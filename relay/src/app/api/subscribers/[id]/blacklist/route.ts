import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params;
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const body = await req.json();
        const { is_unsubscribed } = body;

        if (typeof is_unsubscribed !== 'boolean') {
            return NextResponse.json({ error: 'Invalid state provided. Expected boolean.' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('subscribers')
            .update({ is_unsubscribed })
            .eq('id', id)
            .eq('user_id', workspaceId)
            .select()
            .single();

        if (error) {
            console.error('[SUBSCRIBER-BLACKLIST] Failed to toggle unsubscribe:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, is_unsubscribed: data.is_unsubscribed });
    } catch (err: any) {
        console.error('[SUBSCRIBER-BLACKLIST] Exception handling blacklist request:', err.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
