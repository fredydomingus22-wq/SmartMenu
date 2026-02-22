import { LandingHeader } from "../_components/landing/landing-header";
import { LandingHero } from "../_components/landing/landing-hero";
import { LandingFeatures } from "../_components/landing/landing-features";
import { LandingShowcase } from "../_components/landing/landing-showcase";
import { LandingPricing } from "../_components/landing/landing-pricing";
import { LandingHowItWorks } from "../_components/landing/landing-how-it-works";
import { LandingROICalculator } from "../_components/landing/landing-roi-calculator";
import { LandingCTA } from "../_components/landing/landing-cta";
import { LandingFooter } from "../_components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="dark flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden relative selection:bg-primary/30">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-20 pointer-events-none" />
      
      {/* Skip Links for A11y */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full z-[100] font-bold text-xs uppercase tracking-widest">
        Pular para conteúdo principal
      </a>

      <LandingHeader />

      <main id="main-content" className="flex-1 pt-16">
        <LandingHero />
        
        {/* Section 2: Flow */}
        <LandingHowItWorks />

        {/* Section 2.5: ROI Calculator */}
        <LandingROICalculator />
        
        {/* Section 3: Pain Agitation */}
        <LandingFeatures />
        
        {/* Sections 4, 5, 6: Tech Mockups (KDS, Analytics, Mobile CRM) */}
        <LandingShowcase />
        
        {/* Section 7: Pricing */}
        <LandingPricing />
        
        {/* Section 8: Final CTA with scarcity */}
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
