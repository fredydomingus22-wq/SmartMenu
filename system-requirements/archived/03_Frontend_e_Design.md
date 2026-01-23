# Frontend, UX e Design System

## 10. UX FLOWS (Wireframes Textuais)

### 10.1 Fluxo – Landing Page & Onboarding
1. Acesso à raíz (`/`)
2. Visualização de Hero (Conversão) e Funcionalidades
3. Clique em "Começar" ou "Login"
4. Redirecionamento inteligente (se logado -> Dashboard, se não -> Login)

### 10.2 Fluxo – Cliente (QR Code)
1. Scan QR da mesa (URL: `/menu/[id]?table=[number]`)
2. Validação de sessão (tenant + mesa)
3. Tela Menu:
   - Header: branding do restaurante + mesa (sticked)
   - Categorias em tabs horizontais
   - Cards de itens (Lazy loaded, animação de entrada)
4. Carrinho Inteligente:
   - Floating action button com contador
   - Lista persistente via Context + LocalStorage
   - Edição de quantidade diretamente no drawer
5. Checkout:
   - Revisão final
   - Campo de observações por item
   - Envio via POST (API confiável)
6. Confirmação:
   - Toast de sucesso
   - Limpeza automática do carrinho
   - Tela de status (Em breve: Real-time status)

### 10.2 Fluxo – Atendente / Caixa
1. Login
2. Tela "Pedidos Ativos"
3. Notificação sonora
4. Visualização por mesa
5. Atualizar status
6. Finalizar pedido / pagamento

### 10.3 Fluxo – Cozinha (KDS)
1. Login setor
2. Lista de pedidos por prioridade
3. Marcar preparo / pronto

### 10.4 Fluxo – Gerente
1. Login
2. Dashboard
3. Menu Management
4. Relatórios

---

## 14. DOCUMENTAÇÃO DE UI/UX – DESIGN SYSTEM OFICIAL

### 14.1 Objetivo do Design System
Criar **uniformidade visual, consistência funcional e escalabilidade** para todas as telas do sistema (cliente, atendente, cozinha, gerente e admin SaaS), servindo como **fonte única de verdade** para desenvolvimento, refatoração e adoção futura.

Princípios:
- Clareza > estética
- Mobile-first
- Acessível
- Performático
- Customizável por tenant (branding)

### 14.2 Stack de UI

**Base**
- **shadcn/ui** → componentes base
- **Radix UI** → primitives e acessibilidade
- **Tailwind CSS** → layout, espaçamento e tokens
- **Lucide Icons** → ícones

**Filosofia**
- shadcn = UI funcional e consistente
- Radix = comportamento e acessibilidade
- Tailwind = sistema de design (tokens)

### 14.3 Grid, Breakpoints e Responsividade

**Breakpoints Padrão**
- xs: < 640px (mobile)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Grid**
- Mobile: 4 colunas
- Tablet: 8 colunas
- Desktop: 12 colunas

Gutter padrão: **16px mobile / 24px desktop**

### 14.4 Espaçamentos (Spacing Scale)

Base: **4px (0.25rem)**

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px

Nunca usar valores fora da escala.

### 14.5 Tipografia

**Fontes**
- **Primary:** Inter
- **Fallback:** system-ui

**Escala Tipográfica**
- H1: 32px / semibold
- H2: 24px / semibold
- H3: 20px / medium
- Body: 14–16px / regular
- Caption: 12px

Line-height padrão: 1.4–1.6

### 14.6 Paleta de Cores (Base Neutra + Acento)

**Neutros**
- Background: #0F172A (dark) / #FFFFFF (light)
- Surface: #020617 / #F8FAFC
- Border: #1E293B
- Text Primary: #E5E7EB
- Text Secondary: #94A3B8

**Ações**
- Primary: #2563EB (azul)
- Success: #16A34A
- Warning: #F59E0B
- Error: #DC2626

Tenant pode customizar **Primary**.

### 14.7 Componentes Padrão (shadcn)

**Inputs**
- Input
- Textarea
- Select
- Checkbox
- Switch

**Feedback**
- Toast
- Alert
- Badge
- Tooltip

**Navegação**
- Tabs
- Breadcrumb
- DropdownMenu
- Pagination

**Data Display**
- Table
- Card
- Accordion

### 14.8 Componentes Customizados (Radix + shadcn)

**MenuItemCard**
- Image
- Name
- Price
- Badges (promo / esgotado)

**OrderStatusBadge**
- RECEIVED → cinza
- PREPARING → azul
- READY → verde
- CANCELLED → vermelho

**NotificationBanner**
- Ícone
- Texto curto
- CTA opcional

### 14.9 Estados de UI (Obrigatórios)

Todo componente deve prever:
- Default
- Hover
- Focus (acessibilidade)
- Active
- Disabled
- Loading
- Error

### 14.10 Regras de Tela por Perfil

**Cliente (QR)**
- Mobile-first
- Máx 2 ações primárias por tela
- Fonte ≥ 16px

**Cozinha (KDS)**
- Alto contraste
- Botões grandes
- Atualização em tempo real

**Gerente / Admin**
- Densidade média
- Tabelas com filtros
- Dashboards visuais

### 14.11 Temas e Customização por Tenant

- Logo
- Cor primária
- Nome do restaurante

Implementação via CSS variables:
```
--primary
--radius
--font
```

### 14.12 Checklist de Conformidade UI

- [ ] Usa componentes shadcn
- [ ] Respeita spacing scale
- [ ] Responsivo
- [ ] Estados completos
- [ ] Acessível
- [ ] Tema por tenant

---

## 15. GUIA DE UX WRITING & MICROCOPY PADRÃO

Objetivo: Criar **tom consistente e previsível** em todas as interações, facilitando compreensão, ação e confiança do usuário.

### 15.1 Princípios Gerais
- Curto, claro e direto (≤5 palavras para ações primárias)
- Evitar jargão técnico para clientes finais
- Uniformidade de verbos em ações similares
- Feedback imediato após ações
- Inclusão de contexto quando necessário

### 15.2 Exemplos de Microcopy por Contexto

**Cliente (QR Menu)**
- Botões: “Adicionar ao carrinho”, “Enviar pedido”, “Chamar atendente”, “Pedir conta”
- Estado de pedido: “Recebido”, “Em preparo”, “Pronto”, “Cancelado”
- Avisos: “Item esgotado”, “Selecione pelo menos 1 opção”

**Atendente / Cozinha**
- Notificação: “Novo pedido na mesa 8”
- Botões: “Marcar preparando”, “Pronto para entrega”, “Cancelar pedido”
- Alertas de estoque: “Estoque baixo: X unidades restantes”

**Gerente / Admin**
- Botões: “Adicionar Item”, “Atualizar Preço”, “Ativar/Desativar Item”
- Avisos: “Mudanças salvas com sucesso”, “Erro ao atualizar item”

### 15.3 Padrão de Tom
- Profissional, mas amigável
- Ação no presente: “Enviar”, “Marcar”, “Adicionar”
- Evitar negações complexas: usar positivo preferencialmente

---

## 16. PADRÕES DE ANIMAÇÃO E INTERAÇÃO (FRAMER MOTION)

Objetivo: Dar **feedback visual claro**, suavizar transições e aumentar percepção de qualidade.

### 16.1 Princípios
- Suave e rápida (0.2–0.3s para micro-interações)
- Coerente entre componentes iguais
- Não distrair ou atrasar fluxo crítico
- Suportar prefers-reduced-motion (acessibilidade)

### 16.2 Exemplos de Uso

**Botões e Cards**
- Hover: leve escala 1.05 + sombra sutil
- Click: depressão visual 0.95 scale + feedback ripple opcional

**Notificações / Toasts**
- Entrar: slide from top + fadeIn
- Sair: fadeOut + scaleDown

**Modals / Overlays**
- FadeIn + slideUp suave
- FadeOut + slideDown ao fechar

**Listas / Tables**
- Item adicionado: slideIn da direita
- Item removido: slideOut da esquerda

### 16.3 Tokens de Animação (Implementados)
- **FadeIn:** `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` (Cards de Menu)
- **SlideUp:** `initial={{ y: 20 }} animate={{ y: 0 }}` (Listas)
- **ScaleDown:** `whileTap={{ scale: 0.95 }}` (Botões)

### 16.4 Primitives (Componentes)
- **MenuGrid:** Container animado que orquestra a entrada sequencial (staggered) de categorias e produtos.

---

## 17. STORYBOOK – DOCUMENTAÇÃO VIVA DE COMPONENTES

Objetivo: Ter **uma referência visual e interativa de todos os componentes do sistema**, incluindo estados, variantes, microcopy e animações, pronta para integração e QA.

### 17.1 Estrutura do Storybook

**Pastas e Componentes**
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

### 17.2 Configuração do Storybook
- Framework: **Next.js + React**
- Addons:
  - @storybook/addon-essentials
  - @storybook/addon-interactions
  - @storybook/addon-a11y
  - @storybook/addon-controls
- Preview.js:
  - Carrega Tailwind CSS + shadcn UI theme
  - Aplica CSS Variables para temas por tenant

### 17.3 Component Stories
- **PrimaryButton.stories.tsx**
  - Variantes: Default, Hover, Active, Disabled, Loading
  - Props controls: tamanho, cor, label, ícone
- **MenuItemCard.stories.tsx**
  - Estado: Disponível, Esgotado, Promoção
  - Animação: hover scale + shadow
- **OrderStatusBadge.stories.tsx**
  - Estados: RECEIVED, PREPARING, READY, CANCELLED
- **NotificationBanner.stories.tsx**
  - Tipos: success, error, info, warning
  - Apresenta animação de entrada/saída (slide + fade)

### 17.4 Integração com Tokens de Design
- Usar **spacing scale**, cores e tipografia definidos no Design System
- Exemplo:
  ```ts
  <PrimaryButton size="lg" color="primary">Enviar Pedido</PrimaryButton>
  ```
- Todos os componentes refletem o **tema do tenant** automaticamente

### 17.5 Benefícios
- Documentação viva e interativa
- Visualização de estados e animações
- Facilita QA e testes de UI
- Reduz inconsistência entre devs e telas
- Base para novas features ou refatoração rápida

### 17.6 Próximos Passos Storybook
1. Implementar stories para todos os componentes shadcn customizados
2. Configurar Knobs / Controls para testar variantes em tempo real
3. Configurar Docs add-on para cada componente com guidelines UX Writing
4. Publicar Storybook como site interno ou deploy preview
