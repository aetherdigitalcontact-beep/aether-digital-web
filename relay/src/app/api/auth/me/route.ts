import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;

            // Always fetch fresh data from DB
            const { data: userData, error: userError } = await supabaseServer
                .from('accounts')
                .select('*')
                .eq('id', decoded.id)
                .single();

            const userEmail = (userData?.email || decoded.email || '');
            const isSuperuser = userEmail.trim().toLowerCase() === 'quiel.g538@gmail.com';
            const plan = (userData?.plan || 'free').toUpperCase();

            return NextResponse.json({
                user: {
                    id: decoded.id,
                    email: userData?.email || decoded.email,
                    name: userData?.full_name || decoded.name,
                    full_name: userData?.full_name || decoded.name,
                    company: userData?.company,
                    avatar_url: userData?.avatar_url,
                    plan: plan,
                    is_admin: isSuperuser, // Grant admin flag
                    bot_name: userData?.bot_name || 'Relay Protocol',
                    bot_thumbnail: userData?.bot_thumbnail,
                    created_at: userData?.created_at || decoded.created_at
                }
            });
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
