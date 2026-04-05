import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { data: webhooks, error } = await supabaseServer
            .from('webhooks')
            .select('*')
            .eq('user_id', decoded.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ webhooks });
    } catch (err: any) {
        console.error('Webhooks API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { url, label } = await req.json();

        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

        const secret = 'whsec_' + Math.random().toString(36).substring(2, 15);

        const { data: webhook, error } = await supabaseServer
            .from('webhooks')
            .insert([{
                user_id: decoded.id,
                url,
                label,
                secret,
                is_active: true
            }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ webhook });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const { error } = await supabaseServer
            .from('webhooks')
            .delete()
            .eq('id', id)
            .eq('user_id', decoded.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
