import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    try {
        const sessionToken = req.cookies.get('relay_session')?.value;
        if (!sessionToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const jwt = (await import('jsonwebtoken')).default;
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

        let decoded: any;
        try {
            decoded = jwt.verify(sessionToken, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
        }

        const userId = decoded.id;

        // Disable 2FA in the database
        const { error } = await supabaseServer
            .from('accounts')
            .update({
                totp_secret: null,
                is_2fa_enabled: false
            })
            .eq('id', userId);

        if (error) {
            console.error("Supabase Error disabling 2FA:", error);
            return NextResponse.json({ error: 'Error disabling 2FA configuration' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('2FA Disable API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
