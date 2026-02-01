# Global Metrics Spec

## ADDED Requirements

#### Scenario: View Total Sales
- **Given** I am a logged-in Manager
- **When** I visit the Analytics Dashboard
- **And** I select a Date Range (e.g., "Last 7 Days")
- **Then** I should see the "Total Sales" card displaying the sum of all `CONFIRMED` and `DELIVERED` orders for that period.
- **And** I should see a trend percentage (e.g., "+5% vs previous period").

#### Scenario: View Table Turnover
- **Given** I am a logged-in Manager
- **When** I visit the Analytics Dashboard
- **Then** I should see the "Average Table Turnover" metric.
- **And** It should calculate the average time a table is occupied (from first order to payment/close) divided by total tables.

#### Scenario: Filter Metrics by Date
- **Given** I am viewing the Analytics Dashboard
- **When** I change the date filter from "Today" to "This Month"
- **Then** all displayed metrics (Sales, Turnover) should update to reflect data from the new range.
