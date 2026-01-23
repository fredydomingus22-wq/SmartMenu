---
description: Lifecycle workflow: Requirements -> Plan Validation -> Post-Coding Audit.
---
# Technical Task Lifecycle & Audit Workflow

This workflow ensures every task is properly planned and audited to maintain the highest engineering standards.

## 🟢 Phase 1: Pre-Coding Evaluation
**Trigger:** Start of a new technical task.
**Agent:** `agents/09_Technical_Audit_Lead.md`
**Action:**
1.  Analyze the user request.
2.  Perform a "Levantamento de Requisitos de Código".
3.  Evaluate technical feasibility and risks.
4.  **Output:** Technical Requirements Assessment.

## 🟡 Phase 2: Plan Validation
**Trigger:** Creation of an `implementation_plan.md`.
**Agent:** `agents/09_Technical_Audit_Lead.md`
**Action:**
1.  Audit the proposed plan against `system-requirements/`.
2.  Check for architectural consistency (Document 04).
3.  **Output:** Plan Approval or Requested Changes.

## 🔴 Phase 3: Post-Coding Audit (Automatic)
**Trigger:** Implementation completed.
**Agent:** `agents/09_Technical_Audit_Lead.md`
**Action:**
1.  Compare implementation results with the validated plan.
2.  Check for linting, error handling (via agent 08), and architecture adherence.
3.  Verify database and API changes.
4.  **Output:** **Audit Report** with:
    -   ✅ Successes.
    -   ⚠️ Non-Conformities (NCs).
    -   🛠️ Corrective Action Plan.

---

## Usage
> /technical-audit start [task description]
> /technical-audit audit [implementation details]
