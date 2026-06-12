'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

function SectionDivider() {
  return (
    <div style={{ padding: '0 clamp(16px,5vw,80px)' }}>
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(1,77,248,0.18) 25%, rgba(77,143,255,0.12) 50%, rgba(1,77,248,0.18) 75%, transparent 100%)',
        position: 'relative',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 4, height: 4, borderRadius: '50%',
          background: 'rgba(77,143,255,0.55)',
          boxShadow: '0 0 8px rgba(77,143,255,0.7), 0 0 16px rgba(1,77,248,0.3)',
        }} />
      </div>
    </div>
  );
}

// Lenis only starts AFTER logo reveal to avoid GSAP ticker conflicts
const LenisProvider   = dynamic(() => import('./LenisProvider'),   { ssr: false });
const LogoReveal      = dynamic(() => import('./LogoReveal'),      { ssr: false });
const StarCanvas      = dynamic(() => import('./StarCanvas'),      { ssr: false });
const HeroSection     = dynamic(() => import('./HeroSection'),     { ssr: false }) as React.ComponentType<{ revealed: boolean }>;
const ProblemSection  = dynamic(() => import('./ProblemSection'),  { ssr: false });
const JourneySection  = dynamic(() => import('./JourneySection'),  { ssr: false });
const DALILIMockup    = dynamic(() => import('./DALILIMockup'),    { ssr: false });
const FeaturesSection       = dynamic(() => import('./FeaturesSection'),       { ssr: false });
const TestimonialsSection   = dynamic(() => import('./TestimonialsSection'),   { ssr: false });
const PartnersSection       = dynamic(() => import('./PartnersSection'),       { ssr: false });
const FAQSection            = dynamic(() => import('./FAQSection'),            { ssr: false });
const BlogPreviewSection    = dynamic(() => import('./BlogPreviewSection'),    { ssr: false });
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
            <SectionDivider />
            <ProblemSection />
            <SectionDivider />
            <JourneySection />
            <SectionDivider />
            <DALILIMockup />
            <SectionDivider />
            <FeaturesSection />
            <SectionDivider />
            <TestimonialsSection />
            <SectionDivider />
            <PartnersSection />
            <SectionDivider />
            <FAQSection />
            <SectionDivider />
            <BlogPreviewSection />
            <SectionDivider />
            <div id="waitlist">
              <EmailCapture />
            </div>
          </main>

          <Footer />
        </div>
      </LenisProvider>
    </>
  );
}
