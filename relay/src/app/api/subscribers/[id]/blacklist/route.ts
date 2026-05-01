import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const { is_unsubscribed } = await request.json();

    try {
        const { data, error } = await supabaseServer
            .from('subscribers')
            .update({ is_unsubscribed })
            .eq('id', id)
            .select();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            is_unsubscribed: data[0].is_unsubscribed
        });
    } catch (error) {
        console.error('Error updating subscriber blacklist:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
