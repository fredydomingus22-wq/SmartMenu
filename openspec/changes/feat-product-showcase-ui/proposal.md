# Proposal: Product Showcase (Vitrine de Produtos)

Implement a high-performance, accessible, and conversion-oriented product showcase using Shadcn UI and Radix primitives.

## Problem
The current menu grid needs a more premium, structured, and accessible approach to product presentation, including a dedicated Product Detail Page (PDP) with proper state handling and interaction feedback.

## Solution
Create a set of reusable UI components based on `Radix UI` and `Shadcn` that implement:
- Fixed aspect-ratio square cards.
- Typographic hierarchy for Name and Price.
- Semantic HTML structure (`<article>`, `<a>`, `<button>`).
- Dedicated PDP with sticky CTA and gallery.
- Accessibility-first focus management.

## Scope
- `ProductCard` component.
- `ProductGrid` layout.
- `ProductDetailPage` implementation.
- `Skeleton` states for grid and PDP.
- `EmptyState` and `ErrorState` components.
