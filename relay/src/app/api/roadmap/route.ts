import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('roadmap_items')
            .select('*')
            .order('votes', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ items: data || [] });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
    }
}
