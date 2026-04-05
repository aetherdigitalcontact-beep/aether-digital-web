import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.id;

        const { plan, billingCycle = 'monthly', test_mode = true } = await req.json();

        if (!plan) return NextResponse.json({ error: 'Plan is required' }, { status: 400 });

        const normalizedPlan = plan.toLowerCase();
        const validPlans = ['free', 'hobby', 'starter', 'pro', 'enterprise'];

        if (!validPlans.includes(normalizedPlan)) {
            return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
        }

        // 1. Update the account plan
        const { error: updateError } = await supabaseServer
            .from('accounts')
            .update({ plan: normalizedPlan })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 2. Fetch user's first API key to send the Relay signal (optional automation)
        const { data: keys } = await supabaseServer
            .from('api_keys')
            .select('key_hash')
            .eq('user_id', userId)
            .limit(1);

        const apiKey = keys && keys.length > 0 ? keys[0].key_hash : null;

        if (apiKey) {
            // Self-trigger a notification about the upgrade
            const relayHost = req.headers.get('host');
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            const relayUrl = `${protocol}://${relayHost}/api/relay`;

            fetch(relayUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    category: 'Billing / Subscription',
                    message: `<b>SUBSCRIPTION UPDATED:</b> Your account has been upgraded to the <b>${normalizedPlan.toUpperCase()}</b> plan (${billingCycle}). 🚀\n\nEnjoy increased limits and premium features.`,
                    metadata: { type: 'plan_upgrade', plan: normalizedPlan, cycle: billingCycle }
                })
            }).catch(err => console.error('[BillingAPI] Failed to trigger relay signal:', err));
        }

        return NextResponse.json({
            success: true,
            message: `Account successfully upgraded to ${normalizedPlan.toUpperCase()} (${billingCycle}).`,
            plan: normalizedPlan,
            billingCycle
        });

    } catch (error: any) {
        console.error('Billing API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
