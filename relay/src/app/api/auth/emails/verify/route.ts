import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
        }

        // 1. Fetch the record
        const { data: record, error: fetchError } = await supabaseServer
            .from('account_emails')
            .select('*')
            .eq('account_id', decoded.id)
            .eq('email', email)
            .single();

        if (fetchError || !record) {
            return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
        }

        // 2. Validate code and expiry
        if (record.is_verified) {
            return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
        }

        if (record.verification_code !== code) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        const now = new Date();
        const expiresAt = new Date(record.code_expires_at);
        if (now > expiresAt) {
            return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
        }

        // 3. Mark as verified
        const { error: updateError } = await supabaseServer
            .from('account_emails')
            .update({
                is_verified: true,
                verification_code: null, // Clear the code
                code_expires_at: null
            })
            .eq('id', record.id);

        if (updateError) {
            console.error('[EMAIL-VERIFY] Update Error:', updateError);
            return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Email verified successfully!' });

    } catch (error: any) {
        console.error('[EMAIL-VERIFY] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
