import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Use IP as a simple fingerprint (hashed)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        'anonymous';
    const fingerprint = Buffer.from(ip).toString('base64');

    try {
        // Check if already voted
        const { data: existing } = await supabase
            .from('roadmap_votes')
            .select('id')
            .eq('item_id', id)
            .eq('voter_fingerprint', fingerprint)
            .single();

        if (existing) {
            // Remove vote (toggle off)
            await supabase.from('roadmap_votes').delete().eq('id', existing.id);
            await supabase.rpc('decrement_roadmap_votes', { item_id: id });
            return NextResponse.json({ voted: false });
        } else {
            // Add vote
            await supabase.from('roadmap_votes').insert({ item_id: id, voter_fingerprint: fingerprint });
            await supabase.rpc('increment_roadmap_votes', { item_id: id });
            return NextResponse.json({ voted: true });
        }
    } catch (err: any) {
        return NextResponse.json({ error: 'Vote failed' }, { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    const fingerprint = Buffer.from(ip).toString('base64');

    const { data } = await supabase
        .from('roadmap_votes')
        .select('id')
        .eq('item_id', id)
        .eq('voter_fingerprint', fingerprint)
        .single();

    return NextResponse.json({ voted: !!data });
}
