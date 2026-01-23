# Roadmap de Implementação – SmartMenu

## 7. Plano de Implementação (Fases)

### Fase 1 – MVP (6–8 semanas)
- QR por mesa
- Menu digital
- Pedido e status
- Tela de atendimento
- Notificação sonora

### Fase 2 – Operação Completa (12 semanas)
- KDS (cozinha)
- Dashboard gerente
- Controle de estoque básico
- Pagamentos integrados

### Fase 3 – Escala & Inteligência (8–12 semanas)
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

## 9. Backlog de Execução (Status Atual)

### Fase 0: Infraestrutura ✅
- [x] Monorepo setup (Next.js, NestJS, Python)
- [x] Integração Supabase (Auth, DB, RLS)
- [x] Modelagem do schema multi-tenant (Prisma 7)

### Fase 1: Core Operacional ✅
- [x] **Auth & Onboarding:** Autenticação integrada ao NestJS.
- [x] **Menu CRUD:** Gestão isolada por `tenantId`.
- [x] **QR Engine:** Geração dinâmica de QR por mesa.
- [x] **Client Web App:** Visualização e carrinho mobile-first.
- [x] **Tables Module:** CRUD de mesas + Geração de QR SVG.

### Fase 2: Pedidos e Tempo Real (Sprint Atual) 🚀
- [x] **Landing Page:** Fluxo de redirecionamento premium.
- [x] **Order Engine:** Fluxo completo Carrinho -> API -> DB.
- [ ] **Real-time:** Notificações via WebSockets/Supabase.
- [ ] **E-commerce Showcase Refactor:** Implementar vitrine por seções (Shopify-style), recomendações, upsells e rodapé global na PDP e Home Cliente. (High Priority)
- [ ] **KDS Basic:** Tela de preparação. (Next Step)
- [ ] **UI Refactor:** Implementar `ScrollArea` em todos os forms e Migrar Cadastro de Produto para Página Dedicada (Framer Motion).
- [ ] **Product Gallery:** Upgrade do cadastro de produtos para suportar múltiplas fotos e nova UI de galeria.
- [ ] **Customer UX Upgrade:** Página de Detalhes do Produto com galeria de alta resolução e animações fluidas.
- [ ] **Customization Engine:** Sistema de Extras (pagos) e Remoções (ingredientes/observações) no fluxo de pedido.

### Fase 3: Fidelização e Inteligência ✅ (Parcialmente Antecipada)
- [x] **Login de Cliente:** Fluxo de identificação Supabase Auth.
- [x] **Loyalty Core:** Tabelas e lógica de cálculo de pontos.
- [x] **Resgate UI:** Catálogo de recompensas no Client Web App.
- [ ] **Manager Config:** Painel de configuração de regras de fidelidade.
- [ ] **Pontos Real-time:** Notificação de pontos acumulados pós-pedido.

---

## 19. Roadmap de Implementação (Detalhado)

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

---

**Documento de referência para roadmap e plano de implementação do SmartMenu.**
