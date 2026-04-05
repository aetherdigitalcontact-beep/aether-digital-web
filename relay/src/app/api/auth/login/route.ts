import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        // 1. Find user
        const { data: user, error: findError } = await supabaseServer
            .from('accounts')
            .select('*')
            .eq('email', email)
            .single();

        if (findError || !user) {
            return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
        }

        // 2. Check if confirmed
        if (!user.is_confirmed) {
            return NextResponse.json({ error: 'Email not confirmed' }, { status: 403 });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
        }

        // 4. Create JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.full_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Create Response and set Cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name,
                company: user.company
            }
        });

        response.cookies.set('relay_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Login API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
