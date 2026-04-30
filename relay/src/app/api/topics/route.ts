import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: Request) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const url = new URL(req.url);
        const search = url.searchParams.get('search');

        let query = supabaseServer.from('topics')
            .select(`
                id,
                name,
                key,
                rules,
                created_at,
                topic_subscribers ( count )
            `)
            .eq('user_id', workspaceId)
            .order('created_at', { ascending: false });

        if (search) {
            query = query.or(`name.ilike.%${search}%,key.ilike.%${search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Map the relation 'topic_subscribers' array count down to a numeric property
        // And evaluate dynamic JSON rules count on the fly for the UI badge!
        const topics = await Promise.all(data.map(async (t) => {
            let totalCount = t.topic_subscribers?.[0]?.count || 0;

            if (t.rules && Array.isArray(t.rules) && t.rules.length > 0) {
                let q = supabaseServer.from('subscribers').select('id', { count: 'exact', head: true })
                    .eq('user_id', workspaceId)
                    .eq('is_unsubscribed', false);

                t.rules.forEach((rule: any) => {
                    const { field, operator, value } = rule;
                    if (!field) return;

                    if (field.startsWith('metadata.')) {
                        const jsonKey = field.replace('metadata.', '');
                        if (operator === 'equals') q = q.contains('custom_attributes', { [jsonKey]: value });
                        if (operator === 'exists') q = q.not(`custom_attributes->${jsonKey}`, 'is', null);
                    } else {
                        if (operator === 'equals') q = q.eq(field, value);
                        if (operator === 'not_equals') q = q.neq(field, value);
                        if (operator === 'contains') q = q.ilike(field, `%${value}%`);
                        if (operator === 'exists') q = q.not(field, 'is', null);
                    }
                });

                const { count: dynCount } = await q;
                if (dynCount) totalCount += dynCount;
            }

            return {
                ...t,
                subscriber_count: totalCount
            };
        }));

        return NextResponse.json({ topics });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const body = await req.json();
        const { name, key, rules } = body;

        if (!name || !key) return NextResponse.json({ error: 'Missing name or key' }, { status: 400 });

        const { data, error } = await supabaseServer.from('topics')
            .insert({
                user_id: workspaceId,
                name,
                key,
                rules: rules || []
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({ error: 'A topic with this key already exists.' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ topic: data });
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

        if (!id) return NextResponse.json({ error: 'Missing segment ID' }, { status: 400 });

        const { error } = await supabaseServer.from('topics')
            .delete()
            .eq('user_id', workspaceId)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
