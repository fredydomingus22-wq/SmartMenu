# Design: Restore Consumer Menu UI

## Context

The `apps/consumer` application is currently unstable and inconsistent with the reference implementation in `apps/web`. We aim to restore the UI by porting the proven implementation from the web app.

## Goals / Non-Goals

**Goals:**

- Replace `apps/consumer/app/menu/[id]/page.tsx` with the `apps/web` implementation.
- Update `apps/consumer/app/layout.tsx` to match `apps/web` structure.
- Ensure all dependencies (components, hooks, utils) required by the ported code are present and functional in `apps/consumer`.

**Non-Goals:**

- Refactoring the ported code (unless necessary for compatibility).
- Changing backend API endpoints.

## Decisions

### 1. Code Porting Strategy

We will perform a direct port of the `page.tsx` and `layout.tsx` files. This minimizes the risk of introducing new bugs and ensures visual parity.

### 2. Handling Missing Dependencies

If components like `MarketingNotificationBanner` or `CartProvider` are missing in `apps/consumer`, we will port them from `apps/web` as well.

### 3. Folder Structure

We will maintain the existing `apps/consumer` folder structure but ensure file paths in imports are corrected if they differ from `apps/web`.

## Risks / Trade-offs

- **Risk**: Missing Environment Variables.
  - _Mitigation_: Verify `.env` content matches requirements for the ported code.
- **Risk**: `next.config.ts` Differences.
  - _Mitigation_: We've already checked `next.config.ts` and it seems standard, but we'll monitor for build issues.
