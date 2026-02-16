## ADDED Requirements

### Requirement: Order Assignment Engine

The system SHALL assign delivery orders to available riders based on proximity and capacity.

#### Scenario: Auto-assignment on new delivery order

- **WHEN** a new order with `orderType=DELIVERY` reaches `READY` status
- **THEN** system finds the nearest available rider and creates a `DeliveryAssignment`

#### Scenario: Manual assignment by manager

- **WHEN** a manager manually assigns an order to a specific rider
- **THEN** system creates a `DeliveryAssignment` for that rider and notifies them

### Requirement: Assignment Status Tracking

The system SHALL track the lifecycle of each delivery assignment.

#### Scenario: Assignment created

- **WHEN** an assignment is created
- **THEN** status is set to `ASSIGNED` and rider receives push notification

#### Scenario: Assignment completed

- **WHEN** rider marks delivery as complete
- **THEN** status is set to `DELIVERED` and order is finalized

### Requirement: Delivery Fee Tracking

The system SHALL track delivery fees for rider payouts.

#### Scenario: Fee recorded on completion

- **WHEN** a delivery is marked as `DELIVERED`
- **THEN** system records the delivery fee in the rider's earnings ledger
