import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        // Webhooks send action: 'payment.created' or 'payment.updated'
        // Even test webhooks trigger this.
        if (payload.type === 'payment') {
            const paymentId = payload.data?.id;

            if (paymentId) {
                const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
                if (!mpToken) return NextResponse.json({ received: false }, { status: 500 });

                const client = new MercadoPagoConfig({ accessToken: mpToken });
                const paymentFetcher = new Payment(client);

                // Fetch the actual verified payment data straight from Mercado Pago's servers 
                const paymentData = await paymentFetcher.get({ id: paymentId });

                if (paymentData.status === 'approved') {
                    const userEmail = paymentData.metadata?.user_email;
                    const planKey = paymentData.metadata?.plan_key || 'pro';

                    if (userEmail) {
                        const { error } = await supabaseServer
                            .from('accounts')
                            .update({ plan: planKey })
                            .eq('email', userEmail);

                        if (error) console.error('MercadoPago Db Update Error:', error);
                        else console.log(`Mercado Pago Webhook: Upgraded ${userEmail} to PRO`);
                    }
                }
            }
        }

        // Mercado Pago expects 200 OK
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error('MercadoPago Webhook error:', err);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
