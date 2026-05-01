import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = await supabase
        .from('feature_requests')
        .delete()
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { status } = await req.json();

    const { error } = await supabase
        .from('feature_requests')
        .update({ status })
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    return NextResponse.json({ success: true });
}
