import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Maintenance Mode ──────────────────────────────────────────
// Set to false (or delete this file) when ready to launch
const MAINTENANCE_MODE = true;

// Routes that are ALWAYS accessible, even in maintenance mode
const ALLOWED_PATHS = [
    '/',
    '/privacy',
    '/terms',
    '/refund',
    '/dpa',
    '/roadmap',
];

export function middleware(request: NextRequest) {
    if (!MAINTENANCE_MODE) return NextResponse.next();

    const { pathname } = request.nextUrl;

    // Always allow: API routes, Next.js internals, static files
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/videos/') ||
        pathname.includes('.')           // static files
    ) {
        return NextResponse.next();
    }

    // Allow explicitly permitted paths
    if (ALLOWED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    // Any other route → redirect to home (under construction)
    return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
