# Proposal: Enatega-Style Delivery Management Integration

## Vision

Transform SmartMenu from a primarily dine-in/takeaway system into a comprehensive multi-vendor delivery management system. By leveraging the proven mobile UI patterns from Enatega while maintaining the robust NestJS/Prisma/Supabase architecture of SmartMenu, we provide a unified experience for consumers, riders, and restaurant managers.

## Why Now?

As SmartMenu matures, delivery is the most requested expansion. Building a delivery system from scratch is complex; using Enatega's open-source mobile components significantly accelerates the "Mobile Avançado" phase while ensuring we don't introduce technical debt from incompatible backend stacks.

## What Changes

We will introduce a new "Delivery Ecosystem" within SmartMenu:

- **Rider Experience:** A dedicated mobile flow for riders to accept, track, and complete deliveries.
- **Assignment Logic:** Automated and manual assignment of orders to active riders.
- **Real-time Tracking:** Live GPS tracking of riders for both consumers and restaurant managers.
- **Data Model:** Extension of the existing Prisma schema to support riders, vehicles, and delivery assignments.

## Capabilities

### New Capabilities

- `rider-management`: Onboarding, authentication, and status management for delivery riders.
- `delivery-assignment`: Logic for linking active orders to Available riders based on location and capacity.
- `real-time-tracking`: Live location broadcast using Supabase Realtime from the rider app.
- `rider-payouts`: Basic tracking of delivery fees and earnings for riders.

### Modified Capabilities

- `orders`: Update order status workflow to include `PICKED_UP`, `IN_TRANSIT`, and `DELIVERED`, and link orders to a `DeliveryAssignment`.

## Impact

- **Database:** Addition of `Rider`, `Vehicle`, and `DeliveryAssignment` tables to PostgreSQL via Prisma.
- **API:** New `RiderModule` and `DeliveryModule` in NestJS.
- **Mobile:** Adaptation of Enatega's React Native screens for the Rider app and tracking components in the Consumer app.
- **Infrastructure:** Increased usage of Supabase Realtime for GPS broadcasting.
