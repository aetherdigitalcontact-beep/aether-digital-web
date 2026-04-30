import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    try {
        const { data: requests, error } = await supabaseServer
            .from('workspace_requests')
            .select('*')
            .eq('workspace_owner_id', workspaceId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[REQUESTS-FETCH-ERROR]', error);
            return NextResponse.json({ requests: [] });
        }

        return NextResponse.json({ requests: requests || [] });
    } catch (e) {
        return NextResponse.json({ error: 'Signal failure' }, { status: 500 });
    }
}
