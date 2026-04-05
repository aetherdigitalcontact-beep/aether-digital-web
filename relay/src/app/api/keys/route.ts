import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

async function getUserId(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.id;
    } catch (err) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: keys, error } = await supabaseServer
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Fetch call counts for each key
    const keysWithStats = await Promise.all((keys || []).map(async (key) => {
        const { count } = await supabaseServer
            .from('logs')
            .select('*', { count: 'exact', head: true })
            .eq('key_id', key.id);

        return {
            ...key,
            call_count: count || 0
        };
    }));

    return NextResponse.json({ keys: keysWithStats });
}

export async function POST(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { label, key_hash } = await req.json();

    // 1. Get user plan (default to 'free' if column doesn't exist yet)
    const { data: accountData, error: accountError } = await supabaseServer
        .from('accounts')
        .select('plan')
        .eq('id', userId)
        .single();

    const plan = accountData?.plan || 'free';

    // 2. Get current active key count
    const { count } = await supabaseServer
        .from('api_keys')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const currentKeys = count || 0;

    // 3. Enforce limits based on plan
    const limits: Record<string, number> = {
        free: 1,
        hobby: 1,
        starter: 2,
        pro: 4,
        enterprise: 99999 // Unlimited
    };

    const maxKeys = limits[plan.toLowerCase()] || 1;

    if (currentKeys >= maxKeys) {
        return NextResponse.json(
            { error: `API Limit Reached. Your ${plan.toUpperCase()} plan only allows ${maxKeys} API Key(s). Upgrade for more limit.` },
            { status: 403 }
        );
    }

    const { data, error } = await supabaseServer
        .from('api_keys')
        .insert({
            user_id: userId,
            label,
            key_hash,
            is_active: true
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ key: data });
}

export async function DELETE(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabaseServer
        .from('api_keys')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
