import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const userId = decoded.id;

        // 1. Get user's API Keys
        const { data: keys } = await supabaseServer
            .from('api_keys')
            .select('id')
            .eq('user_id', userId);

        const keyIds = keys?.map(k => k.id) || [];
        if (keyIds.length === 0) {
            return NextResponse.json({ heatmap: [], bestTime: null, platformEfficiency: {} });
        }

        // 2. Fetch logs for these keys (all logs for Best Window, but we'll filter for heatmap)
        const { data: logs, error: logsError } = await supabaseServer
            .from('logs')
            .select('platform, status_code, created_at, error_message')
            .in('key_id', keyIds);

        if (logsError) throw logsError;

        // 3. Process Heatmap Data (Last 24 Hours focus for real-time feel)
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const hourlyDistribution = new Array(24).fill(0).map((_, i) => ({
            hour: i,
            total: 0,
            success: 0,
            platforms: {} as Record<string, number>
        }));

        logs.forEach(log => {
            const date = new Date(log.created_at);
            const hour = date.getUTCHours();
            const platform = log.platform.toLowerCase();

            // All logs contribute to general platform stats below
            // But only recent logs (last 24h) contribute to the visualized heatmap
            if (date >= twentyFourHoursAgo) {
                hourlyDistribution[hour].total++;
                if (log.status_code >= 200 && log.status_code < 300) {
                    hourlyDistribution[hour].success++;
                }
                hourlyDistribution[hour].platforms[platform] = (hourlyDistribution[hour].platforms[platform] || 0) + 1;
            }
        });

        // 4. Calculate Best Time to Notify (based on ALL history for better AI intelligence)
        const historicalDistribution = new Array(24).fill(0);
        logs.forEach(log => {
            const hour = new Date(log.created_at).getUTCHours();
            historicalDistribution[hour]++;
        });

        let bestHour = 0;
        let maxVolume = 0;
        historicalDistribution.forEach((vol, i) => {
            if (vol > maxVolume) {
                maxVolume = vol;
                bestHour = i;
            }
        });

        const bestTimeStr = `${bestHour.toString().padStart(2, '0')}:00 - ${(bestHour + 1).toString().padStart(2, '0')}:00 UTC`;

        // 5. Platform Efficiency
        const platformEfficiency: Record<string, { total: number, successRate: string, usageShare?: string }> = {};
        const platforms = ['telegram', 'discord', 'whatsapp', 'slack', 'email'];

        let totalValidPlatformHits = 0;
        platforms.forEach(p => {
            totalValidPlatformHits += logs.filter(l => l.platform?.toLowerCase().includes(p)).length;
        });

        platforms.forEach(p => {
            const pLogs = logs.filter(l => l.platform?.toLowerCase().includes(p));
            if (pLogs.length > 0) {
                const pSuccess = pLogs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
                platformEfficiency[p] = {
                    total: pLogs.length,
                    successRate: ((pSuccess / pLogs.length) * 100).toFixed(1) + "%",
                    usageShare: totalValidPlatformHits > 0 ? ((pLogs.length / totalValidPlatformHits) * 100).toFixed(1) + "%" : "0%"
                };
            }
        });

        // 6. Failure Analysis
        const failedLogs = logs.filter(l => l.status_code >= 400 || !l.status_code);
        const errorCounts: Record<string, number> = {};

        failedLogs.forEach(log => {
            let reason = "Unknown Network Error";
            if (log.error_message) {
                try {
                    const parsed = JSON.parse(log.error_message);
                    if (parsed.error?.message) reason = parsed.error.message;
                    else if (parsed.message) reason = parsed.message;
                    else if (parsed.error) reason = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
                    else {
                        // Handle Discord-style validation errors: {"avatar_url": ["Must be 2048 or fewer in length."]}
                        const entries = Object.entries(parsed);
                        if (entries.length > 0) {
                            reason = entries.map(([k, v]: [string, any]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join(' | ');
                        } else {
                            reason = log.error_message;
                        }
                    }
                } catch {
                    reason = log.error_message;
                }
            } else if (log.status_code === 429) reason = "Rate Limited (429)";
            else if (log.status_code === 401) reason = "Unauthorized (Invalid Key)";
            else if (log.status_code === 404) reason = "Target Not Found";
            else if (log.status_code === 400) reason = "Bad Request (Invalid Payload)";

            // Truncate long reasons
            reason = reason.length > 80 ? reason.substring(0, 80) + '...' : reason;

            errorCounts[reason] = (errorCounts[reason] || 0) + 1;
        });

        const topFailures = Object.entries(errorCounts)
            .map(([reason, count]) => ({ reason, count, percentage: ((count / failedLogs.length) * 100).toFixed(1) + "%" }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

        return NextResponse.json({
            heatmap: hourlyDistribution,
            bestTime: maxVolume > 0 ? bestTimeStr : "No data yet",
            bestHour,
            platformEfficiency,
            failureAnalysis: topFailures,
            failureTotal: failedLogs.length,
            recommendation: maxVolume > 0
                ? `Relay AI detected your highest activity window at ${bestTimeStr}. Scheduling high-priority alerts for this slot could optimize engagement.`
                : "Initiate more requests to allow Relay AI to build your personalized delivery model."
        });

    } catch (error: any) {
        console.error('AI Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
