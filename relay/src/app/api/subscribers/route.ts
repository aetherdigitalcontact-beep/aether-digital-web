import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: Request) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const url = new URL(req.url);
        const search = url.searchParams.get('search');

        let query = supabaseServer.from('subscribers')
            .select(`*`)
            .eq('user_id', workspaceId)
            .order('created_at', { ascending: false });

        if (search) {
            query = query.or(`external_id.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Try to fetch relay avatars magically for subscribers that have an email
        const emails = data.map(s => s.email).filter(Boolean);
        if (emails.length > 0) {
            const { data: relayUsers } = await supabaseServer
                .from('accounts')
                .select('email, avatar_url')
                .in('email', emails)
                .not('avatar_url', 'is', null);

            if (relayUsers && relayUsers.length > 0) {
                const avatarMap = new Map();
                relayUsers.forEach(u => avatarMap.set(u.email, u.avatar_url));

                data.forEach(s => {
                    if (s.email && avatarMap.has(s.email)) {
                        s.relay_developer_avatar = avatarMap.get(s.email);
                    }
                });
            }
        }

        return NextResponse.json({ subscribers: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const body = await req.json();
        const { external_id, full_name, email, phone, phone_number, custom_data } = body;

        let finalPhone = phone || phone_number || null;

        if (!external_id) return NextResponse.json({ error: 'Missing external_id (Subscriber ID)' }, { status: 400 });

        const { data, error } = await supabaseServer.from('subscribers')
            .insert({
                user_id: workspaceId,
                external_id,
                full_name: full_name || null,
                email: email || null,
                phone: finalPhone,
                custom_attributes: custom_data || {}
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'A subscriber with this ID already exists.' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ subscriber: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing subscriber ID' }, { status: 400 });

        const { error } = await supabaseServer.from('subscribers')
            .delete()
            .eq('user_id', workspaceId)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const body = await req.json();
        const { id, external_id, full_name, email, phone, phone_number, custom_data } = body;

        let finalPhone = phone || phone_number || null;

        if (!id || !external_id) return NextResponse.json({ error: 'Missing id or external_id' }, { status: 400 });

        const { data, error } = await supabaseServer.from('subscribers')
            .update({
                external_id,
                full_name: full_name || null,
                email: email || null,
                phone: finalPhone,
                custom_attributes: custom_data || {}
            })
            .eq('id', id)
            .eq('user_id', workspaceId)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'A subscriber with this External ID already exists.' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ subscriber: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

