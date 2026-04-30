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
        const { workspaceId, targetUserId, action } = body;

        if (!workspaceId || !targetUserId || !action) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        if (decoded.id === targetUserId) {
            return NextResponse.json({ error: 'Cannot perform actions on yourself' }, { status: 400 });
        }

        const { data: actorMember } = await supabaseServer
            .from('workspace_members')
            .select('role')
            .eq('workspace_id', workspaceId)
            .eq('user_id', decoded.id)
            .single();

        if (!actorMember || actorMember.role?.toUpperCase() !== 'OWNER') {
            return NextResponse.json({ error: 'Only owners can manage roles' }, { status: 403 });
        }

        if (action === 'promote') {
            await supabaseServer.from('workspace_members').update({ role: 'OWNER' }).eq('workspace_id', workspaceId).eq('user_id', targetUserId);
        } else if (action === 'demote') {
            await supabaseServer.from('workspace_members').update({ role: 'PILOT' }).eq('workspace_id', workspaceId).eq('user_id', targetUserId);
        } else if (action === 'remove') {
            await supabaseServer.from('workspace_members').delete().eq('workspace_id', workspaceId).eq('user_id', targetUserId);
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: `Member action applied.` });
    } catch (e: any) {
        return NextResponse.json({ error: 'Internal error', details: e.message }, { status: 500 });
    }
}
