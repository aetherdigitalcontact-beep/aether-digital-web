import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email, lang = 'en' } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        // 1. Find user
        const { data: user, error: findError } = await supabaseServer
            .from('accounts')
            .select('*')
            .eq('email', email)
            .single();

        // 2. Defensive check
        if (findError || !user) {
            // Fake success for privacy
            return NextResponse.json({ success: true });
        }

        if (user.is_confirmed) {
            return NextResponse.json({ success: true });
        }

        // 3. REGENERATE Confirmation Code (Ensures fresh link works)
        const newCode = crypto.randomUUID();
        const { error: updateError } = await supabaseServer
            .from('accounts')
            .update({
                confirmation_code: newCode,
                // Optional: set an expiry here if we had an expiry column
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Failed to regenerate confirmation code:', updateError);
            return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
        }

        // 4. Send Confirmation Email
        const confirmUrl = `${new URL(req.url).origin}/api/auth/confirm?code=${newCode}`;

        await sendEmail({
            to: email,
            lang: lang as 'en' | 'es',
            name: user.full_name || undefined,
            url: confirmUrl,
            type: 'resend'
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Resend API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
