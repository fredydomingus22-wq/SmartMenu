# Implementation Plan - Fix Vercel Build & Monorepo Configuration

## Problem
The Vercel build was failing with `Error: No Next.js version detected`.
This occurred because the root `vercel.json` explicitly set `"framework": "nextjs"`, forcing Vercel to treat the monorepo root as a Next.js application. However, the root directory is a Turbo monorepo workspace, not a Next.js app itself.

## Root Cause Analysis
1.  **Misleading `vercel.json`**: The file at the project root asserted `"framework": "nextjs"`.
2.  **Vercel Project Configuration**: Vercel attempted to build the root as a Next.js app but found no `app/` or `pages/` directory at the root level.
3.  **Root Dependencies**: The root `package.json` unnecessarily included `next`, `radix-ui`, etc., which should be scoped to specific apps.

## Implemented Solution

### 1. Infrastructure / Configuration
-   **Updated Root `vercel.json`**: Removed the `framework` property. It now only specifies the build and install commands.
-   **Cleaned Root `package.json`**: Removed application-specific dependencies (`next`, `radix-ui`, `shadcn`) from the root `package.json`.

### 2. Verification Results
-   **Local Build**: `npx turbo build` executed successfully (Exit Code 0).
-   **Dependencies**: Lockfile updated via `npm install`.

## Remaining User Actions (Critical)

Since I cannot access your Vercel Dashboard, you must perform the following manual steps:

1.  **Go to Vercel Project Settings**:
    -   Navigate to your project on Vercel.
    -   Go to **Settings** > **General**.
2.  **Update Root Directory**:
    -   Find the **Root Directory** section.
    -   Click **Edit** and change it from `./` to `apps/web` (or `apps/consumer` if that is the intent of this specific deployment).
3.  **Check Framework Preset**:
    -   Once you change the Root Directory to a Next.js app folder, Vercel should auto-detect **Next.js**. If not, manually select it.
4.  **Redeploy**:
    -   Go to the **Deployments** tab and redeploy the latest commit, or push a new commit to trigger a build.

## Documentation Validation
-   Plan follows `system-requirements/04-arquitetura-tecnica.md` principles (Clean Architecture, Monorepo separation).
