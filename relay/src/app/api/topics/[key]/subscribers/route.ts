import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const resolvedParams = await params;
        const topicKey = resolvedParams.key;

        const { data: topic, error: topicError } = await supabaseServer
            .from('topics')
            .select('id, rules')
            .eq('user_id', workspaceId)
            .eq('key', topicKey)
            .single();

        if (topicError || !topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

        let mappedSubscribers: any[] = [];

        // 1. Fetch static subscribers (those explicitly linked via ID)
        const { data: relations } = await supabaseServer
            .from('topic_subscribers')
            .select(`
                subscriber_id,
                subscribers (
                    id,
                    external_id,
                    email,
                    phone,
                    full_name,
                    custom_attributes,
                    is_unsubscribed
                )
            `)
            .eq('topic_id', topic.id);

        mappedSubscribers = (relations || []).map((rel: any) => rel.subscribers).filter(Boolean);

        // 2. Fetch dynamic subscribers (those passing the JSON rules)
        if (topic.rules && Array.isArray(topic.rules) && topic.rules.length > 0) {
            let query: any = supabaseServer
                .from('subscribers')
                .select(`
                    id,
                    external_id,
                    email,
                    phone,
                    full_name,
                    custom_attributes,
                    is_unsubscribed
                `)
                .eq('user_id', workspaceId);

            topic.rules.forEach((rule: any) => {
                const { field, operator, value } = rule;
                if (!field) return;

                if (field.startsWith('metadata.')) {
                    const jsonKey = field.replace('metadata.', '');
                    if (operator === 'equals') query = query.contains('custom_attributes', { [jsonKey]: value });
                    if (operator === 'exists') query = query.not(`custom_attributes->${jsonKey}`, 'is', null);
                } else {
                    if (operator === 'equals') query = query.eq(field, value);
                    if (operator === 'not_equals') query = query.neq(field, value);
                    if (operator === 'contains') query = query.ilike(field, `%${value}%`);
                    if (operator === 'exists') query = query.not(field, 'is', null);
                }
            });

            const { data: dynSubs } = await query;
            if (dynSubs) {
                // Merge avoiding duplicates
                const existingIds = new Set(mappedSubscribers.map(s => s.id));
                dynSubs.forEach((ds: any) => {
                    if (!existingIds.has(ds.id)) {
                        mappedSubscribers.push(ds);
                    }
                });
            }
        }

        const emails = mappedSubscribers.map((s: any) => s.email).filter(Boolean);
        if (emails.length > 0) {
            const { data: relayUsers } = await supabaseServer
                .from('accounts')
                .select('email, avatar_url')
                .in('email', emails)
                .not('avatar_url', 'is', null);

            if (relayUsers && relayUsers.length > 0) {
                const avatarMap = new Map();
                relayUsers.forEach(u => avatarMap.set(u.email, u.avatar_url));

                mappedSubscribers.forEach((s: any) => {
                    if (s.email && avatarMap.has(s.email)) {
                        s.relay_developer_avatar = avatarMap.get(s.email);
                    }
                });
            }
        }

        return NextResponse.json({ subscribers: mappedSubscribers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ key: string }> }) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const resolvedParams = await params;
        const topicKey = resolvedParams.key;

        const body = await req.json();
        const { subscribers } = body; // Array of subscriber IDs (UUIDs or external_ids)

        if (!subscribers || !Array.isArray(subscribers)) {
            return NextResponse.json({ error: 'Missing array of subscribers' }, { status: 400 });
        }

        // We first need the Topic UUID
        const { data: topic, error: topicError } = await supabaseServer
            .from('topics')
            .select('id')
            .eq('user_id', workspaceId)
            .eq('key', topicKey)
            .single();

        if (topicError || !topic) {
            return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
        }

        // Convert external_ids or emails to UUIDs if necessary
        const { data: dbSubscribers, error: dbSubError } = await supabaseServer
            .from('subscribers')
            .select('id, external_id, email')
            .eq('user_id', workspaceId)
            .or(`external_id.in.(${subscribers.map(s => `"${s}"`).join(',')}),email.in.(${subscribers.map(s => `"${s}"`).join(',')})`);

        if (dbSubError) throw dbSubError;

        // If they provided internal UUIDs, let's also fetch those just in case UI uses them.
        const internalUUIDs = subscribers.filter(s => s.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i));
        let internalSubscribers: any[] = [];
        if (internalUUIDs.length > 0) {
            const { data: uuidDbSubs } = await supabaseServer
                .from('subscribers')
                .select('id')
                .eq('user_id', workspaceId)
                .in('id', internalUUIDs);
            internalSubscribers = uuidDbSubs || [];
        }

        // Merge valid IDs
        const allValidIds = new Set<string>();
        (dbSubscribers || []).forEach((s: any) => allValidIds.add(s.id));
        internalSubscribers.forEach((s: any) => allValidIds.add(s.id));

        if (allValidIds.size === 0) {
            return NextResponse.json({ error: 'No matching subscribers found in workspace' }, { status: 404 });
        }

        // Build relations
        const relations = Array.from(allValidIds).map(subId => ({
            topic_id: topic.id,
            subscriber_id: subId
        }));

        const { error: insertError } = await supabaseServer
            .from('topic_subscribers')
            .upsert(relations, { onConflict: 'topic_id, subscriber_id' });

        if (insertError) throw insertError;

        return NextResponse.json({ success: true, added: relations.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ key: string }> }) {
    try {
        const { workspaceId, error: wsError } = await requireWorkspaceAccess(req as any);
        if (wsError || !workspaceId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const subscriberId = searchParams.get('subscriberId');

        if (!subscriberId) {
            return NextResponse.json({ error: 'Missing subscriberId' }, { status: 400 });
        }

        const resolvedParams = await params;
        const topicKey = resolvedParams.key;

        // We first need the Topic UUID
        const { data: topic } = await supabaseServer
            .from('topics')
            .select('id')
            .eq('user_id', workspaceId)
            .eq('key', topicKey)
            .single();

        if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

        // Remove the relationship
        const { error: delError } = await supabaseServer
            .from('topic_subscribers')
            .delete()
            .eq('topic_id', topic.id)
            .eq('subscriber_id', subscriberId);

        if (delError) throw delError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
