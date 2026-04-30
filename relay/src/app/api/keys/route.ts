import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    const { searchParams } = new URL(req.url);
    const env = searchParams.get('env') || 'development';

    const { data: keys, error } = await supabaseServer
        .from('api_keys')
        .select('*')
        .eq('user_id', workspaceId)
        .eq('environment', env)
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
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    const { label, key_hash, env = 'development' } = await req.json();

    // 1. Get user plan (Ensure account exists)
    let { data: accountData, error: accountError } = await supabaseServer
        .from('accounts')
        .select('plan, email')
        .eq('id', userId)
        .single();

    if (accountError || !accountData) {
        console.warn(`[API-KEYS] Account missing for ${userId}, attempt just-in-time creation`);
        // Fallback: This shouldn't happen if auth/sync works, but let's be safe.
        // We might not have the email here though.
        return NextResponse.json({ error: 'Uplink synchronization pending. Please refresh the dashboard.' }, { status: 403 });
    }

    const plan = accountData?.plan || 'free';

    // 2. Get current active key count for THIS environment
    const { count } = await supabaseServer
        .from('api_keys')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', workspaceId)
        .eq('environment', env);

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
            { error: `API Limit Reached. Your ${plan.toUpperCase()} plan only allows ${maxKeys} API Key(s) per environment. Upgrade for more limit.` },
            { status: 403 }
        );
    }

    const { data, error } = await supabaseServer
        .from('api_keys')
        .insert({
            user_id: workspaceId,
            label,
            key_hash,
            is_active: true,
            environment: env
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ key: data });
}

export async function DELETE(req: NextRequest) {
    const { userId, workspaceId, error: wsError, status: wsStatus } = await requireWorkspaceAccess(req);
    if (wsError) return NextResponse.json({ error: wsError }, { status: wsStatus || 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabaseServer
        .from('api_keys')
        .delete()
        .eq('id', id)
        .eq('user_id', workspaceId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
