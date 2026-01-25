import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('[Middleware] Missing environment variables for Supabase');
            return supabaseResponse;
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // IMPORTANT: DO NOT REMOVE auth.getUser() - it refreshes the token
        const { data: { user }, error } = await supabase.auth.getUser()

        // Protected routes
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            if (error || !user) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Onboarding Check
            // Only trigger for users with specific admin roles (OWNER) who haven't completed it
            const metadata = user.user_metadata || {};
            const role = metadata.role || 'OWNER';
            if (role === 'OWNER' && !metadata.organization_id && !request.nextUrl.pathname.startsWith('/onboarding')) {
                return NextResponse.redirect(new URL('/onboarding', request.url))
            }
        }

        // Auth routes - users who are already logged in should be redirected to dashboard
        if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
            if (user) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
        }

        return supabaseResponse
    } catch (e) {
        console.error('[Middleware] Critical Failure:', e);
        return supabaseResponse;
    }
}
