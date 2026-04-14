import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

async function getUserId(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.id;
    } catch (err) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabaseServer
        .from('logs')
        .select(`
            id,
            platform,
            status_code,
            response_time,
            created_at,
            error_message,
            api_keys (
                label
            )
        `)
        .eq('user_id', userId)
        .eq('is_deleted', false);

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

    // Basic text search over error_message or payload
    if (search) {
        query = query.or(`error_message.ilike.%${search}%,platform.ilike.%${search}%`);
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
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const logId = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    try {
        if (clearAll) {
            const { error } = await supabaseServer
                .from('logs')
                .update({ is_deleted: true })
                .eq('user_id', userId);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (!logId) return NextResponse.json({ error: 'Log ID required' }, { status: 400 });

        const { error } = await supabaseServer
            .from('logs')
            .update({ is_deleted: true })
            .eq('id', logId)
            .eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Logs DELETE API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
