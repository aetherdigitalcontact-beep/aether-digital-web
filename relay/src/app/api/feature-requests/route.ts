import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
    }
}
