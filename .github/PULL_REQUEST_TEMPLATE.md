# ✅ Checklist Oficial de PR — SmartMenu

Este checklist é **obrigatório** para todos os PRs relacionados a UI/Layout/Responsividade.

**Não aprovado → PR bloqueado.**

## 🧱 Arquitetura

* [ ] Usa AppShell correto (`min-height: 100dvh`, safe-area)
* [ ] Respeita PageContainer (max-width, padding responsivo)
* [ ] Um único scroll principal por página
* [ ] Sem viewport units proibidas (`100vh`, `100vw`)
* [ ] Layout separado de UI (usa Layout Primitives)

## 📐 Responsividade

* [ ] Testado em mobile real (não só emulação)
* [ ] Sem scroll horizontal em qualquer viewport
* [ ] Layout colapsa verticalmente (não horizontal)
* [ ] Safe-area respeitada (notch, home indicator)
* [ ] Breakpoints seguem padrão oficial (sm/md/lg/xl)

## 🧩 UI & Design System

* [ ] Usa tokens oficiais de spacing (clamp fluido)
* [ ] Tipografia em `rem`, nunca `px`
* [ ] Touch targets ≥ 44px em mobile
* [ ] Componentes funcionam isolados (Storybook)
* [ ] Estados visuais completos (hover, focus, active, disabled)

## 🧠 Estado & Navegação

* [ ] Estados reagem corretamente ao breakpoint
* [ ] Drawer/Sidebar resetam ao mudar viewport
* [ ] Sem estado "vazando" de desktop → mobile
* [ ] Navegação acessível (keyboard, screen reader)

## ⚡ Performance & Estabilidade

* [ ] Sem layout shift (CLS < 0.1)
* [ ] Skeletons mantêm altura estável
* [ ] Imagens responsivas (`sizes`, `srcset`)
* [ ] Nenhum reflow desnecessário
* [ ] Bundle size não aumentou > 10kb sem justificativa

## 🧪 Testes Mínimos

* [ ] Android Chrome (últimas 2 versões)
* [ ] iOS Safari (últimas 2 versões)
* [ ] Rotação de tela (portrait ↔ landscape)
* [ ] Teclado virtual (não cobre conteúdo importante)
* [ ] Zoom 125% / 150% (acessibilidade)

## 📋 Requisitos Adicionais

* [ ] Documentação atualizada (se novo componente)
* [ ] Storybook criado/atualizado
* [ ] Design review aprovado
* [ ] A11y audit passado (WAVE, axe-core)
* [ ] Sem console errors/warnings

## 🚫 Práticas Proibidas (Bloqueiam PR)

* [ ] ❌ `width: 100vw`
* [ ] ❌ `height: 100vh`
* [ ] ❌ `position: fixed` em UI components
* [ ] ❌ `min-width` em cards/itens
* [ ] ❌ CSS inline para layout
* [ ] ❌ Breakpoints customizados
* [ ] ❌ Viewport units em componentes

## 📝 Aprovação

**Responsável pela revisão:** ____________________
**Data:** ____________________
**Status:** ⭕ Pendente / ✅ Aprovado / ❌ Rejeitado

**Comentários:**
____________________
____________________
____________________

---

**Referências:**
- [Arquitetura Oficial de Layout](system-requirements/07-design-system.md)
- [Guia Interno de Layout & UI](system-requirements/07-design-system.md)
- [Relatório de Auditoria Mobile](audit-report-mobile-layout.md)