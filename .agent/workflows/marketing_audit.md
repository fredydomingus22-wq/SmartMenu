---
description: Combined Marketing & SEO Audit workflow for Landing Pages and Systems.
---
# Marketing & SEO Audit Workflow

This workflow orchestrates the new marketing team to evaluate and improve the product's market positioning and technical reach.

## 🟢 Phase 1: Strategic & Technical Audit (Parallel)
**Agent:** `agents/11_Marketing_Digital_Specialist.md` & `agents/12_SEO_Strategist.md`
**Action:**
1.  **Marketing:** Review the Landing Page for value proposition clarity and CTA effectiveness.
2.  **SEO:** Analyze HTML structure, metadata, and performance for search engines.
3.  **Output:** Strategic Gap Report + Technical SEO Checklist.

## 🟡 Phase 2: Narrative & UX Writing Refinement
**Agent:** `agents/13_CMO_Copywriter.md`
**Trigger:** Completion of Phase 1.
**Action:**
1.  Rewrite headers and descriptions based on gaps identified.
2.  Audit microcopy on the dashboard/menu flows to ensure consistency with the new marketing narrative.
3.  **Output:** Copy & Microcopy Specification (Optimized for conversion).

## 🔴 Phase 3: Consolidation & Improvement Plan
**Agent:** `agents/11_Marketing_Digital_Specialist.md`
**Action:**
1.  Consolidate all findings into a new `implementation_plan.md` focused on Marketing/SEO.
2.  Suggest features that could serve as "Flywheels" for growth.
3.  **Final Output:** Implementation Plan for Marketing Success.

---

## Usage
> /marketing-audit landing-page
> /marketing-audit system-flow
