import { NextRequest, NextResponse } from 'next/server';
import { generateTOTPSecret, generateOTPAuthURI } from '@/lib/2fa';

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

        const userEmail = decoded.email || "user@relay.sh";

        const secret = generateTOTPSecret();
        const uri = generateOTPAuthURI(userEmail, "Relay", secret);

        return NextResponse.json({ success: true, secret, uri });
    } catch (error: any) {
        console.error('2FA Generate API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
