# Change: Phase 1 MVP Foundation

## Why
Initialize the core functional capabilities for the SmartMenu MVP. This foundation is required to support multi-tenant restaurant operations, customer ordering, and administrative management.

## What Changes
- [NEW] **User Auth**: Multi-tenant authentication system using Supabase.
- [NEW] **Menu Management**: CRUD operations for categories and products with tenant isolation.
- [NEW] **QR Engine**: Generation of unique URLs/QRs for specific tables.
- [NEW] **Order Flow Basic**: Capability for customers to send orders to the kitchen/waiter.

## Impact
- Affected specs: `user-auth`, `menu-management`, `qr-engine`, `order-flow-basic` (All NEW).
- Affected code:
  - `apps/web`: Login pages, Menu dashboard, QR client view.
  - `apps/api`: Auth middlewares, Product/Category controllers, Order logic.
