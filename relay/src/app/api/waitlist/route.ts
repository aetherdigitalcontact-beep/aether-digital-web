import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Insert into waitlist table
        const { error } = await supabaseServer
            .from('waitlist')
            .insert([{
                email,
                source: 'maint_landing',
                created_at: new Date().toISOString()
            }]);

        if (error) {
            // Handle duplicate email (if there is a unique constraint)
            if (error.code === '23505') {
                return NextResponse.json({
                    success: true,
                    message: 'You are already on the list! We will notify you soon.'
                });
            }
            console.error('[WAITLIST] DB Error:', error);
            return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully joined the waitlist!'
        });

    } catch (error: any) {
        console.error('[WAITLIST] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
