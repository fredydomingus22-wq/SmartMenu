# Customer Profile Spec

## ADDED Requirements

### Requirement: Search and View Customer
The system MUST allow managers to search for a specific customer and view their detailed profile.

#### Scenario: Search Customer
- **Given** I am on the dedicated "Business Analytics" page
- **When** I use the "Customer Search" feature
- **Then** I SHOULD be able to select a consumer from the results to view their profile.

### Requirement: Customer Favorite Products
The system MUST display the product most frequently ordered by the selected customer.

#### Scenario: View Favorite Product
- **Given** I am viewing a specific Customer Profile
- **Then** I MUST see their "Most Ordered Product" prominently displayed.
- **And** I SHOULD see the quantity they have purchased historically.

### Requirement: Customer Visit Patterns
The system MUST visualize the times of day or days of the week the customer most frequently visits/orders.

#### Scenario: View Visit Heatmap
- **Given** I am viewing a specific Customer Profile
- **Then** I SHOULD see a chart indicating their "Peak Visit Times" (e.g., "Usually orders on Fridays at 20:00").

### Requirement: Customer Spending History
The system MUST allow viewing the customer's total spending within configurable time intervals.

#### Scenario: View Spending Over Time
- **Given** I am viewing a specific Customer Profile
- **When** I select a time interval (e.g., "Last 3 Months")
- **Then** I MUST see the total amount spent by that customer in that period.

### Requirement: Loyalty Metrics
The system MUST allow the manager to view the operational loyalty metrics per customer.

#### Scenario: View Points and Discounts
- **Given** I am viewing a specific Customer Profile
- **Then** I MUST see the total quantitative "Points Earned" by this customer.
- **And** I MUST see the total monetary value of "Discounts Used" (Redeemed Rewards) by this customer.
