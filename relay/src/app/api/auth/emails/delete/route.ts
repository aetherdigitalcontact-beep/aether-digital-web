import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('relay_session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Use service role to ensure deletion succeeds regardless of RLS
        // We validate ownership via .eq('account_id', decoded.id)
        const { error: dbError, count } = await supabaseServer
            .from('account_emails')
            .delete({ count: 'exact' })
            .eq('email', email)
            .eq('account_id', decoded.id);

        if (dbError) {
            console.error('[EMAIL-DELETE] DB Error:', dbError);
            return NextResponse.json({ error: 'Failed to delete email from database' }, { status: 500 });
        }

        console.log(`[EMAIL-DELETE] Deleted ${count} rows for ${email}`);

        return NextResponse.json({ success: true, message: 'Email deleted successfully', count });

    } catch (error: any) {
        console.error('[EMAIL-DELETE] Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
