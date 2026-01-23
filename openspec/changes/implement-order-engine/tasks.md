# Tasks: Order Engine

- [ ] **Frontend: Cart Logic**
    - [x] Create `CartContext.tsx` with add/remove/clear methods. <!-- id: 1 -->
    - [x] Implement `localStorage` persistence logic. <!-- id: 2 -->
    - [x] Create `useCart` hook for easy consumption. <!-- id: 3 -->

- [x] **Frontend: Cart UI**
    - [x] Create `CartSheet` component (using Shadcn Sheet). <!-- id: 4 -->
    - [x] Implement `CartItem` component (display query, +/- quantity). <!-- id: 5 -->
    - [x] Add Floating Cart Button to `PublicMenuPage`. <!-- id: 6 -->

- [x] **Backend: Order API**
    - [x] Create `CreateOrderDto` with validation rules. <!-- id: 7 -->
    - [x] Implement `OrdersService.create()` with price recalculation logic. <!-- id: 8 -->
    - [x] Create transactional insert (Order + OrderItems). <!-- id: 9 -->
    - [x] Expose `POST /public/orders` endpoint. <!-- id: 10 -->

- [x] **Integration & E2E**
    - [x] Connect Frontend `Checkout` button to Backend API. <!-- id: 11 -->
    - [ ] Verify order appears in Database (via Supabase Table Editor). <!-- id: 12 -->
