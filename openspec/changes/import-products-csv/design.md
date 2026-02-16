## Context

Currently, adding multiple products to SmartMenu requires manual entry for each item, which is time-consuming for large menus. A CSV import feature will allow users to bulk upload their product catalogs.

## Goals / Non-Goals

**Goals:**

- Provide a `POST /products/import` endpoint for CSV file uploads.
- Auto-create categories if they don't exist during import.
- Support basic product fields: Name, Description, Price, Category, Image URL.
- Provide clear error reporting for invalid CSV rows.

**Non-Goals:**

- Complex product options/variants import (initially).
- Syncing with external POS systems via CSV.
- Deleting existing products (append-only or update-only).

## Decisions

1. **Format**: Standard CSV with UTF-8 encoding.
2. **Category Handling**: Case-insensitive lookup by name within the tenant's scope. If missing, create a new category with `preparationSector: KITCHEN` as default.
3. **Translations**: Since the DB uses JSON for `name` and `description`, the CSV values will be mapped to the `pt` key by default (matching the project's current primary locale).
4. **Parsing Library**: Use `csv-parse` in the NestJS backend for robust processing.
5. **Flow**:
   - Parse CSV into JSON objects.
   - Validate each object against a schema (e.g., price must be numeric).
   - Resolve `categoryId`.
   - Batch insert into the database within a Prisma transaction to ensure atomicity.

## Risks / Trade-offs

- **[Memory]** → Large CSV files could crash the process if loaded entirely into memory. _Mitigation_: Set a 5MB limit on file uploads and process in a single pass.
- **[Data Integrity]** → Partial success could leave the catalog in an inconsistent state. _Mitigation_: Wrap the entire import in a DB transaction.
- **[Duplicates]** → Importing the same file twice could double the products. _Mitigation_: For MVP, we will append. Future iteration: Deduplicate by name + category.
