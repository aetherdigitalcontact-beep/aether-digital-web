import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail as emailHelper } from '@/lib/email';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function replaceVariables(text: string, variables: Record<string, any>) {
    if (!text) return text;

    // Improved recursive path resolver
    const resolvePath = (path: string, obj: any) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
        // 1. Direct search in variables root
        let val = resolvePath(key, variables);

        // 2. Cascade search in common scopes if not found
        const scopes = ['payload', 'variables', 'metadata'];
        for (const scope of scopes) {
            if (val !== undefined) break;
            if (variables[scope]) {
                val = resolvePath(key, variables[scope]);
            }
        }

        return val !== undefined ? String(val) : match;
    });
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const telemetry: Record<string, number> = { init: Date.now() - startTime };

    try {
        const body = await req.json();
        let {
            apiKey, platform, target, message, category, metadata, attempts = 0,
            variables = {}, _engine_trace, template_id, _worker_exec,
            _override_nodes, _scenario_id, apiKeyId, _is_test_lab, topicKey
        } = body;

        let apiKeyToUse = apiKey || req.headers.get('x-api-key') || req.headers.get('X-API-Key');

        // --- AUTH SETUP ---
        const tAuthStart = Date.now();
        let keyData: any = null;
        if ((_worker_exec || apiKeyId) && !apiKeyToUse) {
            const { data } = await supabaseServer
                .from('api_keys')
                .select('id, user_id, is_active, key_hash, environment')
                .eq('id', apiKeyId || body.apiKeyId)
                .single();
            keyData = data;
            apiKeyToUse = keyData?.key_hash;
        }

        if (!apiKeyToUse && req.headers.get('Authorization')) {
            const authHeader = req.headers.get('Authorization') || '';
            if (authHeader.startsWith('Bearer ')) {
                apiKeyToUse = authHeader.replace('Bearer ', '');
            }
        }

        if (!apiKeyToUse) return NextResponse.json({ error: 'API Key is missing' }, { status: 401 });

        if (!keyData) {
            const { data: dbKeyData, error: keyError } = await supabaseServer
                .from('api_keys')
                .select('id, user_id, is_active, environment')
                .eq('key_hash', apiKeyToUse)
                .single();

            if (keyError || !dbKeyData || !dbKeyData.is_active) {
                return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
            }
            keyData = dbKeyData;
        }
        telemetry.auth = Date.now() - tAuthStart;

        // --- ACCOUNT DATA FETCH ---
        const tAccountStart = Date.now();
        const { data: userData } = await supabaseServer
            .from('accounts')
            .select('plan, bot_name, bot_thumbnail')
            .eq('id', keyData.user_id)
            .single();

        let sandboxEmail: string | null = null;
        if (keyData?.environment === 'development' || _is_test_lab) {
            const { data: authData } = await supabaseServer.auth.admin.getUserById(keyData.user_id);
            sandboxEmail = authData?.user?.email || null;
        }

        const plan = (userData?.plan || 'free').toUpperCase();
        const botNameFallback = userData?.bot_name || 'Relay Protocol';
        const botAvatarFallback = userData?.bot_thumbnail;
        telemetry.account_fetch = Date.now() - tAccountStart;

        const LIMITS: Record<string, number> = { FREE: 100, STARTER: 5000, PRO: 20000, ENTERPRISE: 999999999 };
        const userLimit = LIMITS[plan] || 100;

        // --- BASE64 PROTECTION ---
        const injectedAvatar = metadata?.bot_thumbnail || body.botAvatar;
        if (injectedAvatar && (injectedAvatar.length > 2048 || injectedAvatar.startsWith('data:image'))) {
            return NextResponse.json({ error: 'Invalid bot avatar format. Base64 is not allowed.', code: 'INVALID_AVATAR_FORMAT' }, { status: 400 });
        }

        const processPayloadInBackground = async () => {
            const bgStartTime = Date.now();
            try {
                // 3 & 4. PARALLEL DEP FETCH (O(1) Optimized)
                const tDepStart = Date.now();
                const currentMonth = new Date().toISOString().substring(0, 7);
                const isEnterprise = plan === 'ENTERPRISE';

                // Fetch usage and scenarios in parallel with individual timeouts
                const fetchWithTimeout = async (promise: Promise<any>, ms: number, fallback: any) => {
                    return Promise.race([
                        promise,
                        new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
                    ]);
                };

                const [usageRes, scenariosRes]: [any, any] = await Promise.all([
                    isEnterprise ?
                        Promise.resolve({ data: { usage_count: 0 } }) :
                        fetchWithTimeout(Promise.resolve(supabaseServer.from('plan_usage').select('usage_count').eq('user_id', keyData.user_id).eq('month_year', currentMonth).single()), 5000, { data: null }),
                    _override_nodes ?
                        Promise.resolve({ data: null }) :
                        fetchWithTimeout(Promise.resolve(supabaseServer.from('scenarios').select('id, name, nodes, is_active').eq('user_id', keyData.user_id).eq('is_active', true)), 5000, { data: [], error: 'TIMEOUT' })
                ]);

                telemetry.plan_check = Date.now() - tDepStart;
                if (scenariosRes?.error === 'TIMEOUT') {
                    console.error('[RelayAPI] Scenarios fetch timed out (5s). Check indices.');
                }

                const usageData = usageRes?.data;
                const userScenarios = scenariosRes?.data;
                let usageCount = usageData?.usage_count || 0;

                // Fire-and-forget atomic increment
                if (isEnterprise) {
                    supabaseServer.rpc('increment_plan_usage', { target_user_id: keyData.user_id, target_month: currentMonth }).then(() => { });
                } else {
                    supabaseServer.rpc('increment_plan_usage', { target_user_id: keyData.user_id, target_month: currentMonth })
                        .then(({ error }) => {
                            if (error) {
                                supabaseServer.from('plan_usage').upsert({
                                    user_id: keyData.user_id, month_year: currentMonth,
                                    usage_count: usageCount + 1, last_updated: new Date().toISOString()
                                }, { onConflict: 'user_id, month_year' }).then(() => { });
                            }
                        });
                }

                // 4. SCENARIOS MATCHING
                const tScenariosStart = Date.now();
                let activeScenarios: any[] = [];
                let logicOverride = false;

                // ISOLATION: Skip scenarios if this is a manual Test Lab trigger
                if (_is_test_lab) {
                    activeScenarios = [];
                } else if (_override_nodes) {
                    activeScenarios = [{ id: _scenario_id || undefined, name: 'Worker Resumption', nodes: _override_nodes, is_active: true }];
                    logicOverride = true;
                } else {
                    activeScenarios = Array.isArray(userScenarios) ? userScenarios : [];
                }
                telemetry.scenarios_proc = Date.now() - tScenariosStart;

                let scenarioDebug: any[] = [];
                const finalActions: any[] = [];
                const finalWebhooks = new Set<string>();

                // Build Actions from payload
                const platformList = platform ? [platform].flat() : (body.platforms || []);
                const multiTargets = body.targets || {};
                platformList.forEach((p: string) => {
                    const pk = p.toLowerCase();
                    finalActions.push({ platform: pk, target: multiTargets[pk] || target || null, template: null });
                });

                // --- SCENARIO LOGIC ENGINE ---
                if (activeScenarios.length > 0) {
                    for (const scenario of activeScenarios) {
                        const nodes = scenario.nodes || [];
                        let conditionPassed = true;
                        let scenarioActions: any[] = [];
                        let scenarioWebhooks: string[] = [];

                        for (const node of nodes) {
                            if (node.type === 'triggerNode') continue;
                            if (node.type === 'conditionNode') {
                                const conditionRaw = node.data?.condition || '';
                                let match = false;
                                try {
                                    const parts = conditionRaw.trim().split(/\s+/);
                                    if (parts.length >= 3) {
                                        const leftRaw = parts[0];
                                        const operator = parts[1];
                                        const rightRaw = parts.slice(2).join(' ');
                                        const getVal = (path: string, obj: any) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
                                        const valLeft = leftRaw.startsWith('variables.') ? getVal(leftRaw.replace('variables.', ''), variables) :
                                            leftRaw.startsWith('payload.') ? getVal(leftRaw.replace('payload.', ''), body) : leftRaw;
                                        const right = rightRaw.replace(/['"]/g, '');
                                        const valNum = Number(valLeft), rightNum = Number(right);
                                        if (operator === '==') match = (String(valLeft) === String(right));
                                        else if (operator === '!=') match = (String(valLeft) !== String(right));
                                        else if (operator === '>') match = (!isNaN(valNum) && !isNaN(rightNum)) ? valNum > rightNum : false;
                                        else if (operator === '<') match = (!isNaN(valNum) && !isNaN(rightNum)) ? valNum < rightNum : false;
                                        else if (operator === 'contains') match = String(valLeft).toLowerCase().includes(String(right).toLowerCase());
                                        else match = true;
                                    } else match = true;
                                } catch (e) { match = false; }
                                if (!match) { conditionPassed = false; break; }
                            } else if (node.type === 'actionNode' && node.data?.platform) {
                                scenarioActions.push({
                                    platform: node.data.platform.toLowerCase(),
                                    target: node.data.target_address || null,
                                    template: node.data.message_template || null,
                                    botName: node.data.bot_name || null,
                                    botAvatar: node.data.bot_avatar || null,
                                    fallbackPlatform: node.data.fallback_platform || null,
                                    fallbackTarget: node.data.fallback_target_address || null
                                });
                            } else if (node.type === 'waitNode' || node.type === 'digestNode') {
                                const isDigest = node.type === 'digestNode';

                                // Schema alignment: Handle units from UI
                                let delaySeconds = 0;
                                if (isDigest) {
                                    const amount = Number(node.data?.interval_minutes || 0);
                                    const unit = node.data?.interval_unit || 'minutes';
                                    if (unit === 'seconds') delaySeconds = amount;
                                    else if (unit === 'minutes') delaySeconds = amount * 60;
                                    else if (unit === 'hours') delaySeconds = amount * 3600;
                                    else if (unit === 'days') delaySeconds = amount * 86400;
                                } else {
                                    const amount = Number(node.data?.delay_duration || 0);
                                    const unit = node.data?.delay_unit || 'minutes';
                                    if (unit === 'seconds') delaySeconds = amount;
                                    else if (unit === 'minutes') delaySeconds = amount * 60;
                                    else if (unit === 'hours') delaySeconds = amount * 3600;
                                }

                                const scheduledFor = new Date(Date.now() + delaySeconds * 1000).toISOString();
                                const digestKey = isDigest ? node.data?.digest_key || 'default' : null;

                                const nodeIndex = nodes.findIndex((n: any) => n.id === node.id);
                                const remainingNodes = nodes.slice(nodeIndex + 1);

                                const { error: insertError, data: insertData } = await supabaseServer.from('relay_queue').insert({
                                    user_id: keyData.user_id,
                                    key_id: keyData.id,
                                    scenario_id: scenario.id || null, // Fallbacks to null if somehow missing on Postgres UUID column
                                    type: isDigest ? 'DIGEST' : 'DELAY',
                                    status: 'pending',
                                    scheduled_for: scheduledFor,
                                    digest_key: digestKey,
                                    payload: {
                                        originalBody: body,
                                        variables: variables,
                                        remainingNodes: remainingNodes,
                                        nodeData: node.data
                                    }
                                }).select();

                                console.log(`[Relay Engine] Inserted ${isDigest ? 'DIGEST' : 'DELAY'} to queue. Scheduled for ${scheduledFor}. Error: ${insertError?.message || 'NONE'}`);

                                conditionPassed = false;
                                break;
                            } else if (node.type === 'webhookNode' && node.data?.target_url) {
                                scenarioWebhooks.push(node.data.target_url);
                            }
                        }

                        if (conditionPassed && (scenarioActions.length > 0 || scenarioWebhooks.length > 0)) {
                            logicOverride = true;
                            scenarioActions.forEach(a => finalActions.push(a));
                            scenarioWebhooks.forEach(w => finalWebhooks.add(w));
                            scenarioDebug.push({ scenario: scenario.name, platforms: scenarioActions.map(a => a.platform) });
                        }
                    }
                }

                if (logicOverride && !platform && !body.platforms) {
                    const telIdx = finalActions.findIndex(a => a.platform === 'telegram' && a.target === null);
                    if (telIdx !== -1) finalActions.splice(telIdx, 1);
                }

                if (finalActions.length === 0 && finalWebhooks.size === 0) return;

                const allVariables = { ...body, ...variables };
                const defaultMsg = category ? `[Relay] New ${category} event received.` : `[Relay] Signal received at ${new Date().toLocaleTimeString()}`;
                let baseMessage = replaceVariables(body.message || defaultMsg, allVariables);
                let finalBotName = body.botName || botNameFallback;
                let finalBotAvatar = body.botAvatar || botAvatarFallback;

                // --- TOPIC RESOLUTION ---
                let topicSubTargets: any[] = [];
                if (topicKey && keyData?.user_id) {
                    const { data: topicData } = await supabaseServer
                        .from('topics')
                        .select('id, rules')
                        .eq('user_id', keyData.user_id)
                        .eq('key', topicKey)
                        .single();

                    if (topicData) {
                        const { data: subsData } = await supabaseServer
                            .from('topic_subscribers')
                            .select('subscribers(id, external_id, email, phone, is_unsubscribed, custom_attributes)')
                            .eq('topic_id', topicData.id);

                        if (subsData) {
                            topicSubTargets = subsData.map((row: any) => row.subscribers).filter((sub: any) => sub && sub.is_unsubscribed !== true);
                        }

                        // 2. Dynamic Subscribers from JSONB Rules
                        if (topicData.rules && Array.isArray(topicData.rules) && topicData.rules.length > 0) {
                            let query: any = supabaseServer
                                .from('subscribers')
                                .select('id, external_id, email, phone, is_unsubscribed, custom_attributes')
                                .eq('user_id', keyData.user_id)
                                .eq('is_unsubscribed', false);

                            topicData.rules.forEach((rule: any) => {
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
                            if (dynSubs && dynSubs.length > 0) {
                                const existingIds = new Set(topicSubTargets.map((s: any) => s.id));
                                dynSubs.forEach((ds: any) => {
                                    if (!existingIds.has(ds.id)) {
                                        topicSubTargets.push(ds);
                                    }
                                });
                            }
                        }
                    }
                }

                // Expand actions into deliveries
                const finalDeliveries: any[] = [];
                const webhookPlatforms = ['discord', 'slack', 'webhook', 'teams'];

                // 1. Separate webhook actions (broadcasts 1 time only) from 1:1 actions (email, push, in-app)
                // If a webhook target contains {{, it is dynamic and must be treated as a personal action
                const broadcastActions = finalActions.filter(a => webhookPlatforms.includes(a.platform) && !(a.target && a.target.includes('{{')));
                const personalActions = finalActions.filter(a => !webhookPlatforms.includes(a.platform) || (a.target && a.target.includes('{{')));

                if (topicSubTargets.length > 0) {
                    // Fan-out 1:1 platforms for every subscriber
                    topicSubTargets.forEach(sub => {
                        personalActions.forEach(action => {
                            let subTarget = action.target;
                            let subVariables = { ...body, ...variables, metadata: sub.custom_attributes || {} };

                            if (subTarget && subTarget.includes('{{')) {
                                subTarget = replaceVariables(subTarget, subVariables);
                            } else {
                                if (action.platform === 'email') subTarget = sub.email || sub.external_id;
                                if (action.platform === 'sms' || action.platform === 'whatsapp') subTarget = sub.phone || sub.external_id;
                            }

                            if (subTarget) {
                                // Also inject the specific subscriber variables down to the delivery phase
                                finalDeliveries.push({ ...action, target: subTarget, subscriber_id: sub.id, _subVariables: subVariables });
                            }
                        });
                    });

                    // Add broadcasts exactly once
                    broadcastActions.forEach(action => finalDeliveries.push(action));
                } else {
                    finalActions.forEach(action => finalDeliveries.push(action));
                }

                if (finalDeliveries.length === 0 && finalWebhooks.size === 0) return;

                // --- PARALLEL DELIVERIES ---
                const pendingLogs: any[] = [];
                const notificationLogs: any[] = [];
                const inboxMessages: any[] = [];
                await Promise.all(finalDeliveries.map(async (active) => {
                    const p = active.platform;
                    const resolvedTarget = active.target || target;
                    if (!resolvedTarget) return;

                    // Use subscriber-specific variables if they exist for template resolution
                    const messageVars = active._subVariables || allVariables;
                    const platformMessage = active.template ? replaceVariables(active.template, messageVars) : baseMessage;
                    const deliveryStart = Date.now();

                    try {
                        const attemptDelivery = async (plt: string, trg: string) => {
                            switch (plt) {
                                case 'telegram': return await sendTelegram(trg, platformMessage);
                                case 'discord': return await sendDiscord(trg, platformMessage, active.botName || finalBotName, active.botAvatar || finalBotAvatar);
                                case 'whatsapp': return await sendWhatsApp(trg, platformMessage);
                                case 'slack': return await sendSlack(trg, platformMessage, active.botName || finalBotName, active.botAvatar || finalBotAvatar);
                                case 'teams': return await sendTeams(trg, platformMessage);
                                case 'email': return await sendEmail(trg, category || 'Relay', platformMessage, active.botName || finalBotName);
                                case 'sms': return await sendSMS(trg, platformMessage);
                                case 'in-app': return await sendInApp(keyData.user_id, trg, platformMessage, category || active.botName || finalBotName, category);
                            }
                            return null;
                        };

                        let response: any = { ok: true, status: 200, text: async () => 'SANDBOX_DELIVERY' };
                        let isSandboxIntercepted = false;

                        if (keyData?.environment === 'development' || _is_test_lab) {
                            isSandboxIntercepted = true;
                            if (p === 'email' && sandboxEmail) {
                                // Sandbox intercept: route email to Dev instead of user target
                                response = await attemptDelivery('email', sandboxEmail);
                            } else if (p === 'in-app') {
                                // in-app is internal — always execute regardless of environment.
                                // It has no external cost/risk and must always reach the subscriber.
                                response = await attemptDelivery(p, resolvedTarget);
                                isSandboxIntercepted = false;
                            }
                            // All other external platforms (telegram, discord, sms, etc.) are mocked in sandbox
                        } else {
                            response = await attemptDelivery(p, resolvedTarget);
                        }

                        let status = response?.status || 500;
                        let error = response && !response.ok ? await response.text() : null;
                        let finalPlatformUsed = p;
                        let fallbackTriggered = false;

                        if ((!response || !response.ok) && active.fallbackPlatform && active.fallbackTarget && !isSandboxIntercepted) {
                            const fResponse = await attemptDelivery(active.fallbackPlatform, active.fallbackTarget);
                            status = fResponse?.status || 500;
                            const fError = fResponse && !fResponse.ok ? await fResponse.text() : null;
                            finalPlatformUsed = active.fallbackPlatform;
                            error = fError ? `Primary failed: ${error} | Fallback failed: ${fError}` : null;
                            fallbackTriggered = true;
                        }

                        const deliveryTime = Date.now() - deliveryStart;
                        pendingLogs.push({
                            user_id: keyData.user_id, key_id: keyData.id, platform: finalPlatformUsed,
                            status_code: status, response_time: deliveryTime, error_message: error, environment: keyData?.environment || 'development',
                            payload: {
                                ...body, category: category || 'general', scenario_debug: scenarioDebug,
                                fallback_triggered: fallbackTriggered, sandbox_mode: isSandboxIntercepted,
                                telemetry: {
                                    ...telemetry,
                                    prep_latency: deliveryStart - startTime,
                                    delivery_latency: deliveryTime,
                                    total_relay_time: Date.now() - startTime
                                }
                            }
                        });

                        let subId = active.subscriber_id || null;

                        // Si no vino de Topic, intentamos emparejar el target a un External ID
                        if (!subId && resolvedTarget) {
                            let { data: matchedSub } = await supabaseServer
                                .from('subscribers')
                                .select('id, is_unsubscribed')
                                .eq('user_id', keyData.user_id)
                                .eq('external_id', resolvedTarget)
                                .single();

                            if (!matchedSub) {
                                // Auto-Upsert: Transparently create subscriber to ensure universal widget mirroring works
                                const { data: newSub, error: insertErr } = await supabaseServer
                                    .from('subscribers')
                                    .insert({ user_id: keyData.user_id, external_id: resolvedTarget })
                                    .select('id, is_unsubscribed')
                                    .single();

                                if (insertErr) {
                                    console.error("[RelayAPI] Subscriber Upsert Error:", insertErr.message);
                                }
                                matchedSub = newSub;
                            }

                            if (matchedSub) {
                                if (matchedSub.is_unsubscribed) {
                                    console.log(`[RelayAPI] Skipped ${p} delivery for unsubscribed target: ${resolvedTarget}`);
                                    return;
                                }
                                subId = matchedSub.id;
                            }
                        }

                        if (subId) {
                            const finalExcerpt = typeof platformMessage === 'string' ? platformMessage.substring(0, 100) : 'Payload delivery';
                            notificationLogs.push({
                                user_id: keyData.user_id,
                                subscriber_id: subId,
                                platform: finalPlatformUsed,
                                status: status === 200 || status === 201 || status === 202 ? 'delivered' : 'failed',
                                message_excerpt: finalExcerpt, environment: keyData?.environment || 'development',
                                metadata: { external_target: resolvedTarget, attempt_time: deliveryTime, error_message: error, sandbox_mode: isSandboxIntercepted }
                            });

                            // Universal Inbox Mirroring
                            if ((status === 200 || status === 201 || status === 202) && finalPlatformUsed !== 'in-app') {
                                inboxMessages.push({
                                    project_id: keyData.user_id,
                                    subscriber_id: subId,
                                    title: body.title || category || active.botName || finalBotName || 'Relay Notification',
                                    content: typeof platformMessage === 'string' ? platformMessage : finalExcerpt,
                                    platform: finalPlatformUsed,
                                    metadata: { mirrored_from: finalPlatformUsed, sandbox_mode: isSandboxIntercepted }
                                });
                            }
                        }

                    } catch (e: any) { console.error(`[RelayAPI] Delivery Error (${p}):`, e.message); }
                }));

                if (pendingLogs.length > 0) await supabaseServer.from('logs').insert(pendingLogs);
                if (notificationLogs.length > 0) {
                    const { error: logErr } = await supabaseServer.from('notification_logs').insert(notificationLogs);
                    if (logErr) console.error('[RelayAPI] Notification Logs Insert Error:', logErr.message);
                }
                if (inboxMessages.length > 0) {
                    const { error: inboxErr } = await supabaseServer.from('inbox_messages').insert(inboxMessages);
                    if (inboxErr) console.error('[RelayAPI] Inbox Mirroring Error:', inboxErr.message);
                }

                // Webhooks
                finalWebhooks.forEach(url => {
                    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: category || 'NOTIFICATION', payload: body, timestamp: new Date().toISOString() }) }).catch(() => { });
                });

            } catch (bgError) { console.error('[RelayAPI] Background Error:', bgError); }
        };

        await processPayloadInBackground();

        return NextResponse.json({ success: true, status: 202, message: "Protocol accepted. Processing in optimized background." }, { status: 202 });

    } catch (error: any) {
        console.error('Relay Engine Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function sendTelegram(chatId: string, text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN_NOT_CONFIGURED');
    const cleanChatId = chatId.startsWith('@') ? chatId : chatId;

    // Convert standard Markdown to Telegram HTML
    const htmlText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: cleanChatId,
            text: htmlText,
            parse_mode: 'HTML',
            disable_web_page_preview: false
        }),
    });
}

async function sendDiscord(webhookUrl: string, content: string, username?: string, avatarUrl?: string) {
    const markdownContent = content
        .replace(/<b>/g, '**').replace(/<\/b>/g, '**')
        .replace(/<strong>/g, '**').replace(/<\/strong>/g, '**')
        .replace(/<i>/g, '*').replace(/<\/i>/g, '*')
        .replace(/<em>/g, '*').replace(/<\/em>/g, '*')
        .replace(/<u>/g, '__').replace(/<\/u>/g, '__')
        .replace(/<br\s*\/?>/g, '\n');

    const payload: any = { content: markdownContent };
    if (username) payload.username = username;
    if (avatarUrl) payload.avatar_url = avatarUrl;

    return fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

async function sendWhatsApp(target: string, message: string) {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    // In 2026, we support BSUIDs (Business-Scoped User IDs) and Usernames
    // If target doesn't look like a phone number, treat as BSUID
    const isPhoneNumber = /^\d+$/.test(target.replace(/[+\-\s]/g, ''));

    if (!accessToken || !phoneId) {
        return new Response(JSON.stringify({ error: 'WhatsApp credentials not configured' }), { status: 501 });
    }

    const payload: any = {
        messaging_product: "whatsapp",
        recipient_type: isPhoneNumber ? "individual" : "bsuid",
        to: target,
        type: "text",
        text: { body: message.replace(/\*\*/g, '*').replace(/<[^>]*>?/gm, '') } // Clean HTML for basic text
    };

    return fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });
}

async function sendSlack(target: string, message: string, username?: string, iconUrl?: string) {
    // 2026 Slack Protocol supporting both Webhooks and direct API (Member IDs)
    const isWebhook = target.startsWith('https://hooks.slack.com');

    // Convert standard Markdown ** to Slack * for both methods
    const blockText = message
        .replace(/\*\*/g, '*')
        .replace(/<b>/g, '*').replace(/<\/b>/g, '*')
        .replace(/<strong>/g, '*').replace(/<\/strong>/g, '*')
        .replace(/<i>/g, '_').replace(/<\/i>/g, '_')
        .replace(/<em>/g, '_').replace(/<\/em>/g, '_')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]*>?/gm, '');

    const payload: any = {
        text: blockText,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: blockText
                }
            }
        ]
    };
    if (username) payload.username = username;
    if (iconUrl) payload.icon_url = iconUrl;

    if (isWebhook) {
        // Direct Webhook delivery (no token needed)
        return fetch(target, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } else {
        // API-based delivery (Requires SLACK_BOT_TOKEN)
        const token = process.env.SLACK_BOT_TOKEN;
        if (!token) throw new Error('SLACK_BOT_TOKEN_NOT_CONFIGURED');

        payload.channel = target;
        return fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });
    }
}

async function sendTeams(webhookUrl: string, message: string) {
    // 2026 MS Teams Workflows (Replacement for Office 365 Connectors)
    const teamsMarkdown = message
        .replace(/<b>/g, '**').replace(/<\/b>/g, '**')
        .replace(/<i>/g, '*').replace(/<\/i>/g, '*')
        .replace(/<br\s*\/?>/g, '\n\n')
        .replace(/<[^>]*>?/gm, '');

    return fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: "message",
            attachments: [
                {
                    contentType: "application/vnd.microsoft.card.adaptive",
                    content: {
                        type: "AdaptiveCard",
                        body: [
                            {
                                type: "TextBlock",
                                text: teamsMarkdown,
                                wrap: true
                            }
                        ],
                        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                        version: "1.5"
                    }
                }
            ]
        }),
    });
}

async function sendEmail(target: string, category: string, message: string, fromName?: string) {
    try {
        const result = await emailHelper({
            to: target,
            type: 'relay',
            lang: 'en', // Default lang
            name: message, // Placing the message in the 'body' placeholder of the template
            fromName
        });
        return {
            ok: result.success,
            status: result.success ? 200 : 500,
            text: () => Promise.resolve(result.success ? 'Sent' : String(result.error || 'SMTP Error'))
        };
    } catch (e: any) {
        return { ok: false, status: 500, text: () => Promise.resolve(e.message) };
    }
}

async function sendSMS(target: string, message: string) {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;

    if (!twilioSid || !twilioToken || !twilioFrom) {
        return new Response(JSON.stringify({ error: 'Twilio credentials not configured' }), { status: 501 });
    }

    const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
    const params = new URLSearchParams();
    params.append('To', target);
    params.append('From', twilioFrom);
    params.append('Body', message.replace(/<[^>]*>?/gm, '')); // Clean HTML for SMS

    return fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });
}

async function sendInApp(userId: string, externalId: string, message: string, title?: string, category?: string) {
    try {
        // 1. Resolve or Upsert Subscriber
        let { data: subscriber, error: subError } = await supabaseServer
            .from('subscribers')
            .select('id')
            .eq('user_id', userId)
            .eq('external_id', externalId)
            .single();

        if (!subscriber) {
            const { data: newSub, error: createError } = await supabaseServer
                .from('subscribers')
                .upsert({
                    user_id: userId,
                    external_id: externalId,
                    full_name: externalId // Fallback name
                }, { onConflict: 'user_id, external_id' })
                .select('id')
                .single();

            if (createError) throw createError;
            subscriber = newSub;
        }

        // 2. Insert Message
        const { error: msgError } = await supabaseServer
            .from('inbox_messages')
            .insert({
                project_id: userId,
                subscriber_id: subscriber.id,
                title: title || 'New Notification',
                content: message,
                metadata: category ? { category } : {},
            });

        if (msgError) throw msgError;

        return {
            ok: true,
            status: 201,
            text: () => Promise.resolve('Delivered to Inbox')
        };
    } catch (e: any) {
        console.error('[RelayAPI] In-App Error:', e.message);
        return {
            ok: false,
            status: 500,
            text: () => Promise.resolve(e.message)
        };
    }
}
