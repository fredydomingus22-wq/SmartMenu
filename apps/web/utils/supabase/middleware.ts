import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const { pathname } = request.nextUrl;

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
        const { data: { user } } = await supabase.auth.getUser()

        // Define route categories
        const isAuthRoute = ['/login', '/forgot-password', '/confirm-email', '/reset-password'].some(p => pathname.startsWith(p));
        
        const isDashboardRoute = pathname.startsWith('/dashboard');
        const isOnboardingRoute = pathname.startsWith('/onboarding');
        const isProtectedRoute = isDashboardRoute || isOnboardingRoute;

        // --- REDIRECTION LOGIC ---

        // 1. If logged in and hitting an auth page (except /login and /confirm-email)
        if (user && isAuthRoute && pathname !== '/login' && pathname !== '/confirm-email' && pathname !== '/reset-password') {
            const url = new URL('/dashboard', request.url);
            return NextResponse.redirect(url, {
                headers: supabaseResponse.headers,
            });
        }

        // 2. If NOT logged in and hitting a protected route
        if (!user && isProtectedRoute) {
            const url = new URL('/login', request.url);
            url.searchParams.set('next', pathname);
            return NextResponse.redirect(url, {
                headers: supabaseResponse.headers, // PRESERVE REFRESHED COOKIES
            });
        }

        // 3. User is logged in, check specific states
        if (user) {
            // Check email confirmation for dashboard access (DISABLED)
            /*
            if (!user.email_confirmed_at && isDashboardRoute) {
                const url = new URL('/confirm-email', request.url);
                url.searchParams.set('email', user.email || '');
                return NextResponse.redirect(url, {
                    headers: supabaseResponse.headers,
                });
            }
            */

            // Tenant Check for Dashboard/Onboarding
            if (isDashboardRoute || isOnboardingRoute) {
                const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
                
                console.log('--- MIDDLEWARE DIAGNOSTIC ---');
                console.log(`Path: ${pathname}`);
                console.log(`User ID: ${user.id}`);
                console.log(`User Email: ${user.email}`);
                console.log(`Service Role Key Present: ${!!serviceRoleKey}`);

                const adminSupabase = serviceRoleKey ? createServerClient(
                    supabaseUrl,
                    serviceRoleKey,
                    {
                        cookies: {
                            getAll: () => [], // DO NOT PASS COOKIES TO ADMIN CLIENT
                            setAll: () => {},
                        },
                    }
                ) : supabase;

                const { data: onboardingData, error: profileError } = await adminSupabase
                    .rpc('check_user_onboarding_status', { user_id_param: user.id })
                    .maybeSingle<{ has_tenant: boolean; tenant_id_out: string }>();

                if (profileError) {
                    console.error('[Middleware] Profile Check Error:', profileError);
                }

                const hasTenant = !!onboardingData?.has_tenant;
                const tenantId = onboardingData?.tenant_id_out;
                console.log(`[Middleware Result] HasTenant: ${hasTenant}, TenantID: ${tenantId}`);
                console.log('-----------------------------');

                // Loop Guard Logic
                if (!hasTenant && isDashboardRoute) {
                    console.log('[Middleware] REDIRECT -> /onboarding (No Tenant)');
                    return NextResponse.redirect(new URL('/onboarding', request.url), {
                        headers: supabaseResponse.headers,
                    });
                }

                if (hasTenant && isOnboardingRoute) {
                    console.log(`[Middleware] REDIRECT -> /dashboard (Tenant Found: ${tenantId})`);
                    return NextResponse.redirect(new URL('/dashboard', request.url), {
                        headers: supabaseResponse.headers,
                    });
                }
            }
        }

        return supabaseResponse
    } catch (e) {
        console.error('[Middleware] Critical Failure:', e);
        return supabaseResponse;
    }
}



