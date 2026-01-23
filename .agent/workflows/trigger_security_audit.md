---
description: Trigger this when Database Schema or API endpoints are modified to check for vulnerabilities.
---
# Trigger: Security Schema Audit

Run this workflow whenever `system-requirements/02_Arquitetura_Tecnica.md` (Schema) or `05_Automacao_de_Workflows.md` (Integrations) is modified.

## Steps

### 1. 🕵️‍♂️ Vulnerability Scan
**Agent:** `agents/07_Security_Engineer.md`
**Instruction:**
> "Act as the Security Engineer. Analyze the recent updates in `system-requirements/02_Arquitetura_Tecnica.md`.
> Focus specifically on:
> - New Data Entities (Are they PII?)
> - New Relationships (Do they break Tenant Isolation?)
> - New API Endpoints (Are they authenticated?)"

### 2. 🛡️ Compliance Update
**Agent:** `agents/07_Security_Engineer.md`
**Instruction:**
> "If risks are found,1.  Read `system-requirements/16-seguranca-compliance.md`.
> 1. Add specific mitigation rules (e.g. 'Table X must have RLS enabled').
> 2. Mark any high-risk changes that require a Penetration Test."

### 3. 🚨 Alert
**Action:**
If a change violates "Tenant Isolation" or exposes "Payment Data", issue an immediate **STOP WORK** order until architectural revision.
