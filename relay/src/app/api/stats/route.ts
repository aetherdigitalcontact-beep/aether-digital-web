import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export const dynamic = 'force-dynamic';
import { requireWorkspaceAccess } from '@/lib/server/requireWorkspaceAccess';

export async function GET(req: NextRequest) {
    try {
        const { userId, workspaceId, error: wsError, status } = await requireWorkspaceAccess(req);
        if (wsError) return NextResponse.json({ error: wsError }, { status: status || 401 });

        // 1. Get total deliveries (all logs for any key of this user)
        // We need to join with api_keys to filter by user_id
        const env = req.nextUrl.searchParams.get('env') || 'development';

        // 1. Get user plan for limits early to avoid partial responses
        const { data: userData } = await supabaseServer
            .from('accounts')
            .select('email, plan')
            .eq('id', userId)
            .single();

        const plan = (userData?.plan || 'free').toLowerCase();
        // Development mode gets "unlimited" feel via a huge limit
        const limit = env === 'development'
            ? 999999999
            : (plan === 'starter' ? 35000 : plan === 'pro' ? 175000 : plan === 'enterprise' ? 999999999 : 10000);

        // 2. Get total deliveries (all logs for any key of this user)
        const { data: keys } = await supabaseServer
            .from('api_keys')
            .select('id')
            .eq('user_id', workspaceId)
            .eq('environment', env);

        const keyIds = keys?.map(k => k.id) || [];

        if (keyIds.length === 0) {
            return NextResponse.json({
                success: 0,
                failureRate: "0.0%",
                latency: "0ms",
                uptime: "100.00%",
                usage: 0,
                limit: limit,
                plan: plan.toUpperCase(),
                trends: {
                    success: "+0%",
                    failureRate: "+0%",
                    latency: "0ms"
                }
            });
        }

        // 3. Fetch logs for these keys
        const { data: logs, error: logsError } = await supabaseServer
            .from('logs')
            .select('status_code, response_time, created_at')
            .in('key_id', keyIds);

        if (logsError) throw logsError;

        // Calculate trends (Current 24h vs Previous 24h)
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        const currentPeriodLogs = logs.filter(l => new Date(l.created_at) >= oneDayAgo);
        const previousPeriodLogs = logs.filter(l => {
            const date = new Date(l.created_at);
            return date >= twoDaysAgo && date < oneDayAgo;
        });

        const total = logs.length;
        const successful = logs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
        const failed = total - successful;

        // Formatted absolute values
        const failureRateStr = total > 0 ? ((failed / total) * 100).toFixed(1) + "%" : "0.0%";
        const avgLatencyStr = total > 0
            ? Math.round(logs.reduce((acc, l) => acc + (l.response_time || 0), 0) / total) + "ms"
            : "0ms";
        const uptimeStr = total > 0
            ? ((successful / total) * 100).toFixed(2) + "%"
            : "100.00%";

        // Trend calculations helper
        const calcTrend = (current: number, previous: number) => {
            if (previous === 0 && current > 0) return "+100%";
            if (previous === 0 && current === 0) return "+0%";
            const diff = ((current - previous) / previous) * 100;
            return (diff > 0 ? "+" : "") + diff.toFixed(1) + "%";
        };

        // Success trend
        const currentSuccess = currentPeriodLogs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
        const prevSuccess = previousPeriodLogs.filter(l => l.status_code >= 200 && l.status_code < 300).length;
        const successTrend = calcTrend(currentSuccess, prevSuccess);

        // Failure trend
        const currentFailed = currentPeriodLogs.length - currentSuccess;
        const prevFailed = previousPeriodLogs.length - prevSuccess;
        const currentFailureRate = currentPeriodLogs.length > 0 ? (currentFailed / currentPeriodLogs.length) : 0;
        const prevFailureRate = previousPeriodLogs.length > 0 ? (prevFailed / previousPeriodLogs.length) : 0;

        let failureRateTrend = "+0%";
        if (prevFailureRate === 0 && currentFailureRate > 0) failureRateTrend = "+100%";
        else if (prevFailureRate > 0) {
            const diff = ((currentFailureRate - prevFailureRate) / prevFailureRate) * 100;
            failureRateTrend = (diff > 0 ? "+" : "") + diff.toFixed(1) + "%";
        }

        // Latency trend
        const currentLatency = currentPeriodLogs.length > 0 ? currentPeriodLogs.reduce((acc, l) => acc + (l.response_time || 0), 0) / currentPeriodLogs.length : 0;
        const prevLatency = previousPeriodLogs.length > 0 ? previousPeriodLogs.reduce((acc, l) => acc + (l.response_time || 0), 0) / previousPeriodLogs.length : 0;

        let latencyTrend = "0ms";
        if (currentLatency > 0 || prevLatency > 0) {
            const diffMs = Math.round(currentLatency - prevLatency);
            latencyTrend = (diffMs > 0 ? "+" : "") + diffMs + "ms";
        }

        return NextResponse.json({
            success: successful,
            failureRate: failureRateStr,
            latency: avgLatencyStr,
            uptime: uptimeStr,
            usage: total,
            limit: limit,
            plan: plan.toUpperCase(),
            trends: {
                success: successTrend,
                failureRate: failureRateTrend,
                latency: latencyTrend
            }
        });

    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
