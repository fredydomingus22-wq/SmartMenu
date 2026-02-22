# Plano de Implementação: Landing Page SmartMenu

**De:** Agente Project Manager (04_Project_Manager)
**Baseado em:** `docs/Landing_Page_Briefing.md`, Acordos de Arquitetura e Debates de Qualidade/Segurança.

---

## Estratégia de Entrega (Phasing)

Para garantir a velocidade de entrega sem comprometer as exigências rígidas de Performance (RSC, <150kb) e Segurança (Lead Capture), o desenvolvimento da Landing Page será dividido em **dois Sprints Focados**.

---

## 🏃 Sprint 1: Fundação Estrutural, SEO e Hero Section (Semana 1)

**Objetivo:** Ter a página no ar com a proposta de valor principal e o vídeo Hero a funcionar de forma imaculada em todos os dispositivos, garantindo 95+ no Lighthouse.

### 📝 Tarefas de Frontend (UI/UX Engineering)

- [ ] **Setup da Rota:** Criar a estrutura Base no Next.js App Router em `apps/web/app/(marketing)/page.tsx`.
- [ ] **Componente Hero (Media):**
  - Comprimir o vídeo B-Roll (H.264 e WebM).
  - Desenvolver o componente estático (Server Component) `<HeroVideo />` com as tags obrigatórias: `autoplay loop muted playsinline preload="none"`.
  - Criar e aplicar a imagem `poster` levíssima.
  - Aplicar o CSS do Overlay Gradiente Linear Radial por cima do vídeo para garantir o contraste WCAG AA.
- [ ] **Componente Hero (Conteúdo):**
  - Implementar o Headline (H1 estrito) e o Subheadline.
  - Desenvolver os CTAs Primário (Teste Grátis) e Secundário (Ver Menu).
- [ ] **Rodapé Obrigatório:** Implementar o "Powered by Zimbotechia" no final da página.

### 🛡️ Tarefas de Segurança & Backend (Security/Code Quality)

- [ ] **Infraestrutura de Formulário:** Desenvolver a **Server Action** tipada (`next-safe-action`) para o CTA de Teste Grátis.
- [ ] **Validação Zod:** Criar schema Zod estrito para proteger e validar os inputs (Nome, Email, Telemóvel).
- [ ] **Rate Limiting:** Aplicar middleware ou limitação no Redis/Supabase para a submissão do formulário.
- [ ] **Tratamento de Erros:** Configurar o `<ErrorBoundary>` na raiz de `(marketing)` para quedas suaves sem exposição de stack traces.

### 🧪 Validação QA Sprint 1

- [ ] **Teste de Throttling:** Simular devtools 3G e confirmar que o FCP (First Contentful Paint) via `poster` ocorre em < 1s.
- [ ] **Auditoria de Segurança:** Submeter formulário com payloads maliciosos para confirmar bloqueio do Zod e limites de Rate Limit.

---

## 🏃 Sprint 2: Animações, Fluxo de Valor e Flywheel (Semana 2)

**Objetivo:** Dar vida à página com o storytelling interativo ("Islands" de CSR com Framer Motion), seções de precificação detalhadas e a integração final com a tracking de origem (Flywheel).

### 📝 Tarefas de Frontend (UI/UX Engineering)

- [ ] **Construir Secções Estáticas:**
  - Secção 3: Agitar a Dor
  - Secção 7: Planos Honestos (Cards de Preço limpos)
  - Secção 8: Gatilhos Finais (Contador/Lotação e CTA Final)
- [ ] **Implementar Componentes Interativos ('use client'):**
  - Secção 2: O Fluxo Mágico. Animação step-by-step.
  - Secção 4: Solução Elegante (Mockups telemóvel flutuante 3D animado ao scroll).
  - Secção 5 e 6: Mockups KDS/Dashboard e Animações de Notificação Mini CRM.
- [ ] **Fallback Mobile & Acessibilidade:**
  - Transformar o UI das secções interativas de layout "Sticky" duplo para "Stack de Cards" `flex-col` no Mobile.
  - Aplicar hook `useReducedMotion` do Framer Motion para desativar as animações caso o SO do dispositivo peça.

### 🛡️ Tarefas Backend e Tracking (Analytics/Product-Led)

- [ ] **Integração do Motor de Crescimento (Flywheel):**
  - Inserir link no Menu do Consumidor final ("Powered by Zimbotechia").
  - Configurar propagação de UTM Parameters (`?utm_source=consumer-menu&tenant_id=[id]`).
  - No frontend da Landing Page, ler os UTMs e guardá-los hidden no envio do Formulário de Lead.

### 🧪 Validação Final (QA & Code Quality)

- [ ] **Auditoria de Bundle:** Compilar a app para produção e confirmar que o js file da página de marketing é <150kb gzip.
- [ ] **Teste Acessibilidade Automation:** Executar Lighthouse E2E (Score 95+ Desktop/Mobile).
- [ ] **Teste Flywheel:** Fazer o percurso do Menu Cliente -> Landing Page -> Enviar Formulário, confimar que o `tenant_id` de origem salvou com sucesso na Base de Dados.

---

O Roadmap está claro e as responsabilidades divididas. Todas as aprovações de arquitetura e mitigação de segurança foram absorvidas. Pronto para início do Sprint 1.
