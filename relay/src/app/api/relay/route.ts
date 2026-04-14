import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail as emailHelper } from '@/lib/email';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function replaceVariables(text: string, variables: Record<string, any>) {
    if (!text) return text;
    let result = text;
    // Support both {{key}} and {{ key }}
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        result = result.replace(regex, String(value));
    }
    return result;
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    try {
        const body = await req.json();
        let { apiKey, platform, target, message, category, metadata, attempts = 0, variables = {}, _engine_trace, template_id, _worker_exec, _override_nodes, apiKeyId } = body;

        let apiKeyToUse = apiKey || req.headers.get('x-api-key') || req.headers.get('X-API-Key');

        // --- Special Internal Auth for Worker ---
        let keyData: any = null;
        if ((_worker_exec || apiKeyId) && !apiKeyToUse) {
            const { data } = await supabaseServer
                .from('api_keys')
                .select('id, user_id, is_active, key_hash')
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

        if (!apiKeyToUse) {
            return NextResponse.json({ error: 'API Key is missing' }, { status: 401 });
        }

        if (!keyData) {
            const { data: dbKeyData, error: keyError } = await supabaseServer
                .from('api_keys')
                .select('id, user_id, is_active')
                .eq('key_hash', apiKeyToUse)
                .single();

            if (keyError || !dbKeyData || !dbKeyData.is_active) {
                return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
            }
            keyData = dbKeyData;
        }

        // --- FETCH GLOBAL TEMPLATE IF template_id IS PROVIDED ---
        let globalTemplateContent = null;
        if (template_id) {
            const { data: tplData } = await supabaseServer
                .from('templates')
                .select('content')
                .eq('id', template_id)
                .eq('user_id', keyData.user_id)
                .single();
            if (tplData) globalTemplateContent = tplData.content;
        }

        // --- USAGE LIMITS & BRANDING (Phase 6.2) ---
        const { data: userData } = await supabaseServer
            .from('accounts')
            .select('plan, bot_name, bot_thumbnail')
            .eq('id', keyData.user_id)
            .single();

        const plan = (userData?.plan || 'free').toUpperCase();
        const botNameFallback = userData?.bot_name || 'Relay Protocol';
        const botAvatarFallback = userData?.bot_thumbnail;

        const LIMITS: Record<string, number> = {
            FREE: 100,
            STARTER: 5000,
            PRO: 20000,
            ENTERPRISE: 999999999
        };

        const userLimit = LIMITS[plan] || 100;

        // Count logs for this user in the current month
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const { count: usageCount } = await supabaseServer
            .from('logs')
            .select('*', { count: 'exact', head: true })
        // --- BASE64 PROTECTION & SANITIZATION (Keep in main thread for immediate feedback) ---
        const injectedAvatar = metadata?.bot_thumbnail || body.botAvatar;
        if (injectedAvatar && (injectedAvatar.length > 2048 || injectedAvatar.startsWith('data:image'))) {
            return NextResponse.json({
                error: 'Invalid bot avatar format. Base64 is not allowed. Please use a URL or upload via dashboard.',
                code: 'INVALID_AVATAR_FORMAT'
            }, { status: 400 });
        }

        const processPayloadInBackground = async () => {
            try {
                // Move usage check to background to save ~500-1000ms
                const firstDayOfMonth = new Date();
                firstDayOfMonth.setDate(1);
                firstDayOfMonth.setHours(0, 0, 0, 0);

                const { count: usageCount } = await supabaseServer
                    .from('logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', keyData.user_id)
                    .gte('created_at', firstDayOfMonth.toISOString());

                // Even in background, we log the limit hit
                if ((usageCount || 0) >= userLimit && plan !== 'ENTERPRISE') {
                    console.warn(`[RelayAPI] User ${keyData.user_id} reached limit.`);
                }

                // Sanitize the fallback thumbnail
                let safeBotAvatarFallback = botAvatarFallback;
                if (safeBotAvatarFallback && (safeBotAvatarFallback.length > 2048 || safeBotAvatarFallback.startsWith('data:image'))) {
                    safeBotAvatarFallback = null;
                }

                const platformList = platform ? [platform].flat() : (body.platforms || []);
                const multiTargets = body.targets || {};

                let activeScenarios = [];
                let logicOverride = false;

                if (_override_nodes) {
                    activeScenarios = [{ name: 'Worker Resumption', nodes: _override_nodes, is_active: true }];
                    logicOverride = true;
                } else {
                    const { data: userScenarios } = await supabaseServer
                        .from('scenarios')
                        .select('*')
                        .eq('user_id', keyData.user_id)
                        .eq('is_active', true);
                    activeScenarios = userScenarios || [];
                }

                let scenarioDebug: any[] = [];
                const finalActions: { platform: string, target: string | null, template: string | null, botName: string | null, botAvatar: string | null, fallbackPlatform: string | null, fallbackTarget: string | null }[] = [];

                platformList.forEach((p: string) => {
                    const platformKey = p.toLowerCase();
                    finalActions.push({
                        platform: platformKey,
                        target: multiTargets[platformKey] || target || null,
                        template: globalTemplateContent,
                        botName: null,
                        botAvatar: null,
                        fallbackPlatform: null,
                        fallbackTarget: null
                    });
                });

                const finalWebhooks = new Set<string>();

                if (activeScenarios && activeScenarios.length > 0) {
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
                                        const getNestedValue = (path: string, obj: any) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
                                        const valLeft = leftRaw.startsWith('variables.') ? getNestedValue(leftRaw.replace('variables.', ''), variables) :
                                            leftRaw.startsWith('payload.') ? getNestedValue(leftRaw.replace('payload.', ''), body) : leftRaw;
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
                            } else if (node.type === 'actionNode') {
                                if (node.data?.platform) {
                                    scenarioActions.push({
                                        platform: node.data.platform.toLowerCase(),
                                        targetAddress: node.data.target_address || null,
                                        template: node.data.message_template || null,
                                        botName: node.data.bot_name || null,
                                        botAvatar: node.data.bot_avatar || null,
                                        fallbackPlatform: node.data.fallback_platform || null,
                                        fallbackTarget: node.data.fallback_target_address || null
                                    });
                                }
                            } else if (node.type === 'waitNode') {
                                const duration = Number(node.data?.delay_duration) || 10;
                                const unit = node.data?.delay_unit || 'minutes';
                                let scheduledFor = new Date();
                                if (unit === 'seconds') scheduledFor.setSeconds(scheduledFor.getSeconds() + duration);
                                else if (unit === 'hours') scheduledFor.setHours(scheduledFor.getHours() + duration);
                                else if (unit === 'days') scheduledFor.setDate(scheduledFor.getDate() + duration);
                                else scheduledFor.setMinutes(scheduledFor.getMinutes() + duration);

                                // The 'payload' is the current set of variables + body
                                const queuePayload = {
                                    originalBody: body,
                                    variables,
                                    // Store remaining nodes to execute later
                                    remainingNodes: nodes.slice(nodes.indexOf(node) + 1)
                                };

                                await supabaseServer
                                    .from('relay_queue')
                                    .insert([{
                                        user_id: keyData.user_id,
                                        key_id: keyData.id,
                                        scenario_id: scenario.id,
                                        node_id: node.id,
                                        payload: queuePayload,
                                        type: 'DELAY',
                                        scheduled_for: scheduledFor.toISOString()
                                    }]);

                                // LOG: Add a log entry for visibility
                                await supabaseServer.from('logs').insert({
                                    user_id: keyData.user_id,
                                    key_id: keyData.id,
                                    platform: 'INTERNAL',
                                    status_code: 202,
                                    response_time: Date.now() - startTime,
                                    error_message: `QUEUED: Message delayed for ${duration} ${unit}.`,
                                    payload: { ...body, queued_for: scheduledFor.toISOString(), node_id: node.id }
                                });

                                // Break the current scenario loop - the rest will be handled by the worker
                                conditionPassed = false;
                                break;
                            } else if (node.type === 'digestNode') {
                                const interval = Number(node.data?.interval_minutes) || 60;
                                const digestKeyRaw = node.data?.digest_key || '{{user_id}}';
                                const resolvedDigestKey = replaceVariables(digestKeyRaw, { ...body, ...variables, user_id: keyData.user_id });

                                let nextBatch = new Date();
                                const intervalUnit = node.data?.interval_unit || 'minutes';
                                if (intervalUnit === 'seconds') nextBatch.setSeconds(nextBatch.getSeconds() + interval);
                                else if (intervalUnit === 'hours') nextBatch.setHours(nextBatch.getHours() + interval);
                                else if (intervalUnit === 'days') nextBatch.setDate(nextBatch.getDate() + interval);
                                else nextBatch.setMinutes(nextBatch.getMinutes() + interval);

                                const queuePayload = { originalBody: body, variables, nodeData: node.data };

                                await supabaseServer
                                    .from('relay_queue')
                                    .insert([{
                                        user_id: keyData.user_id,
                                        key_id: keyData.id,
                                        scenario_id: scenario.id,
                                        node_id: node.id,
                                        payload: queuePayload,
                                        type: 'DIGEST',
                                        digest_key: resolvedDigestKey,
                                        scheduled_for: nextBatch.toISOString()
                                    }]);

                                // LOG: Add a log entry for visibility
                                await supabaseServer.from('logs').insert({
                                    user_id: keyData.user_id,
                                    key_id: keyData.id,
                                    platform: 'INTERNAL',
                                    status_code: 202,
                                    response_time: Date.now() - startTime,
                                    error_message: `QUEUED: Message added to digest "${resolvedDigestKey}" (${interval} ${intervalUnit}).`,
                                    payload: { ...body, digest_key: resolvedDigestKey, scheduled_for: nextBatch.toISOString() }
                                });

                                conditionPassed = false;
                                break;
                            } else if (node.type === 'webhookNode') {
                                if (node.data?.target_url) scenarioWebhooks.push(node.data.target_url);
                            }
                        }

                        if (conditionPassed && (scenarioActions.length > 0 || scenarioWebhooks.length > 0)) {
                            logicOverride = true;
                            scenarioActions.forEach(a => finalActions.push({ platform: a.platform, target: a.targetAddress, template: a.template, botName: a.botName, botAvatar: a.botAvatar, fallbackPlatform: a.fallbackPlatform, fallbackTarget: a.fallbackTarget }));
                            scenarioWebhooks.forEach(w => finalWebhooks.add(w));
                            scenarioDebug.push({ scenario: scenario.name, platforms: scenarioActions.map(a => a.platform), webhooks: scenarioWebhooks });
                        }
                    }
                }

                if (logicOverride && !platform && !body.platforms) {
                    const telIdx = finalActions.findIndex(a => a.platform === 'telegram' && a.target === null);
                    if (telIdx !== -1) finalActions.splice(telIdx, 1);
                }

                const activePlatforms = finalActions;
                const activeWebhooks = Array.from(finalWebhooks);

                if (activePlatforms.length === 0 && activeWebhooks.length === 0) return;

                const allVariables = { ...body, ...variables };
                const defaultMsg = category ? `[Relay] New ${category} event received.` : `[Relay] Signal received at ${new Date().toLocaleTimeString()}`;
                let baseMessage = replaceVariables(message || defaultMsg, allVariables);

                // Remove redundant branding footer from baseMessage (Phase 6.2 cleanup)
                // if (plan === 'ENTERPRISE' && botNameFallback) {
                //     baseMessage += `\n\n**Sent via ${botNameFallback}**`;
                // }

                let finalBotName = body.botName || botNameFallback;
                let finalBotAvatar = body.botAvatar || safeBotAvatarFallback;

                // Deliveries in parallel to maximize speed
                await Promise.all(activePlatforms.map(async (active) => {
                    const p = active.platform;
                    const resolvedTarget = active.target || target;
                    const platformMessage = active.template ? replaceVariables(active.template, allVariables) : baseMessage;
                    const resolvedBotName = active.botName || finalBotName;
                    const resolvedBotAvatar = active.botAvatar || finalBotAvatar;

                    // --- NON-BLOCKING CDN WARM-UP ---
                    if (resolvedBotAvatar && resolvedBotAvatar.includes('supabase.co')) {
                        fetch(resolvedBotAvatar, { method: 'HEAD', cache: 'no-store' }).catch(() => { });
                    }

                    try {
                        if (!resolvedTarget) return;

                        const attemptDelivery = async (retryPlatform: string, retryTarget: string) => {
                            switch (retryPlatform) {
                                case 'telegram': return await sendTelegram(retryTarget, platformMessage);
                                case 'discord': return await sendDiscord(retryTarget, platformMessage, resolvedBotName, resolvedBotAvatar);
                                case 'whatsapp': return await sendWhatsApp(retryTarget, platformMessage);
                                case 'slack': return await sendSlack(retryTarget, platformMessage, resolvedBotName, resolvedBotAvatar);
                                case 'teams': return await sendTeams(retryTarget, platformMessage);
                                case 'email': return await sendEmail(retryTarget, category || 'Relay', platformMessage, resolvedBotName);
                                case 'sms': return await sendSMS(retryTarget, platformMessage);
                            }
                            return null;
                        };

                        let response = await attemptDelivery(p, resolvedTarget);
                        let status = response?.status || 500;
                        let error = response && !response.ok ? await response.text() : null;
                        let finalPlatformUsed = p;
                        let fallbackTriggered = false;

                        // Smart Fallback Logic
                        if ((!response || !response.ok) && active.fallbackPlatform && active.fallbackTarget) {
                            console.warn(`[RelayAPI] Delivery to ${p} failed (${status}). Attempting SMART FALLBACK to ${active.fallbackPlatform}...`);
                            const fallbackResponse = await attemptDelivery(active.fallbackPlatform, active.fallbackTarget);

                            status = fallbackResponse?.status || 500;
                            const fallbackError = fallbackResponse && !fallbackResponse.ok ? await fallbackResponse.text() : null;

                            finalPlatformUsed = active.fallbackPlatform;
                            error = fallbackError ? `Primary (${p}) failed: ${error} | Fallback (${active.fallbackPlatform}): ${fallbackError}` : null;
                            fallbackTriggered = true;
                        }

                        // Internal Logging for the final resolution
                        await supabaseServer.from('logs').insert({
                            user_id: keyData.user_id, key_id: keyData.id, platform: finalPlatformUsed,
                            status_code: status, response_time: Date.now() - startTime, error_message: error,
                            payload: { ...body, category: category || 'general', scenario_debug: scenarioDebug, fallback_triggered: fallbackTriggered }
                        });
                    } catch (e: any) {
                        console.error(`[RelayAPI] Delivery Error (${p}):`, e.message);
                    }
                }));

                // Webhooks in background
                activeWebhooks.forEach(url => {
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ event: category || 'NOTIFICATION', payload: body, timestamp: new Date().toISOString(), relay_id: keyData.id })
                    }).catch(() => { });
                });

            } catch (bgError) {
                console.error('[RelayAPI] Critical Background Error:', bgError);
            }
        };

        // Fire and forget
        processPayloadInBackground();

        return NextResponse.json({
            success: true,
            status: 202,
            message: "Protocol accepted. Processing in hyperspeed background."
        }, { status: 202 });

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
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) throw new Error('SLACK_BOT_TOKEN_NOT_CONFIGURED');

    // 2026 Slack Standard uses blocks for rich formatting
    const blockText = message
        .replace(/\*\*/g, '*') // Convert standard Markdown ** to Slack *
        .replace(/<b>/g, '*').replace(/<\/b>/g, '*')
        .replace(/<strong>/g, '*').replace(/<\/strong>/g, '*')
        .replace(/<i>/g, '_').replace(/<\/i>/g, '_')
        .replace(/<em>/g, '_').replace(/<\/em>/g, '_')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]*>?/gm, '');

    const payload: any = {
        channel: target,
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

    return fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });
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
