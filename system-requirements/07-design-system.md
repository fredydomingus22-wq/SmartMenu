# Design System – SmartMenu

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

| Token | Valor |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |

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
| Token | Cor |
|-------|-----|
| Primary | #2563EB |
| Success | #16A34A |
| Warning | #F59E0B |
| Error | #DC2626 |

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

### ProductGallery
- **Visualização (Form):** Grid de thumbnails com upload drag-and-drop.
- **Visualização (Cliente):** Carousel deslizável (Embla Carousel ou Framer Motion drag) com paginação por pontos.

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

- [ ] Usa componentes shadcn
- [ ] Respeita spacing scale
- [ ] Responsivo
- [ ] Estados completos
- [ ] Acessível
- [ ] Tema por tenant

---

**Documento de referência para Design System do SmartMenu.**
