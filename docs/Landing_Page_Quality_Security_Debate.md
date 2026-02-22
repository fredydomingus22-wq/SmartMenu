# Debate Multi-Agente: Qualidade, Segurança e Código (Landing Page SmartMenu)

**Referência:** `docs/Landing_Page_Briefing.md` e `docs/Landing_Page_Architecture_Debate.md`
**Agentes Envolvidos:**

- 🛡️ **Security Engineer (07)** - Foco em Segurança, Proteção de Dados e Hardening
- 🧪 **QA Engineer (06)** - Foco em Testes End-to-End, Performance e Resiliência
- 📐 **Code Quality Specialist (08)** - Foco em Padrões, Linting e Gestão de Erros

---

## Tópico 1: Captura de Leads e Segurança de Formulários (Start Free Trial)

🛡️ **Security Engineer (07):**

> "O CTA principal 'Comece o seu Teste Gratuito Agora' implica um formulário de recolha de dados (Lead Capture). Isto é um vetor de ataque clássico. Exijo:
>
> 1. **Rate Limiting Restrito:** Proteção contra ataques DDoS e bot spam no endpoint de submissão do formulário.
> 2. **Sanitização de Inputs:** Utilização rigorosa do Zod para validar cada campo (Email, Nome do Restaurante, Telefone) no cliente E no servidor. Nenhuma string crua deve tocar na nossa base de dados.
> 3. **Sem Vazamento de PII:** Os UTM parameters do Flywheel ('Powered by Zimbotechia') não devem NUNCA transportar PII (Personally Identifiable Information). Apenas IDs internos de tenants."

📐 **Code Quality Specialist (08):**

> "Concordo 100%. A nível de código, isto exige a utilização de **Server Actions** tipadas no Next.js (com o package `next-safe-action`). Qualquer erro de validação do Zod deve ser devolvido ao cliente com um formato de erro estandardizado. Nada de usar `any` nos blocos try/catch."

---

## Tópico 2: Performance de Vídeo sob Carga e Acessibilidade (WCAG)

🧪 **QA Engineer (06):**

> "O Briefing pede um vídeo 'food porn' em B-Roll na Hero Section. Testaremos isto rigorosamente:
>
> 1. **Teste de Degradação (Network Throttling):** O que acontece se o cliente estiver numa rede 3G fraca? O atributo `poster` (imagem de placeholder estática) tem de carregar em menos de 1 segundo (FCP), ou abro um Bug de Severidade Alta.
> 2. **Auditoria de Acessibilidade:** O Overlay Escuro proposto pela UI/UX é teoria até passar o teste automatizado no Cypress/Playwright. Verificarei o rácio de contraste (mínimo 4.5:1) em todos os breakpoints do telemóvel ao monitor ultrawide.
> 3. **Reduced Motion:** Vou escrever um teste End-to-End específico no Playwright que simula `prefers-reduced-motion: reduce`. Todas as animações do Framer Motion e vídeos de fundo devem parar automaticamente."

---

## Tópico 3: Componentes de UI e Bundle Size (React Server Components)

📐 **Code Quality Specialist (08):**

> "Vamos manter a Landing Page o mais leve possível. O 'Scroll-jacking' e as animações 3D referidas no briefing são componentes cliente pesados.
> **Regra de Linting:** Qualquer componente em `apps/web/app/(marketing)/` que não usar o hook animado deve ser limpo da diretiva `'use client'`. Temos de garantir que quase todo o payload da Landing Page é HTML estático enviado pelo Server Component, de modo a garantir uma pontuação no Lighthouse > 95 em Mobile."

🧪 **QA Engineer (06):**

> "Correto. E implementarei um teste no pipeline de CI/CD que quebra a build automática se o bundle de JavaScript da Landing Page exceder os 150kb (gzip)."

---

## Tópico 4: Tratamento de Erros Silenciosos (Error Boundaries)

🛡️ **Security Engineer (07):**

> "Se um serviço externo falhar (por exemplo, o serviço de envio de emails do Lead Capture intercetar o formulário), a Landing Page não pode mostrar um trace de erro do servidor para o utilizador. Isso é vazamento de informação técnica."

📐 **Code Quality Specialist (08):**

> "Implementarei um `<ErrorBoundary>` global na sub-árvore do `(marketing)` usando um fallback amigável ('Estamos a enfrentar instabilidade, tente novamente em instantes'), acompanhado de logs estruturados e assíncronos que enviam o erro real para o nosso servidor de monitorização de forma silenciosa e abstraída no Next.js."

---

## 🎯 Conclusão e Regras de Qualidade Aprovadas

1.  **Segurança em Formulários:** Lead Captures usarão Server Actions, validação via Zod (Server/Client) e estarão protegidos por Strict Rate Limiting.
2.  **Performance em Mídias Curtas:** O vídeo de background deverá passar no teste formal de _Network Throttling 3G_ de forma graciosa (Fallback obrigatório para imagem WebP).
3.  **Acessibilidade Comprovada:** Inclusão de testes E2E do _prefers-reduced-motion_ e rácios de contraste WCAG validados via automação.
4.  **Limites de Código:** Strict RSC (React Server Components) mantendo a diretiva `'use client'` estritamente nas "Ilhas" de componentes animados do Framer Motion. Verificação de tamanho de bundle no CI/CD (<150kb).
