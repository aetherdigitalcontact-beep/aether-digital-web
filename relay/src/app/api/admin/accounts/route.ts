import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

async function checkAdmin(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const decodedEmail = decoded?.email || '';

        // Hardcoded superuser for now (matches api/auth/me)
        if (decodedEmail.trim().toLowerCase() === 'quiel.g538@gmail.com') return decoded;

        const { data: user } = await supabaseServer
            .from('accounts')
            .select('email')
            .eq('id', decoded.id)
            .single();

        const dbEmail = user?.email || '';
        if (dbEmail.trim().toLowerCase() === 'quiel.g538@gmail.com') return decoded;
        return null;
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const admin = await checkAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: accounts, error } = await supabaseServer
        .from('accounts')
        .select('id, email, full_name, company, plan, created_at, avatar_url')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ accounts });
}

export async function PATCH(req: NextRequest) {
    const admin = await checkAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId, plan } = await req.json();

    if (!userId || !plan) {
        return NextResponse.json({ error: 'Missing userId or plan' }, { status: 400 });
    }

    const { error } = await supabaseServer
        .from('accounts')
        .update({ plan: plan.toLowerCase() })
        .eq('id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const admin = await checkAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        // First delete the auth user
        const { error: authError } = await supabaseServer.auth.admin.deleteUser(userId);
        if (authError) {
            console.error("Auth deletion partial failure:", authError);
            // Non-blocking, as public.accounts is the primary tracking
        }

        const { error } = await supabaseServer
            .from('accounts')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
    }
}
