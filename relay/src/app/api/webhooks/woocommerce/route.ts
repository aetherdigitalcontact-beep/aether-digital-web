import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const apiKey = searchParams.get('api_key');
        const platformsParam = searchParams.get('platforms');
        const target = searchParams.get('target');
        const templateId = searchParams.get('template_id');

        if (!apiKey || !platformsParam || !target || !templateId) {
            return NextResponse.json({
                error: 'Missing required query parameters: api_key, platforms, target, template_id'
            }, { status: 400 });
        }

        const payload = await req.json();

        // Basic safety check for WooCommerce Order structure
        if (!payload.id || !payload.total) {
            return NextResponse.json({ error: 'Invalid WooCommerce webhook payload' }, { status: 400 });
        }

        // Extract relevant variables from WooCommerce Order
        const variables = {
            order_number: payload.number?.toString() || payload.id?.toString(),
            total_price: payload.total,
            currency: payload.currency,
            customer_first_name: payload.billing?.first_name || 'Customer',
            customer_last_name: payload.billing?.last_name || '',
            customer_email: payload.billing?.email || 'N/A',
            items_count: payload.line_items?.length?.toString() || '0',
            source_name: 'woocommerce'
        };

        // Forward to Core Relay Engine
        const relayPayload = {
            platforms: platformsParam.split(','),
            target: target,
            template_id: templateId,
            category: 'Sale / E-commerce',
            variables: variables
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
            message: 'WooCommerce webhook translated and relayed',
            relay_result: relayResult
        });

    } catch (error) {
        console.error('WooCommerce Adapter Error:', error);
        return NextResponse.json({ error: 'Failed to process WooCommerce webhook' }, { status: 500 });
    }
}
