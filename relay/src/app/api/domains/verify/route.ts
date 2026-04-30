import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import jwt from 'jsonwebtoken';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('relay_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { id, simulate } = await req.json();

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        // 1. Get domain info
        const { data: domain, error: fetchError } = await supabaseServer
            .from('domains')
            .select('*')
            .eq('id', id)
            .eq('user_id', decoded.id)
            .single();

        if (fetchError || !domain) {
            return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
        }

        if (domain.status === 'verified') {
            return NextResponse.json({ success: true, message: 'Already verified' });
        }

        // --- NEW: Simulation Bypass ---
        if (simulate) {
            const { error: updateError } = await supabaseServer
                .from('domains')
                .update({ status: 'verified' })
                .eq('id', id);

            if (updateError) throw updateError;
            return NextResponse.json({ success: true, message: 'Verification successful (Simulated)' });
        }

        // 2. Perform DNS lookup
        try {
            const records = await resolveTxt(domain.hostname);
            const flatRecords = records.flat();

            const expectedValue = `relay-verify=${domain.verification_token}`;
            const isVerified = flatRecords.some(record => record.includes(expectedValue));

            if (isVerified) {
                // 3. Update status in DB
                const { error: updateError } = await supabaseServer
                    .from('domains')
                    .update({ status: 'verified' })
                    .eq('id', id);

                if (updateError) throw updateError;
                return NextResponse.json({ success: true, message: 'Verification successful' });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Verification record not found',
                    expected: expectedValue,
                    found: flatRecords
                });
            }
        } catch (dnsErr: any) {
            console.error('DNS Lookup Error:', dnsErr);
            return NextResponse.json({
                success: false,
                message: 'DNS lookup failed. Ensure the TXT record is propagated.',
                error: dnsErr.code
            });
        }

    } catch (err: any) {
        console.error('Verify API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
