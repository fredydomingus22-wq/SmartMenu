# Visão Geral e Requisitos de Negócio

## 1. Visão Geral do Sistema
O sistema é uma plataforma SaaS de pedidos digitais para restaurantes e fast food, acessível via QR Code por mesa, permitindo que clientes visualizem o menu, realizem pedidos, acompanhem o estado em tempo real e interajam com o atendimento. Do lado do restaurante, o sistema centraliza pedidos, notifica setores (cozinha, bar, caixa) e fornece dashboards de gestão.

Objetivo: **reduzir fricção operacional, aumentar ticket médio e gerar dados acionáveis**.

---

## 2. Stakeholders
- Cliente final (consumidor)
- Atendente / Caixa
- Cozinha / Bar
- Gerente do restaurante
- Administrador do sistema (SaaS)

---

## 3. Escopo Funcional (OpenSpec Style)

### 3.1 Cliente (Web App – QR & Landing)
- **Landing Page:** Página principal premium com visão geral da plataforma e conversão.
- **Acesso via QR Code:** Identificação única por mesa, tenant e organização.
- **Visualização de Menu:** Categorias, imagens, preços e descrições otimizadas.
- **Carrinho Inteligente:** Persistência via LocalStorage, permitindo navegação sem perda de dados.
- **Identificação:** Identificação por nome/apelido integrada ao pedido.
- **Checkout:** Fluxo de revisão de itens e envio instantâneo.
- **Acompanhamento de Status (Phase 2):**
  - Recebido (Implementado)
  - Em preparação
  - Pronto
  - Finalizado / Pago
- **Botões Rápidos:**
  - Chamar atendente
  - Pedir conta
- **Histórico da Sessão:** Persistente durante a visita.

### 3.2 Atendimento / Caixa
- Tela de pedidos em tempo real
- Notificação sonora e visual de novos pedidos
- Visualização por mesa, cliente e horário
- Atualização manual ou automática de status
- Gestão de pagamentos (local / digital)

### 3.3 Cozinha / Produção (KDS)
- Tela dedicada (Kitchen Display System)
- Pedidos filtrados por setor
- Ordem cronológica e por prioridade
- Marcação de etapas concluídas
- Tempo médio de preparo

### 3.4 Gerência
- Dashboard analítico:
  - Vendas por período
  - Ticket médio
  - Tempo de preparo
  - Produtos mais vendidos
  - Performance por turno
- Gestão de menu:
  - Ativar/desativar itens
  - Controle de estoque básico
  - Preços e promoções
- Gestão de mesas
- Gestão de usuários e permissões (Escopado por Organização e Tenant)

### 3.5 Admin SaaS
- Multi-Level Multi-tenant:
  - **Organização:** Nível de empresa (ex: Grupo de Restaurantes)
  - **Tenant:** Nível de loja/filial individual
- Gestão de planos e assinaturas
- Configurações globais
- Logs e auditoria
- Gestão de planos e assinaturas
- Configurações globais
- Logs e auditoria

---

## 4. Requisitos Não Funcionais
- Alta disponibilidade
- Baixa latência (tempo real)
- Responsivo (mobile-first)
- Multi-idioma
- Segurança (JWT, RBAC)
- Escalável (cloud-native)

---

## 20. MODALIDADE DE NEGÓCIO

- **SaaS Subscription** (Software como serviço)

- Modelo de assinatura mensal, baseado em tiers:

  - **Basic:** até 50 mesas, menu digital, pedidos em tempo real → \$50/mês
  - **Pro:** até 150 mesas, dashboards básicos, KDS, estoque, notificações → \$150/mês
  - **Enterprise:** ilimitado, multi-tenant, analytics avançado, suporte premium → \$300–500/mês

- Setup inicial opcional: \$200–500 (configuração de tema, menu inicial e treinamento)

- Gateway de pagamento integrado (comissão variável por transação opcional)
