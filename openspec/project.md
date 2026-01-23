# Project Context

## Purpose
SmartMenu is a multi-tenant SaaS platform for digital restaurant menus. It allows customers to access menus via table-specific QR codes, place orders, and track status in real-time. The goal is to reduce operational friction, increase average ticket sizes, and provide data-driven insights for restaurant management.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Supabase SSR.
- **Backend**: NestJS 11, TypeScript (Strict Mode), Prisma 7, WebSockets, OpenAI SDK.
- **AI/Analytics**: Python 3.13, FastAPI, OpenAI, LangChain, Pandas.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
- **Infrastructure**: Supabase CLI, Vercel/Railway for deployment.

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled. Use functional components and hooks in React. Follow NestJS modular structure.
- **Python**: Use type hints and FastAPI dependency injection.
- **Naming**: PascalCase for components/classes, camelCase for variables/functions, snake_case for database columns.

### Architecture Patterns
- **Monorepo**: Managed with NPM workspaces (`apps/web`, `apps/api`, `apps/analytics`).
- **Multi-tenancy**: Strict logical isolation using `tenant_id`. Every database query must filter by `tenant_id`.
- **Event-Driven**: Use WebSockets for real-time order updates and status changes.

### Testing Strategy
- **Unit/Integration**: Jest (NestJS) and Vitest (Next.js).
- **E2E**: Playwright for critical user flows (order placement, KDS updates).
- **Security**: Automated RLS verification tests.

### Git Workflow
- Feature-based branching.
- Commits follow Conventional Commits (feat, fix, chore, etc.).

## Domain Context
- **Tenants**: Independent restaurants with their own menus, staff, and tables.
- **KDS**: Kitchen Display System used by chefs to manage orders.
- **Orders**: Lifecycle: PENDING -> CONFIRMED -> PREPARING -> READY -> DELIVERED.

## Important Constraints
- **Data Isolation**: A user from one tenant MUST NEVER see data from another tenant.
- **Mobile-First**: Primary user interface is the customer's mobile browser via QR code.
- **Real-time**: Order notifications to staff must be near-instant.

## External Dependencies
- **Supabase**: Auth, Database, Storage, and Realtime.
- **OpenAI**: Powers the AI analytics and upsell suggestions.
- **Multicaixa Express**: Primary payment gateway for the Angolan market.

