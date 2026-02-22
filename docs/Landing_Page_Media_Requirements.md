# Multi-Agent Media Requirements: SmartMenu Landing Page

**Resultado do Workflow:** `/multi_agent_review`
**Tópico:** Requisitos para Geração de Imagem e Vídeo com IA (Veo 3.x, Midjourney, Nanobanana)

De acordo com o `Landing_Page_Briefing.md`, a equipa multi-agente (Produto, UX/UI, Marketing e Performance) definiu as seguintes diretrizes estritas para a geração dos assets finais da Landing Page:

---

## 1. 🎥 Hero Video (Geração sugerida: Veo 3.x / Runway Gen-3)

O ativo mais crítico da página. Deve cobrir o fundo da `LandingHero` ocupando 100% da viewport inicial.

### Requisitos do Prompt para IA de Vídeo:

- **Tema:** "Food porn" hiper-realista e cinematográfico em ambiente de restaurante premium.
- **Ação:** Slow-motion extremo. Exemplos: Um hambúrguer suculento a ser montado com queijo derretido, ou um chef a finalizar um prato gourmet com uma chama, ou um cocktail vibrante a ser servido num bar de pouca luz.
- **Iluminação:** "Mood lighting", claro/escuro (chiaroscuro). Cores quentes (laranjas, vermelhos, dourados) contrastando com fundos escuros (preto/cinzento carvão).
- **Sem Pessoas:** O foco deve ser 100% na comida/bebida, sem rostos de clientes (para manter a universalidade).
- **Movimento da Câmera:** Pan lateral lento ou zoom in muito suave. Nenhum movimento brusco para evitar tonturas no scroll.

### Especificações Técnicas (Edição pós-geração):

- **Formato Final:** `.mp4` (H.264) e `.webm` (para Chrome/Firefox perf).
- **Duração:** Loop perfeito de 10 a 15 segundos.
- **Compressão:** O ficheiro final **não pode ultrapassar 3MB** (crucial para o requisito de LCP < 1s).
- **Sem Áudio:** O vídeo deve ser exportado sem canal de áudio (`muted`).

---

## 2. 🖼️ Imagens Estáticas e Mockups (Geração sugerida: Nanobanana / Midjourney / DALL-E)

### A. Poster do Hero Video (`poster.webp`)

A imagem que carrega na primeira fração de segundo antes do vídeo iniciar num dispositivo 3G.

- **Requisito:** Extrair o frame mais bonito e apetitoso do vídeo gerado no Ponto 1.
- **Prompt Alternativo (se gerado à parte):** "Fotografia macro hiper-realista de um hambúrguer gourmet premium sendo grelhado num restaurante escuro, iluminação dramática, alta resolução, 16:9."
- **Técnica:** Converter para `.webp`, resolução 1920x1080 com pesada compressão (Target: < 80kb).

### B. Mockup Consumer (Telemóvel 3D)

Usado na Secção 4 (A Solução Elegante). Atualmente usamos divs simuladas, mas uma imagem realista eleva a conversão.

- **Prompt:** "Um smartphone moderno e sem bordas flutuando em 3D, ecrã a mostrar uma interface de utilizador de um menu de restaurante luxuoso com fundo escuro e fotografias de comida apetitosas. Fundo transparente ou preto puro, renderização 3D, estilo Apple."

### C. Mockup KDS & Dashboard

Usado nas Secções 5 e 6.

- **Prompt:** "Um tablet moderno e um ecrã de computador exibindo um dashboard analítico escuro com gráficos neon azuis e roxos, e um sistema de tickets de cozinha ao lado. Estilo cyber-elegante, interface de utilizador limpa, renderização 3D isométrica."

---

### Avaliação de Acessibilidade (Agente QA):

⚠️ **Lembrete:** Mesmo que as IAs gerem vídeos muito brilhantes, o código Frontend já possui um `Radial Gradient Overlay` no `LandingHero` para forçar o escurecimento do fundo e garantir que o Headline Branco passe no rácio de contraste WCAG AA.
