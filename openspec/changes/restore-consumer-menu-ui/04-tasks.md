# Tasks: Restore Consumer Menu UI

## Phase 1: Preparation

- [ ] Verify `apps/consumer/lib/utils.ts` exists and has `formatCurrency`. (Done)
- [ ] Check existence of shared components in `apps/consumer/app/menu/[id]/_components/`.

## Phase 2: Implementation

- [ ] **Root Layout**: Update `apps/consumer/app/layout.tsx` with provided "layut" code.
- [ ] **Menu Page**: Update `apps/consumer/app/menu/[id]/page.tsx` with provided code.
- [ ] **Cleanup**: Delete `apps/consumer/app/menu/[id]/layout.tsx` to match `apps/web` structure and avoid double fetching/conflicts.

## Phase 3: Verification

- [ ] **Build Check**: Run `turbo build --filter=consumer` to ensure no import errors.
- [ ] **Runtime Check**: Start consumer app and visit menu page.
- [ ] **Visual Check**: Ensure no 404s and images load (or fail gracefully).
