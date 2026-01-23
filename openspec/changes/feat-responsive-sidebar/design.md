# Design: Responsive Sidebar & UI Upgrade

## 1. Architectural Changes
- **Component Extraction**: The current `<aside>` in `layout.tsx` contains heavy logic (Nav Items, Sign Out, Logo). This will be moved to `apps/web/app/dashboard/_components/dashboard-sidebar.tsx`.
- **Layout Restructuring**:
  - `layout.tsx` will conditionally render:
    - `DesktopSidebar` (hidden on mobile).
    - `MobileSidebar` (Sheet trigger visible only on mobile).

## 2. UI/UX Upgrade Plan
The user requested a specific "UI and UX upgrade plan".

### A. Visual Aesthetics (Industrial Premium)
- **Colors**: Use `zinc-950` for dark mode sidebar background with a subtle border `border-zinc-800`.
- **Active State**: Navigation items should use a solid but subtle background for active state (e.g., `bg-orange-50 text-orange-600` in light, `bg-orange-950/20 text-orange-500` in dark).
- **Typography**: ensuring `Inter` or `Geist` font usage with proper font-weights (Medium for links).

### B. Mobile Experience
- **Transition**: Smooth slide-in animation using Radix UI `Sheet` primities.
- **Accessibility**: Tapping outside closes the menu. Focus management handles keyboard navigation.
- **Hiding**: The default Sidebar will have `hidden md:flex`. The Mobile Trigger will have `md:hidden`.

### C. Component Structure
```tsx
// dashboard-sidebar.tsx
export function DashboardSidebar({ className }: { className?: string }) {
  // ... standardized styling ...
}

// layout.tsx
// Desktop
<DashboardSidebar className="hidden md:flex w-64 border-r ..." />

// Mobile (in Header)
<Sheet>
  <SheetTrigger className="md:hidden">
    <MenuIcon />
  </SheetTrigger>
  <SheetContent side="left" className="p-0">
     <DashboardSidebar />
  </SheetContent>
</Sheet>
```
3. **Guardrails**:
- Do not change the logic of `DashboardNav` itself, only its container.
- Ensure `SignOut` button remains accessible in the mobile view.
