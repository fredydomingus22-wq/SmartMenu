# Animações e Interações – SmartMenu

## 16. Padrões de Animação e Interação (Framer Motion)

**Objetivo:** Dar feedback visual claro, suavizar transições e aumentar percepção de qualidade.

---

### 16.1 Princípios

- Suave e rápida (0.2–0.3s para micro-interações)
- Coerente entre componentes iguais
- Não distrair ou atrasar fluxo crítico
- Suportar `prefers-reduced-motion` (acessibilidade)

---

### 16.2 Exemplos de Uso

#### Botões e Cards
- **Hover:** leve escala 1.05 + sombra sutil
- **Click:** depressão visual 0.95 scale + feedback ripple opcional

#### Notificações / Toasts
- **Entrar:** slide from top + fadeIn
- **Sair:** fadeOut + scaleDown

#### Modals / Overlays
- **Abrir:** FadeIn + slideUp suave
- **Fechar:** FadeOut + slideDown

#### Transições de Página (Dedicated Forms)
- **Entrada:** `initial={{ x: "100%" }} animate={{ x: 0 }}` (Slide da direita para simular entrada de nova camada)
- **Saída:** `exit={{ x: "100%" }}` ou `exit={{ opacity: 0 }}`
- **Stagger:** Entrada sequencial dos campos do formulário para reduzir carga cognitiva.

#### Listas / Tables
- **Item adicionado:** slideIn da direita (x: 20 → 0)
- **Item removido:** slideOut da esquerda

#### Primitives
- **MenuGrid:** Container animado que orquestra a entrada sequencial (staggered) de categorias e produtos.

---

### 16.3 Implementação (Framer Motion)

- **FadeIn:** `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` (Cards de Menu)
- **SlideUp:** `initial={{ y: 20 }} animate={{ y: 0 }}` (Listas)
- **ScaleDown:** `whileTap={{ scale: 0.95 }}` (Botões)
- **Duration:** 0.2s (micro), 0.3s (padrão), 0.5s (longa)

| Token | Valor | Uso |
|-------|-------|-----|
| Duration micro | 0.2s | Micro-interações |
| Duration média | 0.3s | Transições padrão |
| Duration longa | 0.5s | Modais, overlays |
| Easing entrada | easeOutQuad | Elementos entrando |
| Easing saída | easeInQuad | Elementos saindo |
| Delay | 0, 0.1s, 0.2s | Sequenciamento |

### 16.4 Transições Globais (Web App)

#### Route Transition (Dashboard)
```typescript
initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
transition={{ duration: 0.3, ease: "easeOut" }}
```

#### Shared Layout (Tabs/Nav)
- Usar `layoutId` para o indicador de "Link Ativo" no Sidebar para criar o efeito de "deslize" entre opções.

---

**Documento de referência para animações e interações do SmartMenu.**
