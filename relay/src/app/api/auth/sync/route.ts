import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { access_token, totpCode } = body;

        if (!access_token) {
            return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
        }

        // 1. Verify token with Supabase
        const { data: { user: sbUser }, error: authError } = await supabaseServer.auth.getUser(access_token);

        if (authError || !sbUser) {
            console.error('Supabase Auth Sync Error:', authError);
            return NextResponse.json({ error: 'Invalid Supabase session' }, { status: 401 });
        }

        const email = sbUser.email;
        if (!email) {
            return NextResponse.json({ error: 'Email not found in session' }, { status: 400 });
        }

        // 2. Check/Sync with local 'accounts' table
        let { data: user, error: findError } = await supabaseServer
            .from('accounts')
            .select('*')
            .eq('email', email)
            .single();

        // Check if there's a logged in user from cookie (for linking different emails)
        const currentToken = req.cookies.get('relay_session')?.value;
        let loggedInUserId = null;
        if (currentToken) {
            try {
                const decoded = jwt.verify(currentToken, JWT_SECRET) as any;
                loggedInUserId = decoded.id;
            } catch (e) { }
        }

        if (findError && findError.code !== 'PGRST116') {
            console.error('Database Sync Find Error:', findError);
            return NextResponse.json({ error: 'Database synchronization failed' }, { status: 500 });
        }

        // 2.1. ID Harmonization / Migration
        // If we found a user by email but the ID is different from Supabase ID
        // OR if the user is logged in as a different ID (linking flow)
        const targetIdToMigrate = (user && user.id !== sbUser.id) ? user.id : (loggedInUserId && loggedInUserId !== sbUser.id) ? loggedInUserId : null;

        if (targetIdToMigrate) {
            console.log(`[AUTH-SYNC] HARMONIZING: ${targetIdToMigrate} -> ${sbUser.id}`);

            // If the user already existed with the new ID, we might have a conflict.
            // But let's assume for now we want to merge into the Supabase ID.

            // 1. Update all related tables (Cascade simulation)
            const relations = [
                { table: 'api_keys', col: 'user_id' },
                { table: 'scenarios', col: 'user_id' },
                { table: 'logs', col: 'user_id' },
                { table: 'account_emails', col: 'account_id' },
                { table: 'webhooks', col: 'user_id' },
                { table: 'domains', col: 'user_id' },
                { table: 'templates', col: 'user_id' },
                { table: 'plan_usage', col: 'user_id' }
            ];

            for (const rel of relations) {
                const { error: relError } = await supabaseServer
                    .from(rel.table)
                    .update({ [rel.col]: sbUser.id })
                    .eq(rel.col, targetIdToMigrate);

                if (relError) console.warn(`Harmonization warning for ${rel.table}:`, relError.message);
            }

            // 2. Update the main account record ID
            const { error: idUpdateError } = await supabaseServer
                .from('accounts')
                .update({ id: sbUser.id })
                .eq('id', targetIdToMigrate);

            if (idUpdateError) {
                console.warn('[AUTH-SYNC] ID Update failed (likely conflict), attempting aggressive merge:', idUpdateError.message);

                // If update failed, it's likely because an account with sbUser.id already exists.
                // We've already moved the relations (scenarios, logs, etc.) to sbUser.id.
                // Now we delete the old record that we can't update.
                await supabaseServer.from('accounts').delete().eq('id', targetIdToMigrate);
            }

            // Re-fetch the final consolidated account
            const { data: consolidatedUser } = await supabaseServer
                .from('accounts')
                .select('*')
                .eq('id', sbUser.id)
                .single();
            user = consolidatedUser;
        }

        // 3. Create user if not exists (First time OAuth)
        if (!user) {
            console.log(`[AUTH-SYNC] Creating new user record for: ${email}`);
            const nameFromMetadata = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name;
            const fallbackName = email.split('@')[0];

            const { data: newUser, error: createError } = await supabaseServer
                .from('accounts')
                .insert([{
                    id: sbUser.id,
                    email: email,
                    full_name: nameFromMetadata && nameFromMetadata !== 'Developer' ? nameFromMetadata : fallbackName,
                    password_hash: crypto.randomBytes(32).toString('hex'), // Dummy password for OAuth users
                    is_confirmed: true,
                    plan: 'FREE'
                }])
                .select()
                .single();

            if (createError) {
                console.error('Database Sync Create Error:', createError);
                return NextResponse.json({ error: 'Failed to create linked account' }, { status: 500 });
            }
            user = newUser;
        } else if (user.full_name === 'Developer' || !user.full_name) {
            // FIX: Update existing user if name is 'Developer' or missing
            const nameFromMetadata = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name;
            if (nameFromMetadata && nameFromMetadata !== 'Developer') {
                console.log(`[AUTH-SYNC] Fixing 'Developer' name for: ${email} -> ${nameFromMetadata}`);
                await supabaseServer
                    .from('accounts')
                    .update({ full_name: nameFromMetadata })
                    .eq('id', user.id);
                user.full_name = nameFromMetadata;
            }
        }

        // 3.5. Check if 2FA is required
        if (user.is_2fa_enabled && user.totp_secret) {
            if (!totpCode) {
                console.log(`[AUTH-SYNC] 2FA Required for user: ${email}`);
                return NextResponse.json({
                    require2FA: true,
                    email: user.email
                }, { status: 200 });
            }

            const { verifyTOTPCode } = await import('@/lib/2fa');
            const { isValid } = await verifyTOTPCode(totpCode, user.totp_secret);

            if (!isValid) {
                console.log(`[AUTH-SYNC] 2FA Failed for user: ${email}`);
                return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
            }
            console.log(`[AUTH-SYNC] 2FA Verified for user: ${email}`);
        }

        // 4. SYNC IDENTITIES TO account_emails TABLE
        const identities = sbUser.identities || [];
        console.log(`[AUTH-SYNC] Syncing ${identities.length} identities for user: ${email}`);

        // Get all emails from identities
        const identityEmails = identities
            .map((id: any) => id.identity_data?.email)
            .filter((e: any) => !!e && e.toLowerCase() !== email.toLowerCase());

        // Upsert unique emails into account_emails
        const uniqueIdentityEmails = Array.from(new Set(identityEmails));

        for (const idEmail of uniqueIdentityEmails) {
            // Check if already exists
            const { data: existing } = await supabaseServer
                .from('account_emails')
                .select('*')
                .eq('account_id', user.id)
                .eq('email', idEmail)
                .single();

            if (!existing) {
                console.log(`[AUTH-SYNC] Adding new identity email: ${idEmail}`);
                await supabaseServer
                    .from('account_emails')
                    .insert([{
                        account_id: user.id,
                        email: idEmail,
                        is_verified: true, // OAuth emails are considered verified
                        is_primary: false
                    }]);
            }
        }

        // 5. Generate our custom JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.full_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 6. Set the relay_session cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name
            }
        });

        response.cookies.set('relay_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Auth Sync API Error:', error);
        return NextResponse.json({ error: 'Internal Sync Error' }, { status: 500 });
    }
}
