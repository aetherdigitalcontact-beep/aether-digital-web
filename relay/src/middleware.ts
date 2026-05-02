import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Maintenance Mode ──────────────────────────────────────────
// Set to false (or delete this file) when ready to launch
const MAINTENANCE_MODE = true;

// ─── Dashboard Access Whitelist ────────────────────────────────
// Only these emails can access /dashboard, /auth, /register
const DASHBOARD_WHITELIST = [
    'quiel.g538@gmail.com',
    'aetherdigital.contact@gmail.com',
];

// Routes that are ALWAYS accessible, even in maintenance mode
const ALLOWED_PATHS = [
    '/',
    '/privacy',
    '/terms',
    '/refund',
    '/dpa',
    '/roadmap',
];

// Private routes that require whitelist check
const PRIVATE_PATHS = ['/dashboard', '/auth', '/register'];

/** Decode JWT payload without verifying signature (Edge-compatible) */
function decodeJwtEmail(token: string): string | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        // Base64url decode the payload
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(payload);
        const decoded = JSON.parse(json);
        return typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : null;
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always allow: Next.js internals and static files
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/videos/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Always allow API routes — they handle their own auth
    if (pathname.startsWith('/api/')) return NextResponse.next();

    // ── Whitelist gate for private routes ──────────────────────
    const isPrivatePath = PRIVATE_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

    if (isPrivatePath) {
        // /auth is always reachable (login page)
        if (pathname.startsWith('/auth')) return NextResponse.next();

        const token = request.cookies.get('relay_session')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }

        const email = decodeJwtEmail(token);
        const whitelist = DASHBOARD_WHITELIST.map(e => e.toLowerCase());

        if (!email || !whitelist.includes(email)) {
            // Email not authorized → clear stale cookie and redirect home
            const res = NextResponse.redirect(new URL('/', request.url));
            res.cookies.delete('relay_session');
            return res;
        }

        return NextResponse.next();
    }

    // ── Maintenance mode (non-private routes only) ─────────────
    if (!MAINTENANCE_MODE) return NextResponse.next();

    if (ALLOWED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
