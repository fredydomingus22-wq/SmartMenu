## ADDED Requirements

### Requirement: Auth Error Resilience
The system SHALL handle authentication failures gracefully, redirecting to login with clear error messages instead of crashing or looping.

#### Scenario: Token Refresh Failure
- **WHEN** the session token is invalid or expired and cannot be refreshed
- **THEN** the system SHALL redirect the user to `/login`
- **AND** clear any stale cookies
