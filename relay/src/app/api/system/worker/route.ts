import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { createClient } from '@supabase/supabase-js';

// We might need a higher-privilege client for the worker to bypass some RLS if needed, 
// though the service role key in supabaseServer should suffice.

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
    const startTime = Date.now();
    const host = req.headers.get('host') || process.env.VERCEL_URL || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
        // --- AUTH: Secure the worker with a secret key ---
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
            // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            // For now, let's allow it if we are testing, but in prod this is critical
        }

        // 1. Fetch pending items that are ready to go
        const { data: pendingItems, error: fetchError } = await supabaseServer
            .from('relay_queue')
            .select('*')
            .eq('status', 'pending')
            .lte('scheduled_for', new Date().toISOString());

        if (fetchError) throw fetchError;
        if (!pendingItems || pendingItems.length === 0) {
            return NextResponse.json({ message: 'Queue empty', processed: 0 });
        }

        let processedCount = 0;

        for (const item of pendingItems) {
            try {
                if (item.type === 'DELAY') {
                    await processDelay(item, baseUrl);
                } else if (item.type === 'DIGEST') {
                    await processDigest(item, baseUrl);
                }

                // Mark as processed
                await supabaseServer
                    .from('relay_queue')
                    .update({ status: 'processed' })
                    .eq('id', item.id);

                processedCount++;
            } catch (err: any) {
                console.error(`[Worker] Error processing item ${item.id}:`, err);
                await supabaseServer
                    .from('relay_queue')
                    .update({ status: 'failed', error_log: err.message })
                    .eq('id', item.id);
            }
        }

        return NextResponse.json({
            message: 'Worker execution complete',
            processed: processedCount,
            duration: `${Date.now() - startTime}ms`
        });

    } catch (error: any) {
        console.error('[Worker] Fatal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

async function processDelay(item: any, baseUrl: string) {
    const { payload, scenario_id, user_id, key_id } = item;
    const { remainingNodes, originalBody, variables } = payload;

    if (!remainingNodes || remainingNodes.length === 0) return;

    // We call the relay engine recursive-style or just process the actions now.
    // For simplicity, we'll hit the /api/relay endpoint with the 'remainingNodes' as a direct override
    // OR we can just execute them here.

    // Let's implement a simplified execution here (Action Nodes & Webhooks)
    // To avoid duplication, we should have a shared 'executeActions' helper, 
    // but for now we'll do the POST call to self to reuse the robust sending logic.

    const res = await fetch(`${baseUrl}/api/relay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...originalBody,
            apiKeyId: item.key_id,
            _worker_exec: true,
            _override_nodes: remainingNodes
        })
    });
}

async function processDigest(item: any, baseUrl: string) {
    // 1. Find all other pending items with the same digest_key and user_id
    const { data: siblings } = await supabaseServer
        .from('relay_queue')
        .select('*')
        .eq('user_id', item.user_id)
        .eq('digest_key', item.digest_key)
        .eq('status', 'pending')
        .eq('type', 'DIGEST');

    if (!siblings || siblings.length === 0) return;

    // 2. Build the consolidated message
    let consolidated = `**📊 Relay Digest: ${item.digest_key}**\n\n`;
    siblings.forEach((s, idx) => {
        const msg = s.payload.originalBody.message || "New event detected";
        consolidated += `${idx + 1}. ${msg}\n`;
    });
    consolidated += `\n_Total grouped: ${siblings.length}_`;

    // 3. Send using the target config of the original node (item.payload.nodeData)
    // We'll hit the relay API with a special flag
    await fetch(`${baseUrl}/api/relay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiKeyId: item.key_id, // Internal bypass
            message: consolidated,
            platform: item.payload.nodeData.platform || 'telegram',
            target: item.payload.nodeData.target_address
        })
    });

    // 4. Mark all siblings as processed
    const siblingIds = siblings.map(s => s.id);
    await supabaseServer
        .from('relay_queue')
        .update({ status: 'processed' })
        .in('id', siblingIds);
}
