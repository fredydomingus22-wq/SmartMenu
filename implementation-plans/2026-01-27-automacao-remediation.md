# Plano de Remediação: Automação e Inteligência Artificial

**Data:** 27/01/2026
**Responsável:** Automation Specialist
**Status:** ✅ Fase 1-3 Concluídas

---

## 🎯 Objetivo
Transformar a arquitetura atual (acoplada e rígida) numa base **orientada a eventos** que permita a criação ágil de automações.

---

## ✅ Fase 1: Arquitetura Orientada a Eventos (CONCLUÍDA)

### Implementação Realizada

| Tarefa | Status | Ficheiro |
|--------|--------|----------|
| Instalar `@nestjs/event-emitter` | ✅ | `package.json` |
| Configurar `EventEmitterModule` | ✅ | `app.module.ts` |
| Criar `WorkflowsModule` | ✅ | `workflows/workflows.module.ts` |
| Definir eventos tipados | ✅ | `workflows/events/*.ts` |
| Criar `OrderEventsListener` | ✅ | `workflows/listeners/order-events.listener.ts` |
| Criar `StockEventsListener` | ✅ | `workflows/listeners/stock-events.listener.ts` |
| Refatorar `OrdersService` | ✅ | `orders/orders.service.ts` |
| Build de validação (API) | ✅ | `Exit code: 0` |

### Critérios de Aceite Resolvidos

- [x] `OrdersService` **não importa** `LoyaltyService` para conceder pontos (usa eventos)
- [x] Existe um `Logger` que regista "Event received: order.status.updated"
- [x] Build compila sem erros

---

## ✅ Fase 2: Serviço de Upsell (CONCLUÍDA)

### Implementação Realizada

| Tarefa | Status | Ficheiro |
|--------|--------|----------|
| Criar `UpsellService` | ✅ | `workflows/services/upsell.service.ts` |
| Endpoint público `/public/suggestions` | ✅ | `workflows/suggestions.controller.ts` |
| Lógica baseada em `ProductUpsell` | ✅ | Usa relações existentes no schema |
| Fallback para "Best Sellers" | ✅ | Se não houver upsells configurados |

### Endpoint Disponível

```http
GET /public/suggestions/:tenantId/upsell?products=id1,id2
```

---

## ✅ Fase 3: Integração Frontend (CONCLUÍDA)

### Componentes Criados

| Componente | Ficheiro | Descrição |
|------------|----------|-----------|
| `SmartBadge` | `components/automation/smart-badge.tsx` | Badge animado para "Sugestão IA", "Mais Pedido", etc. |
| `UpsellSection` | `components/automation/upsell-section.tsx` | Seção de sugestões de upsell no carrinho |
| `PointsEarnedToast` | `components/automation/points-earned-toast.tsx` | Toast animado "+X pontos ganhos" |
| Barrel Export | `components/automation/index.ts` | Exportação organizada |

### Integração no CartSheet

- [x] `UpsellSection` integrado após listagem de itens do carrinho
- [x] Busca automática de sugestões via API `/public/suggestions`
- [x] UI premium com gradientes e animações Framer Motion
- [x] Build validação (Consumer) | ✅ | `Exit code: 0`

### Estrutura de Ficheiros Frontend

```
apps/consumer/components/automation/
├── index.ts
├── points-earned-toast.tsx
├── smart-badge.tsx
└── upsell-section.tsx
```

---

## 📋 Fase 4: Workflow Visual (FUTURO)

### Objetivo
Permitir que tenants configurem automações sem código via painel admin.

### Schema Prisma (Proposta)

```prisma
model Workflow {
  id          String   @id @default(uuid())
  tenantId    String
  name        String
  isActive    Boolean  @default(true)
  triggers    WorkflowTrigger[]
  actions     WorkflowAction[]
}

model WorkflowTrigger {
  id         String   @id @default(uuid())
  workflowId String
  event      String   // e.g., "order.created", "stock.low"
  conditions Json?    // e.g., { "total": { "gte": 50 } }
}

model WorkflowAction {
  id         String   @id @default(uuid())
  workflowId String
  type       String   // e.g., "notify", "updateProduct", "sendEmail"
  config     Json     // e.g., { "channel": "whatsapp", "template": "..." }
  order      Int      @default(0)
}
```

---

## 📊 Resumo de Progresso

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Arquitetura Orientada a Eventos (Backend) | ✅ Concluída |
| 2 | Serviço de Upsell (Backend) | ✅ Concluída |
| 3 | Integração Frontend (Consumer App) | ✅ Concluída |
| 4 | Workflow Visual (Admin) | 📅 Futuro |

---

## 🏗️ Ficheiros Criados/Modificados

### Backend (API)
```
apps/api/src/
├── app.module.ts                          # EventEmitterModule + WorkflowsModule
├── orders/orders.service.ts               # Refatorado para emitir eventos
└── workflows/
    ├── workflows.module.ts
    ├── suggestions.controller.ts          # GET /public/suggestions/:tenantId/upsell
    ├── events/
    │   ├── index.ts
    │   ├── order-created.event.ts
    │   ├── order-status-updated.event.ts
    │   └── stock-low.event.ts
    ├── listeners/
    │   ├── order-events.listener.ts       # Loyalty automation
    │   └── stock-events.listener.ts       # Stock automation
    └── services/
        └── upsell.service.ts              # AI-powered suggestions
```

### Frontend (Consumer)
```
apps/consumer/components/
├── automation/
│   ├── index.ts
│   ├── points-earned-toast.tsx
│   ├── smart-badge.tsx
│   └── upsell-section.tsx
└── cart/
    └── cart-sheet.tsx                     # Integrado UpsellSection
```

---

**Documento de Plano de Remediação - Automação SmartMenu**
