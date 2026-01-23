# Proposal: UI/UX Polish & Design System Foundation

## Overview
This change addresses the gaps identified in the Phase 1 UI/UX audit. It establishes a foundation for professional theming, micro-interactions, and component documentation to ensure a premium experience across all tenant restaurants.

## Problem Statement
The current implementation uses hardcoded design tokens (colors, spacing) and lacks visual feedback for user actions. This makes the platform feel generic and prevents future customization for different restaurant brands.

## Proposed Solution
1. **Dynamic Theming**: Refactor Tailwind classes to use CSS variables injected from tenant configuration.
2. **Micro-animations**: Integrate `framer-motion` for page transitions and button feedback.
3. **Design System Documentation**: Initialize a Storybook environment to document and isolate UI components.
4. **UX Writing Polish**: Standardize copy for the Angolan market (e.g., "Descarregar", "Partilhar").

## Scope
- `apps/web`: Global CSS refactor, animation primitives, Storybook setup.
- `apps/api`: Add branding configuration to Tenant model (optional/future but design for it).

## Risks & Mitigations
- **Complexity**: Over-engineering the theme system. *Mitigation*: Stick to basic CSS variables first.
- **Performance**: Animation bloat. *Mitigation*: Use lightweight Framer Motion variants.
