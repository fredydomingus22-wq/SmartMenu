# Design: Order Engine Architecture

## 1. Client-Side State Management (The Cart)
We will use a **React Context (`CartContext`)** combined with `localStorage` for persistence.
- **State Logic:**
    - `items`: Array of `{ productId, varianceId, quantity, notes }`.
    - `tenantId`: To ensure cart items don't mix between restaurants.
- **Persistence:**
    - Key: `smartmenu_cart_{tenantId}`
    - Hydration: Load on mount, sync on change.

## 2. API Architecture (Order Submission)
The flow respects the "Trustless Client" principle. The frontend sends IDs and Quantities; the backend fetches Prices.

**Endpoint:** `POST /public/orders` (or protected if we decide to force anon auth later)
**Payload:**
```json
{
  "tenantId": "uuid",
  "tableId": "uuid",
  "items": [
    { "productId": "uuid", "quantity": 2, "notes": "No onions" }
  ],
  "customerName": "John Doe"
}
```

**Server-Side Validation:**
1. Verify `tenantId` exists.
2. Verify `productId` belongs to `tenantId`.
3. Check `isAvailable` stock status.
4. **Recalculate Total:** `Sum(Product.price * quantity)`. **Ignore frontend prices.**
5. Create `Order` (status: 'RECEIVED') and `OrderItem` records transactionally.

## 3. Database Schema Impact
No schema changes required if `Order` and `OrderItem` tables already exist (from Phase 0 bootstrap). If not, we will verify and scaffold them.
*Assumption: Tables exist based on Phase 0.*

## 4. UI/UX Patterns
- **Floating Action Button (FAB):** Persistent bottom-right button showing total items.
- **Slide-over Cart:** Shadcn `Sheet` component for reviewing the order without leaving the menu.
- **Toast Feedback:** "Order sent successfully!"
