import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.id;

        // 1. Get user's primary email
        const { data: user, error: userError } = await supabaseServer
            .from('accounts')
            .select('email, full_name')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        // 3. Store the code
        // We use the account_emails table to store security codes for simplicity 
        // OR we can use the accounts table if we assume it has support.
        // Given we saw verification_code in account_emails, we'll store it there for the primary email.
        const { error: codeError } = await supabaseServer
            .from('account_emails')
            .upsert({
                account_id: userId,
                email: user.email,
                verification_code: code,
                code_expires_at: expiresAt,
                is_verified: true // Primary email is already verified
            }, { onConflict: 'account_id,email' });

        if (codeError) {
            console.error('Code Storage Error:', codeError);
            return NextResponse.json({ error: 'Failed to generate security code' }, { status: 500 });
        }

        // 4. Send the code
        const { success, error: emailError } = await sendEmail({
            to: user.email,
            lang: 'en',
            name: user.full_name || 'Developer',
            type: 'verification_code',
            url: code, // In this template, 'url' is used to display the code prominently
            fromName: 'Relay Security'
        });

        if (!success) {
            console.error('Email Delivery Error:', emailError);
            // In dev, we might return the code for testing
            return NextResponse.json({
                success: true,
                message: 'Security code generated but delivery failed. Check SMTP.',
                debug_code: process.env.NODE_ENV === 'development' ? code : undefined
            });
        }

        return NextResponse.json({ success: true, message: 'Security code sent to your primary email.' });

    } catch (error: any) {
        console.error('Security Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
