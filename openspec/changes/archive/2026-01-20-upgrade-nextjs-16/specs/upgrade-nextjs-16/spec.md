# spec-delta: Upgrade Next.js 16 Requirements

## MODIFIED Requirements

### Requirement: Auth Cookie Handling
The system SHALL use asynchronous access for authentication cookies to comply with Next.js 16 server-side requirements.

#### Scenario: Server-Side Token Retrieval
- **GIVEN** a Server Component or Server Action
- **WHEN** the system attempts to retrieve the `access_token`
- **THEN** it SHALL `await` the `cookies()` function before accessing its values.

### Requirement: Request Header Access
The system SHALL treat request headers as asynchronous resources during server-side rendering.

#### Scenario: Extracting Custom Headers
- **WHEN** the API client or middleware needs to read request headers
- **THEN** it SHALL `await` the `headers()` function to ensure data availability.
