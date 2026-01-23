## ADDED Requirements

### Requirement: Product CRUD
The system SHALL allow authorized users (OWNER, MANAGER) to Create, Read, Update, and Delete menu products.

#### Scenario: Create product with tenant isolation
- **WHEN** user creates a product "Burger" in Tenant A
- **THEN** the product SHALL ONLY be visible to users and customers associated with Tenant A

### Requirement: Category Management
The system SHALL allow products to be grouped into categories.

#### Scenario: List categories on menu
- **WHEN** a customer views the menu
- **THEN** categories SHALL be displayed as navigation tabs
