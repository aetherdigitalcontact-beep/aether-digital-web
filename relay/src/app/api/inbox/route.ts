import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const apiKey = req.headers.get('x-api-key') || req.headers.get('X-API-Key') || req.nextUrl.searchParams.get('api_key');
        const limitParam = req.nextUrl.searchParams.get('limit') || '50';
        const limit = parseInt(limitParam) || 50;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key is missing from headers or query' }, { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const { data: keyData, error: keyError } = await supabaseServer
            .from('api_keys')
            .select('id, user_id, is_active')
            .eq('key_hash', apiKey)
            .single();

        if (keyError || !keyData || !keyData.is_active) {
            return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        // Fetch latest successful logs for this user to act as an inbox
        const { data: logs, error: logsError } = await supabaseServer
            .from('logs')
            .select('id, platform, status_code, created_at, payload')
            .eq('user_id', keyData.user_id)
            // .eq('status_code', 200) // Uncomment to only show successful deliveries in inbox
            .order('created_at', { ascending: false })
            .limit(limit);

        if (logsError) {
            return NextResponse.json({ error: 'Failed to fetch inbox data' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        // Transform for a frontend SDK (In-App Inbox style like Novu)
        const inboxReady = logs.map(log => {
            const rawPayload = typeof log.payload === 'string' ? JSON.parse(log.payload) : (log.payload || {});

            return {
                id: log.id,
                read: false, // Future proofing for read-receipts
                platform: log.platform,
                category: rawPayload.category || 'General',
                title: rawPayload.category ? `Notification: ${rawPayload.category}` : 'System Alert',
                message: rawPayload.message || 'You have a new message.',
                received_at: log.created_at,
                data: rawPayload // Contains the original webhook variables (e.g. order_id, amount)
            };
        });

        return NextResponse.json({
            success: true,
            count: inboxReady.length,
            notifications: inboxReady
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 's-maxage=1, stale-while-revalidate'
            }
        });

    } catch (error: any) {
        console.error('Inbox API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}

// Support CORS for client-side fetches (since SDKs run on the user's frontend domain)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        },
    });
}
