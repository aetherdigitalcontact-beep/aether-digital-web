import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { supabaseServer } from '@/lib/supabaseServer';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId } = body;
        if (!workspaceId) return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });

        if (workspaceId !== decoded.id) {
            // Check roles in external workspace
            const { data: member } = await supabaseServer
                .from('workspace_members')
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', decoded.id)
                .single();

            if (!member || member.role?.toUpperCase() !== 'OWNER') {
                return NextResponse.json({ error: 'Only owners can purge data' }, { status: 403 });
            }
        }

        // Delete entries by user_id OR workspace_id where applicable
        await supabaseServer.from('logs').delete().eq('user_id', workspaceId);
        await supabaseServer.from('logs').delete().eq('workspace_id', workspaceId);

        await supabaseServer.from('inboxes').delete().eq('user_id', workspaceId);
        await supabaseServer.from('inboxes').delete().eq('workspace_id', workspaceId);

        await supabaseServer.from('webhooks').delete().eq('user_id', workspaceId);
        await supabaseServer.from('webhooks').delete().eq('workspace_id', workspaceId);

        await supabaseServer.from('scenarios').delete().eq('user_id', workspaceId);
        await supabaseServer.from('scenarios').delete().eq('workspace_id', workspaceId);

        await supabaseServer.from('retries').delete().eq('user_id', workspaceId);
        await supabaseServer.from('retries').delete().eq('workspace_id', workspaceId);

        return NextResponse.json({ success: true, message: 'All telemetry purged.' });
    } catch (e: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
    }
}
