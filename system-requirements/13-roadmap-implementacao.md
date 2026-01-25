# Roadmap de Implementação – SmartMenu

## 🚨 PLANO DE MITIGAÇÃO — NÃO CONFORMIDADES CRÍTICAS

**Data:** Janeiro 2026  
**Prioridade:** URGENTE - Segurança e Arquitetura  
**Status:** Ativo - Fase 2 Concluída ✅ | Fase 3 Iniciada 🚧

### 🎯 OBJETIVOS
- ✅ Corrigir 4 violações críticas identificadas na auditoria (3/4 corrigidas)
- ✅ Restaurar conformidade de segurança e arquitetura
- Preparar base para deploy seguro

---

## 🔥 FASE EMERGÊNCIA — SEGURANÇA (Semanas 1-2) ✅ CONCLUÍDA

### Sprint 1: Secrets Hardcoded (2-3 dias) ✅ CONCLUÍDO
**Responsável:** Security Engineer + Code Quality Specialist
**Status:** ✅ Finalizado
**Data:** Janeiro 2026

**Tarefas Concluídas:**
- [x] **Identificar todos os arquivos** com chaves hardcoded
  - `scripts/setup-storage.js` - service role key
  - `apps/consumer/proxy.ts` - anon key fallback
  - `apps/api/test-jwt.js` - test token
  - `apps/web/utils/supabase/*.ts` - anon key fallbacks
  - `apps/web/lib/supabase.ts` - anon key fallback
- [x] **Criar variáveis de ambiente** padronizadas
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET`
  - `TEST_JWT_TOKEN`
- [x] **Atualizar arquivos** para usar variáveis
- [x] **Criar .env.example** com placeholders
- [x] **Testar builds** locais - ✅ Passando
- [x] **Auditar logs** para exposição histórica

**Critérios de Aceitação:** ✅ ATINGIDOS
- ✅ Nenhum arquivo contém chaves reais
- ✅ Builds passam com variáveis undefined
- ✅ Documentação de configuração atualizada

### Sprint 2: Isolamento de Packages (3-5 dias) ✅ CONCLUÍDO
**Responsável:** System Architect + Code Quality Specialist
**Status:** ✅ Finalizado
**Data:** Janeiro 2026
**Objetivo:** Corrigir side-effects em packages compartilhados

**Tarefas Concluídas:**
- [x] **Refatorar packages/ui/src/lib/supabase-client.ts**
  - Remover acesso direto a `process.env`
  - Criar função que recebe parâmetros (supabaseUrl, supabaseKey)
  - Atualizar interface do ImageUpload
- [x] **Atualizar consumidores do ImageUpload**
  - `apps/web/app/dashboard/settings/_components/menu-design-form.tsx`
  - Passar NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] **Verificar isolamento completo**
  - Nenhum acesso a `process.env` no packages/ui
  - Builds passando para todos os workspaces
- [x] **Testes de isolamento**
  - Verificado que packages não acessam runtime
  - Builds isolados funcionando

**Critérios de Aceitação:** ✅ ATINGIDOS
- ✅ Packages não acessam `process.env`
- ✅ Sem imports relativos entre packages
- ✅ Tests de isolamento passando

---

## 🏗️ FASE ARQUITETURA — MOBILE & PACKAGES (Semanas 3-6)

### Sprint 3: App Mobile MVP (2-3 semanas) ✅ CONCLUÍDO
**Responsável:** UI/UX Designer + Mobile Layout Specialist + System Architect
**Status:** ✅ Finalizado
**Data:** Janeiro 2026
**Objetivo:** Implementar app mobile conforme requisitos

**Tarefas Concluídas:**
- [x] **Setup Expo + React Native**
  - Criar `apps/mobile/` com Expo + TypeScript
  - Configurar estrutura de pastas (src/screens, src/components, etc.)
  - Instalar dependências de navegação e UI
- [x] **UI Mobile Própria**
  - Componentes otimizados para touch (botões, cards, listas)
  - Design system mobile-first com cores e tipografia
  - Navegação nativa (React Navigation com tabs)
- [x] **Integração com Tokens**
  - Consumir componentes do `@smart-menu/ui`
  - Tema compartilhado web/mobile
  - SecureStore para autenticação (expo-secure-store)
- [x] **Funcionalidades Core**
  - Tela de login com autenticação mock
  - Menu browsing com categorias e filtros
  - Carrinho offline com cálculo de total
  - Perfil com opções de usuário
- [x] **Estrutura Base Completa**
  - Sistema de navegação configurado
  - 4 telas principais implementadas
  - Tipos TypeScript compartilhados
  - Build funcionando sem erros

**Critérios de Aceitação:** ✅ ATINGIDOS
- ✅ App mobile funcional no iOS/Android (Expo)
- ✅ UI própria (não web wrapped) - componentes nativos
- ✅ Tokens compartilhados - integração com @smart-menu/ui
- ✅ SecureStore implementado - autenticação segura

### Sprint 4: Otimização de Packages (1 semana) ✅ CONCLUÍDO
**Responsável:** Code Quality Specialist + Automation Specialist
**Status:** ✅ Finalizado
**Data:** Janeiro 2026
**Objetivo:** Melhorar qualidade e performance dos packages

**Tarefas:**
- [ ] **Configurar turbo.json**
  - Pipeline de build otimizado
  - Cache inteligente
  - Dependências paralelas
- [ ] **Bundle Analyzer**
  - Configurar webpack-bundle-analyzer
  - Identificar otimizações
  - Reduzir bundle size
- [ ] **Documentação Completa**
  - Storybook atualizado
  - READMEs detalhados
  - Exemplos de uso

---

## 🛡️ FASE INFRAESTRUTURA — SEGURANÇA & PERFORMANCE (Semanas 7-8)

### Sprint 5: Segurança Avançada (1 semana)
**Responsável:** Security Engineer + System Architect
**Objetivo:** Implementar proteções críticas

**Tarefas:**
- [ ] **Content Security Policy (CSP)**
  - Configurar headers CSP no Next.js
  - Middleware para CSP dinâmico
  - Testar contra XSS
- [ ] **Rate Limiting**
  - Implementar na API (NestJS)
  - Configurar Redis/memory store
  - Testar proteção DoS
- [ ] **Headers de Segurança**
  - HSTS, X-Frame-Options, etc.
  - Configuração por ambiente
- [ ] **Auditoria de Segurança**
  - Scan de vulnerabilidades
  - Penetration testing básico

**Critérios de Aceitação:**
- ✅ CSP configurado e testado
- ✅ Rate limiting ativo
- ✅ Headers de segurança presentes
- ✅ Zero vulnerabilidades críticas

### Sprint 6: Performance & Qualidade (1 semana)
**Responsável:** QA Engineer + Code Quality Specialist
**Objetivo:** Otimizar performance e qualidade

**Tarefas:**
- [ ] **Layout Shift Zero**
  - Implementar skeletons consistentes
  - Lazy loading otimizado
  - Critical CSS inlining
- [ ] **Re-renders Controlados**
  - React.memo estratégico
  - useMemo/useCallback
  - Profiler para identificação
- [ ] **Testes Abrangentes**
  - Cobertura mínima 80%
  - Testes E2E com Playwright
  - Performance tests
- [ ] **Monitoramento**
  - Error boundaries completos
  - Logging estruturado
  - Métricas de performance

---

## 📊 MÉTRICAS DE SUCESSO

### Segurança (Dia 5)
- ✅ Zero chaves hardcoded
- ✅ Packages isolados
- ✅ CSP ativo

### Arquitetura (Semana 6)
- ✅ App mobile funcional
- ✅ turbo.json configurado
- ✅ Bundle otimizado

### Infraestrutura (Semana 8)
- ✅ Rate limiting implementado
- ✅ Performance baseline estabelecido
- ✅ Cobertura de testes >80%

---

## 🚨 DEPENDÊNCIAS & BLOQUEADORES

### Dependências Técnicas
- **Segurança:** Deve ser feita ANTES de qualquer deploy
- **Mobile:** Pode ser paralelo após isolamento de packages
- **Performance:** Depende de arquitetura corrigida

### Bloqueadores Potenciais
- **Deploy Bloqueado:** Até correção de secrets
- **Mobile Release:** Depende de design system estável
- **CI/CD:** Quebrado até isolamento de packages

---

## 👥 RESPONSABILIDADES POR AGENT

### Security Engineer (`agents/07_Security_Engineer.md`)
- Secrets hardcoded (Sprint 1)
- CSP & Headers (Sprint 5)
- Auditoria de segurança

### System Architect (`agents/02_System_Architect.md`)
- Isolamento de packages (Sprint 2)
- Rate limiting (Sprint 5)
- Arquitetura mobile (Sprint 3)

### Code Quality Specialist (`agents/08_Code_Quality_Specialist.md`)
- Refatoração de imports (Sprint 2)
- Turbo & bundle optimization (Sprint 4)
- Testes e qualidade (Sprint 6)

### UI/UX Designer + Mobile Layout (`agents/03_UI_UX_Designer.md` + `agents/14_Mobile_Layout_Specialist.md`)
- App mobile design (Sprint 3)
- UI/UX mobile-first (Sprint 3)

### QA Engineer (`agents/06_QA_Engineer.md`)
- Testes abrangentes (Sprint 6)
- Performance validation (Sprint 6)

---

## 📈 STATUS ATUAL & PRÓXIMOS PASSOS

**Status:** Planejamento concluído  
**Próximo:** Executar Sprint 1 (Segurança)  
**Deadline:** Correções críticas em 2 semanas  

**Comando para iniciar:**
```bash
# Act as @agents/07_Security_Engineer.md and start Sprint 1
```
- [x] **Internationalization (i18n):** Migração completa de UI strings para `pt.json` e suporte a tradução básica no cliente.
- [ ] **Backend i18n Strategy:** Migrar campos `name/description` para JSONB para suporte total a múltiplos idiomas. (High Priority)
- [ ] **E-commerce Showcase Refactor:** Implementar vitrine por seções (Shopify-style), recomendações, upsells e rodapé global na PDP e Home Cliente. (High Priority)
- [ ] **KDS 2.0 Hardening (P0):**
    - [ ] **Backend Filtering:** Implementar `?scope=active` para remover pedidos finalizados/entregues.
    - [ ] **Mobile Retrofit:** Auditoria de UI para garantir uso em smartphones (1-col grid, 48px buttons).
    - [ ] **Workflow Logic:** Validar transições de estado no backend (`PATCH /status`).
    - [ ] **Zero Distraction:** Garantir que o KDS limpa pedidos concluídos em tempo real.
- [ ] **Marketing Management UI:** Painel para o gerente configurar Upsells e Recomendações vinculadas a produtos.
- [x] **Technical Sweep:** Implementação de Error Boundaries, Type Safety e eliminação de `any` (Dashboard & Menu).
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
