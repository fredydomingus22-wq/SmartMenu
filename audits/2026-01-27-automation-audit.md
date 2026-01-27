# Relatório de Auditoria de Automação e IA

**Data:** 27/01/2026
**Auditor:** Agent Automation Specialist
**Status Geral:** 🔴 Crítico / Inicial

## 1. Resumo Executivo

A auditoria revelou que o sistema de Automação e IA, conforme definido em `system-requirements/11-automacao-workflows.md`, encontra-se em estágio **embrionário**. A infraestrutura central ("Workflow Engine") não existe, e a maioria das automações planejadas não está implementada. A única excepção é a lógica de Fidelidade, que está implementada de forma "hardcoded" (rígida) e não configurável. Os componentes de UI necessários para refletir estas automações também estão ausentes.

## 2. Infraestrutura Central (Workflow Engine)

| Componente | Status | Observações |
|------------|--------|-------------|
| **Tabelas de Workflow** | ❌ Ausente | Não existem tabelas para `workflows`, `triggers`, `actions`, `executions`. |
| **Workflow Service** | ❌ Ausente | Não há serviço central para gerir eventos e ações. |
| **Visual Builder** | ❌ Ausente | A funcionalidade drag & drop não existe no frontend admin. |
| **Event Bus** | ⚠️ Parcial | Existe um sistema de broadcast via Supabase em `OrdersService`, mas é usado apenas para atualizações em tempo real, não para desencadear automações lógicas. |

**Impacto:** Sem o motor, cada nova automação requer desenvolvimento backend personalizado, violando o objetivo "No-Code / Low-Code".

## 3. Estado das Automações Planeadas

| Automação | Status | Implementação Atual | Divergência |
|-----------|--------|---------------------|-------------|
| **1. Pedido → Notificação** | ⚠️ Parcial | Via Supabase Realtime (hardcoded). | Não permite regras condicionais (ex: "apenas se valor > X"). |
| **2. Estoque Baixo → Ação** | ❌ Ausente | Nenhuma lógica encontrada em `ProductsService` ou `OrdersService`. | Itens não são desativados automaticamente, nem gerentes notificados. |
| **3. Happy Hour** | ❌ Ausente | Não há agendador ou lógica de alteração de preço por horário. | - |
| **4. Upsell (IA)** | ❌ Ausente | Nenhuma lógica de recomendação baseada em carrinho. | - |
| **5. Reclamação → Resolução** | ❌ Ausente | Não há fluxo de feedback. | - |
| **6. Fechamento Diário** | ❌ Ausente | Não há jobs agendados (cron). | - |
| **7. Fidelidade** | ⚠️ Parcial | Implementado em `OrdersService.updateStatus` (`DELIVERED` -> `earnPoints`). | Lógica rígida no código, não configurável por tenant via workflow visual. |

## 4. Auditoria de UI (Frontend - Apps/Consumer)

Conforme `12-integracao-automacoes-ui.md`, a automação deve ser visível.

| Componente UI Planeado | Status | Observações |
|------------------------|--------|-------------|
| `SmartBadge` | ❌ Ausente | Necessário para destacar itens "Sugeridos pela IA". |
| `PriceTag` (Dinâmico) | ❌ Ausente | Componente atual é estático. Falta suporte a estados "price-up/down". |
| `SmartSuggestionCard` | ❌ Ausente | Crítico para o Upsell de carrinho. |
| `OrderReminderBanner` | ❌ Ausente | Necessário para recuperação de pedidos abandonados. |
| `PointsToast` | ❌ Ausente | Feedback visual de pontos ganhos não encontrado no consumer. |

## 5. Análise de Código (Deep Dive)

### `apps/api/src/orders/orders.service.ts`
Trecho identificado (Linhas 322-333):
```typescript
    if (status === 'DELIVERED' && order.userId) {
      try {
        await this.loyaltyService.earnPoints(...)
      } catch (error) { ... }
    }
```
**Problema:** A lógica de negócio está acoplada ao serviço de pedidos. Se quisermos mudar a regra (ex: ganhar pontos apenas acima de 10€), é necessário deploy de código.
**Recomendação:** Emitir um evento `ORDER_STATUS_CHANGED` e deixar um `LoyaltyListener` (ou Workflow Engine) reagir.

## 6. Plano de Ação Recomendado (Prioridade)

1.  **Fundação (Backend):**
    *   Criar módulo `WorkflowsModule` na API.
    *   Implementar `EventEmitter` interno robusto.
    *   Migrar a lógica de fidelidade para um *Listener* isolado como PoC.

2.  **UI Components (Frontend):**
    *   Criar componentes base no Design System (`SmartBadge`, `SmartSuggestion`).
    *   Documentar no Storybook.

3.  **Primeira Automação Real:**
    *   Implementar "Upsell Simples" (se produto X no carrinho, sugerir Y).
    *   Isso validará o fluxo completo (Gatilho -> Lógica -> UI).

---
**Assinatura:**
*Antigravity Agent - Automation Specialist*
