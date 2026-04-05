import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { data: templates, error } = await supabaseServer
            .from('templates')
            .select('*')
            .eq('user_id', decoded.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ templates });
    } catch (err: any) {
        console.error('Templates API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { name, content, platform_defaults } = await req.json();

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
        }

        const { data: template, error } = await supabaseServer
            .from('templates')
            .upsert([{
                user_id: decoded.id,
                name,
                content,
                platform_defaults: platform_defaults || {}
            }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ template });
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
            .from('templates')
            .delete()
            .eq('id', id)
            .eq('user_id', decoded.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
