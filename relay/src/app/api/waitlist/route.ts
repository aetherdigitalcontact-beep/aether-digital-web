import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Insert into waitlist table
        const { error } = await supabaseServer
            .from('waitlist')
            .insert([{ email }]);

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({
                    success: true,
                    message: "You're already on our list! We'll notify you at launch."
                });
            }
            console.error('[WAITLIST] DB Error:', error);
            return NextResponse.json({
                error: "We couldn't save your email right now. Please try again in a moment."
            }, { status: 500 });
        }

        // Notify admin
        try {
            await transporter.sendMail({
                from: `"New Subscriber to Relay ⚡" <${process.env.EMAIL_USER}>`,
                to: 'aetherdigital.contact@gmail.com',
                subject: `🎉 New Waitlist Registration — ${email}`,
                html: `
                    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; background: #060810; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 32px 40px;">
                            <div style="margin-bottom: 8px;">
                                <span style="font-weight: 900; font-size: 20px; letter-spacing: -0.5px;">⚡ RELAY</span>
                            </div>
                            <p style="margin: 0; font-size: 13px; opacity: 0.7; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;">Waitlist Notification</p>
                        </div>
                        <div style="padding: 40px;">
                            <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 900; color: #fff;">New subscriber joined!</h2>
                            <p style="margin: 0 0 32px; color: #94a3b8; font-size: 15px;">Someone registered to receive Relay Protocol updates.</p>
                            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
                                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #475569;">Email address</p>
                                <p style="margin: 0; font-size: 18px; font-weight: 700; color: #60a5fa;">${email}</p>
                            </div>
                            <p style="margin: 0; font-size: 12px; color: #334155; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
                                Registered at ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} &middot; Source: Maintenance Landing Page
                            </p>
                        </div>
                    </div>
                `,
            });
        } catch (mailErr) {
            console.error('[WAITLIST] Admin notification failed:', mailErr);
        }

        return NextResponse.json({
            success: true,
            message: 'You are on the list! We will notify you at launch.'
        });

    } catch (error: any) {
        console.error('[WAITLIST] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
