## ADDED Requirements

### Requirement: Rider Onboarding

The system SHALL allow riders to register and manage their profile, including vehicle information and availability status.

#### Scenario: Rider registration

- **WHEN** a new rider submits registration with valid details
- **THEN** system creates a rider profile linked to their user account

#### Scenario: Rider sets availability

- **WHEN** a rider toggles their availability status to "online"
- **THEN** system marks them as available for order assignment

### Requirement: Rider Location Broadcasting

The system SHALL broadcast rider location updates in real-time via Supabase Realtime.

#### Scenario: Location update during delivery

- **WHEN** a rider's location changes during an active delivery
- **THEN** system broadcasts the new coordinates to the `deliveries:{tenantId}` channel

### Requirement: Rider Delivery Workflow

The system SHALL allow riders to accept, pick up, and complete deliveries.

#### Scenario: Rider accepts order

- **WHEN** a rider accepts an assigned order
- **THEN** delivery status changes to `ACCEPTED` and customer is notified

#### Scenario: Rider marks pickup

- **WHEN** a rider confirms pickup at the restaurant
- **THEN** delivery status changes to `PICKED_UP` and tracking begins

#### Scenario: Rider completes delivery

- **WHEN** a rider confirms delivery at customer location
- **THEN** delivery status changes to `DELIVERED` and order is marked complete
