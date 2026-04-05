import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email, lang = 'en' } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Find user by email
        const { data: user, error: findError } = await supabaseServer
            .from('accounts')
            .select('id, full_name')
            .eq('email', email)
            .single();

        if (findError || !user) {
            // Security: Don't reveal if user exists, but return success to avoid enumeration
            return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        // 2. Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry

        // 3. Store token in DB (overwriting any previous ones)
        const { error: updateError } = await supabaseServer
            .from('accounts')
            .update({
                confirmation_code: resetToken, // We use the same column for simplicity or can use a 'reset_token' if it exists
                // Note: ideally we have a specific column, but based on confirm/register, 'confirmation_code' is used for tokens
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Reset Token Storage Error:', updateError);
            return NextResponse.json({ error: 'Failed to initiate reset' }, { status: 500 });
        }

        // 4. Send Reset Email (Non-blocking for performance)
        const resetUrl = `${new URL(req.url).origin}/auth/reset?token=${resetToken}`;

        sendEmail({
            to: email,
            lang: lang as 'en' | 'es',
            name: user.full_name,
            url: resetUrl,
            type: 'reset'
        }).catch(err => console.error('Background Email Error:', err));

        return NextResponse.json({ success: true, message: 'Reset link sent successfully' });

    } catch (error: any) {
        console.error('Reset Password API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
