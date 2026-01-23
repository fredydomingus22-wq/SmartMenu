# Proposal: Upgrade Next.js 15 to 16

## Goal
Upgrade the `web` application from Next.js 15 to version 16 to leverage the latest performance improvements, Turbopack stability, and React 19 features. This upgrade addresses recent API changes in Next.js, specifically the transition of `cookies()` and `headers()` to asynchronous functions.

## Context
The current implementation of `apiClient` and various Server Components rely on synchronous access to `cookies()`. Next.js 16 enforces asynchronous access, which is a breaking change that impacts our authentication flow and data fetching logic.

## Proposed Changes
- **Dependency Update**: Upgrade `next`, `react`, and `react-dom` to version 16.x and 19.x respectively.
- **Async Auth Utilities**: Refactor `apiClient.ts` and middleware to await `cookies()` and `headers()`.
- **Turbopack Configuration**: Enable stable Turbopack in `next.config.ts`.
- **Component Refactoring**: Audit and update all Server Components that use `cookies()` or `headers()`.
- **Cache Policy**: Explicitly set `cache: 'no-store'` for authenticated API requests to align with Next.js 16 default caching behavior.

## Benefits
- Improved development speed with stable Turbopack.
- Enhanced performance and stability on the latest Next.js/React versions.
- Future-proofing the codebase against deprecated synchronous APIs.
