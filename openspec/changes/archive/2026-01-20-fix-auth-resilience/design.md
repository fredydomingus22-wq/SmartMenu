# Design: Auth Resilience

## Architecture
We use Supabase for Auth. In Next.js App Router (RSC), tokens must be refreshed explicitly if the middleware hasn't had a chance to intercept the request (e.g., direct navigation to deeply nested routes).

## Key Changes
1. **Server Action Proxy Pattern**: 
   - Forms in Client Components must call Server Actions defined with `"use server"`.
   - Server Actions use `apiClient` which automatically retrieves Supabase cookies via `next/headers`.
2. **Supabase SSR Cookie Extraction**:
   - The `apiClient` must detect the `sb-<project>-auth-token` (base64) and standard `sb-access-token` cookies.
   - It must handle isomorphic environments: using `next/headers` on server and (optionally) `getAuthSession` on client (though proxying is preferred).
3. **API Auth Guard Isolation**:
   - The NestJS API must strictly validate the `Authorization: Bearer` header, independent of the frontend's session state.

## Trade-offs
- `getUser()` makes an extra network call compared to `getSession()`, but it is much safer as it validates the token on the server side.
