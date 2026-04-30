import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function DELETE(req: NextRequest) {
    try {
        // 1. Get current user session from our custom JWT
        const token = req.cookies.get('relay_session')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        const userId = decoded.id;

        // 2. Comprehensive Cleanup (Order matters: children first)
        const tables = [
            'logs',
            'scenarios',
            'api_keys',
            'account_emails',
            'webhooks',
            'domains',
            'templates',
            'plan_usage'
        ];

        for (const table of tables) {
            const { error: tblError } = await supabaseServer.from(table).delete().eq(table === 'account_emails' ? 'account_id' : 'user_id', userId);
            if (tblError) console.warn(`Error clearing ${table}:`, tblError.message);
        }

        // Delete account profile
        const { error: deleteError } = await supabaseServer.from('accounts').delete().eq('id', userId);

        if (deleteError) {
            console.error('Account record deletion failed:', deleteError);
            return NextResponse.json({ error: 'Database cleanup failed. Contact support.' }, { status: 500 });
        }

        // 3. NUCLEAR: Delete the user from Supabase Auth via Admin API
        const { error: adminError } = await supabaseServer.auth.admin.deleteUser(userId);

        if (adminError) {
            console.warn('Admin delete error (might be Traditional user):', adminError.message);
        }

        const response = NextResponse.json({ success: true });

        // CLEAR COOKIE
        response.cookies.delete('relay_session');

        return response;
    } catch (error: any) {
        console.error('Critical delete account error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
