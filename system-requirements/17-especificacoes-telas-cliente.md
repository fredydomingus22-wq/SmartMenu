# Especificações de Telas: Cliente (Menu & PDP)

Este documento detalha a interface do cliente final, focando em conversão, performance e padrões globais de e-commerce (Shopify-style).

## 1. Home / Vitrine de Produtos (Menu)

O menu deve ser estruturado como uma Landing Page de vendas, não apenas uma lista técnica.

### 1.1 Header (Branding & Contexto)
- **Logo:** Centralizado ou à esquerda, máx 48px de altura.
- **Mesa:** Badge discreto "Mesa 05".
- **Busca:** Input fixo ou ícone com expansão (Radix Dialog).

### 1.2 Seções Estratégicas (Home Layout)
1. **Hero Banner:** Promoção central do dia (ex: Combo Casal).
2. **Horizontal Slider (Categorias):** Navegação rápida visual.
3. **"Os Queridinhos" (Best Sellers):** Grid de 2 colunas com badges de "Best Seller".
4. **Categorias Principais:** Grid vertical intercalado com banners de categoria (ex: "Nossas Pizzas Artesanais").
5. **Upsell Generalizado:** Banner de sobremesas antes do rodapé.

### 1.3 Card de Produto (Specs)
- **Layout:** Vertical (Stack).
- **Imagem:** Square, object-cover, loading="lazy".
- **Ação:** Clique no card = Detalhes; Botão "+" = Adição rápida (se não houver variantes obrigatórias).
- **Touch Target:** Botão "+" deve ter no mínimo 48x48px de área clicável.

---

## 2. Página de Detalhes do Produto (PDP)

Focada em personalização e aumento do ticket médio.

### 2.1 Estrutura de Seções (Ordem de Relevância)
> [!IMPORTANT]
> A ordem e visibilidade destas seções são controladas dinamicamente via Dashboard por restaurante.
1. **Galeria de Imagens:** 
   - Mobile: Slider com indicadores de pontos.
   - Desktop: Main image + listagem vertical de thumbnails.
2. **Informações Base:** Nome (H1), Preço (Destaque), Rating (opcional).
3. **Personalização (Configurador):**
   - **Variantes:** Escolha única (ex: Tamanho P/M/G).
   - **Adicionais (Upsell Local):** "Turbine seu hambúrguer" (ex: + Bacon, + Queijo).
   - **Remoções:** Observações negativas (ex: "Sem Cebola").
4. **Descrição & Specs:** Tabs ou Accordion para manter a página limpa.
5. **Cross-Sell / Recomendações:** 
   - Seção horizontal "Combina bem com..." (ex: Batata Frita se o item for Hambúrguer).
6. **Social Proof (Opcional):** "X pessoas pediram este item hoje".

### 2.2 Sticky CTA (Mobile)
- Barra fixa no fundo contendo:
  - Seletor de quantidade (- 1 +).
  - Total dinâmico.
  - Botão "Adicionar ao Pedido".
- **Shadow:** Elevação suave para separar do conteúdo.

---

## 3. Rodapé do Restaurante (Global Footer)

Padrão de confiança e contacto.

### 3.1 Conteúdo
- **Informações de Contacto:** Endereço clicável (Google Maps), Telefone (WhatsApp direct branch), Horário de funcionamento.
- **Redes Sociais:** Ícones Lucide (Instagram, Facebook).
- **Links Institucionais:** Sobre Nós, Termos de Uso, Políticas de Alergênicos.
- **Powered by SmartMenu:** Badge discreto no bottom.

---

## 4. Performance & Acessibilidade (A11y)
- **Lighthouse Score:** Alvo 90+ em Performance.
- **Alt Text:** Obrigatório em todas as imagens de produto.
- **Focus Rings:** Customizados com a cor primária do tenant.
