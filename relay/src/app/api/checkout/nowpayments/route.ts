import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        // 1. Auth check
        const token = req.cookies.get('relay_session')?.value;
        if (!token) {
            return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
        }

        let userEmail = '';
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            userEmail = decoded.email;
        } catch (e) {
            return NextResponse.json({ error: 'Sesión inválida.' }, { status: 401 });
        }

        // 2. Body check
        const { planKey, isAnnual } = await req.json();
        if (!['starter', 'pro'].includes(planKey)) {
            return NextResponse.json({ error: 'Plan inválido.' }, { status: 400 });
        }

        const prices = {
            starter: isAnnual ? 180.00 : 19.00, // $15/mo vs $19/mo
            pro: isAnnual ? 468.00 : 49.00     // $39/mo vs $49/mo
        };

        const price = prices[planKey as 'starter' | 'pro'];

        // 3. NowPayments API Request
        // Encode email, plan and isAnnual in the order_id for the webhook to parse back
        const encodedData = Buffer.from(`${userEmail}|${planKey}|${isAnnual ? 'annual' : 'monthly'}`).toString('base64').replace(/=/g, '');
        const orderId = `now_${encodedData}_${Date.now()}`;

        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'x-api-key': NOWPAYMENTS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price_amount: price,
                price_currency: 'usd',
                pay_currency: 'usdttrc20',
                ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/nowpayments`,
                order_id: orderId,
                order_description: `Relay ${planKey.toUpperCase()} Subscription`,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancel`
            })
        });

        const data = await response.json();

        if (data.invoice_url) {
            return NextResponse.json({ url: data.invoice_url });
        } else {
            console.error('NowPayments API error:', data);
            return NextResponse.json({ error: 'PROVIDER_ERROR', details: data.message }, { status: 500 });
        }

    } catch (err: any) {
        console.error('NowPayments Checkout Error:', err);
        return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
    }
}
