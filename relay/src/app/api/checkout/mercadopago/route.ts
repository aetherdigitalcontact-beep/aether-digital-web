import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        // Authenticate request using session cookie
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

        const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
        if (!mpToken) {
            return NextResponse.json({ error: 'Falta configurar Mercado Pago en Vercel.' }, { status: 500 });
        }

        let planKey = 'pro'; // default
        try {
            const reqBody = await req.json();
            if (reqBody.planKey && (reqBody.planKey === 'starter' || reqBody.planKey === 'pro')) {
                planKey = reqBody.planKey;
            }
        } catch (e) {
            // Ignore if no body
        }

        const client = new MercadoPagoConfig({ accessToken: mpToken });
        const preference = new Preference(client);

        const prices = {
            starter: {
                id: 'relay_starter_ar',
                title: 'Relay Starter (Oferta Argentina)',
                unit_price: 18620
            },
            pro: {
                id: 'relay_pro_ar',
                title: 'Relay Pro (Oferta Argentina)',
                unit_price: 48020
            }
        };

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://relay-amber-nu.vercel.app';
        const body = {
            items: [
                {
                    id: prices[planKey as 'starter' | 'pro'].id,
                    title: prices[planKey as 'starter' | 'pro'].title,
                    quantity: 1,
                    unit_price: prices[planKey as 'starter' | 'pro'].unit_price
                }
            ],
            back_urls: {
                success: `${appUrl}/dashboard?payment=success`,
                failure: `${appUrl}/pricing?payment=failure`,
                pending: `${appUrl}/dashboard?payment=pending`
            },
            auto_return: 'approved',
            metadata: {
                user_email: userEmail,
                plan_key: planKey
            },
        };

        const response = await preference.create({ body });

        return NextResponse.json({ url: response.init_point });
    } catch (err: any) {
        console.error('Mercado Pago Checkout Error:', err);
        return NextResponse.json({ error: 'PROVIDER_ERROR' }, { status: 500 });
    }
}
