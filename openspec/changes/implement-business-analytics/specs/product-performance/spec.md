# Product Performance Spec

## Goal
Identify which menu items are driving revenue and which are underperforming.

## Requirements

### Requirement: Top Selling Products
The system MUST list the top N products by quantity sold and by revenue generated.

#### Scenario: View Top Sellers
- **Given** I am on the Business Analytics dashboard
- **Then** I SHOULD see a list or chart of the top 5 item names.
- **And** I SHOULD be able to toggle between "By Volume" and "By Revenue".

### Requirement: Least Selling Products
The system MUST identify products with the lowest sales volume in the selected period to aid in menu optimization decisions.

#### Scenario: View Underperformers
- **Given** I am on the Business Analytics dashboard
- **Then** I SHOULD be able to view a report of items with zero or low sales count.
