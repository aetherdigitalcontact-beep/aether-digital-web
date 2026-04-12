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
        const { apiKey, platform, target, message, category, metadata, attempts = 0, variables = {}, _engine_trace, template_id } = body;

        let apiKeyToUse = apiKey || req.headers.get('x-api-key') || req.headers.get('X-API-Key');
        if (!apiKeyToUse && req.headers.get('Authorization')) {
            const authHeader = req.headers.get('Authorization') || '';
            if (authHeader.startsWith('Bearer ')) {
                apiKeyToUse = authHeader.replace('Bearer ', '');
            }
        }

        if (!apiKeyToUse) {
            return NextResponse.json({ error: 'API Key is missing' }, { status: 401 });
        }

        const { data: keyData, error: keyError } = await supabaseServer
            .from('api_keys')
            .select('id, user_id, is_active')
            .eq('key_hash', apiKeyToUse)
            .single();

        if (keyError || !keyData || !keyData.is_active) {
            return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
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
            .eq('user_id', keyData.user_id)
            .gte('created_at', firstDayOfMonth.toISOString());

        if ((usageCount || 0) >= userLimit) {
            return NextResponse.json({
                error: 'Monthly usage limit exceeded',
                plan: plan,
                limit: userLimit,
                current: usageCount,
                message: 'Upgrade your plan at https://relay.aether.digital/pricing'
            }, { status: 429 });
        }
        // ------------------------------------------

        const platformList = platform ? (Array.isArray(platform) ? platform : [platform]) : [];

        const payloadToRetry = {
            apiKey: apiKeyToUse,
            ...body
        };

        const processPayloadInBackground = async () => {
            try {
                const payloadToRetry = { ...body, variables, _engine_trace: (_engine_trace || 0) + 1 };

                const { data: userScenarios } = await supabaseServer
                    .from('scenarios')
                    .select('*')
                    .eq('user_id', keyData.user_id)
                    .eq('is_active', true);

                let logicOverride = false;
                let scenarioDebug: any[] = [];

                // Aggregate platform data and webhook URLs
                // To support multiple targets of the same platform, we use a list of actions
                const finalActions: { platform: string, target: string | null, template: string | null, botName: string | null, botAvatar: string | null }[] = [];

                // Initialize with request-level platform(s)
                const platformList = platform ? [platform].flat() : (body.platforms || []);
                const multiTargets = body.targets || {}; // New: allows { telegram: "...", discord: "..." }

                platformList.forEach((p: string) => {
                    const platformKey = p.toLowerCase();
                    finalActions.push({
                        platform: platformKey,
                        target: multiTargets[platformKey] || target || null,
                        template: globalTemplateContent,
                        botName: null,
                        botAvatar: null
                    });
                });

                const finalWebhooks = new Set<string>();

                if (userScenarios && userScenarios.length > 0) {
                    for (const scenario of userScenarios) {
                        const nodes = scenario.nodes || [];
                        let conditionPassed = true;
                        let scenarioActions: { platform: string, targetAddress: string | null, template: string | null, botName: string | null, botAvatar: string | null }[] = [];
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
                                        botAvatar: node.data.bot_avatar || null
                                    });
                                }
                            } else if (node.type === 'webhookNode') {
                                if (node.data?.target_url) scenarioWebhooks.push(node.data.target_url);
                            }
                        }

                        if (conditionPassed && (scenarioActions.length > 0 || scenarioWebhooks.length > 0)) {
                            logicOverride = true;
                            scenarioActions.forEach(a => finalActions.push({ platform: a.platform, target: a.targetAddress, template: a.template, botName: a.botName, botAvatar: a.botAvatar }));
                            scenarioWebhooks.forEach(w => finalWebhooks.add(w));
                            scenarioDebug.push({ scenario: scenario.name, platforms: scenarioActions.map(a => a.platform), webhooks: scenarioWebhooks });
                        }
                    }
                }

                // Default logic: remove Telegram if scenario logic is active and no platform was explicitly requested
                if (logicOverride && !platform && !body.platforms) {
                    const telIdx = finalActions.findIndex(a => a.platform === 'telegram' && a.target === null);
                    if (telIdx !== -1) finalActions.splice(telIdx, 1);
                }

                const activePlatforms = finalActions;
                const activeWebhooks = Array.from(finalWebhooks);


                if (activePlatforms.length === 0 && activeWebhooks.length === 0) {
                    console.log('[RelayAPI] No targets identified for matching criteria.');
                    return;
                }

                // --- PLATFORM DELIVERY ---
                let finalStatusCode = 500, finalProviderError = null, successfulPlatform = null, finalAttempts = [];
                const allVariables = { ...body, ...variables };

                // Fallback message if both template and message are empty
                const defaultMsg = category ? `[Relay] New ${category} event received.` : `[Relay] Signal received at ${new Date().toLocaleTimeString()}`;
                let baseMessage = replaceVariables(message || defaultMsg, allVariables);

                // --- CORPORATE SIGNATURE INJECTION (ENTERPRISE ONLY) ---
                if (plan === 'ENTERPRISE' && botNameFallback) {
                    const signature = `\n\n**Sent via ${botNameFallback}**`;
                    baseMessage += signature;
                }

                if (template_id && !globalTemplateContent) {
                    console.warn(`[RelayAPI] Template ID ${template_id} requested but not found in DB.`);
                }

                let finalBotName = body.botName || botNameFallback;
                let finalBotAvatar = body.botAvatar || botAvatarFallback;

                for (const active of activePlatforms) {
                    const p = active.platform;
                    const resolvedTarget = active.target || target;
                    const platformMessage = active.template ? replaceVariables(active.template, allVariables) : baseMessage;

                    let attemptStatusCode = 200, attemptError = null, response;
                    try {
                        if (!resolvedTarget) throw new Error('Target address missing');
                        if (!platformMessage) throw new Error('Message content empty');

                        const resolvedBotName = active.botName || finalBotName;
                        const resolvedBotAvatar = active.botAvatar || finalBotAvatar;

                        switch (p) {
                            case 'telegram': response = await sendTelegram(resolvedTarget, platformMessage); break;
                            case 'discord': response = await sendDiscord(resolvedTarget, platformMessage, resolvedBotName, resolvedBotAvatar); break;
                            case 'whatsapp': response = await sendWhatsApp(resolvedTarget, platformMessage); break;
                            case 'slack': response = await sendSlack(resolvedTarget, platformMessage, resolvedBotName, resolvedBotAvatar); break;
                            case 'teams': response = await sendTeams(resolvedTarget, platformMessage); break;
                            case 'email': response = await sendEmail(resolvedTarget, category || 'Relay', platformMessage, resolvedBotName); break;
                            case 'sms': response = await sendSMS(resolvedTarget, platformMessage); break;
                            default: throw new Error(`Unsupported platform: ${p}`);
                        }

                        if (response) {
                            attemptStatusCode = response.status;
                            if (response.ok) {
                                successfulPlatform = successfulPlatform ? `${successfulPlatform},${p}` : p; finalStatusCode = attemptStatusCode; finalProviderError = null;
                                finalAttempts.push({ platform: p, status: attemptStatusCode, error: null });
                            } else {
                                attemptError = await response.text() || 'Provider error';
                            }
                        }
                    } catch (e: any) {
                        attemptStatusCode = e.message.includes('NOT_CONFIGURED') ? 401 : 502;
                        attemptError = e.message;
                    }

                    finalAttempts.push({ platform: p, status: attemptStatusCode, error: attemptError });
                    finalStatusCode = attemptStatusCode; finalProviderError = attemptError;
                }

                // --- WEBHOOK DELIVERY ---
                for (const url of activeWebhooks) {
                    try {
                        await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ event: category || 'NOTIFICATION', payload: body, timestamp: new Date().toISOString(), relay_id: keyData.id })
                        });
                    } catch (err) { console.error(`[Webhook] Failed: ${url}`, err); }
                }

                // --- LOGGING ---
                const responseTime = Date.now() - startTime;
                await supabaseServer.from('logs').insert({
                    user_id: keyData.user_id, key_id: keyData.id, platform: successfulPlatform || activePlatforms[0]?.platform || 'webhook',
                    status_code: finalStatusCode, response_time: responseTime, error_message: finalProviderError,
                    payload: { ...body, attempts: finalAttempts, category: category || 'general', scenario_debug: scenarioDebug }
                });

                // --- RETRY QUEUE ---
                if (!successfulPlatform && activePlatforms.length > 0) {
                    if (req.headers.get('x-relay-retry') !== 'true') {
                        await supabaseServer.from('retry_queue').insert({
                            user_id: keyData.user_id, target_url: `${req.headers.get('origin') || 'http://localhost:3000'}/api/relay`,
                            payload: payloadToRetry, next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
                        });
                    }
                }
            } catch (bgError) {
                console.error('[RelayAPI] Critical Background Error:', bgError);
            }
        };

        // Fire the background execution without awaiting it
        processPayloadInBackground();

        // Immediate Response (Webhook Pattern)
        return NextResponse.json({
            success: true,
            status: 202,
            message: "Payload accepted and routed for background sequential processing. Delivery monitoring actively working silently."
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
