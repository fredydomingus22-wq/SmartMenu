# Design: Product Showcase UI

## Hierarchy & Structure
The showcase follows a standard e-commerce pattern adapted for a restaurant menu.

### Product Card
- **HTML**: Uses `<article>` for independence.
- **Link Partitioning**: The entire card is wrapped in a link for navigation, but the "Add to Cart" button uses `e.stopPropagation()` and `e.preventDefault()` to allow direct action without navigation.
- **Aspect Ratio**: `aspect-square` ensures visual consistency across various image dimensions.

### Product Detail Page (PDP)
- **Sticky CTA**: Ensures the "Order" action is always within reach on mobile without obscuring critical content.
- **Tabs/Accordion**: Organizes secondary information (Description, Specs, Policies) to keep the initial view clean.

### Accessibility (A11y)
- **Radix UI**: Leverage Radix's managed focus and keyboard navigation for components like `Tabs`, `Accordion`, and `RadioGroup`.
- **Focus Ring**: Custom `focus-visible` styles to ensure clear visibility for keyboard users.

### Performance
- **Image Optimization**: Use Next.js `Image` with proper `priority` for above-the-fold items.
- **Skeletons**: Layout-stable skeletons to prevent Cumulative Layout Shift (CLS).
