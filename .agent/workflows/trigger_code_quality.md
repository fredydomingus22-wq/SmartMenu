---
description: Trigger this when code is pushed or a PR is created to ensure Linting and Error Handling standards.
---
# Code Quality Audit Workflow

This workflow triggers a review focused on code health, standards, and resilience.

## Trigger
Run this workflow after **Implementing a Feature** or **Refactoring Code**.

## Steps

### 1. 🔍 Static Analysis
**Agent:** `agents/08_Code_Quality_Specialist.md`
**Trigger:** Completion of a code change.
**Action:**
1.  Run `npm run lint` in the relevant package.
2.  Review `tsconfig.json` and `.eslintrc` compliance.
3.  Audit **Error Handling** patterns (try/catch blocks, error logging).
4.  **Output:** Lint report and quality feedback.

### 2. 🛡️ Resistance Check
**Agent:** `agents/08_Code_Quality_Specialist.md`
**Action:**
1.  Verify if fallbacks are implemented for external service failures (e.g., Supabase, OpenAI).
2.  Check for explicit type safety (avoid `any`).
3.  **Output:** Resilience approval or requested fixes.

## Usage
> "Act as @agents/08_Code_Quality_Specialist.md and audit the last changes for linting and error handling."
