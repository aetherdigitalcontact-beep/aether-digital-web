import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * CRON WORKER: RELAY FLUSH
 * This route should be called periodically (every minute) to process:
 * 1. Delayed notifications (waitNode)
 * 2. Compiling and sending Digests (digestNode)
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date().toISOString();
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        // 1. Process DELAY items
        const { data: delays, error: delayError } = await supabaseServer
            .from('relay_queue')
            .select('*')
            .eq('type', 'DELAY')
            .eq('status', 'pending')
            .lte('scheduled_for', now)
            .limit(50);

        if (delayError) throw delayError;

        console.log(`[Flush] NOW: ${now} | TYPE DELAY & PENDING: Found ${delays?.length || 0} payloads`);

        const results = [];

        for (const item of delays || []) {
            try {
                // Resume the scenario execution by calling /api/relay internally
                const payload = item.payload;

                // Fix Node.js 18+ IPv6 fetch bug by substituting localhost with 127.0.0.1
                const safeUrl = baseUrl.includes('localhost') ? baseUrl.replace('localhost', '127.0.0.1') : baseUrl;

                const response = await fetch(`${safeUrl}/api/relay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...payload.originalBody,
                        variables: payload.variables,
                        _override_nodes: payload.remainingNodes,
                        _scenario_id: item.scenario_id,
                        apiKeyId: item.key_id,
                        _worker_exec: true
                    })
                });

                if (response.ok) {
                    await supabaseServer.from('relay_queue').delete().eq('id', item.id);
                    results.push({ id: item.id, status: 'RESUMED' });
                } else {
                    const err = await response.text();
                    console.error(`[Flush] Failed to resume delay ${item.id}:`, err);
                    results.push({ id: item.id, status: 'FAILED', error: err });
                }
            } catch (e: any) {
                console.error(`[Flush] Error processing delay ${item.id}:`, e.message);
                results.push({ id: item.id, status: 'FAILED', error: e.message || 'Node Fetch Crash' });
            }
        }

        // 2. Process DIGEST items
        const { data: readyDigests } = await supabaseServer
            .from('relay_queue')
            .select('digest_key, scenario_id, key_id, user_id')
            .eq('type', 'DIGEST')
            .eq('status', 'pending')
            .lte('scheduled_for', now);

        if (readyDigests && readyDigests.length > 0) {
            const uniqueDigestSpecs = Array.from(new Set(readyDigests.map(d => `${d.digest_key}|${d.scenario_id}`)));

            for (const spec of uniqueDigestSpecs) {
                const [dKey, sId] = spec.split('|');

                // Fetch all items for this specific digest bucket
                const { data: items } = await supabaseServer
                    .from('relay_queue')
                    .select('*')
                    .eq('digest_key', dKey)
                    .eq('scenario_id', sId)
                    .eq('type', 'DIGEST');

                if (!items || items.length === 0) continue;

                const firstItem = items[0];
                const scenarioId = firstItem.scenario_id;
                const remainingNodes = firstItem.payload.remainingNodes;
                const nodeData = firstItem.payload.nodeData;

                // Aggregate items for the next node
                const digestItems = items.map(it => ({
                    timestamp: it.created_at,
                    ...it.payload.originalBody,
                    ...it.payload.variables
                }));

                const template = nodeData?.digest_template || `**Digest: {{key}}**\n- {{items}}`;
                const summaryMessage = template
                    .replace('{{count}}', items.length.toString())
                    .replace('{{key}}', dKey)
                    .replace('{{items}}', items.map(it => it.payload.originalBody.message || 'New event').join('\n- '));

                // Resume Scenario Flow
                const safeUrl = baseUrl.includes('localhost') ? baseUrl.replace('localhost', '127.0.0.1') : baseUrl;
                try {
                    const response = await fetch(`${safeUrl}/api/relay`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: summaryMessage,
                            digest_items: digestItems,
                            _override_nodes: remainingNodes,
                            _scenario_id: scenarioId,
                            apiKeyId: firstItem.key_id,
                            _worker_exec: true
                        })
                    });

                    if (response.ok) {
                        await supabaseServer.from('relay_queue')
                            .delete()
                            .eq('digest_key', dKey)
                            .eq('scenario_id', sId)
                            .eq('type', 'DIGEST');
                        results.push({ digest: dKey, status: 'SENT', count: items.length });
                    } else {
                        results.push({ digest: dKey, status: 'FAILED', error: await response.text() });
                    }
                } catch (e: any) {
                    results.push({ digest: dKey, status: 'FAILED', error: e.message });
                }
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results,
            debug: {
                now,
                delaysFound: delays?.length || 0,
                digestsFound: readyDigests?.length || 0,
                firstDelayParams: delays?.[0] || null
            }
        });

    } catch (error: any) {
        console.error('[Flush Worker Error]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
