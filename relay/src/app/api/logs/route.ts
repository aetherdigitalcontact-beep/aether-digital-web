import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const env = searchParams.get('env') || 'development';

    let query: any;

    if (search && search.trim() !== '') {
        query = supabaseServer.rpc('search_relay_logs', {
            search_query: search.trim(),
            p_workspace_id: workspaceId,
            p_environment: env
        }).select(`
            id,
            platform,
            status_code,
            response_time,
            created_at,
            error_message,
            payload,
            api_keys (
                label
            )
        `);
    } else {
        query = supabaseServer
            .from('logs')
            .select(`
                id,
                platform,
                status_code,
                response_time,
                created_at,
                error_message,
                payload,
                api_keys (
                    label
                )
            `)
            .eq('user_id', workspaceId)
            .eq('environment', env)
            .eq('is_deleted', false);
    }

    if (platform && platform !== 'all') {
        query = query.eq('platform', platform);
    }

    if (status) {
        if (status === 'success') {
            query = query.gte('status_code', 200).lt('status_code', 300);
        } else if (status === 'fault') {
            query = query.gte('status_code', 300);
        }
    }


    const { data: logs, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Logs API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ logs });
}

export async function DELETE(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    const { searchParams } = new URL(req.url);
    const logId = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';
    const env = searchParams.get('env') || 'development';

    try {
        if (clearAll) {
            const { error } = await supabaseServer
                .from('logs')
                .update({ is_deleted: true })
                .eq('user_id', workspaceId)
                .eq('environment', env);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (!logId) return NextResponse.json({ error: 'Log ID required' }, { status: 400 });

        const { error } = await supabaseServer
            .from('logs')
            .update({ is_deleted: true })
            .eq('id', logId)
            .eq('user_id', workspaceId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Logs DELETE API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
