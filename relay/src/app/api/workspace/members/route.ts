import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    try {
        // Get members from workspace_members JOIN account/auth users (simulated via service role lookup)
        const { data: members, error } = await supabaseServer
            .from('workspace_members')
            .select(`
                id,
                joined_at,
                role,
                member_id
            `)
            .eq('workspace_owner_id', workspaceId);

        if (error) {
            console.error('[MEMBERS-FETCH-ERROR]', error);
            return NextResponse.json({ members: [] });
        }

        // Enrich with user data (normally you'd join, but Supabase auth users need admin client enrichment)
        const enrichedMembers = [];

        // Add owner as a member
        const { data: ownerAccount } = await supabaseServer.from('accounts').select('*').eq('id', workspaceId).single();
        enrichedMembers.push({
            id: 'owner-' + workspaceId,
            user_id: workspaceId,
            full_name: ownerAccount?.full_name || 'Protocol Owner',
            email: ownerAccount?.email || 'Unknown Signal',
            avatar_url: ownerAccount?.avatar_url,
            role: 'OWNER',
            joined_at: ownerAccount?.created_at,
            is_me: workspaceId === userId
        });

        for (const m of (members || [])) {
            const { data: acc } = await supabaseServer.from('accounts').select('*').eq('id', m.member_id).single();
            enrichedMembers.push({
                ...m,
                full_name: acc?.full_name || 'Pilot',
                email: acc?.email || 'N/A',
                avatar_url: acc?.avatar_url,
                is_me: m.member_id === userId
            });
        }

        return NextResponse.json({ members: enrichedMembers });

    } catch (e) {
        return NextResponse.json({ error: 'Signal failure' }, { status: 500 });
    }
}
