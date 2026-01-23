---
description: Interactive execution workflow: Plan -> Research -> Code -> Verify.
---

# Implementation Execution Workflow

This workflow drives the coding phase, ensuring research-backed implementation and collaboration.

## 🟢 Phase 1: Context & Research
**Trigger:** `/Implementation start [plan_name]`
**Agent:** `agents/10_Implementation_Lead.md`
**Action:**
1.  Read the active `implementation_plan.md`.
2.  **Web Search:** Search for updated patterns related to the task (e.g., "Next.js 16 Server Actions patterns").
3.  Refine the plan with new findings.

## 🟡 Phase 2: Execution (Iterative)
**Agent:** `agents/10_Implementation_Lead.md`
**Action:**
1.  Create/Update code files according to plan.
2.  **Check-in:** If a Design decision is ambiguous -> Trigger `/multi_agent_review` (Step 3: Design).
3.  **Check-in:** If an Architecture decision is ambiguous -> Trigger `/multi_agent_review` (Step 2: Arch).

## 🔴 Phase 3: Hand-off & Audit
**Trigger:** Implementation completed.
**Agent:** `agents/09_Technical_Audit_Lead.md`
**Action:**
1.  Automatically trigger the `technical_lifecycle` (Phase 3: Audit).
2.  Review specific "Code Quality" metrics (Agent 08).
3.  **Output:** Final Pull Request Readiness.

## Usage
> /Implementation start "Integração Stripe"
> "Act as @agents/10_Implementation_Lead.md and build the KDS component."