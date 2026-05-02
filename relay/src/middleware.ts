import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Maintenance Mode Config ───────────────────────────────────
// Set NEXT_PUBLIC_MAINTENANCE_MODE=false in Vercel env vars to disable
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'false';

// Routes that are ALWAYS accessible, even in maintenance mode
const ALLOWED_PATHS = [
    '/',
    '/privacy',
    '/terms',
    '/refund',
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
