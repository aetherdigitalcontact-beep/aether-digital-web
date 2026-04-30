import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 1. Personal Workspace
        const { data: ownerAccount } = await supabaseServer.from('accounts').select('*').eq('id', decoded.id).single();

        const workspaces = [
            {
                id: decoded.id,
                name: ownerAccount?.company || ownerAccount?.full_name ? `${ownerAccount.company || ownerAccount.full_name}'s Workspace` : 'Personal Workspace',
                role: 'OWNER',
                isPersonal: true,
                avatar_url: ownerAccount?.bot_thumbnail || ownerAccount?.avatar_url || null
            }
        ];

        // 2. Shared Workspaces (Where User is a Co-Pilot)
        const { data: memberships, error } = await supabaseServer
            .from('workspace_members')
            .select(`
                workspace_owner_id,
                role
            `)
            .eq('member_id', decoded.id);

        if (!error && memberships && memberships.length > 0) {
            for (const membership of memberships) {
                // Fetch the owner's account to get the workspace name
                const { data: hostAccount } = await supabaseServer.from('accounts').select('full_name, company, avatar_url, bot_thumbnail').eq('id', membership.workspace_owner_id).single();

                workspaces.push({
                    id: membership.workspace_owner_id,
                    name: hostAccount?.company || hostAccount?.full_name ? `${hostAccount.company || hostAccount.full_name}'s Workspace` : 'Shared Workspace',
                    role: membership.role || 'PILOT',
                    isPersonal: false,
                    avatar_url: hostAccount?.bot_thumbnail || hostAccount?.avatar_url || null
                });
            }
        }

        return NextResponse.json({ workspaces });

    } catch (e) {
        return NextResponse.json({ error: 'Signal failure fetching workspaces' }, { status: 500 });
    }
}
