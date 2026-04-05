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
    } catch {
        return null; // Don't crash on invalid token
    }
}

export async function GET(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const { data, error } = await supabaseServer
                .from('scenarios')
                .select('*')
                .eq('id', id)
                .eq('user_id', userId)
                .single();
            if (error) throw error;
            return NextResponse.json({ scenario: data });
        } else {
            const { data, error } = await supabaseServer
                .from('scenarios')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return NextResponse.json({ scenarios: data });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { name, description } = body;

        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        // Default minimalist graph (Webhook -> Action)
        const defaultNodes = [
            {
                id: 'trigger-1',
                type: 'triggerNode',
                position: { x: 100, y: 150 },
                data: { label: 'Webhook', event: 'payload.received' }
            },
            {
                id: 'action-1',
                type: 'actionNode',
                position: { x: 400, y: 150 },
                data: { label: 'Route Payload', platform: 'telegram' }
            }
        ];

        const defaultEdges = [
            { id: 'edge-1', source: 'trigger-1', target: 'action-1' }
        ];

        const { data, error } = await supabaseServer
            .from('scenarios')
            .insert({
                user_id: userId,
                name,
                description: description || '',
                nodes: defaultNodes,
                edges: defaultEdges
            })
            .select('*')
            .single();

        if (error) throw error;
        return NextResponse.json({ scenario: data });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { id, name, description, nodes, edges, is_active } = body;

        if (!id) return NextResponse.json({ error: 'Scenario ID is required' }, { status: 400 });

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (nodes !== undefined) updateData.nodes = nodes;
        if (edges !== undefined) updateData.edges = edges;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabaseServer
            .from('scenarios')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ scenario: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids')?.split(',') || (searchParams.get('id') ? [searchParams.get('id')] : []);
    if (ids.length === 0) return NextResponse.json({ error: 'Scenario ID(s) required' }, { status: 400 });

    try {
        const { error } = await supabaseServer
            .from('scenarios')
            .delete()
            .in('id', ids)
            .eq('user_id', userId);

        if (error) throw error;
        return NextResponse.json({ success: true, count: ids.length });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
