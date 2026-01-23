# Auth Resilience Specification Delta

## MODIFIED Requirements

### Requirement: Auth Error Resilience
The system SHALL handle authentication failures gracefully and ensure robust token propagation between environment boundaries (Next.js 16 Server Components/Actions and NestJS API).

#### Scenario: Server Action Proxy Auth
- **GIVEN** a user is authenticated in the web application
- **WHEN** they submit a form that triggers a Server Action
- **THEN** the Server Action SHALL retrieve the Supabase auth token from cookies
- **AND** the `apiClient` SHALL inject the token into the `Authorization` header
- **AND** the NestJS API SHALL successfully validate the request

#### Scenario: Supabase SSR Cookie Decoding
- **GIVEN** the browser holds a base64 encoded Supabase SSR cookie (`sb-<project>-auth-token`)
- **WHEN** a Server Action calls the `apiClient`
- **THEN** the `apiClient` SHALL decode the base64 session
- **AND** extract the `access_token` for the API request
