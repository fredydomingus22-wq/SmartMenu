---
description: Trigger this when Functional Requirements (01) or Architecture (02) change to ensure Test Coverage.
---
# Trigger: QA Coverage Review

Run this workflow whenever `system-requirements/01_Visao_Geral_e_Requisitos.md` or `02_Arquitetura_Tecnica.md` is modified.

## Steps

### 1. 🔍 Analyze Changes
**Agent:** `agents/06_QA_Engineer.md`
**Instruction:**
> "Act as the QA Engineer1.  Read `system-requirements/15-estrategia-qualidade.md` and `system-requirements/05-user-stories.md`.
 content. Identifying any new features or logic changes."

### 2. 📝 Update Test Strategy
**Agent:** `agents/06_QA_Engineer.md`
**Instruction:**
> "Now, open `system-requirements/15-estrategia-qualidade.md`.
> 1. Does the current strategy cover the new features identified?
> 2. If not, append new 'Test Cases' or 'Acceptance Criteria' to the relevant section.
> 3. Verify if new 'E2E' tests are needed."

### 3. 🚫 Gate Check
**Action:**
If the QA strategy was completely missing coverage for a Critical Feature, flag it as a **BLOCKER** to the Product Manager.
