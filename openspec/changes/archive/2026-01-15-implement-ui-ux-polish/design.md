# Design: UI/UX Foundation

## Architectural Decisions

### 1. CSS Variable Injection
Instead of hardcoding `bg-orange-600`, we will use `bg-primary`. The `--primary` variable will be defined in `:root` and potentially overridden by an inline style on the `<body>` or a wrapper div, fetching data from the tenant context.

### 2. Animation System
We will adopt `framer-motion` as the primary library for animations. We will define a set of "Printers" (Animation Primitives) that can be reused across cards and buttons to ensure consistency.

### 3. Storybook Strategy
Storybook will be hosted as a separate development tool within the `apps/web` workspace. It will be used to verify component states (Hover, Loading, Disabled) in isolation from the backend.

## Data Model Changes
The `Tenant` model in `schema.prisma` should eventually include a `branding` JSON field or specific columns for `primaryColor`, `secondaryColor`, and `fontFamily`.

```prisma
// Example potential change
model Tenant {
  // ...
  primaryColor   String?
  logoUrl        String?
  // ...
}
```
