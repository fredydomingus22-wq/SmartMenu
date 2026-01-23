# ui-polish Specification

## Purpose
TBD - created by archiving change implement-ui-ux-polish. Update Purpose after archive.
## Requirements
### Requirement: Semantic Design Tokens
The system MUST use CSS variables for primary branding tokens to support multi-tenant customization.

#### Scenario: Active Brand Primary Color
- **Given** a tenant with a registered primary color of `#22c55e` (green)
- **When** the customer accesses the public menu
- **Then** the header and primary buttons MUST be displayed in green
- **And** the tailwind `bg-primary` class MUST resolve to this specific color.

### Requirement: Interaction Feedback
All interactive elements MUST provide visual feedback to user input using defined animation primitives.

#### Scenario: Item Addition Animation
- **Given** a customer viewing the menu
- **When** the customer clicks on a "MenuItemCard"
- **Then** the card MUST subtly scale down (active state)
- **And** the transition to the detail view MUST be smooth using a fade-in effect.

### Requirement: Component isolation (Documentation)
UI components MUST be documented and testable in isolation.

#### Scenario: Storybook Verification
- **Given** a new UI component `SmartBadge`
- **When** the developer opens Storybook
- **Then** all variants (Default, AI-Suggested, Promo) MUST be visible and interactable with controls.

