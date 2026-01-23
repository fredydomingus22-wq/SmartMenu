# Design: Auth Refactor

## Architecture
- **Middleware**: Centralized session refresh and route protection.
- **Server Actions**: Handle login/logout interactions.
- **Supabase Client**: Singleton pattern for server-side usage.

## Key Changes
1.  **Middleware Optimization**:
    - Avoid unnecessary calls if possible.
    - Handle `AuthApiError` gracefully.
2.  **Error Handling**:
    - Add explicit error boundaries for auth failures.
    - Log auth errors to monitoring.

## Questions
- What is the specific "error" mentioned by the user?
- Are we using PKCE flow via `auth/callback`?
