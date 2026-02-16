# Restore Consumer Menu UI to match Web Implementation

## Context

The `apps/consumer` application is currently unstable, experiencing memory leaks (crashes) and 404 errors on the menu page. The user has requested to restore the UI to match the working implementation found in `apps/web`, specifically referencing the `menu/[id]/page.tsx` and `layout.tsx` components.

## Problem Statement

- **Stability**: The consumer app crashes with "JavaScript heap out of memory" during development.
- **Correctness**: The menu page returns 404s even when data appears to be fetched.
- **Consistency**: The consumer UI needs to be aligned with the `apps/web` version which is considered the "golden master" for this feature.

## Proposed Solution

We will replace the current consumer menu implementation with the code from `apps/web`.

### 1. Update `apps/consumer/app/menu/[id]/page.tsx`

- Replace with the provided `apps/web` implementation.
- This includes fetching logic for categories, config, loyalty, marketing events, and promotions using `Promise.all`.
- It uses `PublicMenuClient`, `AppShell`, `PublicMenuHeader`, and `MenuGrid`.

### 2. Update `apps/consumer/app/layout.tsx`

- Match the `apps/web` root layout structure.
- Ensure providers (`I18nProvider`, `CartProvider`) and global components (`MarketingNotificationBanner`, `Toaster`) are correctly placed.

### 3. Verify Dependencies

- Ensure all imported components (e.g., `@smart-menu/ui` components) are available and compatible.
- Ensure utility functions (e.g., `getAuthorizedClient`, `apiClient`) behave consistently between web and consumer apps.

## Verification Plan

- **Manual Test**: Run `apps/consumer` and verify the menu loads without 404s.
- **Visual Check**: Compare `localhost:3002/menu/...` (consumer) with `localhost:3000/menu/...` (web) to ensure visual parity.
- **Stability Check**: Verify no immediate crashes upon loading the menu.
