import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // Handle Supabase session update
    const response = await updateSession(request);

    const isProduction = process.env.NODE_ENV === 'production';
    const cspHeader = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.stripe.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        `connect-src 'self' https://*.supabase.co https://*.stripe.com wss://*.supabase.co https://smart-menu-api.vercel.app ${!isProduction ? 'http://localhost:3001 http://127.0.0.1:3001 http://localhost:3002' : ''}`,
        "frame-src 'self' https://*.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        isProduction ? "upgrade-insecure-requests" : "",
    ].filter(Boolean).join('; ');

    // Security Headers
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // HSTS (HTTP Strict Transport Security) - only in production
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    } else {
        response.headers.set('Strict-Transport-Security', 'max-age=0');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
