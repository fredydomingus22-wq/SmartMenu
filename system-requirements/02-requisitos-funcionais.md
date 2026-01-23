# Requisitos Funcionais – SmartMenu

## 3. Escopo Funcional

### 3.1 Cliente (Web App – QR)

- Acesso via QR Code único por mesa
- **Visualização de Menu (Vitrine de Produtos Premium):**
  - **Stack:** Shadcn UI + Radix UI Primitives + Tailwind CSS.
  - **Estrutura do Card (article):** Aspect ratio fixo (square), imagem object-cover, hierarquia tipográfica (Nome: font-medium, Preço: font-bold text-lg).
  - **Interação:** Card navegável (wrapper <a>), botão de ação com `stopPropagation`.
  - **Feedback:** Hover com zoom (1.05x) e elevação suave no desktop; Feedback visual imediato no toque (mobile).
  - **Organização por Seções (Shopify-Style):**
    - O menu não é apenas uma lista, mas sim dividido em seções estratégicas: "Destaques da Semana", "Mais Vendidos", "Promoções", além das categorias tradicionais.
    - Seções de banner promocional intercaladas.
  - **Layout Responsivo:**
    - Mobile (<768px): Grid de 2 colunas, CTA sempre visível, touch targets ≥ 44x44px.
    - Desktop (≥1024px): Grid de 4–5 colunas, botão opcionalmente visível apenas no hover.
- **Página de Detalhes do Produto (Dedicated URL):**
  - Rota dedicada `/menu/{tenantId}/product/{productId}`.
  - **Conteúdo Principal:** H1 (Nome), Preço em destaque, Galeria de imagens (Thumbnail grid + Main image), Variantes (RadioGroup/Select).
  - **Acessibilidade:** Managed focus via Radix, ARIA labels para galeria.
  - **Seções de Conversão & Engajamento:**
    - **Upsell:** Sugestão de produtos complementares ("Aumente seu pedido por apenas R$ X").
    - **Recomendações:** "Quem comprou este também comprou" ou "Produtos Relacionados".
  - **Organização:** Tabs ou Accordion para Descrição, Especificações e Políticas.
  - **Mobile:** Sticky CTA no rodapé após scroll (sem cobrir conteúdo).
- **Rodapé do Restaurante (Global Standards):**
  - Informações de contacto (Endereço, Telefone, Redes Sociais).
  - Links Úteis (Sobre nós, Alergênicos, Políticas de Privacidade).
  - Branding do Restaurante em alta resolução.
- **Customização de Pedido:**
  - Seleção de molhos e acompanhamentos extras (com acréscimo de valor)
  - Opção de "Remover item" (ex: sem cebola, sem ketchup) via checklist ou observação
- Filtros (promoções, combos, vegetarianos, etc.)
- Carrinho de pedidos com resumo de personalizações
- Identificação por nome/apelido
- Envio de pedido
- Acompanhamento de status:
  - Recebido
  - Em preparação
  - Pronto
  - Finalizado / Pago
- Botões rápidos:
  - Chamar atendente
  - Pedir conta
- Histórico da sessão

---

### 3.2 Atendimento / Caixa

- Tela de pedidos em tempo real
- Notificação sonora e visual de novos pedidos
- Visualização por mesa, cliente e horário
- Atualização manual ou automática de status
- Gestão de pagamentos (local / digital)

---

### 3.3 Cozinha / Produção (KDS)

- Tela dedicada (Kitchen Display System)
- Pedidos filtrados por setor
- Ordem cronológica e por prioridade
- Marcação de etapas concluídas
- Tempo médio de preparo

---

### 3.4 Gerência

- **Dashboard analítico:**
  - Vendas por período
  - Ticket médio
  - Tempo de preparo
  - Produtos mais vendidos
  - Performance por turno
- **Gestão de menu:**
  - Ativar/desativar itens
  - Controle de estoque básico
  - Preços e promoções
- Gestão de mesas
- Gestão de usuários e permissões

---

### 3.5 Admin SaaS

- Multi-tenant (vários restaurantes)
- Gestão de planos e assinaturas
- Configurações globais
- Logs e auditoria

---

## 11. CRUD de Menu Item (Gestão Completa)

### 11.1 Princípios de Tenant Isolation

- Cada restaurante = 1 tenant
- Todo dado possui tenant_id
- Isolamento lógico no banco
- RBAC por tenant

### 11.2 Entidades Relacionadas

- Tenant
- MenuCategory
- MenuItem
- MenuItemOption
- MenuItemVariant
- MenuItemAvailability

### 11.3 Create – Criar Item de Menu (Página Dedicada)

**Fluxo UX (Gerente):**
1. Menu > Produtos > "+ Novo Produto"
2. **Interface:** Página dedicada com formulário segmentado e transições fluidas (Framer Motion).
3. **Padrão:** Todos os formulários complexos devem utilizar `ScrollArea` (Radix UI) para garantir acessibilidade e usabilidade em qualquer resolução.
4. Campos: Nome, Descrição, Categoria, Preço base, Imagens (Galeria com suporte a múltiplos uploads), Tipo, Setor.
5. Configurações avançadas: Variantes, Extras, Disponibilidade, Estoque inicial.
6. Salvar e Retornar.

**Backend:** `POST /tenants/{id}/menu-items`

### 11.4 Read – Visualização

- **Gerente:** Lista filtrável (categoria, status), Preview do item
- **Cliente:** Apenas itens ativos, Cache por tenant
- **Backend:** `GET /tenants/{id}/menu-items`

### 11.5 Update – Atualização

- Alterar preço, imagem, ativar/desativar, ajustar estoque
- Não afeta pedidos em andamento
- **Backend:** `PUT /menu-items/{id}`

### 11.6 Delete – Exclusão Lógica

- Soft delete (is_deleted = true)
- Histórico preservado

### 11.7 Gestão Avançada

- Agendamento de disponibilidade
- Preço promocional
- Item esgotado automático
- Clonagem de item

---

**Documento de referência para requisitos funcionais do SmartMenu.**

## 12. CRUD de Gestão de Mesas e QR Code

### 12.1 Objetivo
Permitir que o restaurante configure seu plano de sala digital e forneça acesso fácil aos clientes via QR Codes físicos.

### 12.2 Create – Adicionar Mesa
**Fluxo UX (Gerente):**
1. Configurações > Mesas > Adicionar Mesa
2. Campos: Número da Mesa (Único por Tenant)
3. Backend: `POST /tables`
4. Resultado: Mesa criada e QR Code gerado instantaneamente na UI.

### 12.3 Read – Listagem e QR
**Fluxo UX (Gerente):**
1. Visualização em Grid de todas as mesas cadastradas.
2. Cada card exibe:
   - Número da Mesa
   - QR Code (Gerado via Client-Side: `https://app.smartmenu.com/q/{tenantId}/{tableId}`)
   - Status (Ocupada/Livre - Futuro)
   - Contagem de pedidos ativos

### 12.4 QR Code & Acesso
- **Formato:** SVG vetorial para alta qualidade de impressão.
- **Ação:** Botão "Baixar" em cada card para impressão individual.
- **Link:** Redireciona o cliente diretamente para o Menu Digital daquele Tenant, com a Mesa pré-selecionada na sessão.

### 12.5 Delete – Remover Mesa
- Ação crítica com confirmação.
- Backend: `DELETE /tables/{id}`

---

## 13. Programa de Fidelidade (Club de Pontos)

### 13.1 Configuração do Restaurante (Gerente)
- Toggle para Ativar/Desativar o programa de fidelidade por Tenant.
- Definição da **Regra de Conversão**: (Ex: R$ 1,00 = 1 Ponto).
- Gestão de **Recompensas**:
  - Seleção de produtos do menu que podem ser resgatados.
  - Definição do custo em pontos para cada produto selecionado.
  - Definição de descontos percentuais ou fixos em pontos.

- **Branding Personalizado:**
  - Upload de Logo e Banner da loja.
  - Seleção de Cor Primária e Secundária.
  - O cliente vê *apenas* a marca do restaurante, nunca "SmartMenu".

### 13.2 Identificação e Registro do Cliente (Local)
- **Registro Isolado:** O cadastro cria um vínculo único `(User, Tenant)`.
- **Visão Única:** O cliente acessa `/menu/{tenantId}` e vê apenas seu histórico e pontos *daquele* restaurante.
- **Login:** O sistema detecta o contexto do restaurante e filtra os dados automaticamente.


### 13.3 Acúmulo de Pontos
- Atribuição automática de pontos após a finalização/pagamento do pedido.
- Regra baseada no valor total do pedido (subtotal).

### 13.4 Resgate de Pontos
- Aplicação de recompensa no carrinho se o cliente tiver saldo suficiente.
- Validação no checkout para garantir que os pontos ainda são válidos.
- Fluxo de aprovação: O item resgatado aparece para o restaurante com sinalização de "Resgate Fidelidade".

