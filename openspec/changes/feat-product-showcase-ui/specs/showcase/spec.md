# Specification: Product Showcase

## ADDED Requirements

### Requirement: Product Card Semantics and Hierarchy
The product card must use semantic HTML and maintain clear typographic hierarchy.
#### [SHOW-001]
#### Scenario: Client views the menu grid
- **Given** a list of products is fetched from the tenant's catalog
- **When** the menu grid is rendered
- **Then** each product must be wrapped in an `<article>` tag
- **And** the product name must use `font-medium`
- **And** the price must be `font-bold text-lg`

### Requirement: Interaction and Feedback
The product card must provide clear visual feedback during hover and touch interactions.
#### [SHOW-002]
#### Scenario: User interacts with a product card on Desktop
- **Given** the user is using a keyboard or mouse on a desktop device
- **When** hovering over a card
- **Then** the image should scale by 1.05x smoothly
- **And** the card should show a subtle elevation (shadow)
- **When** navigating via Tab
- **Then** a clear `focus-visible` ring must appear on the card link and buttons

### Requirement: Responsive Grid Layout
The product grid layout must adapt to various screen sizes while maintaining target sizes for accessibility.
#### [SHOW-003]
#### Scenario: User accesses the menu on different devices
- **Given** a viewport width < 768px (Mobile)
- **Then** the grid must show exactly 2 columns
- **And** touch targets for action buttons must be at least 44x44px
- **Given** a viewport width ≥ 1024px (Desktop)
- **Then** the grid must show 4 or 5 columns depending on the container width

### Requirement: Product Detail Page State Preservation
The product detail page must maintain a dedicated call-to-action that remains accessible during scrolling.
#### [SHOW-004]
#### Scenario: User scrolls the PDP on Mobile
- **Given** the user is on the product detail page on a mobile device
- **When** the user scrolls down past the initial price info
- **Then** a sticky CTA button must appear at the footer
- **And** it must not cover any interactive elements like variant selectors

### Requirement: Loading and Error States
The system must handle loading and error states without layout shifts or ambiguous messaging.
#### [SHOW-005]
#### Scenario: Data is being fetched or failed
- **When** the product list is loading
- **Then** several Skeletons matching the aspect ratio and typographic hierarchy of the final cards must be shown
- **When** a product ID does not exist
- **Then** a human-readable "Product Not Found" message with a button to return to the menu must be displayed
