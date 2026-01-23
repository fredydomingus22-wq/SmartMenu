# Design: Next.js 16 Upgrade Architecture

## Overview
The upgrade to Next.js 16 requires a shift in how server-side request context is accessed. The primary architectural change is the transition from synchronous to asynchronous `cookies` and `headers` APIs.

## Key Changes

### 1. Asynchronous Request Context
Next.js 16 makes `cookies()` and `headers()` return a Promise. This requires all callers to be `async` and use `await`.

#### Impact on `apiClient`:
The `apiClient` must be updated to await the cookie store before retrieving the authentication token.

```typescript
import { cookies } from "next/headers";

export async function apiClient(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  // ... rest of the implementation
}
```

### 2. Turbopack Stability
Turbopack is now stable in Next.js 16. We will enable it by default in `next.config.ts` for improved development experience.

### 3. Default Caching Behavior
Next.js 16 introduces more aggressive caching for `fetch` requests. We will ensure that all data-sensitive or authenticated requests explicitly use `cache: 'no-store'` or `revalidate: 0` unless specifically intended for caching.

## Trade-offs
- **Breaking Changes**: Moving to async `cookies()` requires a widespread audit of the codebase.
- **Node.js Requirement**: Requires Node.js >= 18.18 (recommended 20+).
