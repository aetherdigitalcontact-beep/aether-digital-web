import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { provider } = await req.json();

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        // 1. Get user identities from Supabase Auth
        // We use admin API to be sure we find them
        const { data: { user: sbUser }, error: userError } = await supabaseServer.auth.admin.getUserById(decoded.id);

        if (userError || !sbUser) {
            console.error('[UNLINK] User not found in Supabase:', userError);
            return NextResponse.json({ error: 'User not found in authentication system' }, { status: 404 });
        }

        const identity = sbUser.identities?.find(id => id.provider === provider.toLowerCase());

        if (!identity) {
            return NextResponse.json({ error: `No connected ${provider} account found` }, { status: 404 });
        }

        // 2. Unlink the identity
        // Note: admin.unlinkIdentity doesn't exist, we must use the client-side instance or delete the identity record if possible?
        // Actually, Supabase Admin API allows updating identities but unlinking is usually a user-session action.

        // WORKAROUND: In Supabase, identities are just records. 
        // We can try to delete the identity record from the auth schema if we had direct access, 
        // but the standard way is user session.

        /* 
        If we cannot unlink via Admin API directly, we will at least ensure the Email list is clean.
        However, most Supabase projects allow unlinking via a user-authenticated client.
        Since we don't have the user's password here, we will return an error if we can't do it via admin.
        */

        return NextResponse.json({
            error: 'Unlinking via API is coming soon. Please try again or contact support.',
            details: 'Server implementation for identity unlinking requires session propagation.'
        }, { status: 501 });

    } catch (error: any) {
        console.error('[UNLINK] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
