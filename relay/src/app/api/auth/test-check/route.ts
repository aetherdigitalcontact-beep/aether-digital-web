import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
    const { data, error } = await supabaseServer
        .from('accounts')
        .select('*')
        .eq('confirmation_code', '17b58359-f228-4949-95ac-cb83cbf4e11a')
        .single();

    return NextResponse.json({ data, error });
}
