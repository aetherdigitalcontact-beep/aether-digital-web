import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.id;

        const { currentPassword, newPassword, lang = 'en' } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing password fields' }, { status: 400 });
        }

        // Fetch current user
        const { data: user, error: fetchError } = await supabaseServer
            .from('accounts')
            .select('password_hash, email, full_name')
            .eq('id', userId)
            .single();

        if (fetchError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
        }

        // Hash new password
        const hashed = await bcrypt.hash(newPassword, 10);

        // Update password
        const { error: updateError } = await supabaseServer
            .from('accounts')
            .update({ password_hash: hashed })
            .eq('id', userId);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Send Security Alert (Background)
        sendEmail({
            to: user.email,
            lang: lang as 'en' | 'es',
            name: user.full_name || 'Developer',
            type: 'password_alert'
        }).catch(err => console.error('Password alert email error:', err));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Password Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
