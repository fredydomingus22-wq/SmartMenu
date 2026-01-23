

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

## 19. ROADMAP DE IMPLEMENTAÇÃO

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

## 20. MODALIDADE DE NEGÓCIO

- **SaaS Subscription** (Software como serviço)

- Modelo de assinatura mensal, baseado em tiers:

  - **Basic:** até 50 mesas, menu digital, pedidos em tempo real → \$50/mês
  - **Pro:** até 150 mesas, dashboards básicos, KDS, estoque, notificações → \$150/mês
  - **Enterprise:** ilimitado, multi-tenant, analytics avançado, suporte premium → \$300–500/mês

- Setup inicial opcional: \$200–500 (configuração de tema, menu inicial e treinamento)

- Gateway de pagamento integrado (comissão variável por transação opcional)

---

**Documento atualizado: agora inclui User Stories completas, roadmap de implementação, modalidade de negócio e pricing para SaaS multi-tenant do sistema.**



---

## 21. AUTOMAÇÃO DE WORKFLOWS (NO‑CODE / LOW‑CODE + IA)

### Visão Geral

Este módulo transforma o sistema num **orquestrador operacional inteligente**, inspirado em ferramentas como **n8n / Zapier**, mas **nativo para restaurantes**. O objetivo é **eliminar tarefas repetitivas, reduzir erros humanos e aumentar eficiência**, com ou sem IA.

Arquitetura base:

- Event-driven (Order, Payment, Stock, Time, User Action)
- Workflow Engine (visual)
- Nodes (ações)
- Triggers (gatilhos)
- Execução síncrona ou assíncrona

---

## 21.1 Motor de Workflow (Core)

### Funcionalidades

- Criador visual de fluxos (drag & drop)
- Triggers baseados em eventos
- Condições (if / else)
- Ações encadeadas
- Execução programada ou em tempo real

### Lógica de Funcionamento

1. Evento ocorre (ex: pedido criado)
2. Trigger dispara
3. Condições são avaliadas
4. Ações executadas
5. Logs e auditoria por tenant

---

## 21.2 Automações Prontas (Templates)

### 🔁 1. Pedido → Notificação Inteligente

**Trigger:** Novo pedido **Ações:**

- Enviar notificação sonora na cozinha
- Enviar WhatsApp para gerente se valor > X
- Atualizar dashboard

**Dores resolvidas:** pedidos perdidos, atraso no atendimento **Benefícios:** resposta imediata, menos falhas humanas **Venda:** "Nenhum pedido passa despercebido"

---

### 📦 2. Estoque Baixo → Ação Automática

**Trigger:** Estoque < limite **Ações:**

- Marcar item como esgotado
- Notificar gerente
- Criar tarefa de reposição

**Dores:** pedidos impossíveis, frustração do cliente **Benefícios:** menu sempre correto **Venda:** "O sistema evita vendas que viram problema"

---

### ⏰ 3. Happy Hour Automático

**Trigger:** Horário configurado **Ações:**

- Alterar preço de itens
- Ativar banner promocional
- Enviar push interno

**Dores:** promoções esquecidas **Benefícios:** aumento de vendas sem esforço **Venda:** "Promoções que se ativam sozinhas"

---

### 🧠 4. Upsell Automático com IA

**Trigger:** Item adicionado ao carrinho **Ações:**

- IA sugere extra/combo
- Exibe sugestão ao cliente

**Dores:** baixo ticket médio **Benefícios:** mais receita por pedido **Venda:** "Venda mais sem contratar mais gente"

---

### 💬 5. Reclamação → Fluxo de Resolução

**Trigger:** Feedback negativo **Ações:**

- Registrar ocorrência
- Notificar gerente
- Gerar cupom automático

**Dores:** clientes insatisfeitos silenciosos **Benefícios:** retenção **Venda:** "Transforme erro em fidelização"

---

### 💰 6. Fechamento Diário Automático

**Trigger:** Horário (ex: 23:59) **Ações:**

- Gerar relatório
- Enviar por email/WhatsApp
- Salvar histórico

**Dores:** fechamento manual **Benefícios:** controle financeiro **Venda:** "O relatório aparece pronto"

---

## 21.3 Automações com IA (Avançadas)

### 🤖 IA de Previsão de Demanda

- Analisa histórico
- Prevê pico por dia/horário
- Sugere escala e estoque

**Venda:** "Prepare-se antes da confusão"

---

### 🧠 IA de Análise Operacional

- Detecta gargalos
- Sugere ajustes de menu/preço

**Venda:** "IA como gerente invisível"

---

### ✍️ IA para Conteúdo de Menu

- Gera descrições atrativas
- Sugere nomes de combos

**Venda:** "Menu que vende sozinho"

---

## 21.4 Integrações Externas

### Comunicação

- WhatsApp Business API
- Email (SMTP)
- SMS

### Financeiro

- Multicaixa Express
- POS local
- Excel / Google Sheets

### Operação

- Impressoras térmicas
- Displays externos

---

## 21.5 Benefícios Diretos para Restaurantes

- Menos trabalho manual
- Menos erros operacionais
- Mais velocidade
- Aumento de ticket médio
- Melhor experiência do cliente

---

## 21.6 Argumentos Comerciais (Venda)

- "O sistema trabalha mesmo quando ninguém está olhando"
- "Automatiza o que hoje depende da memória do funcionário"
- "Reduz custos sem reduzir qualidade"
- "IA aplicada à operação real, não moda"

---

## 21.7 Diferencial Competitivo

Nenhum concorrente local oferece:

- Workflows nativos
- IA operacional
- Automação orientada a eventos de restaurante

Isso posiciona o produto como **plataforma inteligente**, não só sistema de pedidos.

---

**Módulo de automação definido – pronto para MVP e expansão estilo n8n, porém focado em restaurantes.**

---

# 🔗 INTEGRAÇÃO DAS AUTOMAÇÕES COM DESIGN SYSTEM & STORYBOOK

## Objetivo

Garantir que **todas as automações inteligentes do menu digital** tenham **representação visual, estados de UI, microcopy e animações padronizadas**, documentadas no **Storybook**, servindo como contrato entre backend, frontend e produto.

---

## 🧠 Princípio-chave

> *Automação que não aparece na UI é bug.*\
> Toda automação deve refletir **feedback claro, sutil e confiável** para o utilizador.

---

## 🧩 MAPEAMENTO: AUTOMAÇÕES → COMPONENTES UI

### 1️⃣ Reordenação Inteligente do Menu (IA)

**Automação:** `MENU_VIEWED → reorderMenu()`

**Componentes Storybook:**

- `MenuGrid`
- `MenuItemCard`
- `SmartBadge` ("Recomendado", "Popular agora")

**Estados documentados:**

- default
- reordered-by-ai
- highlight-transition

**Animação (Framer Motion):**

- fade + slide suave (y: 6px → 0)
- duration: 0.25s

**Microcopy UX:**

- "Sugestões pensadas para si"

---

## 2️⃣ Precificação Dinâmica

**Automação:** `TIME_SLOT_REACHED | LOW_STOCK`

**Componentes:**

- `PriceTag`
- `PriceDelta`

**Estados:**

- static
- price-up
- price-down

**Animação:**

- scale 0.95 → 1
- color transition (token-based)

**Microcopy:**

- "Promo ativa"
- "Alta procura"

---

## 3️⃣ Upsell / Cross-sell Inteligente

**Automação:** `ITEM_ADDED_TO_CART`

**Componentes:**

- `SmartSuggestionCard`
- `AddToOrderCTA`

**Estados:**

- suggested
- accepted
- dismissed

**Animação:**

- slide-up + opacity

**UX Rule:**

- máximo 1 sugestão por interação

---

## 4️⃣ Abandono de Pedido

**Automação:** `ORDER_STARTED → idle`

**Componentes:**

- `OrderReminderBanner`

**Estados:**

- idle-warning
- incentive

**Microcopy:**

- "Seu pedido está quase pronto"
- "Finalizar agora"

---

## 5️⃣ Bloqueio Automático de Itens

**Automação:** `LOW_STOCK_DETECTED`

**Componentes:**

- `MenuItemCard (disabled)`
- `AlternativeSuggestion`

**Estados:**

- disabled
- alternative-active

**Microcopy:**

- "Indisponível no momento"
- "Experimente este"

---

## 6️⃣ Feedback Loop (Aprendizado)

**Automação:** `ORDER_CONFIRMED`

**Componentes (internos / invisíveis):**

- `TelemetryIndicator` (dev-only)

**Storybook:**

- documentado como *non-visual automation*

---

## 📚 STORYBOOK – ESTRUTURA FINAL

```
/storybook
 ├── Menu
 │   ├── MenuGrid.stories.tsx
 │   ├── MenuItemCard.stories.tsx
 │   └── SmartBadge.stories.tsx
 ├── Pricing
 │   └── PriceTag.stories.tsx
 ├── Automation
 │   ├── Upsell.stories.tsx
 │   ├── Abandonment.stories.tsx
 │   └── DisabledItems.stories.tsx
 ├── Motion
 │   └── Transitions.stories.tsx
```

---

## 🔐 MULTI-TENANT & FEATURE FLAGS (UI)

Cada automação possui flags:

- `automation.menu.reorder`
- `automation.dynamic.pricing`
- `automation.smart.upsell`

Document
