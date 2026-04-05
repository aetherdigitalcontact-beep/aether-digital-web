import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
    const { data, error } = await supabaseServer
        .from('accounts')
        .select('*')
        .eq('id', '1361dedc-e72b-4abf-82bb-07bbd9c68ff0')
        .single();

    return NextResponse.json({ data, error });
}
