# Integração das Automações com Design System & Storybook

## Objetivo

Garantir que todas as automações inteligentes tenham representação visual, estados de UI, microcopy e animações padronizadas, documentadas no Storybook.

---

## 🧠 Princípio-chave

> *Automação que não aparece na UI é bug.*
> Toda automação deve refletir feedback claro, sutil e confiável para o utilizador.

---

## 🧩 Mapeamento: Automações → Componentes UI

### 1️⃣ Reordenação Inteligente do Menu (IA)

| Aspecto | Detalhes |
|---------|----------|
| **Automação** | `MENU_VIEWED → reorderMenu()` |
| **Componentes** | `MenuGrid`, `MenuItemCard`, `SmartBadge` |
| **Estados** | default, reordered-by-ai, highlight-transition |
| **Animação** | fade + slide suave (y: 6px → 0), 0.25s |
| **Microcopy** | "Sugestões pensadas para si" |

### 2️⃣ Precificação Dinâmica

| Aspecto | Detalhes |
|---------|----------|
| **Automação** | `TIME_SLOT_REACHED | LOW_STOCK` |
| **Componentes** | `PriceTag`, `PriceDelta` |
| **Estados** | static, price-up, price-down |
| **Microcopy** | "Promo ativa", "Alta procura" |

### 3️⃣ Upsell / Cross-sell Inteligente

| Aspecto | Detalhes |
|---------|----------|
| **Automação** | `ITEM_ADDED_TO_CART` |
| **Componentes** | `SmartSuggestionCard`, `AddToOrderCTA` |
| **Estados** | suggested, accepted, dismissed |
| **UX Rule** | Máximo 1 sugestão por interação |

### 4️⃣ Abandono de Pedido

| Aspecto | Detalhes |
|---------|----------|
| **Automação** | `ORDER_STARTED → idle` |
| **Componentes** | `OrderReminderBanner` |
| **Estados** | idle-warning, incentive |
| **Microcopy** | "Seu pedido está quase pronto", "Finalizar agora" |

### 5️⃣ Bloqueio Automático de Itens

| Aspecto | Detalhes |
|---------|----------|
| **Automação** | `LOW_STOCK_DETECTED` |
| **Componentes** | `MenuItemCard (disabled)`, `AlternativeSuggestion` |
| **Microcopy** | "Indisponível no momento", "Experimente este" |

### 6️⃣ Feedback Loop (Aprendizado)

| Aspecto | Detalhes |
|---------|----------|
| **Automação** | `ORDER_CONFIRMED` |
| **Componentes** | `TelemetryIndicator` (dev-only) |
| **Storybook** | Documentado como *non-visual automation* |
 
+### 7️⃣ Sistema de Fidelidade (Club de Pontos)
+
+| Aspecto | Detalhes |
+|---------|----------|
+| **Automação** | `ORDER_FINALIZED → updatePoints()` |
+| **Componentes** | `LoyaltyBalanceCard`, `PointsToast` |
+| **Animação** | Contador numérico incrementando, Confete (opcional) |
+| **Microcopy** | "+ 150 pontos acumulados!" |
+| **Feature Flag** | `loyalty.club.enabled` |
+
 ---
 
 ## 📚 Storybook – Estrutura Final

---

## 📚 Storybook – Estrutura Final

```
/storybook
 ├── Menu
 │   ├── MenuGrid.stories.tsx
 │   ├── MenuItemCard.stories.tsx
 │   └── SmartBadge.stories.tsx
 ├── Pricing
 │   └── PriceTag.stories.tsx
 ├── Automation
 │   ├── Upsell.stories.tsx
 │   ├── Abandonment.stories.tsx
 │   └── DisabledItems.stories.tsx
 ├── Motion
 │   └── Transitions.stories.tsx
```

---

## 🔐 Multi-Tenant & Feature Flags (UI)

Cada automação possui flags:
- `automation.menu.reorder`
- `automation.dynamic.pricing`
- `automation.smart.upsell`

---

**Documento de referência para integração de automações com UI do SmartMenu.**
