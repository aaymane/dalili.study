'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

// Lenis only starts AFTER logo reveal to avoid GSAP ticker conflicts
const LenisProvider   = dynamic(() => import('./LenisProvider'),   { ssr: false });
const LogoReveal      = dynamic(() => import('./LogoReveal'),      { ssr: false });
const StarCanvas      = dynamic(() => import('./StarCanvas'),      { ssr: false });
const HeroSection     = dynamic(() => import('./HeroSection'),     { ssr: false }) as React.ComponentType<{ revealed: boolean }>;
const ProblemSection  = dynamic(() => import('./ProblemSection'),  { ssr: false });
const JourneySection  = dynamic(() => import('./JourneySection'),  { ssr: false });
const FeaturesSection       = dynamic(() => import('./FeaturesSection'),       { ssr: false });
const TestimonialsSection   = dynamic(() => import('./TestimonialsSection'),   { ssr: false });
const PartnersSection       = dynamic(() => import('./PartnersSection'),       { ssr: false });
const FAQSection            = dynamic(() => import('./FAQSection'),            { ssr: false });
const EmailCapture          = dynamic(() => import('./EmailCapture'),          { ssr: false });
const Footer          = dynamic(() => import('./Footer'),          { ssr: false });

export default function ClientHomePage() {
  const [revealed, setRevealed] = useState(false);
  // useCallback keeps the same reference across re-renders —
  // without this, every parent render creates a new fn → LogoReveal's useEffect
  // sees a dep change → tl.kill() is called mid-animation → black screen forever.
  const handleRevealComplete = useCallback(() => setRevealed(true), []);

  return (
    <>
      <LogoReveal onComplete={handleRevealComplete} />

      {/* Lenis enabled only after logo reveal (avoids freeze/conflict) */}
      <LenisProvider enabled={revealed}>
        <div style={{
          opacity: revealed ? 1 : 0,
          transition: 'opacity 0.45s ease',
          minHeight: '100vh',
        }}>
          <StarCanvas />
          <Navbar />

          <main id="main-content" style={{ position: 'relative', zIndex: 2 }}>
            {/* Pass revealed so plane entrance is synced with logo disappearance */}
            <HeroSection revealed={revealed} />
            <ProblemSection />
            <JourneySection />
            <FeaturesSection />
            <TestimonialsSection />
            <PartnersSection />
            <FAQSection />
            <EmailCapture />
          </main>

          <Footer />
        </div>
      </LenisProvider>
    </>
  );
}
