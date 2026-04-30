import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const appId = searchParams.get('appId');
        const subscriberId = searchParams.get('subscriberId');

        if (!appId || !subscriberId) {
            return NextResponse.json({ error: 'Missing appId or subscriberId' }, { status: 400 });
        }

        // 1. Get subscriber internal ID (unless wildcard admin)
        let targetSubscriberId: string | null = null;

        if (subscriberId !== 'admin_dashboard_wildcard') {
            const { data: subscriber, error: subError } = await supabaseServer
                .from('subscribers')
                .select('id')
                .eq('user_id', appId)
                .eq('external_id', subscriberId)
                .single();

            if (subError || !subscriber) {
                return NextResponse.json({ notifications: [] });
            }
            targetSubscriberId = subscriber.id;
        }

        // 2. Fetch specific messages meant strictly for this subscriber (or all for the workspace if wildcard)
        let query = supabaseServer
            .from('inbox_messages')
            .select('id, title, content, is_read, created_at, metadata')
            .eq('project_id', appId)
            .order('created_at', { ascending: false })
            .limit(30);

        if (targetSubscriberId) {
            query = query.eq('subscriber_id', targetSubscriberId);
        }

        const { data: messages, error: msgError } = await query;

        if (msgError) throw msgError;

        // 3. Normalize for Widget consumption
        const uiNotifications = (messages || []).map(m => ({
            id: m.id,
            category: m.metadata?.category || 'System',
            body: m.content,          // 'content' is the canonical field in inbox_messages
            is_read: m.is_read,
            created_at: m.created_at
        }));

        return NextResponse.json({ notifications: uiNotifications });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, logIds, appId, subscriberId } = body;

        // Allow demo mock behavior
        if (appId === 'demo') {
            return NextResponse.json({ success: true });
        }

        if (!appId || !subscriberId || action !== 'read') return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

        if (subscriberId === 'admin_dashboard_wildcard') {
            if (Array.isArray(logIds) && logIds.length > 0) {
                await supabaseServer
                    .from('inbox_messages')
                    .update({ is_read: true, read_at: new Date().toISOString() })
                    .in('id', logIds)
                    .eq('project_id', appId);
            }
            return NextResponse.json({ success: true });
        }

        const { data: subscriber } = await supabaseServer
            .from('subscribers')
            .select('id')
            .eq('user_id', appId)
            .eq('external_id', subscriberId)
            .single();

        if (subscriber && Array.isArray(logIds) && logIds.length > 0) {
            await supabaseServer
                .from('inbox_messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .in('id', logIds)
                .eq('subscriber_id', subscriber.id);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
