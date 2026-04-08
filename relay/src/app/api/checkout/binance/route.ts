import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const BINANCE_API_KEY = process.env.BINANCE_API_KEY || '';
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET || '';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

function generateNonce(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function hashSignature(payload: string, secret: string) {
    return crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex')
        .toUpperCase();
}

export async function POST(req: NextRequest) {
    try {
        // 1. Auth check
        const token = req.cookies.get('relay_session')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No tienes sesión iniciada.' }, { status: 401 });
        }

        let userEmail = '';
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            userEmail = decoded.email;
        } catch (e) {
            return NextResponse.json({ error: 'Sesión inválida.' }, { status: 401 });
        }

        // 2. Body check
        const { planKey } = await req.json();
        if (!['starter', 'pro'].includes(planKey)) {
            return NextResponse.json({ error: 'Plan inválido.' }, { status: 400 });
        }

        const prices = {
            starter: 19.00,
            pro: 49.00
        };

        // 3. Binance API Request
        const endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/v2/order';
        const nonce = generateNonce();
        const timestamp = Date.now();

        // Encode email and plan in the trade number for the webhook to parse back
        const encodedData = Buffer.from(`${userEmail}|${planKey}`).toString('base64').replace(/=/g, '');
        const merchantTradeNo = `rl_${encodedData}_${Date.now()}`;

        const body = {
            env: { terminalType: 'WEB' },
            merchantTradeNo: merchantTradeNo,
            orderAmount: prices[planKey as 'starter' | 'pro'].toFixed(2),
            currency: 'USDT',
            goods: {
                goodsType: '01', // Virtual goods
                goodsCategory: 'Z000', // Others (SaaS)
                referenceGoodsId: planKey,
                goodsName: `Relay ${planKey.toUpperCase()} Subscription`,
                goodsDetail: `Access to Relay ${planKey.toUpperCase()} tier for 1 month.`
            },
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancel`,
            webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/binance`
        };

        // Binance V2/V3 Signature Logic: timestamp + "\n" + nonce + "\n" + body + "\n"
        const payloadToSign = timestamp + "\n" + nonce + "\n" + JSON.stringify(body) + "\n";
        const signature = hashSignature(payloadToSign, BINANCE_API_SECRET);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'BinancePay-Timestamp': timestamp.toString(),
                'BinancePay-Nonce': nonce,
                'BinancePay-Certificate-SN': BINANCE_API_KEY,
                'BinancePay-Signature': signature
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.status === 'SUCCESS' && data.data?.checkoutUrl) {
            return NextResponse.json({ url: data.data.checkoutUrl });
        } else {
            console.error('Binance API error:', data);
            return NextResponse.json({ error: 'Hubo un error contactando a Binance Pay.', details: data.errorMessage }, { status: 500 });
        }

    } catch (err: any) {
        console.error('Binance Checkout Error:', err);
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
    }
}
