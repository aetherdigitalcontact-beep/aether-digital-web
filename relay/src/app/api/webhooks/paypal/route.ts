import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const event = JSON.parse(bodyText);

        console.log(`[PayPal Webhook] Received Event: ${event.event_type}`);

        // We listen for subscription creation or activation
        if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED' || event.event_type === 'BILLING.SUBSCRIPTION.CREATED') {
            const resource = event.resource;

            // The frontend MUST inject the user's email into custom_id during createSubscription
            const customIdRaw = resource.custom_id; // Format expected: "exequiel@gmail.com|pro"
            if (!customIdRaw) {
                console.error('PayPal Webhook Error: No custom_id provided to identify user.');
                return NextResponse.json({ error: 'Missing custom_id' }, { status: 400 });
            }

            const [userEmail, planKey] = customIdRaw.split('|');

            if (userEmail && planKey) {
                const { error } = await supabaseAdmin
                    .from('accounts')
                    .update({
                        plan: planKey
                    })
                    .eq('email', userEmail);

                if (error) {
                    console.error('[PayPal Webhook] Supabase update failed:', error);
                    return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
                }

                console.log(`[PayPal Webhook] Successfully upgraded ${userEmail} to ${planKey}`);
                return NextResponse.json({ received: true, action: 'upgraded' });
            }
        } else if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || event.event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
            const resource = event.resource;
            const customIdRaw = resource.custom_id;

            if (customIdRaw) {
                const [userEmail] = customIdRaw.split('|');
                await supabaseAdmin
                    .from('accounts')
                    .update({
                        plan: 'free'
                    })
                    .eq('email', userEmail);

                console.log(`[PayPal Webhook] Downgraded ${userEmail} to free due to cancellation.`);
            }
        }

        return NextResponse.json({ received: true, action: 'ignored' });
    } catch (err: any) {
        console.error('[PayPal Webhook] Critical Error:', err);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
