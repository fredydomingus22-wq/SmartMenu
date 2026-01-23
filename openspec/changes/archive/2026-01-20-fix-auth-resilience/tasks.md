# Tasks: Auth Resilience

- [ ] Audit `apps/web/app/dashboard` for direct client-side fetch calls to protected API.
- [ ] Migrate all direct client-side fetch calls to use **Server Actions** as a proxy.
- [ ] Finalize `apps/web/utils/api-client.ts` with robust Supabase SSR cookie decoding.
- [ ] Audit NestJS `SupabaseAuthGuard` for compatibility with Supabase SSR tokens.
- [ ] Implement `npm run dev:fresh` script to clear `.next` cache and ensure clean state.
- [ ] Verify fix by completing the `/onboarding` restaurant creation flow.
