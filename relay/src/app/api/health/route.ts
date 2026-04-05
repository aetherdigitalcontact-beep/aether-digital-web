import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
    try {
        const start = Date.now();

        // 1. Check Database
        const { data, error } = await supabaseServer.from('api_keys').select('count', { count: 'exact', head: true });
        if (error) throw error;

        const dbLatency = Date.now() - start;

        // 2. System Status Logic
        // In a real production scenario, we'd check external providers here.
        // For now, we return 200 if DB is reachable.

        return NextResponse.json({
            status: "STABLE",
            timestamp: new Date().toISOString(),
            latency: {
                database: `${dbLatency}ms`,
                uplink: "12ms" // Mocked global edge latency
            },
            services: {
                discord: "OPERATIONAL",
                telegram: "OPERATIONAL",
                whatsapp: "OPERATIONAL"
            }
        });
    } catch (err: any) {
        return NextResponse.json({
            status: "DEGRADED",
            error: err.message,
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
}
