## 1. Backend Implementation (API)

- [x] 1.1 Install dependencies (`csv-parse`, `@types/multer`) in `apps/api`
- [x] 1.2 Add `importProducts` endpoint to `ProductsController`
- [x] 1.3 Implement CSV parsing and validation logic in `ProductsService`
- [x] 1.4 Implement category auto-creation logic within the import flow
- [x] 1.5 Ensure data persistence using a Prisma transaction for atomicity

## 2. Frontend Implementation (Web)

- [x] 2.1 Create `ProductImportModal` component in `apps/web`
- [x] 2.2 Add "Importar CSV" button to the Product List header
- [x] 2.3 Connect the frontend upload to the new API endpoint
- [x] 2.4 Add success/error notifications for the import process

## 3. Documentation & Verification

- [x] 3.1 Create a sample CSV file for user reference
- [x] 3.2 Verify the import flow with various edge cases (empty rows, missing categories)
- [x] 3.3 Finalize documentation of the "Ideal CSV Format"
