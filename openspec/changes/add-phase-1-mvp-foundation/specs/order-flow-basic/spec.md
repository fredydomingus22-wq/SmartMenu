## ADDED Requirements

### Requirement: Real-time Order Submission
The system SHALL allow customers to submit their shopping cart as an order.

#### Scenario: Order notification
- **WHEN** customer submits order
- **THEN** the system SHALL notify the restaurant staff via WebSocket in less than 500ms
