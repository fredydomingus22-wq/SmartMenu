# 🚀 Vercel Deployment Checklist - SmartMenu

## 1. Project Configuration (Vercel Dashboard)
- [ ] **Project Name**: `smart-menu-web`
- [ ] **Framework Preset**: Next.js
- [ ] **Root Directory**: `apps/web`
- [ ] **Build Command**: `cd ../.. && npx turbo build --filter=web`
- [ ] **Install Command**: `cd ../.. && npm install`
- [ ] **Output Directory**: `.next`

## 2. Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: [Your URL]
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [Your Key]
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: [Your Key]
- [ ] `JWT_SECRET`: [Your Secret]
- [ ] `DATABASE_URL`: [Your Connection String]
- [ ] `NEXT_PUBLIC_API_URL`: [Your API URL or internal Vercel URL]

## 3. Monorepo Specifics
- [ ] Ensure `packages/ui` and `packages/api` are declared in `package.json` workspaces.
- [ ] Verify that `turbo.json` has appropriate pipeline tasks.
- [ ] Ensure `postinstall` in root generates Prisma client: `"postinstall": "npx prisma generate"`.

## 4. Build Optimization
- [ ] Node.js version set to **20.x**.
- [ ] Check for unused imports/vars (ESLint errors block Vercel builds).
- [ ] Verify local production build runs: `npx turbo build`.

## 5. Troubleshooting Common Failures
- **Error: "Module not found" for @smart-menu/ui**: Usually caused by running `next build` from `apps/web` instead of running `turbo build` from the root.
- **Error: "PrismaClient initialization"**: Ensure `DATABASE_URL` is available during build time if using static generation.
- **Error: ESLint violations**: Vercel runs `npm run lint` during build. Fix all errors locally first.
