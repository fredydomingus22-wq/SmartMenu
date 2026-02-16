# Design: Delivery Management System

## Context

SmartMenu currently handles dine-in and takeaway orders without a delivery orchestration layer. To support delivery, we need to manage a fleet of riders, assign orders to them, and provide real-time tracking to customers.

## Goals / Non-Goals

**Goals:**

- Provide a dedicated mobile interface for riders.
- Implement an order assignment engine (manual/auto).
- Enable live GPS tracking using existing Supabase Realtime infra.
- Extend the Prisma schema to support the delivery domain.

**Non-Goals:**

- Multi-leg delivery (e.g., rider aggregation).
- External vehicle integrations (OBD-II, etc.).
- Complex route optimization algorithms (will use simple distance-based assignment for v1).

## Decisions

### 1. Hybrid Frontend Strategy

We will extract the Rider App UI from the Enatega repository.

- **Rationale:** Enatega's Rider UI is mature and uses React Native/Expo, making it highly compatible with our monorepo.
- **Implementation:** Create `apps/rider-mobile` based on Enatega components but utilizing our `@smart-menu/ui` and API layer.

### 2. Native NestJS Backend

We will **not** use Enatega's Express/MongoDB backend.

- **Rationale:** Maintain a single source of truth in PostgreSQL and avoid technical debt of a secondary database. All logic will be implemented in a new `DeliveryModule` within `apps/api/src`.

### 3. Real-time Tracking via Supabase

Location updates will be pushed from the Rider app to a Supabase Broadcast channel.

- **Rationale:** We already use Supabase for broadcast events in `OrdersService`. This avoids introducing Socket.IO or MQTT.

## Data Model (Prisma)

New models to be added:

- `Rider`: Profile, vehicle info, availability status, and current coordinates.
- `DeliveryAssignment`: Links an `Order` to a `Rider` with status tracking (`ASSIGNED`, `PICKED_UP`, `DELIVERED`).
- `Vehicle`: Metadata about rider transport.

## Risks / Trade-offs

- **[Risk] Background Location** → Mitigation: Use `expo-location` with task manager for background updates; accept battery trade-off for real-time tracking accuracy.
- **[Risk] UI Consistency** → Mitigation: Gradually refactor Enatega components to use SmartMenu's design tokens and `@smart-menu/ui` primitives.
- **[Risk] GPS Accuracy** → Mitigation: Implement basic Kalman filtering on the client-side to smooth out erratic location points before broadcasting.
