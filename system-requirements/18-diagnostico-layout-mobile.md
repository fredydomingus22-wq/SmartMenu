# 18. Diagnóstico Técnico de Layout Mobile – SmartMenu

## Visão Geral
Este documento contém o diagnóstico técnico detalhado de problemas de layout mobile observados no sistema SmartMenu. Mesmo sem acesso ao código, os sintomas visuais indicam falhas arquiteturais comuns em sistemas SaaS nascidos desktop-first.

## Sintomas Observáveis (Padrão Recorrente)
- Componentes estouram horizontalmente
- Scroll horizontal indesejado
- Cards/listas "espremidos" ou desalinhados
- Elementos fixos competindo com viewport (header/footer)
- Layout muda quando aparece teclado virtual

**Conclusão:** Não é bug isolado, mas falha de arquitetura de layout.

## Causas Mais Prováveis (Ordem de Impacto)
1. **Uso de width fixo ou min-width global**
2. **Containers assumindo viewport (100vw) ignorando safe-area**
3. **Componentes acoplados ao layout (sabem demais)**
4. **Falta de mobile-first nos tokens de spacing**
5. **Estado global não controlado (menu, drawer, sidebar)**
6. **Uso errado de position: fixed no mobile**
7. **Grid/Flex misturados sem regra clara**

**Nota:** 90% das vezes o bug não está no componente que "quebra", mas no pai.

## Correções Arquiteturais (Obrigatórias)

### A. Separar Arquitetura de Layout da UI
**Estado Atual (Problemático):**
- Componente = UI + layout + regras de viewport

**Estado Correto:**
- **Layout Components:** AppShell, PageContainer, ContentArea, Stack/Grid system
- **UI Components:** Card, Button, ListItem, Badge

**Implementado:**
- ✅ `AppShell`: Container principal mobile-first
- ✅ `PageContainer`: Wrapper responsivo com padding fluido
- ✅ `Stack`: Sistema de layout vertical/horizontal
- ✅ Separação clara entre layout e apresentação

**Regras para UI Components:**
- Nunca definir width global
- Nunca assumir viewport
- Nunca controlar scroll

### B. Criar um AppShell Mobile-First
Estrutura conceitual:
```
<AppShell>
 ├── Header (sticky)
 ├── Main (scroll container único)
 │    └── PageContent
 └── BottomBar (mobile only)
</AppShell>
```

**Regras Obrigatórias:**
1. Apenas 1 scroll principal
2. Nada de overflow: hidden global
3. Nada de múltiplos position: fixed

### C. Corrigir Uso de Viewport Units (CRÍTICO)
**Evitar (Causa Bugs):**
```css
height: 100vh;
```

**Usar (Correto):**
```css
height: 100dvh;
```
Ou:
```css
min-height: 100%;
```

**Impacto:** Resolve 30-40% dos bugs mobile modernos sozinho.

### D. Design Tokens Responsivos (Obrigatório)
**Estado Atual:** Spacing fixo, tipografia não escala, componentes não colapsam.

**Correção com Tokens Fluidos:**
```css
spacing: {
  xs: clamp(4px, 1vw, 8px),
  sm: clamp(8px, 2vw, 12px),
  md: clamp(12px, 3vw, 16px),
}
```

**Benefícios:**
- Layout fluido
- Menos media queries
- Menos bugs futuros

### E. Estados Globais Conscientes de Viewport
**Problemas Clássicos:**
- Sidebar aberta no desktop quebra mobile
- Drawer não reseta estado ao mudar viewport

**Correções:**
- Estado de navegação dependente de breakpoint
- Reset automático ao trocar viewport

**Nota:** Estado mal gerido = layout bug mascarado.

### F. Proibir Práticas que Causam Regressão
Regras internas obrigatórias:
- ❌ width: 100vw
- ❌ position: fixed sem justificativa
- ❌ min-width em cards
- ❌ alturas fixas para conteúdo dinâmico

## Checklist Oficial de Auditoria (SmartMenu/SmartLab)

### ✅ A. Arquitetura de Layout
- [ ] Existe apenas 1 scroll principal
- [ ] Layout é mobile-first
- [ ] AppShell separado de UI
- [ ] Nenhum componente assume viewport
- [ ] Safe-area (notch) considerada

### ✅ B. CSS & Responsividade
- [ ] Sem 100vh em mobile
- [ ] Uso correto de dvh
- [ ] Nenhum width fixo em UI
- [ ] Grid/Flex usados com propósito claro
- [ ] Container Queries quando aplicável

### ✅ C. Design System
- [ ] Tokens de spacing fluidos
- [ ] Tipografia com rem
- [ ] Componentes colapsam verticalmente
- [ ] Touch targets ≥ 44px

### ✅ D. Estado & Navegação
- [ ] Estado de menu controlado por viewport
- [ ] Nenhum estado "vaza" para mobile
- [ ] Drawer/Sidebar resetam corretamente

### ✅ E. Performance & Estabilidade
- [ ] Sem layout shift visível (CLS)
- [ ] Skeletons com altura estável
- [ ] Imagens responsivas
- [ ] Nenhum reflow excessivo

### ✅ F. Testes Obrigatórios
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Rotação de tela
- [ ] Teclado virtual
- [ ] Zoom 125% / 150%

## Conclusão (Visão de Investidor)
O problema não é "ajustar mobile" – é maturar a arquitetura de layout do produto.

**Riscos se não corrigido:**
- Cada nova feature quebra mobile
- Custo de manutenção explode
- UX inconsistente
- Produto perde credibilidade enterprise

**Recomendação:** Implementar correções arquiteturais antes de adicionar novas features. Usar agentes especializados (UI/UX Designer e Mobile Layout Specialist) para auditoria e implementação.