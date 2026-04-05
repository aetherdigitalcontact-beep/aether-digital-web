import { NextRequest, NextResponse } from 'next/server';

/**
 * Universal Relay Catchall
 * Accept ANY JSON payload and forward it to the Relay Engine.
 * Use query params: ?api_key=...&platforms=telegram,whatsapp&target=ID
 */
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get('api_key') || req.headers.get('x-api-key');

        // Optional overrides from URL
        const platformsParam = searchParams.get('platforms');
        const target = searchParams.get('target');
        const category = searchParams.get('category') || 'Universal Webhook';

        if (!apiKey) {
            return NextResponse.json({
                error: 'Missing API Key'
            }, { status: 401 });
        }

        let body = {};
        try {
            body = await req.json();
        } catch (e) {
            console.warn('[UniversalWebhook] No JSON body provided or invalid JSON');
        }

        // Forward to Core Relay Engine
        const relayPayload = {
            platform: platformsParam ? platformsParam.split(',') : undefined,
            target: target || undefined,
            category: category,
            variables: body, // All incoming data becomes variables
            ...body          // Also flatten for easier scenario access as payload.XYZ
        };

        const relayHost = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const relayUrl = `${protocol}://${relayHost}/api/relay`;

        const relayResponse = await fetch(relayUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(relayPayload)
        });

        const relayResult = await relayResponse.json();

        return NextResponse.json({
            success: true,
            status: 202,
            message: 'Universal Payload Accepted',
            relay_engine_status: relayResponse.status,
            relay_result: relayResult
        }, { status: 202 });

    } catch (error) {
        console.error('Universal Adapter Error:', error);
        return NextResponse.json({ error: 'Failed to process universal webhook' }, { status: 500 });
    }
}
