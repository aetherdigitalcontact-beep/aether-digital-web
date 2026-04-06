import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        // Authenticate request using session cookie
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

        const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
        if (!mpToken) {
            return NextResponse.json({ error: 'Falta configurar Mercado Pago en Vercel.' }, { status: 500 });
        }

        const client = new MercadoPagoConfig({ accessToken: mpToken });
        const preference = new Preference(client);

        const body = {
            items: [
                {
                    id: 'relay_pro_ar',
                    title: 'Relay Pro (Oferta Argentina)',
                    quantity: 1,
                    unit_price: 48020 // Pricing in ARS - $49 USD * 1400 ARS/USD - 30% discount
                }
            ],
            back_urls: {
                success: 'https://relay-amber-nu.vercel.app/dashboard?payment=success',
                failure: 'https://relay-amber-nu.vercel.app/pricing?payment=failure',
                pending: 'https://relay-amber-nu.vercel.app/dashboard?payment=pending'
            },
            auto_return: 'approved',
            metadata: {
                user_email: userEmail,
                plan_key: 'pro'
            },
        };

        const response = await preference.create({ body });

        return NextResponse.json({ url: response.init_point });
    } catch (err: any) {
        console.error('Mercado Pago Checkout Error:', err);
        return NextResponse.json({ error: 'Hubo un error contactando a Mercado Pago.' }, { status: 500 });
    }
}
