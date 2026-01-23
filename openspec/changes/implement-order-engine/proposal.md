# Proposal: Order Engine Implementation

## Why
To enable the core value proposition of the SmartMenu, customers must be able to select items and place orders directly from their devices. This "Order Engine" is the foundation for all subsequent fulfillment features (Real-time KDS, Payments).

## What Changes
We will implement the end-to-end flow for order creation:
1.  **Frontend Cart Context:** A React Context to manage the shopping cart state, persisting to LocalStorage.
2.  **Checkout UI:** A review screen where customers confirm their items and "Place Order".
3.  **Order API:** A secure `POST /orders` endpoint in the NestJS API to validate and persist the order in the database.

## Scope
### In Scope
- `CartProvider` implementation.
- `useCart` hook for adding/removing items.
- Floating "View Cart" button.
- Cart Sheet/Drawer component.
- Backend `OrderController` and `OrderService`.
- Database insertion of `Order` and `OrderItem` records.

### Out of Scope
- Real-time updates (WebSocket/Supabase Channels) - *Next Proposal*.
- Payment Gateway integration - *Future Proposal*.
- KDS (Kitchen View) - *Next Proposal*.

## Risks
- **Data Integrity:** Ensuring concurrent orders don't glitch.
- **Validation:** Malicious users modifying prices/product IDs in the payload. We must re-validate everything on the backend.
