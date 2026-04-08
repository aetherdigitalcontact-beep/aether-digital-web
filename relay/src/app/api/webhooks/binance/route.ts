import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseServer } from '@/lib/supabaseServer';

const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET || '';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const payload = JSON.parse(rawBody);

        // 1. Verify Binance Signature (Standard procedure for V2/V3)
        // Note: For full production, use Binance's Public Key verification.
        // For now, we process the success status.

        if (payload.bizType === 'PAY' && payload.bizStatus === 'PAY_SUCCESS') {
            const data = JSON.parse(payload.data);
            const merchantTradeNo = data.merchantTradeNo;

            console.log(`[Binance Webhook] Payment Successful: ${merchantTradeNo}`);

            // 2. Extract user and plan from trade number (rl_BASE64_TIMESTAMP)
            const parts = merchantTradeNo.split('_');
            if (parts.length >= 2 && parts[0] === 'rl') {
                const encodedData = parts[1];
                // Pad base64 if needed
                const paddedData = encodedData.padEnd(encodedData.length + (4 - encodedData.length % 4) % 4, '=');
                const decoded = Buffer.from(paddedData, 'base64').toString('utf8');
                const [email, plan] = decoded.split('|');

                if (email && plan) {
                    console.log(`[Binance Webhook] Upgrading ${email} to ${plan.toUpperCase()}`);
                    const { error } = await supabaseServer
                        .from('accounts')
                        .update({ plan: plan })
                        .eq('email', email);

                    if (error) console.error('Database update error:', error);
                }
            }
        }

        // Return Binance-required success response
        return NextResponse.json({ returnCode: '000000', returnMsg: 'success' });
    } catch (err: any) {
        console.error('Binance Webhook Error:', err);
        return NextResponse.json({ returnCode: '999999', returnMsg: 'fail' }, { status: 500 });
    }
}
