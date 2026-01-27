---
description: Combined Marketing & SEO Audit workflow for Landing Pages and Systems.
---

# Marketing, SEO & Narrative Audit Workflow

This workflow coordinates Marketing, SEO, and Product Copy to systematically improve positioning, discover growth leverage points, and translate insights into execution-ready actions.

---

## 🟢 Phase 1: Market, Message & Technical Baseline (Parallel)

**Agents:**
- `agents/11_Marketing_Digital_Specialist.md`
- `agents/12_SEO_Strategist.md`

### Actions

**Marketing — Positioning & Conversion**
1. Evaluate the Landing Page:
   - Value proposition clarity (above the fold)
   - CTA visibility, wording, and intent
   - Message-to-audience fit
2. Identify trust gaps:
   - Social proof
   - Credibility and authority signals

**SEO — Technical & Structural**
1. Audit:
   - HTML semantics and heading hierarchy
   - Metadata (title, description, Open Graph)
   - Core Web Vitals and performance signals
2. Identify:
   - Quick SEO wins
   - Medium-effort improvements
   - Structural or architectural issues

### Output (Mandatory)
- **Strategic Gap Map**
  - User expectations vs communicated value
- **Technical SEO Checklist**
  - Categorized by impact and effort

---

## 🟡 Phase 2: Narrative Alignment & UX Writing Optimization

**Agent:**
- `agents/13_CMO_Copywriter.md`

**Trigger:**
- Completion of Phase 1 outputs

### Actions

1. Rewrite and refine:
   - Hero headline and subheadline
   - Section headers and key descriptions
   - Primary and secondary CTAs
2. Audit in-product microcopy:
   - Navigation labels
   - Empty states
   - Error, success, and helper messages
3. Align tone and language across:
   - Landing page
   - Dashboard
   - Menu and system flows

### Decision Rules
- Copy must reflect real product capabilities
- Language must reduce friction, not decorate features
- Every CTA must clearly communicate the next action

### Output
- **Copy & Microcopy Specification**
  - Final version and alternatives
  - Context (screen, state, user intent)
  - Conversion rationale

---

## 🔵 Phase 3: Growth Opportunities & Flywheel Discovery

**Agents:**
- `agents/11_Marketing_Digital_Specialist.md`
- `agents/12_SEO_Strategist.md`

### Actions

1. Identify potential growth flywheels:
   - SEO-driven content loops
   - Product-led acquisition hooks
   - Shareable system outputs (reports, dashboards, exports)
2. Evaluate each opportunity by:
   - Expected impact
   - Implementation effort
   - Time-to-value

### Output
- **Flywheel Opportunity Matrix**
  - Idea → Trigger → Loop → Expected Outcome

---

## 🔴 Phase 4: Consolidation & Execution Plan

**Agent:**
- `agents/11_Marketing_Digital_Specialist.md`

### Actions

1. Consolidate findings into:
   - `implementation_plan.md`
2. Translate insights into:
   - Clear initiatives
   - Prioritized actions
   - Defined ownership
3. Establish KPIs and iteration checkpoints

### Final Output
- **Marketing & SEO Implementation Plan**
  - Prioritized roadmap
  - Success metrics
  - Dependencies and risks

---

## 🔁 Continuous Improvement Loop

After implementation:
- Re-run Phase 1 on impacted pages and flows
- Validate improvements using:
  - Conversion and engagement metrics
  - SEO and search performance indicators

Marketing is a system, not a one-time effort.

---

## Usage

```text
/marketing-audit landing-page
/marketing-audit system-flow
/marketing-audit growth-opportunities
