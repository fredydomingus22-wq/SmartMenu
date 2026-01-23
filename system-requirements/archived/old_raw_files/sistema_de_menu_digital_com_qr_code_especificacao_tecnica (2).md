# Proposta Técnica – Sistema de Menu Digital Inteligente (QR Ordering)

## 1. Visão Geral do Sistema
O sistema é uma plataforma SaaS de pedidos digitais para restaurantes e fast food, acessível via QR Code por mesa, permitindo que clientes visualizem o menu, realizem pedidos, acompanhem o estado em tempo real e interajam com o atendimento. Do lado do restaurante, o sistema centraliza pedidos, notifica setores (cozinha, bar, caixa) e fornece dashboards de gestão.

Objetivo: **reduzir fricção operacional, aumentar ticket médio e gerar dados acionáveis**.

---

## 2. Stakeholders
- Cliente final (consumidor)
- Atendente / Caixa
- Cozinha / Bar
- Gerente do restaurante
- Administrador do sistema (SaaS)

---

## 3. Escopo Funcional (OpenSpec Style)

### 3.1 Cliente (Web App – QR)
- Acesso via QR Code único por mesa
- Visualização de menu (categorias, imagens, preços, descrições)
- Filtros (promoções, combos, vegetarianos, etc.)
- Carrinho de pedidos
- Identificação por nome/apelido
- Envio de pedido
- Acompanhamento de status:
  - Recebido
  - Em preparação
  - Pronto
  - Finalizado / Pago
- Botões rápidos:
  - Chamar atendente
  - Pedir conta
- Histórico da sessão

### 3.2 Atendimento / Caixa
- Tela de pedidos em tempo real
- Notificação sonora e visual de novos pedidos
- Visualização por mesa, cliente e horário
- Atualização manual ou automática de status
- Gestão de pagamentos (local / digital)

### 3.3 Cozinha / Produção (KDS)
- Tela dedicada (Kitchen Display System)
- Pedidos filtrados por setor
- Ordem cronológica e por prioridade
- Marcação de etapas concluídas
- Tempo médio de preparo

### 3.4 Gerência
- Dashboard analítico:
  - Vendas por período
  - Ticket médio
  - Tempo de preparo
  - Produtos mais vendidos
  - Performance por turno
- Gestão de menu:
  - Ativar/desativar itens
  - Controle de estoque básico
  - Preços e promoções
- Gestão de mesas
- Gestão de usuários e permissões

### 3.5 Admin SaaS
- Multi-tenant (vários restaurantes)
- Gestão de planos e assinaturas
- Configurações globais
- Logs e auditoria

---

## 4. Requisitos Não Funcionais
- Alta disponibilidade
- Baixa latência (tempo real)
- Responsivo (mobile-first)
- Multi-idioma
- Segurança (JWT, RBAC)
- Escalável (cloud-native)

---

## 5. Arquitetura Técnica

### 5.1 Arquitetura Geral
- Frontend: Web Apps (Cliente, Atendente, Cozinha, Gerente)
- Backend: API central + serviços em tempo real
- Banco de Dados: Relacional + Cache
- Comunicação em tempo real: WebSockets

### 5.2 Stack Sugerida

**Frontend**
- Next.js (App Router)
- Tailwind CSS
- PWA (offline básico)

**Backend**
- Node.js (NestJS ou Fastify)
- WebSockets (Socket.io / native WS)
- REST + Events

**Database**
- PostgreSQL (dados críticos)
- Redis (cache + filas + eventos)

**Infraestrutura**
- Docker
- Cloud (AWS / GCP / Azure)
- Nginx

---

## 6. Modelo de Dados (Alto Nível)
- Restaurant
- Table
- QRSession
- User (roles)
- MenuCategory
- MenuItem
- Order
- OrderItem
- Payment
- Notification

---

## 7. Plano de Implementação (Fases)

### Fase 1 – MVP (6–8 semanas)
- QR por mesa
- Menu digital
- Pedido e status
- Tela de atendimento
- Notificação sonora

### Fase 2 – Operação Completa
- KDS (cozinha)
- Dashboard gerente
- Controle de estoque básico
- Pagamentos integrados

### Fase 3 – Escala & Inteligência
- Fidelização
- Analytics avançado
- Multi-restaurante
- Planos SaaS

---

## 8. Roadmap de Evolução
- IA para sugestão de upsell
- Previsão de demanda
- Integração POS
- Delivery local

---

## 9. Backlog Inicial de Tarefas (Exemplo)

### Backend
- [ ] Modelagem do schema
- [ ] Autenticação e RBAC
- [ ] API de pedidos
- [ ] WebSocket de eventos

### Frontend
- [ ] UI menu QR
- [ ] Carrinho e checkout
- [ ] Painel de pedidos
- [ ] KDS view

### Infra
- [ ] Setup Docker
- [ ] CI/CD
- [ ] Monitoramento

---

## 10. UX FLOWS (Wireframes Textuais)

### 10.1 Fluxo – Cliente (QR Code)
1. Scan QR da mesa
2. Validação de sessão (tenant + mesa)
3. Tela Menu:
   - Header: nome do restaurante + mesa
   - Categorias em tabs
   - Cards de itens (imagem, nome, preço, badge promo)
4. Clique no item:
   - Modal com descrição
   - Opcionais (extras, tamanhos)
   - Quantidade
5. Adicionar ao carrinho
6. Carrinho:
   - Lista de itens
   - Observações
   - Total
7. Enviar pedido
8. Tela de status (real-time)

---

### 10.2 Fluxo – Atendente / Caixa
1. Login
2. Tela "Pedidos Ativos"
3. Notificação sonora
4. Visualização por mesa
5. Atualizar status
6. Finalizar pedido / pagamento

---

### 10.3 Fluxo – Cozinha (KDS)
1. Login setor
2. Lista de pedidos por prioridade
3. Marcar preparo / pronto

---

### 10.4 Fluxo – Gerente
1. Login
2. Dashboard
3. Menu Management
4. Relatórios

---

## 11. CRUD DE MENU ITEM (GESTÃO COMPLETA)

### 11.1 Princípios de Tenant Isolation
- Cada restaurante = 1 tenant
- Todo dado possui tenant_id
- Isolamento lógico no banco
- RBAC por tenant

---

### 11.2 Entidades Relacionadas
- Tenant
- MenuCategory
- MenuItem
- MenuItemOption
- MenuItemVariant
- MenuItemAvailability

---

### 11.3 Create – Criar Item de Menu
**Fluxo UX (Gerente):**
1. Menu > Categorias > Criar Item
2. Campos:
   - Nome
   - Descrição
   - Categoria
   - Preço base
   - Imagem
   - Tipo (comida, bebida, combo)
   - Setor (cozinha, bar)
3. Configurações avançadas:
   - Variantes (tamanho, sabor)
   - Extras (checkbox)
   - Disponibilidade (horário / dias)
   - Estoque inicial
4. Salvar

**Backend:**
- POST /tenants/{id}/menu-items
- Validação tenant_id
- Persistência relacional

---

### 11.4 Read – Visualização
**Gerente:**
- Lista filtrável (categoria, status)
- Preview do item

**Cliente:**
- Apenas itens ativos
- Cache por tenant

**Backend:**
- GET /tenants/{id}/menu-items

---

### 11.5 Update – Atualização
**Casos:**
- Alterar preço
- Atualizar imagem
- Ativar/desativar
- Ajustar estoque

**Regras:**
- Não afeta pedidos em andamento
- Versionamento opcional

**Backend:**
- PUT /menu-items/{id}

---

### 11.6 Delete – Exclusão Lógica
- Soft delete (is_deleted = true)
- Histórico preservado

---

### 11.7 Gestão Avançada
- Agendamento de disponibilidade
- Preço promocional
- Item esgotado automático
- Clonagem de item

---

## 12. Segurança e Governança
- JWT com tenant_id
- Middleware de isolamento
- Logs por tenant

---

## 13. Próximos Passos Técnicos
1. Definir schema SQL
2. Criar policies de isolamento
3. Implementar CRUD base
4. Testes multi-tenant

---

**Documento atualizado – Arquitetura Sénior Fullstack.**



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

---

## 14.2 Stack de UI

### Base
- **shadcn/ui** → componentes base
- **Radix UI** → primitives e acessibilidade
- **Tailwind CSS** → layout, espaçamento e tokens
- **Lucide Icons** → ícones

### Filosofia
- shadcn = UI funcional e consistente
- Radix = comportamento e acessibilidade
- Tailwind = sistema de design (tokens)

---

## 14.3 Grid, Breakpoints e Responsividade

### Breakpoints Padrão
- xs: < 640px (mobile)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Grid
- Mobile: 4 colunas
- Tablet: 8 colunas
- Desktop: 12 colunas

Gutter padrão: **16px mobile / 24px desktop**

---

## 14.4 Espaçamentos (Spacing Scale)

Base: **4px (0.25rem)**

- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px

Nunca usar valores fora da escala.

---

## 14.5 Tipografia

### Fontes
- **Primary:** Inter
- **Fallback:** system-ui

### Escala Tipográfica
- H1: 32px / semibold
- H2: 24px / semibold
- H3: 20px / medium
- Body: 14–16px / regular
- Caption: 12px

Line-height padrão: 1.4–1.6

---

## 14.6 Paleta de Cores (Base Neutra + Acento)

### Neutros
- Background: #0F172A (dark) / #FFFFFF (light)
- Surface: #020617 / #F8FAFC
- Border: #1E293B
- Text Primary: #E5E7EB
- Text Secondary: #94A3B8

### Ações
- Primary: #2563EB (azul)
- Success: #16A34A
- Warning: #F59E0B
- Error: #DC2626

Tenant pode customizar **Primary**.

---

## 14.7 Componentes Padrão (shadcn)

### Inputs
- Input
- Textarea
- Select
- Checkbox
- Switch

### Feedback
- Toast
- Alert
- Badge
- Tooltip

### Navegação
- Tabs
- Breadcrumb
- DropdownMenu
- Pagination

### Data Display
- Table
- Card
- Accordion

---

## 14.8 Componentes Customizados (Radix + shadcn)

### MenuItemCard
- Image
- Name
- Price
- Badges (promo / esgotado)

### OrderStatusBadge
- RECEIVED → cinza
- PREPARING → azul
- READY → verde
- CANCELLED → vermelho

### NotificationBanner
- Ícone
- Texto curto
- CTA opcional

---

## 14.9 Estados de UI (Obrigatórios)

Todo componente deve prever:
- Default
- Hover
- Focus (acessibilidade)
- Active
- Disabled
- Loading
- Error

---

## 14.10 Regras de Tela por Perfil

### Cliente (QR)
- Mobile-first
- Máx 2 ações primárias por tela
- Fonte ≥ 16px

### Cozinha (KDS)
- Alto contraste
- Botões grandes
- Atualização em tempo real

### Gerente / Admin
- Densidade média
- Tabelas com filtros
- Dashboards visuais

---

## 14.11 Temas e Customização por Tenant

- Logo
- Cor primária
- Nome do restaurante

Implementação via CSS variables:
```
--primary
--radius
--font
```

---

## 14.12 Checklist de Conformidade UI

- [ ] Usa componentes shadcn
- [ ] Respeita spacing scale
- [ ] Responsivo
- [ ] Estados completos
- [ ] Acessível
- [ ] Tema por tenant

---

**Design System oficial definido – Referência única de UI/UX do sistema.**

