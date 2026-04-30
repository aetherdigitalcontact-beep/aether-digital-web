import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Specialized endpoint for the Universal Widget
// In the future, this can include logic for impressions, JWT verification for subscribers, etc.
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        // We use appId (Application Identifier) instead of x-api-key for frontend widgets
        const appId = req.headers.get('x-app-id') || searchParams.get('appId');
        const subscriberId = searchParams.get('subscriberId');

        if (!appId || !subscriberId) {
            return NextResponse.json({ error: 'Missing Application ID or Subscriber ID' }, { status: 400 });
        }

        // 1. Authenticate Application using the public appId
        // In Relay, the appId maps directly to the user_id (Workspace ID)
        const { data: account, error: accountError } = await supabaseServer
            .from('accounts')
            .select('id')
            .eq('id', appId)
            .single();

        if (accountError || !account) {
            return NextResponse.json({ error: 'Invalid Application Identifier' }, { status: 401 });
        }

        // 2. Resolve Subscriber under this account
        const { data: subscriber, error: subError } = await supabaseServer
            .from('subscribers')
            .select('id')
            .eq('user_id', account.id)
            .eq('external_id', subscriberId)
            .single();

        if (subError || !subscriber) {
            // Graceful return for new subscribers
            return NextResponse.json({ messages: [], metadata: { status: 'bridged', subscriber: 'new' } });
        }

        // 3. Fetch Messages with specialized widget metadata
        const { data: messages, error: msgError } = await supabaseServer
            .from('inbox_messages')
            .select('id, title, content, platform, created_at, is_read, metadata')
            .eq('subscriber_id', subscriber.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (msgError) throw msgError;

        return NextResponse.json({
            messages,
            metadata: {
                count: messages.length,
                unread: messages.filter(m => !m.is_read).length,
                system: 'Relay Uplink 1.0'
            }
        });
    } catch (error: any) {
        console.error('[Relay Widget API Error]:', error);
        return NextResponse.json({ error: 'Signal Lost' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { messageId, readAll } = body;
        const { searchParams } = new URL(req.url);

        const appId = req.headers.get('x-app-id') || searchParams.get('appId') || body.appId;
        const subscriberId = searchParams.get('subscriberId') || body.subscriberId;

        if (!appId || !subscriberId) return NextResponse.json({ error: 'Missing App ID or Subscriber ID' }, { status: 401 });

        const { data: subscriber } = await supabaseServer
            .from('subscribers')
            .select('id')
            .eq('user_id', appId)
            .eq('external_id', subscriberId)
            .single();

        if (!subscriber) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });

        if (readAll) {
            await supabaseServer
                .from('inbox_messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('subscriber_id', subscriber.id)
                .eq('is_read', false);
        } else if (messageId) {
            await supabaseServer
                .from('inbox_messages')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('id', messageId)
                .eq('subscriber_id', subscriber.id);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
