# Design: Onboarding Architecture

## Data Model Sync
We will use **Application-Layer Sync** (Server Actions) instead of Database Triggers for better visibility and error handling during the MVP phase.

flowchart LR
    A[User Login] --> B{Has Org?}
    B -- Yes --> C[Dashboard]
    B -- No --> D[Onboarding /onboarding]
    D --> E[Form: Company & Restaurant]
    E --> F[Server Action]
    F --> G[(Prisma: Create Org + Tenant)]
    F --> H[(Prisma: Update UserProfile)]
    F --> I[Supabase: Update User Metadata]
    I --> C

## Middleware Logic
```typescript
// Refined Middleware Logic
if (user && !user.user_metadata.organization_id) {
    if (!request.nextUrl.pathname.startsWith('/onboarding')) {
         return NextResponse.redirect(new URL('/onboarding', request.url))
    }
}
```

**Note**: We need to ensure `user_metadata` is kept in sync with the `UserProfile` table.
