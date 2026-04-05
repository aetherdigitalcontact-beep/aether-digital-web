import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.redirect(new URL('/auth?status=error&message=Missing+confirmation+code', req.url));
        }

        // 1. Find user by confirmation code
        const { data: user, error: findError } = await supabaseServer
            .from('accounts')
            .select('id, is_confirmed')
            .eq('confirmation_code', code)
            .single();

        console.log(`[Diagnostic] Search Code: "${code}", findError:`, findError, 'User:', user);

        if (findError || !user) {
            return NextResponse.redirect(new URL(`/auth?status=error&message=Invalid+or+expired+confirmation+code`, req.url));
        }

        // 2. Prepare update data
        const updateData: any = {
            is_confirmed: true,
            confirmation_code: null // Clear code after use
        };

        // Handle email change if encoded in JWT confirmation token
        let newEmail = null;
        try {
            const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';
            const decoded = jwt.verify(code, JWT_SECRET) as any;
            if (decoded && decoded.pendingEmail) {
                newEmail = decoded.pendingEmail;
            }
        } catch (e) {
            // Ignore error: This means it's a standard registration UUID confirmation code
        }

        if (newEmail) {
            updateData.email = newEmail;
        }

        // 3. Mark as confirmed/updated
        const { error: updateError } = await supabaseServer
            .from('accounts')
            .update(updateData)
            .eq('id', user.id);

        if (updateError) {
            console.error('Confirmation Update Error:', updateError);
            return NextResponse.redirect(new URL('/auth?status=error&message=System+error+during+confirmation', req.url));
        }

        // 4. Redirect to login with success message
        return NextResponse.redirect(new URL('/auth?status=confirmed', req.url));

    } catch (error: any) {
        console.error('Confirmation API Error:', error);
        return NextResponse.redirect(new URL('/auth?status=error&message=Internal+Server+Error', req.url));
    }
}
