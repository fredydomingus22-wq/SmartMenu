# Customer Insights Spec

## Goal
Understand customer behavior patterns to optimize staffing and marketing.

## Requirements

### Requirement: Average Ticket Size
The system MUST calculate the average value of orders placed in the selected period.

#### Scenario: View Avg Ticket
- **Given** I am on the Business Analytics dashboard
- **Then** I SHOULD see an "Average Ticket" KPI card.
- **And** This constitutes (Total Revenue / Total Number of Orders).

### Requirement: Peak Operation Hours
The system MUST visualize the busiest times of day based on order volume.

#### Scenario: View Peak Hours
- **Given** I am on the Business Analytics dashboard
- **Then** I SHOULD see a bar chart or heatmap showing order counts by hour of the day (00:00 - 23:00).
- **And** The system SHOULD highlight the peak hour interval.
