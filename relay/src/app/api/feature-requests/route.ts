import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
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

const PRIORITY_COLOR: Record<string, string> = {
    Low: '#64748b',
    Medium: '#f59e0b',
    High: '#ef4444',
};

export async function GET() {
    const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes', { ascending: false });

    if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 });
    return NextResponse.json({ requests: data || [] });
}

export async function POST(req: NextRequest) {
    try {
        const { title, description, priority, author_email } = await req.json();
        if (!title || title.length < 5) {
            return NextResponse.json({ error: 'Title too short' }, { status: 400 });
        }

        const { error } = await supabase.from('feature_requests').insert({
            title,
            description,
            priority: priority || 'Low',
            author_email: author_email || null,
            status: 'Pending',
        });

        if (error) throw error;

        // Notify admin
        const priorityColor = PRIORITY_COLOR[priority || 'Low'] || '#64748b';
        try {
            await transporter.sendMail({
                from: `"Relay Community ⚡" <${process.env.EMAIL_USER}>`,
                to: 'aetherdigital.contact@gmail.com',
                subject: `💡 New Feature Request — ${title}`,
                html: `
                    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; background: #060810; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
                        <div style="background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%); padding: 32px 40px;">
                            <div style="margin-bottom: 8px;">
                                <span style="font-weight: 900; font-size: 20px; letter-spacing: -0.5px;">⚡ RELAY</span>
                            </div>
                            <p style="margin: 0; font-size: 13px; opacity: 0.7; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;">Community Feature Request</p>
                        </div>
                        <div style="padding: 40px;">
                            <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 900; color: #fff;">New request submitted!</h2>
                            <p style="margin: 0 0 32px; color: #94a3b8; font-size: 15px;">A user submitted a new feature request from the public roadmap.</p>

                            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 24px; margin-bottom: 16px;">
                                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #475569;">Feature Title</p>
                                <p style="margin: 0; font-size: 18px; font-weight: 700; color: #60a5fa;">${title}</p>
                            </div>

                            ${description ? `
                            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 24px; margin-bottom: 16px;">
                                <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #475569;">Description</p>
                                <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.6;">${description}</p>
                            </div>` : ''}

                            <div style="display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">
                                <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 18px;">
                                    <p style="margin: 0 0 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #475569;">Priority</p>
                                    <p style="margin: 0; font-size: 14px; font-weight: 800; color: ${priorityColor};">${priority || 'Low'}</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 18px;">
                                    <p style="margin: 0 0 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #475569;">Submitted by</p>
                                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #e2e8f0;">${author_email || 'Anonymous'}</p>
                                </div>
                            </div>

                            <p style="margin: 0; font-size: 12px; color: #334155; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
                                Submitted at ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })} &middot; Source: Public Roadmap
                            </p>
                        </div>
                    </div>
                `,
            });
        } catch (mailErr) {
            console.error('[FEATURE_REQUEST] Admin notification failed:', mailErr);
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
    }
}
