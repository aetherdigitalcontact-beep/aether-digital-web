import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Fetch logs
        const { data: logs, error } = await supabaseServer
            .from('notification_logs')
            .select('*')
            .eq('subscriber_id', id)
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        return NextResponse.json({ logs });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error fetching logs' }, { status: 500 });
    }
}
