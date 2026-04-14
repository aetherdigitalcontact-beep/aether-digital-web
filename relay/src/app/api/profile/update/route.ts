import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    // Temporary logger to file since I can't see the terminal
    const logToFile = (msg: string) => {
        try {
            const logPath = path.join(process.cwd(), 'api_debug.log');
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
        } catch (e) { }
    };

    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.id;

        const formData = await req.json();
        const { avatar_url, full_name, email, company, current_password, lang = 'en' } = formData;

        // Build update object based on provided fields
        const updateData: any = {};
        if (avatar_url !== undefined) {
            console.log(`[API] Updating avatar for user ${userId}, length: ${avatar_url.length}`);
            updateData.avatar_url = avatar_url;
        }
        if (full_name !== undefined) updateData.full_name = full_name;
        if (company !== undefined) updateData.company = company;
        if (formData.bot_name !== undefined) updateData.bot_name = formData.bot_name;
        if (formData.bot_thumbnail !== undefined) updateData.bot_thumbnail = formData.bot_thumbnail;

        const { data: currentUser } = await supabaseServer
            .from('accounts')
            .select('email, password_hash')
            .eq('id', userId)
            .single();

        if (!currentUser) {
            logToFile(`Update Failed: Current user record not found in DB for ID ${userId}`);
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        const normalizedInputEmail = email?.trim().toLowerCase();
        const normalizedCurrentEmail = currentUser.email?.trim().toLowerCase();

        logToFile(`Profile Update Route Hit!`);
        logToFile(`- Payload ID: ${userId}`);
        logToFile(`- Input Email: "${email}" (Normalized: "${normalizedInputEmail}")`);
        logToFile(`- DB Current Email: "${currentUser.email}" (Normalized: "${normalizedCurrentEmail}")`);
        logToFile(`- JWT Email (Desync Check): "${decoded.email}"`);

        let emailMessage = "";
        // Email update logic (SECURE VERSION: JWT-encoded pending email)
        if (normalizedInputEmail && normalizedInputEmail !== normalizedCurrentEmail) {
            logToFile(`Email change detected. Initiating verification flow...`);

            // 1. Verify Current Password
            if (!current_password) {
                return NextResponse.json({ error: 'Current password is required to change email' }, { status: 401 });
            }

            if (!(await bcrypt.compare(current_password, currentUser.password_hash))) {
                return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
            }

            // 2. Check if new email is taken
            const { data: existing } = await supabaseServer
                .from('accounts')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

            // 3. Encode pending email securely without schema changes
            const confirmationToken = jwt.sign({ pendingEmail: email, type: 'email_update' }, JWT_SECRET, { expiresIn: '2h' });
            updateData.confirmation_code = confirmationToken;

            // Send Confirmation to NEW email
            const confirmUrl = `${new URL(req.url).origin}/api/auth/confirm?code=${confirmationToken}`;
            const emailResult = await sendEmail({
                to: email,
                lang: lang as 'en' | 'es',
                name: full_name || decoded.name || 'Developer',
                url: confirmUrl,
                type: 'email_change'
            });

            if (!emailResult.success) {
                logToFile(`Email Dispatch Failed: ${JSON.stringify(emailResult.error)}`);
                return NextResponse.json({ error: 'Failed to send confirmation email. Please check your SMTP settings.' }, { status: 500 });
            }

            logToFile(`Email Dispatch Successful.`);
            emailMessage = "Verification link sent to new address. Please confirm to apply changes.";
        } else {
            logToFile(`No email change detected or email matches current session.`);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        // Update user account
        const { data: updatedRows, error } = await supabaseServer
            .from('accounts')
            .update(updateData)
            .eq('id', userId)
            .select();

        logToFile(`Update result: ${JSON.stringify({ success: !!updatedRows, error, updateData })}`);

        if (error) {
            console.error('[API] Supabase Update Error:', error);
            if (error.code === 'PGRST204') {
                return NextResponse.json({
                    error: 'Database Schema Mismatch: The columns bot_name or bot_thumbnail are missing. Please run the provided SQL fix in Supabase dashboard.',
                    code: 'SCHEMA_MISMATCH'
                }, { status: 500 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!updatedRows || updatedRows.length === 0) {
            console.error('[API] Update Failed: 0 rows modified for user ID', userId);
            return NextResponse.json({ error: `Update failed: User ID not found in accounts table (${userId}).` }, { status: 404 });
        }

        // If emailMessage has content, use it. Otherwise use the default.
        return NextResponse.json({
            success: true,
            user: updatedRows[0],
            message: emailMessage || "Profile updated successfully."
        });

    } catch (error: any) {
        console.error('Profile Upload Error:', error);
        return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
    }
}
