import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseServer } from '@/lib/supabaseServer';

// Must match the secret you pasted in Lemon Squeezy dashboard
const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || 'Relay_Production_Secret_2026';

export async function POST(req: NextRequest) {
    try {
        // 1. Read raw body text for signature verification
        const rawBody = await req.text();
        const signature = req.headers.get('X-Signature') || '';

        // 2. Verify cryptographical signature from Lemon Squeezy
        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            console.error('Webhook signature verification failed');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 3. Parse JSON payload
        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;

        // Subscription details from Lemon Squeezy
        const customerEmail = payload.data.attributes.user_email;
        const productName = (payload.data.attributes.product_name || '').toLowerCase();

        console.log(`[Lemon Squeezy Webhook] Received ${eventName} for ${customerEmail}`);

        // 4. Determine target Relay Plan based on Product Name
        let relayPlanType = 'hobby'; // Fallback
        if (productName.includes('starter')) relayPlanType = 'starter';
        if (productName.includes('pro')) relayPlanType = 'pro';

        // 5. Update Database Logic based on event type
        if (['subscription_created', 'subscription_updated'].includes(eventName)) {
            const { error } = await supabaseServer
                .from('accounts')
                .update({ plan: relayPlanType })
                .eq('email', customerEmail);

            if (error) {
                console.error('Webhook Db Update Error:', error);
            } else {
                console.log(`Successfully upgraded ${customerEmail} to ${relayPlanType.toUpperCase()}`);
            }

        } else if (eventName === 'subscription_expired' || eventName === 'subscription_cancelled') {
            // Downgrade user back to Hobby if subscription stops
            const { error } = await supabaseServer
                .from('accounts')
                .update({ plan: 'hobby' })
                .eq('email', customerEmail);

            if (error) console.error('Webhook Db Downgrade Error:', error);
        }

        // 6. Return 200 OK so Lemon Squeezy knows we received it
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error('Webhook processing error:', err);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
