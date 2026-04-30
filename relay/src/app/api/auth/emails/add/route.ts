import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 1. Strict verification blocker
        const { data: existingEntry } = await supabaseServer
            .from('account_emails')
            .select('is_verified')
            .eq('account_id', decoded.id)
            .eq('email', email)
            .single();

        if (existingEntry?.is_verified) {
            return NextResponse.json({ error: 'This email is already connected and verified.' }, { status: 400 });
        }

        // 2. Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now

        // 3. Insert or update in account_emails
        const { error: dbError } = await supabaseServer
            .from('account_emails')
            .upsert({
                account_id: decoded.id,
                email: email,
                verification_code: code,
                code_expires_at: expiresAt,
                is_verified: false
            }, { onConflict: 'account_id,email' });

        if (dbError) {
            console.error('[EMAIL-ADD] DB Error:', dbError);
            return NextResponse.json({ error: 'Failed to register email for verification' }, { status: 500 });
        }

        // 3. Send verification email
        const { success, error: emailError } = await sendEmail({
            to: email,
            lang: 'en', // Could be dynamic based on user pref
            name: decoded.full_name || decoded.name || 'Developer',
            type: 'verification_code',
            url: code, // Pass code as the display value 
            fromName: 'Relay Security'
        });

        if (!success) {
            console.error('[EMAIL-ADD] Email Error:', emailError);
            // We don't fail the whole request if DB succeeded, 
            // but we alert the user something went wrong with delivery.
            return NextResponse.json({
                success: true,
                message: 'Email registered, but delivery failed. Please check SMTP settings.',
                code_for_debug: process.env.NODE_ENV === 'development' ? code : undefined
            });
        }

        return NextResponse.json({ success: true, message: 'Verification code sent' });

    } catch (error: any) {
        console.error('[EMAIL-ADD] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
