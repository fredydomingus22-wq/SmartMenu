## ADDED Requirements

### Requirement: Multi-tenant Login
The system SHALL allow users to authenticate via email and password, associating them with a specific `tenant_id`.

#### Scenario: Successful login
- **WHEN** user provides valid credentials
- **THEN** system returns a JWT containing the user's `role` and `tenant_id`

### Requirement: RBAC Enforcement
The system MUST restrict access to resources based on the user's role (OWNER, MANAGER, STAFF).

#### Scenario: Unauthorized access prevention
- **WHEN** a STAFF user tries to access faturamento/billing settings
- **THEN** the system SHALL return a 403 Forbidden error
