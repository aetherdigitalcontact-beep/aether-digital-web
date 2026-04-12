import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const { access_token } = await req.json();

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

        if (findError && findError.code !== 'PGRST116') {
            console.error('Database Sync Find Error:', findError);
            return NextResponse.json({ error: 'Database synchronization failed' }, { status: 500 });
        }

        // 3. Create user if not exists (First time OAuth)
        if (!user) {
            const { data: newUser, error: createError } = await supabaseServer
                .from('accounts')
                .insert([{
                    email: email,
                    full_name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split('@')[0],
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
        }

        // 4. Generate our custom JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.full_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Set the relay_session cookie
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
