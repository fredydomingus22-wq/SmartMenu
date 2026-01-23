# Proposal: Auth Resilience & Environment Stability

## Why
Users are encountering "Invalid or expired token" errors in Server Components (RSC) and dev server instability (404 hot-updates). This stems from unreliable session retrieval in RSCs and stale dev server states.

## What Changes
- **Auth Logic**: Transition from `getSession()` to `getUser()` and enforce a strict **Server Action Proxy** pattern. All client-side write operations must pass through a Server Action to ensure secure token propagation.
- **API Client**: Robust handler for Supabase SSR cookies (including base64 encoded sessions) and isomorphic environment detection.
- **Backend Guard**: Audit `SupabaseAuthGuard` in the NestJS API to ensure legacy and modern token formats are supported.

## Goal
- Eliminate "Invalid or missing authentication token" errors (401) in Server Actions.
- Zero unauthorized requests from the client-side directly to the protected API.

## Impact
- **Web App**: Migration of auth retrieval strategy in all dashboard pages.
- **Environment**: New `pnpm dev:clean` (or similar) script to ensure local stability.
