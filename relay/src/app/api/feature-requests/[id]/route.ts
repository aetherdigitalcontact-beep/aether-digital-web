import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin whitelist — server-side enforced
const ADMIN_EMAILS = ['quiel.g538@gmail.com', 'aetherdigital.contact@gmail.com'];

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Verify the caller's JWT and return their email, or null if unauthorized */
async function getAdminEmail(req: NextRequest): Promise<string | null> {
    const auth = req.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;

    const email = (user.email || (user.user_metadata?.email as string) || '').toLowerCase();
    return ADMIN_EMAILS.includes(email) ? email : null;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminEmail(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { error } = await supabaseAdmin
        .from('feature_requests')
        .delete()
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const admin = await getAdminEmail(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: 'Missing status' }, { status: 400 });

    const { error } = await supabaseAdmin
        .from('feature_requests')
        .update({ status })
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    return NextResponse.json({ success: true });
}
