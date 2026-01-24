# UX Flows – SmartMenu

## 10. UX Flows (Wireframes Textuais)

### 10.1 Fluxo – Landing Page & Onboarding

1. Acesso à raíz (`/`)
2. Visualização de Hero (Conversão) e Funcionalidades
3. Clique em "Começar" ou "Login"
4. Redirecionamento inteligente (se logado -> Dashboard, se não -> Login)

---

### 10.2 Fluxo – Cliente (QR Code)

1. Scan QR da mesa (URL: `/menu/[id]?table=[number]`)
2. Validação de sessão (tenant + mesa)
3. Tela Menu (Home Concept):
   - Header: branding do restaurante + mesa (sticked) + **Language Selector** (Globe Icon/Dropdown).
   - **Discovery Sections:**
     - Hero Banner (Promocional).
     - Categorias em tabs horizontais (Sticky below Header).
     - Featured Section: "Mais Vendidos" (Grid).
     - Standard Categories: Itens lazy loaded.
   - Clique no card abre **Product Detail Page** (Dedicated URL).
3.1 Detalhe e Personalização (PDP):
   - Hero: Image Gallery (Swipe on mobile).
   - Configuration: Variantes e Adicionais (Upsell local).
   - **Engagement Blocks:**
     - Recommendations: "Experimente também..."
     - Upsell: "Transforme em Combo".
   - Info: Descrição e Alergênicos.
   - Sticky CTA: Footer fixo com seletor de quantidade e preço total.
4. Carrinho Inteligente:
   - Floating Action Button com contador
   - Lista persistente via Context + LocalStorage
   - Exibição de itens com suas personalizações.
   - Edição de quantidade diretamente no drawer.
5. Checkout:
   - Revisão final
   - Campo de observações por item
   - Envio via POST (Trustless: preço recalculado no server)
6. Confirmação:
   - Toast de sucesso
   - Limpeza automática do carrinho
   - Tela de status (Real-time updates via WebSockets)

---

### 10.2 Fluxo – Atendente / Caixa

```
1. Login
2. Tela "Pedidos Ativos"
3. Notificação sonora
4. Visualização por mesa
5. Atualizar status
6. Finalizar pedido / pagamento
```

---

### 10.3 Fluxo – Cozinha (KDS)

1. **Acesso:** Login especializado ou redirecionamento de Manager para `/dashboard/kds`.
2. **Visualização:** Grid de cards (`KDSOrderCard`) com pedidos pendentes e em preparo.
3. **Priorização:** Ordenação automática por tempo de espera. Diferenciação visual por cores conforme o atraso.
4. **Interação:** 
   - Clique em "Preparar" -> Status muda para `PREPARING`. O cliente recebe notificação "Seu pedido está sendo preparado".
   - Clique em "Pronto" -> Status muda para `READY`. O cliente recebe notificação "Seu pedido está pronto para retirada/entrega".
5. **Filtros:** Possibilidade de filtrar por setor (Bar, Cozinha, Copa) se o tenant tiver múltiplos setores.

---

### 10.4 Fluxo – Gerente

```
1. Login
2. Dashboard
3. Menu Management:
   - Visualizar Lista de Categorias e Produtos
   - Criar/Editar Categoria (Modal/Drawer com ScrollArea)
   - **Criar/Editar Produto (Dedicated Page):**
     - Transição suave (Slide) para `/dashboard/menu/products/new`
     - Formulário segmentado em Tabs (Info Básica, Preços, Extra, Fotos)
     - ScrollArea interno para o conteúdo
     - **Auto-Translate Trigger:** Botão opcional para traduzir campos vazios via IA (para idiomas ativados).
     - Sticky Header com botão "Salvar" e "Cancelar"
4. Relatórios
5. Configurações > Mesas:
   - Visualizar Grid de Mesas
   - "Adicionar Mesa" (Drawer com ScrollArea)
   - Baixar QR (SVG)
   - Remover Mesa
6. **Fidelidade (Club de Pontos):**
   - Ativar programa via Toggle.
   - Definir valor de 1 ponto (ex: 1kz = 1pt).
   - Listar Recompensas cadastradas.
   - Criar Recompensa: escolher produto do menu + custo em pontos.

---

### 10.5 Fluxo – Fidelidade (Cliente)
1. **Identificação:** Seção "Minha Conta" no menu ou banner "Ganhe pontos aqui".
2. **Cadastro/Login:** Drawer modal simples (Email/Senha).
3. **Visão de Saldo:** Card flutuante ou fixo no topo mostrando pontos atuais.
4. **Resgate:**
   - Visualizar "Catálogo de Recompensas".
   - Clicar em "Resgatar" -> Item adicionado ao carrinho com preço 0.00 e flag de "Recompensa".
   - Verificação de saldo no momento da adição.
```

---

**Documento de referência para fluxos de UX do SmartMenu.**
