# user-auth Specification

## Purpose
TBD - created by archiving change refactor-auth-logic. Update Purpose after archive.
## Requirements
### Requirement: Auth Error Resilience
The system SHALL handle authentication failures gracefully, redirecting to login with clear error messages instead of crashing or looping.

#### Scenario: Token Refresh Failure
- **WHEN** the session token is invalid or expired and cannot be refreshed
- **THEN** the system SHALL redirect the user to `/login`
- **AND** clear any stale cookies

### Requirement: Mandatory Onboarding
The system SHALL require all new users (OWNER role) to complete an onboarding process to establish their Organization and first Restaurant before accessing the dashboard.

#### Scenario: New User First Login
- **GIVEN** a user has just signed up and has no linked Organization
- **WHEN** they log in
- **THEN** they are redirected to `/onboarding`
- **AND** cannot access `/dashboard` until completion

### Requirement: Organization Provisioning
The system SHALL atomically create an Organization, a Tenant, and link the User as the owner upon onboarding completion.

#### Scenario: Completing Onboarding
- **WHEN** user submits valid Company and Restaurant details
- **THEN** system creates `Organization`
- **AND** system creates `Tenant` linked to Organization
- **AND** system updates `UserProfile` with `organization_id` and `tenant_id`

