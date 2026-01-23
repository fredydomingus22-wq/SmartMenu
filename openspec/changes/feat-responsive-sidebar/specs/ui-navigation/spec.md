
# Capability: UI Navigation

## ADDED Requirements

### Requirement: [UI-NAV-001] Responsive Sidebar Visibility
The dashboard sidebar MUST adapt its visibility based on the viewport size to ensure usability on all devices.

#### Scenario: Desktop View
GIVEN a user is accessing the dashboard on a viewport wider than or equal to 768px (md breakpoint)
THEN the sidebar MUST be visible as a fixed-width column on the left side
AND the sidebar MUST persist during navigation.

#### Scenario: Mobile View
GIVEN a user is accessing the dashboard on a viewport narrower than 768px
THEN the persistent sidebar MUST be hidden
AND a "Menu" button (Hamburger icon) MUST be visible in the top header.

### Requirement: [UI-NAV-002] Mobile Navigation Sheet
The mobile navigation MUST use a slide-out sheet pattern to display the menu without leaving the current page context.

#### Scenario: Opening Mobile Menu
GIVEN a user is on a mobile device
WHEN the user clicks the "Menu" button in the header
THEN a slide-out Sheet MUST appear from the left side
AND the Sheet MUST contain the exact same navigation items as the desktop sidebar.

#### Scenario: Closing Mobile Menu
GIVEN the mobile menu Sheet is open
WHEN the user clicks on a navigation link OR clicks outside the Sheet
THEN the Sheet MUST close automatically.
