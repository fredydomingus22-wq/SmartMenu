# Proposal: CSV Product Import

## Context

<!-- Why are we doing this? -->

Users (Tenants/Admin) need a way to bulk import products into the system for faster setup. Currently, products must be added one by one via the dashboard.

## What Changes

<!-- Describe what will change. Be specific about new capabilities, modifications, or removals. -->

- Implement a new API endpoint in `apps/api` to handle CSV file uploads.
- Create a processing service to validate and map CSV rows to the `Product` schema (including categories and options).
- Add a UI component in `apps/web` (Admin Dashboard) to upload CSV files and show import progress/stats.
- Documentation for the "Ideal CSV Format" will be provided to users.

## Capabilities

### New Capabilities

<!-- Capabilities being introduced. Each creates specs/<name>/spec.md -->

- `product-import`: Bulk product creation from CSV files. Covers validation, category auto-creation, and basic option mapping.

### Modified Capabilities

<!-- Existing capabilities whose REQUIREMENTS are changing. -->

- None.

## Impact

- **API**: New `POST /products/import` endpoint.
- **Service**: `ProductsService` will likely need an `importCSV` method.
- **Frontend**: New "Import" button and modal in the Products management page.
- **Storage**: Temporary storage for uploaded CSVs if processed asynchronously.
