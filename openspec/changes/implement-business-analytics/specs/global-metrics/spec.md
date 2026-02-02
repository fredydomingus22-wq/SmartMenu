# Global Metrics Spec

## Goal
Provide a high-level overview of the restaurant's financial and operational health.

## Requirements

### Requirement: Total Revenue
The system MUST display the total revenue (sum of all `COMPLETED` order totals) for the selected time period.

#### Scenario: View Revenue
- **Given** I am on the Business Analytics dashboard
- **When** I select a date range
- **Then** I SHOULD see a "Total Sales" card with the aggregated value.
- **And** I SHOULD see a percentage trend confirming growth or decline compared to the previous period.

### Requirement: Table Turnover Rate
The system MUST display the average time a table is occupied or the cycle of order-to-delivery flow.

#### Scenario: View Turnover
- **Given** I am on the Business Analytics dashboard
- **Then** I SHOULD see a "Avg Service Time" KPI card.
- **And** This value represents the average duration between Order Creation and Order Delivery/Readiness.
