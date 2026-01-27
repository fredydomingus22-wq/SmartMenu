# Arquitetura Completa: Motor de Automação SmartMenu

**Data:** 27/01/2026
**Versão:** 1.0
**Status:** ✅ Implementado (Fase 1)

---

## 1. Visão Geral da Arquitetura

O SmartMenu implementa uma **Arquitetura Orientada a Eventos (Event-Driven Architecture)** para desacoplar lógica de negócio e permitir automações escaláveis.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SmartMenu API                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────┐    ┌──────────────────────┐ │
│  │  Services   │───▶│  EventEmitter   │───▶│  WorkflowsModule     │ │
│  │ (Orders,    │    │  (NestJS)       │    │  ┌────────────────┐  │ │
│  │  Products)  │    │                 │    │  │   Listeners    │  │ │
│  └─────────────┘    └─────────────────┘    │  │ ─────────────  │  │ │
│                                             │  │ • Order Events │  │ │
│                                             │  │ • Stock Events │  │ │
│                                             │  └────────────────┘  │ │
│                                             │  ┌────────────────┐  │ │
│                                             │  │   Services     │  │ │
│                                             │  │ ─────────────  │  │ │
│                                             │  │ • Upsell       │  │ │
│                                             │  └────────────────┘  │ │
│                                             └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes Implementados

### 2.1. Event System (`@nestjs/event-emitter`)

**Ficheiro:** `apps/api/src/app.module.ts`

O `EventEmitterModule.forRoot()` inicializa o barramento de eventos interno.

### 2.2. Eventos Definidos

| Evento | Ficheiro | Payload |
|--------|----------|---------|
| `order.status.updated` | `events/order-status-updated.event.ts` | `orderId, tenantId, userId, status, total` |
| `order.created` | `events/order-created.event.ts` | `orderId, tenantId, userId, items[], total` |
| `stock.low` | `events/stock-low.event.ts` | `productId, tenantId, currentStock, threshold` |

### 2.3. Listeners (Automações)

| Listener | Evento | Ação |
|----------|--------|------|
| `OrderEventsListener` | `order.status.updated` | Se `DELIVERED`, chama `LoyaltyService.earnPoints()` |
| `StockEventsListener` | `stock.low` | Se `stock <= 0`, desativa produto (`isAvailable = false`) |

### 2.4. Serviços de Automação

| Serviço | Endpoint Público | Descrição |
|---------|------------------|-----------|
| `UpsellService` | `GET /public/suggestions/:tenantId/upsell?products=...` | Retorna sugestões de upsell baseadas no carrinho |

---

## 3. Fluxo de Dados

### 3.1. Fluxo: Pedido Entregue → Pontos de Fidelidade

```
OrdersService.updateStatus(DELIVERED)
       │
       ▼
eventEmitter.emit('order.status.updated', OrderStatusUpdatedEvent)
       │
       ▼
OrderEventsListener.handleOrderStatusUpdated()
       │
       ▼
LoyaltyService.earnPoints()
```

### 3.2. Fluxo: Estoque Baixo → Desativar Produto

```
(Futuro: ProductsService ou OrdersService após venda)
       │
       ▼
eventEmitter.emit('stock.low', StockLowEvent)
       │
       ▼
StockEventsListener.handleStockLow()
       │
       ▼
prisma.product.update({ isAvailable: false })
```

---

## 4. Estrutura de Ficheiros

```
apps/api/src/workflows/
├── events/
│   ├── index.ts                       # Barrel export
│   ├── order-created.event.ts
│   ├── order-status-updated.event.ts
│   └── stock-low.event.ts
├── listeners/
│   ├── order-events.listener.ts       # Loyalty automation
│   └── stock-events.listener.ts       # Stock automation
├── services/
│   └── upsell.service.ts              # Upsell suggestions
├── suggestions.controller.ts           # Public API
└── workflows.module.ts                 # Module definition
```

---

## 5. Próximos Passos (Fase 2)

1. **Emitir `stock.low`:** Integrar com `OrdersService` após cada venda para verificar níveis de stock.
2. **Notificações:** Criar `NotificationListener` para enviar alertas via WebSocket/Push.
3. **Workflow Visual (Fase 3):** Criar tabelas `workflows`, `workflow_triggers`, `workflow_actions` para configuração dinâmica por tenant.

---

## 6. Endpoints Disponíveis

### Upsell Suggestions
```http
GET /public/suggestions/:tenantId/upsell?products=productId1,productId2
```

**Response:**
```json
[
  {
    "productId": "uuid",
    "name": "Coca-Cola 350ml",
    "price": 3.50,
    "imageUrl": "https://...",
    "reason": "Combina bem com seu pedido"
  }
]
```

---

**Documento de Arquitetura do Motor de Automação SmartMenu.**
