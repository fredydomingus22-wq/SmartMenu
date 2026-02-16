## 1. Data Model (Prisma)

- [x] 1.1 Add `Rider` model to `schema.prisma` with profile fields and relation to `User`
- [x] 1.2 Add `Vehicle` model linked to `Rider`
- [x] 1.3 Add `DeliveryAssignment` model linking `Order` and `Rider` with status enum
- [x] 1.4 Create migration `add_delivery_management_tables`
- [x] 1.5 Update `Order` model to include `deliveryAssignment` relation

## 2. API Implementation (NestJS)

- [x] 2.1 Generate `RiderModule` resource (controller, service)
- [x] 2.2 Implement `RiderService.register()` and profile management
- [x] 2.3 Generate `DeliveryModule` resource
- [x] 2.4 Implement assignment logic: `findAvailableRiders(location)`
- [x] 2.5 Create `POST /deliveries/assign` endpoint for manual assignment
- [x] 2.6 Implement `PATCH /deliveries/:id/status` for rider updates (PICKED_UP, DELIVERED)
- [x] 2.7 Add Real-time broadcast triggers in `DeliveryService` for location updates

## 3. Rider Mobile App (Manual Implementation)

- [x] 3.1 Initialize `apps/rider-mobile` (Expo/React Native)
- [x] 3.2 Implement Auth Screen (Login)
- [x] 3.3 Implement Dashboard (Assigned Orders List)
- [x] 3.4 Wire up Auth screens to `RiderService` (NestJS)
- [x] 3.5 Refactor "Available Orders" screen to fetch from our API
- [x] 3.6 Refactor "Active Delivery" screen to use our Order model
- [x] 3.7 Implement background location tracking compatible with `expo-location`
- [x] 3.8 Integrate `Supabase Realtime` for location broadcasting
- [/] 3.9 Refine Rider App UI structure based on Enatega reference (Help, Language, Vehicle Type, etc.)

## 4. Consumer & Admin Apps Integration

- [x] 4.1 Implement `TrackingMap` component for Consumer Web App (Next.js)
- [x] 4.2 Integrate `TrackingMap` into Consumer `OrderStatusPage`
- [ ] 4.3 Implement Map tracking in Admin Mobile App (`OrdersScreen` or dedicated Detail)
- [ ] 4.4 Implement real-time status sync across all apps
- [ ] 4.5 Add "Assign Rider" modal to `apps/admin-mobile` order details
- [ ] 4.6 Subscribe apps to `deliveries:{tenantId}` channel for live updates
