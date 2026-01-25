# @smart-menu/ui

Shared UI components library for SmartMenu applications.

## Overview

This package contains reusable UI components built with React, TypeScript, and Tailwind CSS. It's designed to be used across all SmartMenu applications (Web, Mobile, etc.) to ensure consistent design and user experience.

## Installation

This package is part of the SmartMenu monorepo and is automatically available to all workspace applications.

```bash
# From the monorepo root
npm install
```

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@smart-menu/ui';

<Button variant="primary" size="md">
  Click me
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `disabled`: `boolean`
- `loading`: `boolean`
- `children`: `ReactNode`

### ImageUpload

A file upload component optimized for image uploads with drag-and-drop support.

```tsx
import { ImageUpload } from '@smart-menu/ui';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  onRemove={() => setImageUrl('')}
  supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
  supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
  bucketName="menu-assets"
/>
```

**Props:**
- `value`: `string` - Current image URL
- `onChange`: `(url: string) => void` - Callback when image is uploaded
- `onRemove`: `() => void` - Callback when image is removed
- `disabled`: `boolean`
- `className`: `string`
- `bucketName`: `string` - Supabase storage bucket name
- `supabaseUrl`: `string` - Supabase project URL (required)
- `supabaseKey`: `string` - Supabase anon key (required)

## Design System

### Colors

The design system uses a consistent color palette:

- **Primary**: Blue (#2563eb)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Font Family**: System fonts with fallbacks
- **Sizes**: xs (12px), sm (14px), md (16px), lg (18px), xl (20px), 2xl (24px)
- **Weights**: normal (400), medium (500), semibold (600), bold (700)

### Spacing

Uses a consistent spacing scale based on Tailwind's spacing system:
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)

## Usage Guidelines

### Package Isolation

⚠️ **Important**: This package must not access runtime environment variables directly. All configuration must be passed as props to maintain package isolation.

**❌ Wrong:**
```tsx
// Inside @smart-menu/ui components
const supabase = createClient(); // Uses process.env
```

**✅ Correct:**
```tsx
// Component accepts environment as props
interface MyComponentProps {
  supabaseUrl: string;
  supabaseKey: string;
}

export function MyComponent({ supabaseUrl, supabaseKey }: MyComponentProps) {
  const supabase = createClient(supabaseUrl, supabaseKey);
}
```

### Component Patterns

1. **Always use TypeScript** for type safety
2. **Accept className prop** for styling flexibility
3. **Use forwardRef** when the component needs to expose a ref
4. **Document all props** with JSDoc comments
5. **Include default values** for optional props

### Testing

Components should be tested with:
- **Unit tests** for logic and interactions
- **Visual tests** using Storybook
- **Accessibility tests** using axe-core

## Development

### Adding New Components

1. Create component in `src/components/`
2. Add TypeScript types
3. Create Storybook stories
4. Update this README
5. Add unit tests

### File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── image-upload.tsx
│   │   └── ...
│   └── index.ts
├── lib/
│   ├── utils.ts
│   └── supabase-client.ts
└── types/
    └── index.ts
```

### Building

```bash
# Build the package
npm run build

# Run Storybook
npm run storybook

# Run tests
npm run test
```

## Dependencies

### Runtime Dependencies
- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `@supabase/supabase-js`: ^2.39.0

### Development Dependencies
- `typescript`: ^5.0.0
- `tailwindcss`: ^3.0.0
- `@types/react`: ^18.0.0
- `storybook`: Latest

## Contributing

1. Follow the established patterns and guidelines
2. Ensure all components are accessible (WCAG 2.1 AA)
3. Test components across different screen sizes
4. Update documentation when adding new features
5. Use semantic versioning for releases

## License

Internal use only - SmartMenu proprietary.