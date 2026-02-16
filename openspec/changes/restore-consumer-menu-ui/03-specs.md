# Specs: Restore Consumer Menu UI

## 1. Overview

This spec details the changes required to restore the `apps/consumer` menu UI to match the `apps/web` implementation.

## 2. Detailed Technical Requirements

### 2.1. `apps/consumer/app/menu/[id]/page.tsx`

- **Source**: `apps/web/app/menu/[id]/page.tsx`
- **Changes**:
  - Replace entire file content.
  - Verify imports:
    - `@smart-menu/api` -> Ensure installed.
    - `@smart-menu/ui` -> Ensure installed.
    - `lucide-react` -> Ensure installed.
    - `next/link`, `next/navigation`, `next/font/google` -> Standard.
    - Utils: `@/utils/api-client-server`, `@/utils/auth-server`, `@/utils/i18n-server`, `@/lib/utils`.
    - Components: `./_components/menu-grid`, `./_components/public-menu-client`, `./_components/public-menu-header`, `./_components/restaurant-footer`, `@/components/error-boundary`.

### 2.2. `apps/consumer/app/layout.tsx`

- **Source**: `apps/web/app/layout.tsx`
- **Changes**:
  - Update root layout to include `MarketingNotificationBanner`, `CartProvider`, `I18nProvider`, `Toaster`.
  - Ensure metadata matches (or is appropriate for consumer).

### 2.3. Shared Components

- Ensure `MenuGrid`, `PublicMenuClient`, `PublicMenuHeader`, `RestaurantFooter` exist in `apps/consumer/app/menu/[id]/_components/` or are imported from `@smart-menu/ui` if they were moved there.
  - _Note_: The web implementation imports them from `./_components/...`. We need to verified if they exist in `apps/web` and if we need to copy them to `apps/consumer`.
  - **Action**: Check `apps/consumer/app/menu/[id]/_components` content vs `apps/web`.

## 3. Data Model

No changes to the data model. The data fetching logic in `page.tsx` is compatible with the existing API.

## 4. API & Interfaces

- The `apiClient` usage in `page.tsx` assumes endpoints:
  - `/public/menu/${id}`
  - `/public/menu/${id}/config`
  - `/loyalty/config/public?tenantId=${id}`
  - `/marketing/public/groups/${id}`
  - `/marketing/public/events/${id}`
  - `/marketing/public/promotions/${id}`
  - `/loyalty/ensure-profile` (POST)
- These endpoints must exist on the API. (We verified `/public/menu/${id}` and `/config` exist).

## 5. Security & Compilance

- No new security concerns.

## 6. Migration Steps

1.  Copy `apps/web/app/menu/[id]/page.tsx` to `apps/consumer/app/menu/[id]/page.tsx`.
2.  Copy `apps/web/app/layout.tsx` to `apps/consumer/app/layout.tsx` (adjusting metadata if needed).
3.  Copy any missing `_components` from `apps/web/app/menu/[id]/_components/` to `apps/consumer/app/menu/[id]/_components/`.
