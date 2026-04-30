import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function requireWorkspaceAccess(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return { error: 'Unauthorized', status: 401 };

    let userId: string;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
    } catch {
        return { error: 'Invalid token', status: 401 };
    }

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || userId; // fallback to personal

    if (workspaceId !== userId) {
        // Verify membership
        const { data, error } = await supabaseServer
            .from('workspace_members')
            .select('role')
            .eq('workspace_owner_id', workspaceId)
            .eq('member_id', userId)
            .single();

        if (error || !data) {
            return { error: 'Forbidden: You do not have access to this workspace', status: 403 };
        }

        return { userId, workspaceId, role: data.role, error: null, status: 200 };
    }

    return { userId, workspaceId, role: 'OWNER', error: null, status: 200 };
}
