import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = req.headers.get('x-api-key');
        const externalId = searchParams.get('subscriberId');

        let targetProjectId = null;
        let targetSubscriberId = null;

        // 1. Dual Authentication: Internal Dashboard vs External SDK
        if (apiKey) {
            if (!externalId) {
                return NextResponse.json({ error: 'Missing Subscriber ID' }, { status: 400 });
            }

            const { data: keyData, error: keyError } = await supabaseServer
                .from('api_keys')
                .select('user_id')
                .eq('key_hash', apiKey)
                .single();

            if (keyError || !keyData) {
                return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
            }

            targetProjectId = keyData.user_id;

            const { data: subscriber, error: subError } = await supabaseServer
                .from('subscribers')
                .select('id')
                .eq('user_id', targetProjectId)
                .eq('external_id', externalId)
                .single();

            if (subError || !subscriber) {
                return NextResponse.json({ messages: [] });
            }
            targetSubscriberId = subscriber.id;
        } else {
            // Dashboard Internal Access
            const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
            if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
            targetProjectId = workspaceId;
        }

        // 3. Fetch Messages with dynamic filters depending on mode
        let messages = [];

        if (targetSubscriberId) {
            let query = supabaseServer
                .from('inbox_messages')
                .select('*')
                .eq('project_id', targetProjectId)
                .eq('subscriber_id', targetSubscriberId)
                .order('created_at', { ascending: false })
                .limit(50);

            const platform = searchParams.get('platform');
            const search = searchParams.get('search');

            if (platform && platform !== 'all') {
                query = query.eq('platform', platform);
            }
            if (search) {
                query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%,category.ilike.%${search}%`);
            }

            const { data, error: msgError } = await query;
            if (msgError) throw msgError;
            messages = data || [];
        } else {
            // Internal Dashboard Mode: Read from 'logs' to get a global view of all dispatched messages
            let query = supabaseServer
                .from('logs')
                .select('*')
                .eq('user_id', targetProjectId)
                .eq('environment', searchParams.get('env') || 'development')
                .eq('is_deleted', false)
                .order('created_at', { ascending: false })
                .limit(searchParams.get('search') ? 300 : 50); // Múltiplo ampliado si hay búsqueda para memory filtering

            const platform = searchParams.get('platform');
            const search = searchParams.get('search');

            if (platform && platform !== 'all') {
                query = query.eq('platform', platform);
            }

            const { data, error: logError } = await query;
            if (logError) throw logError;

            let rawLogs = data || [];

            // In-memory deep payload search
            if (search) {
                const s = search.toLowerCase();
                rawLogs = rawLogs.filter(log => JSON.stringify(log.payload || {}).toLowerCase().includes(s) || (log.error_message || '').toLowerCase().includes(s));
            }

            // Map logs to the format expected by InboxView.tsx
            messages = rawLogs.map(log => {
                const body = log.payload || {};

                // Extract real interpolated message from variables if present (for better UX in Dashboard)
                let realMessage = body.variables?.msg || body.variables?.message || body.message || log.error_message;

                if (!realMessage) {
                    const innerPayload = body.payload || body.variables;
                    if (innerPayload && typeof innerPayload === 'object' && Object.keys(innerPayload).length > 0) {
                        realMessage = Object.values(innerPayload)
                            .map(v => (typeof v === 'string' || typeof v === 'number') ? String(v) : '')
                            .filter(Boolean)
                            .join(' • ');
                    }
                }

                realMessage = realMessage || 'Content logged in telemetry payload.';

                return {
                    id: log.id,
                    project_id: log.user_id,
                    platform: log.platform,
                    category: body.category || 'GENERAL',
                    title: body.title || (log.status_code >= 400 ? 'Delivery Failure' : 'Uplink Event'),
                    message: realMessage,
                    content: realMessage,
                    received_at: log.created_at,
                    data: body,
                    status: log.status_code < 400 ? 'delivered' : 'failed'
                };
            });
        }

        return NextResponse.json({ messages });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { messageId, readAll, subscriberId } = body;
        const apiKey = req.headers.get('x-api-key');

        if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 401 });

        const { data: keyData } = await supabaseServer
            .from('api_keys')
            .select('user_id')
            .eq('key_hash', apiKey)
            .single();

        if (!keyData) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        if (readAll && subscriberId) {
            // Mark all as read for this subscriber
            const { data: subscriber } = await supabaseServer
                .from('subscribers')
                .select('id')
                .eq('user_id', keyData.user_id)
                .eq('external_id', subscriberId)
                .single();

            if (subscriber) {
                await supabaseServer
                    .from('inbox_messages')
                    .update({ is_read: true, read_at: new Date().toISOString() })
                    .eq('subscriber_id', subscriber.id)
                    .eq('is_read', false);
            }
        } else if (messageId) {
            // Mark specific message as read
            await supabaseServer
                .from('inbox_messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', messageId)
                .eq('project_id', keyData.user_id);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { logIds, workspaceId } = body;

        if (!workspaceId || !Array.isArray(logIds) || logIds.length === 0) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Soft delete all matching logs explicitly for this workspace
        const { error } = await supabaseServer
            .from('logs')
            .update({ is_deleted: true })
            .in('id', logIds)
            .eq('user_id', workspaceId);

        if (error) throw error;

        return NextResponse.json({ success: true, deletedCount: logIds.length });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
