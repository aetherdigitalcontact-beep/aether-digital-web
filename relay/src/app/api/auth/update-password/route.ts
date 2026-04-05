import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // 1. Find user by token
        // In this implementation, we use confirmation_code for both email confirmation and password reset
        const { data: user, error: findError } = await supabaseServer
            .from('accounts')
            .select('id')
            .eq('confirmation_code', token)
            .single();

        if (findError || !user) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // 2. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Update Password and Clear Token
        const { error: updateError } = await supabaseServer
            .from('accounts')
            .update({
                password_hash: passwordHash,
                confirmation_code: null, // Clear the token to prevent reuse
                is_confirmed: true // If they can reset, their email is verified
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Update Password Error:', updateError);
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error: any) {
        console.error('Update Password API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
