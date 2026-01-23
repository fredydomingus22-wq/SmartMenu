## ADDED Requirements

### Requirement: Table-Specific QR
The system SHALL generate a unique URL and QR code for each table in a restaurant.

#### Scenario: Scan QR redirects to menu
- **WHEN** customer scans QR of Table 5
- **THEN** the Web App SHALL open with Table 5 identified in the state
