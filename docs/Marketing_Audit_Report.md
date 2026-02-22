# Relatório de Auditoria de Marketing e SEO: SmartMenu Landing Page

**Documento Avaliado:** `docs/Landing_Page_Briefing.md`
**Workflow Base:** `/marketing_audit`

---

## 🟢 Fase 1: Mercado, Mensagem e Baseline Técnico

### 1.1 Avaliação de Posicionamento e Conversão

- **Clareza da Proposta de Valor (Above the fold):** A secção Hero é muito forte visualmente ("food porn" B-Roll), mas a cópia atual ("O seu restaurante está a perder 30%...") foca-se mais na dor do que na solução. **Recomendação:** Incluir um Headline principal (H1) mais aspiracional antes de introduzir a dor, ex: _"O Menu Digital Que Aumenta os Seus Lucros Sem Esforço."_
- **Visibilidade e Intenção dos CTAs:** Os CTAs primário ("Comece o seu Teste Gratuito Agora") e secundário ("Ver Menu de Demonstração") têm excelente contraste de intenção. O "Teste Gratuito" atrai _early adopters_ práticos, enquanto a "Demonstração" captura os mais cautelosos.
- **Gaps de Confiança (Trust Gaps):** Faltam sinais de autoridade visíveis no topo. **Recomendação:** Adicionar uma barra de prova social debaixo do Hero (ex: _"A impulsionar mais de 50 restaurantes em Angola"_, ou logótipos de primeiros clientes/parceiros conhecidos).

### 1.2 Checklist de SEO Técnico e Estrutural

| Prioridade | Ação Recomendada                                                                                                                                                                                                                    | Esforço |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| **Alta**   | **Semântica HTML:** Garantir que apenas existe um `<h1>` na página (no Hero) e que as secções seguintes usam `<h2>` e `<h3>` lógicos para os crawlers.                                                                              | Baixo   |
| **Alta**   | **Core Web Vitals:** Para o vídeo de background, usar `<video autoplay loop muted playsinline>` com o atributo `poster` (uma imagem optimizada leve para carregar antes do vídeo). Atrasar o carregamento de vídeos abaixo da fold. | Médio   |
| **Média**  | **Metadata e Open Graph:** Definir Títulos (`<title>`) e Descrições ricas com palavras-chave como _"Menu Digital para Restaurantes"_, _"Gestão de KDS"_, _"Aumentar Ticket Médio"_.                                                 | Baixo   |

---

## 🟡 Fase 2: Alinhamento Narrativo e UX Writing

### 2.1 Especificação de Copy e Microcopy

A narrativa de dor -> solução -> operação -> CRM é excelente. Porém, há espaço para otimização de atrito:

- **Secção de Preços (Fricção):** A transição para os planos em Kwanzas é boa, mas o CTA "Comece Grátis por 30 Dias!" deve enfatizar o risco zero. **Reescrita Recomendada:** _"Poupe tempo e dinheiro. Comece grátis por 30 dias. Sem cartão de crédito necessário."_
- **Secção do Core Flow:** A explicação do "Fluxo Mágico" é clara, mas beneficia de verbos de ação curtos.
  - _Atual:_ "O cliente senta-se à mesa."
  - _Otimizado:_ "Sente. Escaneie. Peça." (Estilo Apple, mais incisivo).
- **Gatilho de Urgência Final:** O fecho na Secção 8 ("Os seus concorrentes na mesma rua...") é muito forte e adequado para publicidade B2B (restauração).

---

## 🔵 Fase 3: Oportunidades de Crescimento e Flywheels

### 3.1 Matriz de Oportunidades (Flywheels)

Descobrimos alavancas de crescimento orgânico não exploradas no briefing:

1.  **Product-Led Acquisition (O Efeito "Powered By"):**
    - _Ideia:_ O rodapé _"Powered by Zimbotechia"_ exigido na landing page também deve estar visível no **Menu Digital do Consumidor** (quando o cliente do restaurante abre o menu).
    - _Loop:_ Consumidor gosta do menu -> Repara no selo "Powered by SmartMenu/Zimbotechia" -> Consumidor é na verdade um dono de bar -> Vai à Landing Page -> Regista o seu bar.
2.  **SEO-Driven Content (Calculadora de ROI):**
    - _Ideia:_ Criar uma ferramenta gratuita na landing page: _"Descubra quanto dinheiro o seu restaurante perde em tempo de espera e erros de pedidos"_.
    - _Loop:_ Utilizador insere dados -> Vê a poupança com o SmartMenu -> Converte num lead.

---

## 🔴 Fase 4: Plano de Implementação Consolidado

**Plano de Ação para a Equipa Inteira:**

1.  **UI/UX (Design):** Incorporar Logos de Confiança (Mockups) e a Calculadora de ROI simples no design do Figma.
2.  **Copywriter:** Refinar o `<h1>` principal para ser mais orientado aos benefícios antes de introduzir a dor, e adicionar o mitigador de risco ("Sem cartão de crédito") aos planos.
3.  **Frontend Eng:** Implementar rigidamente as técnicas de carregamento preguiçoso (_lazy loading_) de vídeos e a hierarquia semântica de Cabeçalhos (H1 a H4) para assegurar o SEO Técnico.
4.  **Produto:** Confirmar a viabilidade de colocar o selo referencial na app do consumidor final como motor primário de Aquisição (Product-Led).
