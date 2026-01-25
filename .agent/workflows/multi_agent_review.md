---
description: Orchestrates a full requirement review cycle involving all expert agents.
---
# Multi-Agent Requirement Review Workflow

This workflow guides the user through a complete cycle of requirement updates, ensuring all perspectives (Product, Tech, Design, QA, Security) are considered.

## Trigger
Run this workflow when a **New Feature** is proposed or a **Major Refactor** is needed.

## Steps

### 1. 🧠 Product Definition (Product Owner)
**Agent:** `agents/01_Product_Manager.md`
**Trigger:** User Input (New Idea).
**Action:**
1.  Read `system-requirements/01-visao-geral-e-stakeholders.md`.
2.  Update `02-requisitos-funcionais.md` or `05-user-stories.md`.
3.  **Output:** Updated requirement documents.

### 2. 🏗️ Technical Feasibility (System Architect)
**Agent:** `agents/02_System_Architect.md`
**Trigger:** Change in Product Docs.
**Action:**
1.  Update `system-requirements/04-arquitetura-tecnica.md`.
2.  Check for Database changes or API endpoints.
3.  **Output:** Updated architecture doc.

### 3. 🎨 Experience & Intelligence (Parallel)
**Agents:** `agents/03_UI_UX_Designer.md`, `agents/05_Automation_Specialist.md` & `agents/14_Mobile_Layout_Specialist.md`
**Trigger:** Change in Architecture/Vision.
**Actions:**
*   **Designer:** Update `07-design-system.md`, `06-ux-flows.md`, `08-ux-writing-microcopy.md`.
*   **Automation:** Update `11-automacao-workflows.md` and `12-integracao-automacoes-ui.md`.
*   **Mobile Layout Specialist:** Audit and enhance mobile layout guidelines in `07-design-system.md`, ensure advanced CSS and responsive principles.

### 4. 🛡️ Risk Assessment & Quality (QA, Security & Code)
**Agents:** `agents/06_QA_Engineer.md`, `agents/07_Security_Engineer.md` & `agents/08_Code_Quality_Specialist.md`
**Trigger:** Updates in Design or Architecture.
**Actions:**
*   **QA:** Update `15-estrategia-qualidade.md`. Define test cases.
*   **Security:** Update `16-seguranca-compliance.md`.
*   **Code Quality:** Review patterns and update linting expectations if needed.

### 5. 📅 Execution Planning (Project Manager)
**Agent:** `agents/04_Project_Manager.md`
**Trigger:** All specs updated.
**Action:**
1.  Update `system-requirements/13-roadmap-implementacao.md`.
2.  **Final Output:** A ready-to-code roadmap update.

## Usage
To execute a step, reference the agent file in your prompt:
> "Act as @agents/01_Product_Manager.md and analyze this request..."
