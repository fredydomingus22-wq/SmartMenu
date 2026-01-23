
---

## 15. GUIA DE UX WRITING & MICROCOPY PADRÃO

Objetivo: Criar **tom consistente e previsível** em todas as interações, facilitando compreensão, ação e confiança do usuário.

### 15.1 Princípios Gerais
- Curto, claro e direto (≤5 palavras para ações primárias)
- Evitar jargão técnico para clientes finais
- Uniformidade de verbos em ações similares
- Feedback imediato após ações
- Inclusão de contexto quando necessário

### 15.2 Exemplos de Microcopy por Contexto

**Cliente (QR Menu)**
- Botões: “Adicionar ao carrinho”, “Enviar pedido”, “Chamar atendente”, “Pedir conta”
- Estado de pedido: “Recebido”, “Em preparo”, “Pronto”, “Cancelado”
- Avisos: “Item esgotado”, “Selecione pelo menos 1 opção”

**Atendente / Cozinha**
- Notificação: “Novo pedido na mesa 8”
- Botões: “Marcar preparando”, “Pronto para entrega”, “Cancelar pedido”
- Alertas de estoque: “Estoque baixo: X unidades restantes”

**Gerente / Admin**
- Botões: “Adicionar Item”, “Atualizar Preço”, “Ativar/Desativar Item”
- Avisos: “Mudanças salvas com sucesso”, “Erro ao atualizar item”

### 15.3 Padrão de Tom
- Profissional, mas amigável
- Ação no presente: “Enviar”, “Marcar”, “Adicionar”
- Evitar negações complexas: usar positivo preferencialmente

---

## 16. PADRÕES DE ANIMAÇÃO E INTERAÇÃO (FRAMER MOTION)

Objetivo: Dar **feedback visual claro**, suavizar transições e aumentar percepção de qualidade.

### 16.1 Princípios
- Suave e rápida (0.2–0.3s para micro-interações)
- Coerente entre componentes iguais
- Não distrair ou atrasar fluxo crítico
- Suportar prefers-reduced-motion (acessibilidade)

### 16.2 Exemplos de Uso

**Botões e Cards**
- Hover: leve escala 1.05 + sombra sutil
- Click: depressão visual 0.95 scale + feedback ripple opcional

**Notificações / Toasts**
- Entrar: slide from top + fadeIn
- Sair: fadeOut + scaleDown

**Modals / Overlays**
- FadeIn + slideUp suave
- FadeOut + slideDown ao fechar

**Listas / Tables**
- Item adicionado: slideIn da direita
- Item removido: slideOut da esquerda

### 16.3 Tokens de Animação (para uso consistente)
- Duration: 0.2s, 0.3s, 0.5s (micro, média, longa)
- Easing: easeOutQuad (entrar), easeInQuad (sair)
- Delay: 0, 0.1s, 0.2s (sequenciamento)

---

**Agora o sistema tem:**
- Design System oficial com grid, cores, tipografia e componentes
- UX Writing e Microcopy padrão por perfil
- Padrões de animação e interação documentados para uniformidade e acessibilidade

Pronto para servir de referência **total para desenvolvimento e refatoração** com consistência e qualidade profissional.

