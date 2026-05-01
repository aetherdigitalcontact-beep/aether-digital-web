import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const supabase = createRouteHandlerClient({ cookies });
    const { is_unsubscribed } = await request.json();

    try {
        const { data, error } = await supabase
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
