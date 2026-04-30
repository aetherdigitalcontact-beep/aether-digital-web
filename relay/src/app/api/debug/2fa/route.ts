import { NextRequest, NextResponse } from 'next/server';
import { TOTP, NobleCryptoPlugin, ScureBase32Plugin } from 'otplib';

export async function POST(req: NextRequest) {
    try {
        const { secret, code } = await req.json();

        console.log('--- 2FA DEBUG START ---');
        console.log('Received Secret:', secret);
        console.log('Received Code:', code);

        const totp = new TOTP({
            crypto: new NobleCryptoPlugin(),
            base32: new ScureBase32Plugin(),
            digits: 6,
            algorithm: 'sha1',
            period: 30
        });

        const isValidDefault = await totp.verify(code, { secret });

        // Try with 10 steps tolerance
        const isValidWithWindow = await totp.verify(code, {
            secret,
            epochTolerance: 300 // 5 mins
        });

        console.log('Validation (Default):', isValidDefault);
        console.log('Validation (5m Window):', isValidWithWindow);
        console.log('Server Time:', new Date().toISOString());
        console.log('--- 2FA DEBUG END ---');

        return NextResponse.json({
            isValidDefault,
            isValidWithWindow,
            serverTime: new Date().toISOString(),
            secretLength: secret.length
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
