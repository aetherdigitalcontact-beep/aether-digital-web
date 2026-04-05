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

        // Basic safety check for Stripe Event structure
        if (!payload.type || !payload.data || !payload.data.object) {
            return NextResponse.json({ error: 'Invalid Stripe webhook payload' }, { status: 400 });
        }

        // We only care about successful charges for this connector
        if (payload.type !== 'charge.succeeded') {
            return NextResponse.json({ message: 'Event type ignored' }, { status: 200 });
        }

        const charge = payload.data.object;

        // Extract relevant variables from Stripe
        const variables = {
            amount: (charge.amount / 100).toFixed(2), // Stripe amounts are in cents
            currency: charge.currency.toUpperCase(),
            receipt_url: charge.receipt_url || 'N/A',
            customer_name: charge.billing_details?.name || 'Customer',
            customer_email: charge.billing_details?.email || 'N/A',
            description: charge.description || 'Stripe Purchase'
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
            message: 'Stripe webhook translated and relayed',
            relay_result: relayResult
        });

    } catch (error) {
        console.error('Stripe Adapter Error:', error);
        return NextResponse.json({ error: 'Failed to process Stripe webhook' }, { status: 500 });
    }
}
