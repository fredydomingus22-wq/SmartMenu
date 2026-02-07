import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
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
        const role = user.user_metadata.role || 'OWNER'; // Default to OWNER if not set
        if (role === 'OWNER' && !user.user_metadata.organization_id && !request.nextUrl.pathname.startsWith('/onboarding')) {
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
}
