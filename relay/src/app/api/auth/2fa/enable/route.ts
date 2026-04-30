import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { verifySync } from 'otplib';

export async function POST(req: NextRequest) {
    try {
        const { secret, code } = await req.json();

        if (!secret || !code) {
            return NextResponse.json({ error: 'Missing secret or code' }, { status: 400 });
        }

        // Get session to know which user to update
        const sessionToken = req.cookies.get('relay_session')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        import('jsonwebtoken').then(async (jwt) => {
            // Note: Since we are in the API route, we could decode the JWT to get user ID
            // However, since we're using a simple implementation, let's assume we can fetch the user by token or we just rely on Supabase Server Client's session if configured.
            // For now, let's decode the JWT.
        });

        // Let's decode the JWT directly here to get user ID
        const jwt = (await import('jsonwebtoken')).default;
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

        let decoded: any;
        try {
            decoded = jwt.verify(sessionToken, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
        }

        const userId = decoded.id;

        // Verify the code again on the server side for security
        console.log(`[2FA-DEBUG] Verifying code: "${code}" for secret: "${secret}"`);
        console.log(`[2FA-DEBUG] Current Server Time: ${new Date().toISOString()} (${Math.floor(Date.now() / 1000)})`);

        const { verifyTOTPCode } = await import('@/lib/2fa');
        const verificationResult = await verifyTOTPCode(code, secret);
        const { isValid } = verificationResult;

        console.log(`[2FA-DEBUG] Validation Result: ${isValid}`, verificationResult);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid 2FA code', debug: { serverTime: Date.now() } }, { status: 400 });
        }

        // Update the user's account with the secret and mark 2FA as enabled
        console.log(`[2FA-ENABLE] Attempting to save 2FA for User: ${userId}`);
        const { data: updateData, error, count } = await supabaseServer
            .from('accounts')
            .update({
                totp_secret: secret,
                is_2fa_enabled: true
            })
            .eq('id', userId)
            .select();

        if (error) {
            console.error("[2FA-ENABLE] Supabase Error:", error);
            return NextResponse.json({ error: 'Error saving 2FA configuration' }, { status: 500 });
        }

        console.log(`[2FA-ENABLE] Successfully updated database. rows affected: ${updateData?.length || 0}`);
        if (!updateData || updateData.length === 0) {
            console.warn("[2FA-ENABLE] No rows were updated. Check if userId matches.");
            return NextResponse.json({ error: 'User record not found or no change' }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('2FA Enable API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
