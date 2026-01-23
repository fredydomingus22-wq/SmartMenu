# 🤖 SmartMenu Multi-Agent System Setup

This guide explains how to use the "Antigravity" multi-agent architecture configured for this project.

## 📂 Structure
The intelligence of the system is distributed across specialized markdown files in the `agents/` directory.

-   **`agents/`**: Contains the "System Prompts" for each expert.
-   **`system-requirements/`**: The "Knowledge Base" each agent owns.
-   **`.agent/workflows/`**: Orchestration logic (e.g., `/multi_agent_review`).

## 🚀 How to Use (Workflow)

When you have a task, ask Antigravity to "Switch Personas" by referencing the agent file.

**Example Prompt:**
> "I want to add a 'Split Bill' feature. Please start the **/multi_agent_review** workflow, beginning with the **@01_Product_Manager**."

### The "Trigger" Loop
1.  **Ideation:** You ping the PM Agent.
2.  **Handoff:** Explicitly ask: "Now pass this to the **@02_System_Architect** to validate."
3.  **Refinement:** "Now ask **@03_UI_UX_Designer** to visualize this."

## 🧩 Recommended VS Code Extensions

To maximize your productivity with this setup, install these extensions:

1.  **Markdown All in One** (yzhang.markdown-all-in-one)
    *   *Why:* Essential for reading/editing the documentation and requirements.
2.  **Mermaid Preview** (vsc-mermaid)
    *   *Why:* We use Mermaid.js for diagrams in the requirement files.
3.  **ESLint** & **Prettier**
    *   *Why:* Standard code quality tools we enforce in the QA process.
4.  **Tailwind CSS IntelliSense**
    *   *Why:* Critical for the Frontend workflows (`shadcn` support).
5.  **PostgreSQL** (ckolkman.vscode-postgres)
    *   *Why:* Useful for the Architect to visualize DB schemas directly.

## ⚡ Automation Triggers

You can automate repetitive checks.

*   **On Requirement Change:** Run `/trigger_qa_review` -> Automates the update of the QA Strategy.
*   **On Schema Change:** Run `/trigger_security_audit` -> Automates the audit for PII and Tenant Isolation risks.
