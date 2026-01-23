# Tasks: Next.js 16 Upgrade

## Phase 1: Preparation
- [ ] Check Node.js version (`node -v`) and ensure it's >= 18.18.
- [ ] Create a new branch `upgrade/next-16`.

## Phase 2: Dependency & Infrastructure Update
- [ ] Update `package.json` dependencies: `next@latest`, `react@latest`, `react-dom@latest`.
- [ ] Clear project cache: `rm -rf .next node_modules package-lock.json`.
- [ ] Perform a fresh install: `npm install`.
- [ ] Update `next.config.ts` to enable Turbopack:
  ```typescript
  experimental: {
    turbo: true,
  }
  ```

## Phase 3: Code Refactoring
- [ ] Refactor `apps/web/utils/api-client.ts` to use `await cookies()`.
- [ ] Audit and refactor `middleware.ts` to handle async cookies/headers.
- [ ] Update all Server Components in `apps/web/app` to properly `await` request context.
- [ ] Enforce `cache: 'no-store'` in authenticated fetch calls.

## Phase 4: Verification
- [ ] Verify `npm run dev` starts successfully with Turbopack.
- [ ] Test authentication flow (login, token retrieval, authenticated requests).
- [ ] Verify multi-tenant data isolation persists.
- [ ] Run a production build: `npm run build`.
