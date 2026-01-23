# Planejamento, Roadmap e User Stories

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

## 9. Backlog de Execução (Status Atual)

### Fase 0: Infraestrutura & Bootstrap ✅
- [x] Monorepo setup (Next.js, NestJS, Python)
- [x] Integração Supabase (Auth, DB, RLS)
- [x] Modelagem do schema multi-tenant (Prisma 7)
- [x] Configuração de Agentes Expert e Workflows

### Fase 1: Core Operacional (Sprint 1-2) 🚀
- [x] **Auth & Onboarding:** Autenticação Supabase integrada ao NestJS + RBAC.
- [x] **Menu CRUD:** Gestão de categorias e itens com isolamento lógico (tenantId).
- [x] **QR Engine:** Geração dinâmica de links/QR por mesa.
- [x] **Client Web App:** Visualização do menu e carrinho mobile-first.
- [x] **UI/UX Polish:** Theming dinâmico (CSS Vars), framer-motion animations e componentes premium.

### Fase 2: Pedidos e Tempo Real (Sprint 3-4) 🚀
- [x] **Landing Page:** Página inicial premium e fluxo de redirecionamento.
- [x] **Order Engine (Core):** Fluxo de pedido completo (Carrinho -> API -> DB) com persistência local.
- [x] **Schema Synchronization:** Mapeamento snake_case e sincronização via Prisma.
- [ ] **Real-time Notifications:** WebSockets/Supabase Realtime para Cozinha e Atendente.
- [ ] **KDS Basic:** Tela simples de preparação de pedidos.
- [ ] **Pagamentos:** Integração inicial com Multicaixa Express (checkout).

### Fase 3: Inteligência e Polish (Sprint 5-+)
- [ ] **AI Analytics:** Microserviço Python gerando insights de vendas.
- [ ] **Smart Upsell:** Recomendações baseadas em IA no checkout.
- [ ] **Design System:** Storybook Infrastructure (Tech Debt) e PWA setup.


---

## 18. USER STORIES COMPLETAS

### 18.1 Cliente (QR Menu)

1. Como cliente, quero escanear o QR da minha mesa para acessar o menu digital, para fazer pedidos sem esperar o garçom.
2. Como cliente, quero visualizar imagens, preços e descrições de cada item, para escolher melhor.
3. Como cliente, quero adicionar itens ao carrinho com opções e variantes, para personalizar meu pedido.
4. Como cliente, quero enviar o pedido e receber confirmação, para ter certeza que foi registrado.
5. Como cliente, quero acompanhar o status do pedido (Recebido, Preparando, Pronto, Finalizado), para saber quando pegar ou consumir.
6. Como cliente, quero pedir a conta ou chamar atendente com um botão, para facilitar interação.
7. Como cliente, quero receber notificações visuais/sonoras de alterações importantes do pedido.

### 18.2 Atendente / Caixa

1. Como atendente, quero receber notificações de novos pedidos em tempo real, para não perder nenhum.
2. Como atendente, quero visualizar todos os pedidos por mesa e cliente, para organizar atendimento.
3. Como atendente, quero atualizar status dos pedidos, para informar clientes e equipe de cozinha.
4. Como atendente, quero finalizar pedidos e registrar pagamento, para controlar vendas.
5. Como atendente, quero filtros rápidos por setor e prioridade, para otimizar preparo.

### 18.3 Cozinha / Produção (KDS)

1. Como cozinheiro, quero receber pedidos filtrados por setor, para focar na minha área.
2. Como cozinheiro, quero marcar pedidos em preparo e prontos, para informar atendente/cliente.
3. Como cozinheiro, quero visualizar tempo estimado de preparo, para priorizar corretamente.

### 18.4 Gerente / Admin

1. Como gerente, quero gerenciar menu e categorias, para atualizar itens conforme necessidade.
2. Como gerente, quero ativar/desativar itens e gerenciar estoque, para refletir disponibilidade real.
3. Como gerente, quero visualizar dashboards de vendas, ticket médio e performance de mesas, para tomar decisões estratégicas.
4. Como gerente, quero configurar promoções e combos, para aumentar vendas.
5. Como administrador SaaS, quero gerenciar múltiplos tenants, planos e assinaturas, para operar negócio escalável.

---

## 19. ROADMAP DE IMPLEMENTAÇÃO (Detalhado)

### Fase 1 – MVP (8 semanas)

- QR por mesa e menu digital completo
- CRUD de menu items (tenant isolated)
- Envio de pedidos + notificações básicas
- Status de pedidos para cliente
- Tela de atendente com visualização de pedidos
- Integração mínima de backend e WebSockets

### Fase 2 – Operação Completa (12 semanas)

- KDS para cozinha com filtragem por setor
- Dashboard gerente com métricas principais
- Estoque e disponibilidade avançada
- Pagamento digital integrado
- Personalização de tema por tenant (cores, logo)
- UX Writing e animações refinadas

### Fase 3 – Escala e Inteligência (8–12 semanas)

- Fidelização e pontos de cliente
- Upsell automático e recomendações de combos
- Analytics avançado e relatórios por período/turno
- Multi-restaurante (multi-tenant) completo
- Otimização e monitoramento em produção
- Deploy CI/CD completo + Storybook integrado
