# Debate Multi-Agente: Arquitetura e UI da Landing Page SmartMenu

**Referência:** `docs/Landing_Page_Briefing.md`
**Agentes Envolvidos:**

- 🧠 **Product Manager (01)** - Foco em Negócio e Conversão
- 🏗️ **System Architect (02)** - Foco em Performance, SEO Técnico e Escalabilidade
- 🎨 **UI/UX Designer (03)** - Foco em Experiência, Acessibilidade e Animações

---

## Tópico 1: Stack Tecnológica e Renderização (SSR vs CSR)

🏗️ **System Architect (02):**

> "Para garantir que alcançamos a pontuação máxima no Lighthouse e um SEO perfeito (crucial para uma Landing Page SaaS), precisamos de usar **React Server Components (RSC) no Next.js 16 (App Router)**. O conteúdo principal (Hero, Preços, Textos) deve ser 100% Server-Side Rendered (SSR). O JavaScript enviado para o cliente deve ser o mínimo possível. Não podemos ter a página a ficar pesada apenas por causa das animações."

🎨 **UI/UX Designer (03):**

> "Concordo com o SSR para o conteúdo base. No entanto, o briefing exige animações cinematográficas profundas (Parallax, Scroll-jacking suave, Blur-reveals). Para isso, precisamos de hidratar componentes client-side (CSR - `'use client'`) usando o **Framer Motion**. A minha sugestão arquitetural é aplicar o padrão de _Island Architecture_: Renderizar o esqueleto no servidor, isolando as secções animadas (como o Hero Video Overlay e o Mockup 3D) em pequenos componentes cliente para não penalizar a First Contentful Paint (FCP)."

🧠 **Product Manager (01):**

> "Desde que a página abra instantaneamente no telemóvel e o cliente não perca o interesse, usem essa arquitetura híbrida (Islands/RSC) que estão a propor. Lembrem-se que performance é conversão."

---

## Tópico 2: Gestão do Vídeo B-Roll (Food Porn) e Performance

🏗️ **System Architect (02):**

> "Vídeos de background são os maiores assassinos de conversão se não forem bem geridos. Temos de seguir regras rígidas:
>
> 1. Formato **.webm** predominante com fallback para **.mp4 (H.264)**. Ambos compactados ao extremo.
> 2. Uso obrigatório do atributo `poster` com uma imagem `.webp` de baixíssima resolução (blur) que carrega imediatamente no FCP.
> 3. `<video autoplay loop muted playsinline preload="none">`. Nunca fazer preload total do vídeo se estivermos em mobile."

🎨 **UI/UX Designer (03):**

> "Adiciono a isso a necessidade de um **Overlay Escuro (Gradiente Linear Radial)** sobre o vídeo. Se o restaurante reproduzir uma cena clara (ex: molho branco a cair), o nosso Headline branco (H1) vai perder legibilidade e quebrar as normas **WCAG AA** de rácio de contraste mínimo (4.5:1). A nível de UI, o Hero vai usar o vídeo como `absolute -z-10 object-cover w-full h-full`."

---

## Tópico 3: Padrões de Layout e Responsividade UI

🎨 **UI/UX Designer (03):**

> "Para a Secção 4 (Controlo Absoluto) e Secção 6 (Mini CRM), as animações pedidas pelo PM requerem empilhar elementos na interface (dashboards sobrepostos e ecrãs de telemóvel em 3D). No Mobile, empilhar assets visuais desta forma quebra a experiência.
>
> **A minha proposta de Master-Detail UI:**
>
> - **Desktop:** Grid de 2 colunas (`grid-cols-2`), layout _Sticky Scroll_ (o texto faz scroll no lado esquerdo, enquanto a imagem/mockup interativa do lado direito muda).
> - **Mobile:** CSS Flexbox (`flex-col`), trocando as imagens por cards estáticos altamente contrastados ou pequenos GIFs/Lotties. O Scroll Animation tem de ser desativado ou muito reduzido em mobile para não causar 'scroll fatigue'."

🏗️ **System Architect (02):**

> "Tecnicamente sólido. Podemos utilizar a hook `useReducedMotion` para desativar automaticamente as animações 3D se as preferências de sistema operacional do utilizador assim o indicarem. Isso garante conformidade adicional de acessibilidade."

---

## Tópico 4: Integração do Flywheel e KDS (Motor de Crescimento)

🧠 **Product Manager (01):**

> "Lembrem-se da nossa 'arma secreta': o botão _Powered by Zimbotechia_ no Menu Digital do consumidor final para gerar leads B2B para esta Landing Page. Como rastreamos isso tecnicamente?"

🏗️ **System Architect (02):**

> "Podemos passar parâmetros na UTM linkada no footer do Menu Digital. `?utm_source=consumer-menu&utm_medium=referral&tenant_id=xyz`. Assim, na Landing Page, não só sabemos que a lead veio de um menu ativo, como sabemos _qual_ restaurante gerou a conversão, permitindo-nos até premiar o restaurante de origem no seu Club de Pontos se assim quisermos no futuro!"

🎨 **UI/UX Designer (03):**

> "Perfeito. No UI do menu do cliente, o link ficará discreto no rodapé inferior, usando uma tipografia neutra (`text-muted-foreground`), garantindo que não rouba atenção da conversão principal (o pedido de comida), mas permanece institucional."

---

## 🎯 Conclusão e Decisões Acordadas

1.  **Stack Base:** Next.js 16 (App Router) + Tailwind CSS + Shadcn UI.
2.  **Abordagem de Renderização:** Híbrida. (SSR predominante + Framer Motion apenas em componentes folha isolados).
3.  **Media:** Vídeos comprimidos (`.webm`), Muted, Playsinline, sempre com imagem Poster e Gradientes de Contraste Overlay.
4.  **UX Mobile:** Redução ou eliminação de scroll-jacking e 3D no Mobile a favor de um layout `flex-col` rápido e legível. Respeito ao `useReducedMotion`.
5.  **Analytics:** Rastreio via UTM parameters dos links injetados nos componentes in-app.
