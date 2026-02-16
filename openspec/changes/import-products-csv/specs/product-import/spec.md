# Capability: product-import

## Overview

Allows bulk creation of products via CSV file upload. This capability ensures that menu setup is efficient and less prone to manual entry errors.

## CSV Structure Requirement

The CSV file MUST contain the following headers (order-independent):

- `name`: String (Required)
- `description`: String (Optional)
- `price`: Number (Required, e.g., 10.50)
- `category`: String (Required)
- `image_url`: String (Optional, URL format)
- `is_available`: Boolean (Optional, defaults to TRUE)

## Business Rules

1. **Tenant Isolation**: Products MUST be associated with the `tenantId` and `organizationId` from the authenticated user context.
2. **Category Resolution**:
   - If a category with the given name exists for the tenant, associate the product with it.
   - If no category exists, create a new one automatically.
3. **Data Validation**:
   - Empty names or prices MUST cause the entire row to be rejected.
   - Prices MUST be positive numbers.
   - Invalid image URLs SHOULD be logged as warnings but not block the import.
4. **Atomic Operation**: The import process SHOULD be atomic; if one row fails critical validation (after pre-parse), the whole operation SHOULD rollback (or report failure for that specific import session).

## API Behavior

- **Path**: `POST /products/import`
- **Security**: Protected by `SupabaseAuthGuard`.
- **Response**:
  ```json
  {
    "success": true,
    "importedCount": 45,
    "errors": []
  }
  ```
