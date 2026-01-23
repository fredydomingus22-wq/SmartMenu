# Proposal: Implement Onboarding Flow

## Context
Current signup process captures "Restaurant Name" but fails to provision the necessary `Organization` and `Tenant` database records. Users are left efficiently "orphaned" without a linked business entity, preventing them from using the system (no `tenant_id` for queries).

## Goal
Implement a mandatory Onboarding Flow that runs post-signup to:
1.  create the `Organization` (Company) record.
2.  create the first `Tenant` (Restaurant) record.
3.  Link the `User` to these entities.

## Technical Approach
- **Middleware**: Intercept authenticated users without an active Organization/Tenant and redirect them to `/onboarding`.
- **UI**: A multi-step Wizard at `/onboarding`.
    - Step 1: Company Details (Name, NIF/Tax ID).
    - Step 2: First Restaurant (Name, Address, Slug).
- **Backend (Server Actions)**:
    - `actions/onboarding.ts`: `createOrganizationAndTenant` transaction.
    - Update `UserProfile` table to link the user.

## UX Flow
1.  User Signs Up -> Email Confirmation -> Login.
2.  Middleware detects missing `organization_id` -> Redirects to `/onboarding`.
3.  User fills "Company Name" and "Restaurant Name".
4.  System creates records -> Updates User metadata/profile -> Redirects to `/dashboard`.
