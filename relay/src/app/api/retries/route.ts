import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// This endpoint can be triggered by a Vercel Cron or manually via the Dashboard
export async function POST(req: NextRequest) {
    try {
        // 1. Fetch up to 50 pending retries that are scheduled for now or earlier
        const { data: queue, error: fetchError } = await supabaseServer
            .from('retry_queue')
            .select('*')
            .eq('status', 'pending')
            .lte('next_attempt_at', new Date().toISOString())
            .limit(50);

        if (fetchError) throw fetchError;

        if (!queue || queue.length === 0) {
            return NextResponse.json({ message: 'No pending retries at this time', processed: 0 });
        }

        const results = [];

        // 2. Process each retry
        for (const item of queue) {
            const { id, payload, attempts } = item;
            const newAttempts = attempts + 1;
            let success = false;
            let finalStatus = 'failed';
            let nextAttempt = null;

            try {
                // Re-inject into the Relay Engine (via loopback POST)
                const host = req.headers.get('host') || 'localhost:3000';
                const protocol = req.headers.get('x-forwarded-proto') || 'http';
                const relayUrl = `${protocol}://${host}/api/relay`;

                // Add a special header to prevent infinite retry loops if the payload fails again
                const res = await fetch(relayUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': payload.apiKey,
                        'x-relay-retry': 'true' // Custom header to tell relay engine to NOT re-queue if it fails
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    success = true;
                    finalStatus = 'resolved';
                } else {
                    // Exponential backoff: 5m, 15m, 60m... Max 3 attempts
                    if (newAttempts >= 3) {
                        finalStatus = 'dead_letter';
                    } else {
                        finalStatus = 'pending';
                        const backoffMinutes = Math.pow(3, newAttempts) * 5; // attempt 1: 15m, attempt 2: 45m
                        nextAttempt = new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString();
                    }
                }

                results.push({ id, success, attempts: newAttempts });

            } catch (err) {
                console.error(`Error processing retry ${id}:`, err);
                if (newAttempts >= 3) {
                    finalStatus = 'dead_letter';
                } else {
                    finalStatus = 'pending';
                    nextAttempt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
                }
            }

            // 3. Update the queue record
            await supabaseServer
                .from('retry_queue')
                .update({
                    status: finalStatus,
                    attempts: newAttempts,
                    next_attempt_at: nextAttempt,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);
        }

        return NextResponse.json({
            message: 'Retry queue processed',
            processed: queue.length,
            results
        });

    } catch (error: any) {
        console.error('Retry Worker Error:', error);
        return NextResponse.json({ error: 'Failed to process retry queue' }, { status: 500 });
    }
}
