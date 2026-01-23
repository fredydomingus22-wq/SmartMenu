# Capability: Order Engine (Basic)

## ADDED Requirements

### Requirement: Cart State Persistence
The system MUST persist the user's shopping cart state locally to prevent data loss on page refresh.

#### Scenario: Browser Refresh
- **Given** a user has added 3 items to their cart
- **When** they refresh the browser page
- **Then** the cart MUST still contain the same 3 items with correct quantities.

### Requirement: Trustless Order Processing
The backend MUST recalculate all prices based on the valid catalog data, ignoring any price information sent by the client.

#### Scenario: Tampered Request
- **Given** a malicious user sends an order payload with "Price: $0.01" for a valid "$10.00" item
- **When** the backend processes the order
- **Then** the recorded order total MUST be based on the $10.00 catalog price
- **And** the operation MUST succeed (unless item is unavailable).

### Requirement: Tenant Isolation in Orders
Orders MUST be strictly linked to the correct Tenant ID given in the payload.

#### Scenario: Cross-Tenant Protection
- **Given** a payload with `tenantId` A and `productId` B (where Product B belongs to Tenant B)
- **When** the backend validates the order items
- **Then** the request MUST fail with a "Product not found or invalid" error.
