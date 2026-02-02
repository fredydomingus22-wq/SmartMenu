# Implement Business Analytics

## Goal
Enable restaurant owners and managers to make data-driven decisions by providing real-time and historical insights into their business performance, specifically focusing on Sales and Turnover metrics.

## Context
SmartMenu captures rich transactional data (Orders, Products, Customers). Currently, this data is underutilized. We need a dedicated Analytics dashboard to visualize Key Performance Indicators (KPIs).

## Requirements
- **Global Metrics**: Display Total Sales (Revenue) and Table Turnover Rate.
- **Product Performance**: Identify Top Selling Products (Volume & Revenue) and Least Selling Items.
- **Customer Insights**: metrics like Average Ticket Size and Peak Operation Hours.
- **Individual Customer Profile**: View specific customer details including favorite products, visit frequency/times, and spending history details.
- **Filtering**: Allow filtering by date range (Today, Week, Month, Custom).
- **Visualization**: Use charts/graphs to show trends over time.

## Risk Assessment
- **Performance**: Aggregating large datasets might be slow. We may need to implement caching or pre-calculated aggregates later.
- **Privacy**: Ensure customer data is anonymized in aggregate views if individual customer tracking is added later.

## Plan
1.  Define specs for Global Metrics, Product Performance, and Customer Insights.
2.  Implement `AnalyticsService` extensions.
3.  **Dedicated Page**: Revamp `apps/web/app/dashboard/analytics/page.tsx` to serve as the central Business Intelligence hub, distinct from the main dashboard.
4.  Integrate all new components into this dedicated page.
