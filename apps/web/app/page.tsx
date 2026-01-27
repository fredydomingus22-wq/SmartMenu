import { LandingHeader } from "./_components/landing/landing-header";
import { LandingHero } from "./_components/landing/landing-hero";
import { LandingFeatures } from "./_components/landing/landing-features";
import { LandingPricing } from "./_components/landing/landing-pricing";
import { LandingHowItWorks } from "./_components/landing/landing-how-it-works";
import { LandingSocialProof } from "./_components/landing/landing-social-proof";
import { LandingFAQ } from "./_components/landing/landing-faq";
import { LandingFooter } from "./_components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Skip Links for A11y */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full z-[100] font-bold text-xs uppercase tracking-widest">
        Pular para conteúdo principal
      </a>

      <LandingHeader />

      <main id="main-content" className="flex-1 pt-16">
        <LandingHero />
        <LandingFeatures />
        <LandingSocialProof />
        <LandingPricing />
        <LandingHowItWorks />
        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
}
