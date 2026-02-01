# Design System – SmartMenu

## 🧱 Arquitetura Oficial de Layout — SmartMenu

### 🎯 Princípios Inegociáveis

Estas regras são **lei do sistema**:

* Mobile-first sempre
* Um único scroll principal
* Layout ≠ UI
* Componentes não conhecem viewport
* Estados reagem ao breakpoint
* Zero hacks visuais

### 🏗️ Estrutura Oficial de Layout

#### 📦 Camada 1 — AppShell (obrigatória)

Responsável por:
* viewport
* safe-area
* navegação
* scroll

```tsx
<AppShell>
  <Header />
  <MainScrollArea>
    <PageContainer>
      {children}
    </PageContainer>
  </MainScrollArea>
  <BottomBar /> {/* mobile only */}
</AppShell>
```

**Regras do AppShell:**
* `min-height: 100dvh`
* **NUNCA** `100vh`
* `overflow: hidden` só aqui
* Safe-area respeitada (`env(safe-area-inset-*)`)

#### 📄 Camada 2 — PageContainer

Responsável por:
* largura máxima
* padding responsivo
* alinhamento

```css
max-width: 1280px;
padding-inline: var(--spacing-page);
margin: 0 auto;
```

**Página nunca:**
* define grid global
* define scroll
* define height fixa

#### 🧩 Camada 3 — Layout Primitives

Componentes estruturais reutilizáveis:

| Componente | Função |
| ---------- | ------------------- |
| `Stack` | layout vertical |
| `Inline` | layout horizontal |
| `Grid` | layout responsivo |
| `Spacer` | respiro consistente |

**UI components só usam esses primitivos.**

#### 🎛️ Camada 4 — UI Components (Shadcn/Radix)

Exemplos:
* Card
* Button
* Badge
* ListItem

**UI components:**
* não definem largura fixa
* não usam `position: fixed`
* não usam viewport units
* são 100% contidos pelo layout

---

## 📘 Guia Interno de Layout & UI (SmartMenu)

### 📐 Tokens Oficiais (Design System)

#### Spacing (fluido)

```css
--space-xs: clamp(4px, 1vw, 8px);
--space-sm: clamp(8px, 2vw, 12px);
--space-md: clamp(12px, 3vw, 16px);
--space-lg: clamp(16px, 4vw, 24px);
```

#### Tipografia

* Base: `1rem`
* Nunca `px` em texto
* Line-height mínimo: `1.4`

#### Touch targets (mobile)

* Mínimo: **44px**
* Botões nunca colados
* Estados ativos claros

### 📱 Breakpoints Oficiais

```css
sm: 0–639px
md: 640–1023px
lg: 1024–1279px
xl: 1280px+
```

**Nunca criar breakpoint fora deste padrão.**

### 🧠 Estados Conscientes de Viewport

Exemplo:
* Sidebar aberta no desktop → **fecha automaticamente** no mobile
* Drawer mobile → não existe no desktop

**Estado + layout sempre sincronizados.**

### 🚫 Práticas Proibidas (Regra Interna)

❌ `width: 100vw`
❌ `height: 100vh`
❌ `position: fixed` em UI (use `sticky` ou `absolute` contido)
❌ `min-width` em cards (use `grow/shrink`)
❌ **Imagens controlando altura do container** (use `aspect-ratio` + `max-height`)
❌ **Conteúdo sem container** (texto fora de `<PageContainer>` ou `<Section>`)

**Violou → PR bloqueado.**

---

### 🎭 Hero & Banner Contract (Padrão Ouro)

Todo componente de destaque (Hero) deve seguir este contrato:

| Propriedade | Mobile | Desktop |
| :--- | :--- | :--- |
| `Aspect Ratio` | **4:5** ou **1:1** | **21:9** ou **4:1** |
| `Max Height` | **50vh** ou **60vh** | **400px** ou **500px** |
| `Containment` | `overflow-hidden` | `overflow-hidden` |
| `Content Overlay` | Bottom aligned, max 60% w | Bottom-left aligned, max 40% w |

**Objetivo:** Garantir que o conteúdo secundário (Título da Loja, Botões de Ação) esteja visível **above the fold**.

---

## ✅ Checklist Oficial de PR — SmartMenu

### 🧱 Arquitetura
* [ ] Usa AppShell
* [ ] Respeita PageContainer
* [ ] Um único scroll
* [ ] Sem viewport units proibidas

### 📐 Responsividade
* [ ] Testado em mobile real
* [ ] Sem scroll horizontal
* [ ] Layout colapsa verticalmente
* [ ] Safe-area respeitada

### 🧩 UI & Design System
* [ ] Usa tokens oficiais
* [ ] Tipografia em rem
* [ ] Touch targets ≥ 44px
* [ ] Componentes não quebram isolados

### 🧠 Estado & Navegação
* [ ] Estados reagem a breakpoint
* [ ] Drawer / Sidebar resetam corretamente
* [ ] Sem estado "vazando" de desktop → mobile

### ⚡ Performance & Estabilidade
* [ ] Sem layout shift (CLS)
* [ ] Skeletons estáveis
* [ ] Imagens responsivas
* [ ] Nenhum reflow desnecessário

### 🧪 Testes Mínimos
* [ ] Android Chrome
* [ ] iOS Safari
* [ ] Rotação
* [ ] Teclado virtual
* [ ] Zoom 125%

---

---

## 13. Modelo de Governança do Design System (Federado)

### 13.1 Visão Geral
Adotamos um modelo **Federado** para garantir agilidade e consistência.
*   **Core Team (Arquitetura):** Mantém os "Primitives" (Tokens, Layouts, Componentes Base).
*   **Product Teams (Features):** Criam e mantêm "Composite Components" específicos de domínio.

### 13.2 Papéis e Responsabilidades

| Papel | Responsabilidade | Exemplos |
| :--- | :--- | :--- |
| **Maintainers (Core)** | Definir tokens, regras de layout, manter `components/ui` (shadcn). | Atualizar cor primária, corrigir bug no Button. |
| **Contributors (Product)** | Criar componentes de negócio, propor novos primitives via RFC. | Criar `KDSOrderCard`, `MenuGrid`. |
| **Consumers (Devs)** | Usar componentes existentes sem "ejectar" ou hackear estilos. | Usar `<Button>` na tela de Login. |

### 13.3 Fluxo de Contribuição (RFC)
1.  **Identificação:** Time precisa de um componente novo.
2.  **Verificação:** Existe algo similar no System?
    *   *Sim:* Usa ou propõe melhoria.
    *   *Não:* Cria no projeto local (`app/_components`).
3.  **Promoção (Opcional):** Se o componente for útil para outros apps:
    *   Abre PR para mover para `packages/design-system` (futuro).
    *   Revisão pelos Maintainers.

### 13.4 Regras de Ouro
1.  **Separação Estrita:** Componentes de UI **nunca** definem margens externas. Quem define o espaço é o **Layout Component** pai (`Stack`, `Grid`).
2.  **Tokens First:** Nunca use hardcoded hex values (`#fff`). Use `bg-background`.
3.  **Sem Business Logic:** Componentes do Design System recebem dados via props, não fazem fetch.

---

## 14. Documentação de UI/UX – Design System Oficial


### 14.1 Objetivo

Criar **uniformidade visual, consistência funcional e escalabilidade** para todas as telas do sistema.

**Princípios:**
- Clareza > estética
- Mobile-first
- Acessível
- Performático
- Customizável por tenant (branding)

---

## 14.2 Stack de UI

| Tecnologia | Uso |
|------------|-----|
| shadcn/ui | Componentes base |
| Radix UI | Primitives e acessibilidade |
| Tailwind CSS | Layout, espaçamento e tokens |
| Lucide Icons | Ícones |

---

## 14.2.1 Separação: Layout Components vs UI Components

Para manter a arquitetura limpa e evitar acoplamento, seguimos uma separação rigorosa:

### Layout Components
**Responsabilidade:** Estrutura, posicionamento e fluxo de layout. Nunca contêm lógica de negócio ou estilização visual específica.

**Exemplos:**
- `AppShell`: Container principal com header/main/footer
- `PageContainer`: Wrapper de página com padding responsivo
- `ContentArea`: Área de conteúdo scrollável
- `Stack`: Layout vertical/horizontal com gap
- `GridSystem`: Sistema de grid responsivo

**Regras:**
- Não assumem viewport (usam classes fluidas)
- Não contêm cores ou tipografia específica
- São agnósticos ao conteúdo
- Usam apenas spacing tokens fluidos

### UI Components
**Responsabilidade:** Elementos visuais específicos, interações e apresentação de dados.

**Exemplos:**
- `Card`: Container com sombra e bordas
- `Button`: Elemento clicável com variantes
- `ProductCard`: Exibição de produto com imagem/preço
- `Badge`: Indicador visual
- `Input`: Campo de entrada

**Regras:**
- Não controlam layout global
- Não definem width/height fixos
- Usam tokens de design system
- São compostos usando Layout Components quando necessário

**Exemplo de Composição Correta:**
```tsx
// ❌ Errado: UI Component assumindo layout
<Card className="w-full max-w-md mx-auto p-4">
  <Content />
</Card>

// ✅ Correto: Layout + UI separados
<PageContainer>
  <Card className="p-4">
    <Content />
  </Card>
</PageContainer>
```

---

## 14.3 Grid, Breakpoints e Responsividade

### Breakpoints Padrão
- **xs:** < 640px (mobile)
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Grid
- Mobile: 4 colunas
- Tablet: 8 colunas
- Desktop: 12 colunas

**Gutter:** 16px mobile / 24px desktop

---

## 14.4 Espaçamentos (Spacing Scale)

Base: **4px (0.25rem)**

| Token | Valor | Fluido (Mobile-First) |
|-------|-------|----------------------|
| xs | 4px | `clamp(4px, 1vw, 8px)` |
| sm | 8px | `clamp(8px, 2vw, 12px)` |
| md | 12px | `clamp(12px, 3vw, 16px)` |
| lg | 16px | `clamp(16px, 4vw, 24px)` |
| xl | 24px | `clamp(24px, 5vw, 32px)` |
| 2xl | 32px | `clamp(32px, 6vw, 48px)` |
| 3xl | 48px | `clamp(48px, 8vw, 64px)` |

**Uso:** Prefira tokens fluidos para layouts responsivos. Use valores fixos apenas para elementos críticos.

---

## 14.5 Tipografia

| Elemento | Tamanho | Peso |
|----------|---------|------|
| H1 | 32px | semibold |
| H2 | 24px | semibold |
| H3 | 20px | medium |
| Body | 14–16px | regular |
| Caption | 12px | regular |

**Fontes:** Inter (primary), system-ui (fallback)

---

## 14.6 Paleta de Cores

### Neutros
| Token | Dark | Light |
|-------|------|-------|
| Background | #0F172A | #FFFFFF |
| Surface | #020617 | #F8FAFC |
| Border | #1E293B | - |
| Text Primary | #E5E7EB | - |
| Text Secondary | #94A3B8 | - |

### Ações
| Token | Cor | OKLCH (Ref) |
|-------|-----|-------------|
| Primary | Orange | `0.6 0.22 45` |
| Secondary | Red/Muted | `0.97 0 0` |
| Destructive | Red | `0.577 0.245 27.325` |

### Glassmorphism (Premium)
| Token | Style |
|-------|-------|
| Glass Surface | `bg-white/10 dark:bg-black/40 backdrop-blur-xl border-white/10` |
| Glass Card | `bg-white/5 dark:bg-zinc-900/40 backdrop-blur-md border border-white/10` |
| Glass Glow | `shadow-[0_0_20px_rgba(37,99,235,0.1)]` |

---

## 14.7 Componentes Padrão (shadcn)

### Inputs
Input, Textarea, Select, Checkbox, Switch

### Feedback
Toast, Alert, Badge, Tooltip

### Navegação
Tabs, Breadcrumb, DropdownMenu, Pagination

### Data Display
Table, Card, Accordion

---

## 14.8 Componentes Customizados

### MenuItemCard (Vitrine)
- **Aspect Ratio:** 1:1 (Square)
- **Dimensões Mobile:** 160px – 180px de largura (Grid 2 colunas).
- **Dimensões Desktop:** 240px – 280px de largura (Grid 4-5 colunas).
- **Conteúdo:** 
  - Imagem (70-80% do card)
  - Nome (font-medium text-base, max 2 lines)
  - Preço (font-bold text-lg, bottom aligned)
  - Badges: Canto superior esquerdo (`top-2 left-2`)

### Home/Menu Sections (Shopify-Style)
- **Hero Section:** Banner de destaque (full width ou container).
- **Feature Section:** Grid horizontal (scroll) ou vertical para "Mais Vendidos".
- **Category Section:** Grid padrão intercalado com banners informativos.

### Product Detail Page (PDP) Sections
- **Main Content:** Hero (Gallery) + Purchase info.
- **Upsell Section:** Banner horizontal "Melhore seu pedido" (ex: adicionar combo).
- **Detailed Info:** Accordion (Descrição, Alergênicos).
- **Recommendations:** Grid "Pessoas também pediram".
- **Global Footer:** Informações fixas no final da página.

### OrderStatusBadge
- RECEIVED → cinza
- PREPARING → azul
- READY → verde
- CANCELLED → vermelho

### NotificationBanner
- Ícone, Texto curto, CTA opcional

### LoyaltyBalanceCard
- Display do saldo atual, Barra de progresso para a próxima recompensa, Histórico recente.

### RewardItemCard
- Visual similar ao MenuItemCard, mas exibe o custo em pontos em destaque e botão "Resgatar".

### BI & Analytics Components (Advanced)
- **Heatmap (Peak Hours):** Grid of 24 cells (hours) x 7 days. Intensity based on CSS opacity (e.g., `bg-primary/20` to `bg-primary`).
- **Ranking Boards:** Modern table without borders, high-contrast typography for positions 1-3.
- **Metric Grids:** 3+ columns on desktop, 1 column on mobile with horizontal scroll for overflow if critical.

### Mobile Gestures & Patterns
- **Swipe-to-Action:** Right-to-left swipe on ListItems to reveal status change buttons (blue/green).
- **BottomSheet Details:** All deep data (Order details, Customer BI) must open in a `Vaul` (Drawer) component on mobile.
- **Faceted Filters:** Horizontal scrollable list (Inline) of filter chips/badges above the list.

### ProductDetailSheet
- **Header:** Botão de fechar, nome do item fixo ao rolar.
- **Hero:** `ProductGallery` em destaque.
- **Body:** 
  - Descrição detalhada.
  - Seção "Extras / Adicionais": Lista de `ProductOptionValue` com preço e seletor.
  - Seção "Preferências / Remoções": Campo de texto ou checklist para "Sem [x]".
- **Footer:** Botão "Adicionar ao Carrinho" fixo com somatório (Preço Base + Extras).

### KDSOrderCard
- **Layout Mobile:** Full-width (100%), empilhado verticalmente.
- **Layout Tablet:** Grid de 3 ou 4 colunas dependendo da orientação.
- **Touch Targets:** Botões de ação com altura mínima de **48px** (padrão "Fat Finger").
- **Tipografia:** Tamanhos aumentados em 20% para legibilidade à distância (3 metros).
- **Contraste:** Fundo de card de pedido com borda colorida grossa (4px) indicando status (Amarelo=Atrasado).
- **Conteúdo:** Resumo do pedido: Itens, Quantidade, Observações críticas.
- **Timer:** Cronômetro com mudança de cor (Verde -> Amarelo -> Vermelho).

### ProductOptionGroup
- Seletor visual para opções (Rádio para escolha única, Checkbox para múltipla).
- Sinalização visual de item obrigatório.
- Exibição de preço adicional (+R$ X,XX) ao lado da opção.

### ConsumerLandingComponents
#### QRScannerOverlay
- **Visual:** Fundo escurecido (black/80) com frame central transparente (square).
- **Feedback:** Linha de scan animada (moving up/down).
- **Ação:** Toque fora para cancelar. Habilita lanterna se suportado.

#### RecentRestaurantCard
- **Visual:** Layout horizontal compacta (60px height).
- **Conteúdo:** Avatar circular (logo), Título (semiblold), Subtítulo (muted).
- **Interação:** Toque redireciona para `/menu/[tenantId]`.

#### GlobalLoyaltySummary
- **Visual:** Card com gradiente sutil, ícone de estrela.
- **Conteúdo:** "Você tem X pontos em Y restaurantes".
- **CTA:** "Ver todos".

Todo componente deve prever:
- Default
- Hover
- Focus (acessibilidade)
- Active
- Disabled
- Loading
- Error
- Empty State (Placeholder visual)

### 14.9.1 Micro-interactions
| Interaction | Motion |
|-------------|--------|
| **Hover Card** | `scale: 1.02`, `shadow: xl`, `duration: 0.2s` |
| **Hover Button**| `scale: 1.05`, `brightness: 1.1` |
| **Tap/Click** | `scale: 0.98`, `duration: 0.1s` |
| **Focus** | `outline-2`, `outline-primary`, `outline-offset-2` |

---

## 14.10 Layout e Containment

### ScrollArea (Padrão de Formulário)
Todo formulário que exceda 60% da altura da viewport ou contenha mais de 8 campos deve ser encapsulado em um `ScrollArea`.
- **Ancoragem:** Botões de ação (Salvar/Cancelar) devem permanecer fixos no rodapé da página ou modal.

### Transições de Página (Framer Motion)
Para CRUDs em páginas dedicadas, utilizar transições de "Slide" ou "Fade" suaves para manter o contexto espacial.
- **Entrada:** Slide da direita (X: 100% → 0).
- **Saída:** Slide para a esquerda ou FadeOut.

---

## 14.10 Regras de Tela por Perfil

| Perfil | Regras |
|--------|--------|
| Cliente (QR) | Mobile-first, máx 2 ações primárias, fonte ≥ 16px |
| Cozinha (KDS) | Alto contraste, botões grandes, real-time |
| Gerente/Admin | Densidade média, tabelas com filtros |

---

## 14.11 Temas e Customização por Tenant (White-Label)

O sistema deve injetar variáveis CSS `root` baseadas na configuração do `TenantBranding` carregado.

```css
:root {
  --primary: {tenant.brandColor}; /* ex: #E63946 */
  --radius: {tenant.borderRadius}; /* ex: 0.5rem */
  --font-sans: {tenant.fontFamily}; /* ex: 'Inter', sans-serif */
}
```

### Elementos Customizáveis:
1. **Identidade:** Logo no Header, Favicon dinâmico.
2. **Cores:** Primary (Botões, Destaques), Background (Light/Dark).
3. **Copy:** Nome do Restaurante em todas as mensagens (ex: "Bem-vindo ao [Restaurante X]").

---

## 14.12 Checklist de Conformidade UI

- [x] Usa componentes shadcn
- [x] Respeita spacing scale
- [x] Responsivo
- [x] Estados completos
- [x] Acessível
- [x] Tema por tenant
- [x] Separação Layout vs UI Components

---

## 14.13 Advanced Mobile Layout Guidelines (Enterprise-Level Auditing)

To ensure robust, scalable mobile layouts beyond quick CSS fixes, adhere to these advanced principles:

### 14.13.1 CSS Fundamentals (Advanced)
- **Flexbox & Grid:** Use Flexbox for 1D layouts, Grid for 2D. Avoid over-relying on Flexbox for complex grids.
- **Sizing:** Employ `min-width`, `max-width`, `clamp()` for fluid sizing. Use `aspect-ratio` for consistent proportions.
- **Overflow & Containment:** Manage `overflow`, `contain`, `isolation` to prevent layout shifts.
- **Positioning:** Distinguish `position: sticky` vs `fixed`. Handle stacking context and z-index bugs.
- **Viewport Units:** Use real mobile viewport units (`dvh`, `svh`, `lvh`) to address 90% of mobile bugs.

### 14.13.2 Responsive Design Architecture
- **Mobile-First:** Build from mobile up, not desktop down.
- **Content-Based Breakpoints:** Define breakpoints based on content needs, not device sizes.
- **Fluid + Adaptive Layouts:** Combine fluid elements with adaptive containers.
- **Advanced Media Queries:** Use `@media (hover: none)`, `@media (pointer: coarse)`, and container queries for precise control.

### 14.13.3 Framework-Specific Considerations (React/Next.js)
- **Render Cycle:** Optimize for reflow/repaint minimization.
- **Hydration:** Mitigate hydration issues in Next.js affecting layouts.
- **SSR/CSR Impact:** Ensure layouts work across server and client rendering.
- **Componentization:** Design mobile-safe components, avoiding global state breaking layouts.

### 14.13.4 Design Tokens & System Integrity
- **Responsive Tokens:** Implement tokens that adapt to screen sizes (e.g., fluid spacing).
- **Consistent Scales:** Enforce 4px/8px systems for spacing, sizing.
- **Layout-Safe Components:** Avoid fixed widths/heights/paddings; use token-based values.
- **Systemic Fixes:** Resolve issues at the system level, not per-component.

### 14.13.5 Performance & Stability
- **CLS Prevention:** Avoid layout shifts with proper sizing and loading strategies.
- **Responsive Images:** Use `srcset` and `sizes` for optimal image delivery.
- **Skeletons:** Ensure skeletons maintain height to prevent shifts.
- **Lazy Loading:** Implement conscious lazy loading for performance.

### 14.13.6 Security & Systemic Impact
- **No Device Hacks:** Avoid platform-specific workarounds.
- **Unified Components:** Do not duplicate components for mobile/desktop.
- **Debt-Free Fixes:** Ensure changes don't break other platforms or create technical debt.
- **Testing & Guidelines:** Establish visual tests and clear guidelines for audits.

### 14.13.7 Auditing Methodology
- **Testing Scope:** iOS Safari, Android Chrome, screen rotation, virtual keyboard, safe areas, zoom levels (125%/150%), scroll behaviors.
- **Tools:** Chrome DevTools (emulation, layout shift), Lighthouse, CSS Overview, Performance tab for thrashing detection.
- **Accessibility Integration:** Ensure font scaling, rem units, fluid line-height, focus states, 44px touch targets.

### 14.13.8 Resilient Component Architecture
- **Layout-Agnostic Components:** Build components that adapt to any layout context.
- **Separation:** Distinguish layout components from UI components.
- **Composition:** Use slots and composition patterns correctly to avoid viewport assumptions.

**Checklist for Mobile Layout Audits:**
- [ ] No fixed dimensions; uses fluid sizing
- [ ] Handles viewport units correctly
- [ ] Tested across devices and orientations
- [ ] No CLS; proper image/loading strategies
- [ ] Accessible touch targets and scaling
- [ ] Systemic fixes, not patches
- [ ] Performance optimized (no thrashing)

---

### 14.11 Requisitos de Componentes de Layout (Topbar, Sidebar, Footbar)

Todos os componentes estruturais devem seguir estas regras rígidas de **Branding e Tokens** e **Unidades Relativas**:

> [!TIP]
> **Evite Pixel-Perfect estático.** Prefira `rem`, `em`, `%` ou `dvh`.

#### 14.11.1 Topbar (Header)
*   **Altura:** `h-16` (4rem) padrão ou `h-14` (3.5rem) no mobile.
*   **Fundo:** DEVE usar `bg-background/95 backdrop-blur` ou `bg-primaria` (se brand-heavy). **Nunca** cor fixa.
*   **Z-Index:** `--z-header` (50).
*   **Conteúdo:**
    *   Logo (Esquerda).
    *   Breadcrumb ou Título da Página (Centro/Esquerda).
    *   UserNav / Ações Globais (Direita).

#### 14.11.2 Sidebar (Navigation)
*   **Largura:** `w-64` (16rem) expandida, `w-fit` ou `w-[4.5rem]` (auto/rem) colapsada.
*   **Comportamento:**
    *   Desktop: Fixa (`sticky`) ou `fixed`.
    *   Mobile: Drawer (`Sheet`) vindo da esquerda.
*   **Styling:**
    *   Borda direita: `border-r border-border`.
    *   Item Ativo: `bg-accent text-accent-foreground`.
    *   Item Hover: `hover:bg-muted`.

#### 14.11.3 Footbar (Mobile Actions)
*   **Posição:** `fixed bottom-0 left-0 right-0`.
*   **Uso:** Apenas mobile, para ações primárias rápidas (ex: "Ver Carrinho", "Checkout").
*   **Padding:** Deve incluir `pb-[env(safe-area-inset-bottom)]`.

---

## 15. Checklist de Auditoria (System & Architecture)

Este checklist deve ser rodado antes de qualquer Release Major.

### 15.1 Design System & UI
- [ ] **Zero Hardcoded Colors:** Nenhuma ocorrência de hex (`#`) em arquivos `.tsx`. Apenas em `globals.css` ou `tailwind.config`.
- [ ] **Dynamic Units:** Evite `px` para layout. Use `rem` (Tailwind classes padrão) ou `dvh` para alturas de viewport.
- [ ] **Responsive:** Topbar e Sidebar colapsam corretamente em mobile (< 640px).
- [ ] **Touch Targets:** Botões em mobile tem min-height de 44px (ou `h-11`).

### 15.2 Arquitetura & Código
- [ ] **Import Cycles:** Nenhum warning de dependência circular.
- [ ] **Client vs Server:**
    - [ ] Páginas (`page.tsx`) são Server Components por padrão.
    - [ ] Interatividade (`onClick`, `useState`) movida para `client-components`.
- [ ] **Package Boundaries:**
    - [ ] `apps/web` não importa de `apps/consumer`.
    - [ ] UI compartilhada vem de `@smart-menu/ui`.

### 15.3 Performance & Assets
- [ ] **Imagens:** Todas usam `next/image` ou `NImage` (wrapper).
- [ ] **Fonts:** Carregadas via `next/font` (sem @import CSS externo bloqueante).

