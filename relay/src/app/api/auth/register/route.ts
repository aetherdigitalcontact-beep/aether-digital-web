import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

// Invite-only: only these emails may register
const DASHBOARD_WHITELIST = [
    'quiel.g538@gmail.com',
    'aetherdigital.contact@gmail.com',
];

export async function POST(req: NextRequest) {
    try {
        const { name, company, email, password, lang = 'en' } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Invite-only: block registrations from non-whitelisted emails
        if (!DASHBOARD_WHITELIST.map(e => e.toLowerCase()).includes(email.trim().toLowerCase())) {
            return NextResponse.json({ error: 'Registration is currently invite-only.' }, { status: 403 });
        }

        // 1. Check if user already exists
        const { data: existingUser } = await supabaseServer
            .from('accounts')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Generate confirmation code
        const confirmationCode = crypto.randomUUID();

        // 4. Create Account
        const { data: newUser, error: createError } = await supabaseServer
            .from('accounts')
            .insert({
                email,
                password_hash: passwordHash,
                full_name: name,
                company,
                confirmation_code: confirmationCode,
                is_confirmed: false
            })
            .select()
            .single();

        if (createError) {
            console.error('Account Creation Error:', createError);
            return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
        }

        // 5. Send Confirmation Email (ASYNCHRONOUS - Background)
        const confirmUrl = `${new URL(req.url).origin}/api/auth/confirm?code=${confirmationCode}`;

        sendEmail({
            to: email,
            lang: lang as 'en' | 'es',
            name: name,
            url: confirmUrl,
            type: 'confirm'
        }).catch(err => {
            console.error('Background Email Sending Error:', err);
        });

        // Return success immediately
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Registration API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
