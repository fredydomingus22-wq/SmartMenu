# Storybook – SmartMenu

## 17. Storybook – Documentação Viva de Componentes

**Objetivo:** Ter uma referência visual e interativa de todos os componentes do sistema.

---

### 17.1 Estrutura do Storybook

```
src/components/
├─ buttons/
│   ├─ PrimaryButton.tsx
│   ├─ SecondaryButton.tsx
│   └─ IconButton.tsx
├─ inputs/
│   ├─ Input.tsx
│   ├─ Textarea.tsx
│   └─ Select.tsx
├─ cards/
│   ├─ MenuItemCard.tsx
│   ├─ OrderCard.tsx
│   └─ NotificationBanner.tsx
├─ badges/
│   └─ OrderStatusBadge.tsx
├─ layout/
│   ├─ Grid.tsx
│   ├─ Container.tsx
│   └─ Modal.tsx
└─ storybook/
    └─ preview.tsx
```

---

### 17.2 Configuração do Storybook

- **Framework:** Next.js + React
- **Addons:**
  - @storybook/addon-essentials
  - @storybook/addon-interactions
  - @storybook/addon-a11y
  - @storybook/addon-controls
- **Preview.js:**
  - Carrega Tailwind CSS + shadcn UI theme
  - Aplica CSS Variables para temas por tenant

---

### 17.3 Component Stories

| Componente | Estados/Variantes |
|------------|-------------------|
| PrimaryButton | Default, Hover, Active, Disabled, Loading |
| MenuItemCard | Disponível, Esgotado, Promoção |
| OrderStatusBadge | RECEIVED, PREPARING, READY, CANCELLED |
| NotificationBanner | success, error, info, warning |

---

### 17.4 Integração com Tokens de Design

```tsx
<PrimaryButton size="lg" color="primary">Enviar Pedido</PrimaryButton>
```

Todos os componentes refletem o **tema do tenant** automaticamente.

---

### 17.5 Benefícios

- Documentação viva e interativa
- Visualização de estados e animações
- Facilita QA e testes de UI
- Reduz inconsistência entre devs e telas
- Base para novas features ou refatoração rápida

---

### 17.6 Próximos Passos Storybook

1. Implementar stories para todos os componentes shadcn customizados
2. Configurar Knobs / Controls para testar variantes em tempo real
3. Configurar Docs add-on para cada componente com guidelines UX Writing
4. Publicar Storybook como site interno ou deploy preview

---

**Documento de referência para Storybook do SmartMenu.**
