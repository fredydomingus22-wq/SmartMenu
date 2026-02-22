import { Button, BRAND_COLORS } from "@smart-menu/ui";
import Link from "next/link";
import { HeroVideoClient } from "./hero-video-client";
import LandingHeroAnimations from "./landing-hero-animations";

/**
 * LandingHero (Server Component)
 * Strict SEO requirements handled by HeroVideoClient.
 */
export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center py-12 md:py-16 px-6 overflow-hidden bg-white">
      {/* Background Video with Controlled Layering */}
      <div className="absolute inset-0 z-0">
        <HeroVideoClient 
          poster="/assets/marketing/poster.png"
          videoSrc="/assets/marketing/hero-video.mp4"
        />
        {/* Subtle Overlays - Cleaner for the light theme */}
        <div className="absolute inset-0 bg-white/40 z-[1]" />
        <div 
          className="absolute inset-0 z-[1] opacity-5" 
          style={{ background: `radial-gradient(circle at 0% 0%, oklch(${BRAND_COLORS.orange}) 0%, transparent 50%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-[1]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col items-center justify-center text-center">
        
        <LandingHeroAnimations>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-bold tracking-wider uppercase text-zinc-600 mb-8 shadow-sm">
            A impulsionar restaurantes de elite em Angola.
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.1] max-w-4xl mx-auto">
            O Menu Digital Que Aumenta os Seus Lucros <span style={{ color: `oklch(${BRAND_COLORS.orange})` }}>Sem Esforço.</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-zinc-800 max-w-2xl mx-auto font-medium leading-relaxed">
            O seu restaurante está a perder 30% das vendas a cada minuto de espera. Transforme a lentidão em lucros em menos de 24 horas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Button size="lg" className="h-14 px-8 text-base font-bold rounded-xl text-zinc-950" style={{ backgroundColor: `oklch(${BRAND_COLORS.orange})` }} asChild>
              <Link href="/login">Comece o seu Teste Gratuito Agora</Link>
            </Button>
            <Button size="lg" className="h-14 px-8 text-base font-bold rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-xs hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300" asChild>
              <Link href="https://smart-menu-consumer.vercel.app//menu/c02dc8bc-112e-4def-9a71-dcf4950ed7bf" target="_blank">Ver Menu de Demonstração</Link>
            </Button>
          </div>
        </LandingHeroAnimations>

      </div>
    </section>
  );
}
