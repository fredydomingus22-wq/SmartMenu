import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ykjkdyesejssidyqwqpc.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlramtkeWVzZWpzc2lkeXF3cXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODUyNzcsImV4cCI6MjA4Mzk2MTI3N30.W5xyrkspeSSuDsqGOBA8VhckJak9IzyqfJnu0-kN20s";

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Proxy] Missing environment variables for Supabase');
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

    // REFRESH SESSION
    await supabase.auth.getUser()

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
