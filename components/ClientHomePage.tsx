'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LenisProvider from './LenisProvider';
import HeroSection from './HeroSection';
import IntroAnimation from './IntroAnimation';

const INTRO_KEY = 'dalili_intro_done';

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

// LenisProvider, HeroSection and IntroAnimation are imported normally (not dynamic/ssr:false)
// so their markup — including the hero image that's the page's actual LCP element, and the
// intro's opaque cover — is present in the server-rendered HTML instead of only appearing
// once a lazy JS chunk mounts client-side. All three are safe to render on the server:
// LenisProvider is a pass-through (`<>{children}</>`, all its logic lives in a useEffect),
// and HeroSection/IntroAnimation's window/DOM access is effect-only too. IntroAnimation
// specifically MUST be eager: with HeroSection now rendering immediately for LCP, a lazy
// intro would let the real page flash through before the cover mounts.
const ProblemSection  = dynamic(() => import('./ProblemSection'),  { ssr: false });
const JourneySection  = dynamic(() => import('./JourneySection'),  { ssr: false });
const FeaturesSection       = dynamic(() => import('./FeaturesSection'),       { ssr: false });
const TestimonialsSection   = dynamic(() => import('./TestimonialsSection'),   { ssr: false });
const PartnersSection       = dynamic(() => import('./PartnersSection'),       { ssr: false });
const ToolsSection          = dynamic(() => import('./ToolsSection'),          { ssr: false });
const FAQSection            = dynamic(() => import('./FAQSection'),            { ssr: false });
const BlogPreviewSection    = dynamic(() => import('./BlogPreviewSection'),    { ssr: false });
const EmailCapture          = dynamic(() => import('./EmailCapture'),          { ssr: false });
const Footer          = dynamic(() => import('./Footer'),          { ssr: false });

interface HomePageProps {
  guidesCount: number;
  universitesCount: number;
  villesCount: number;
}

export default function ClientHomePage({ guidesCount, universitesCount, villesCount }: HomePageProps) {
  const [revealed, setRevealed] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);

  // Skip intro animation on back-navigation / soft re-renders.
  // Only show it once per browser session (clears on tab close / hard refresh).
  useEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) {
      setRevealed(true);
      setSkipIntro(true);
    }
  }, []);

  const handleRevealComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, '1');
    setRevealed(true);
  }, []);

  return (
    <>
      {!skipIntro && <IntroAnimation onComplete={handleRevealComplete} />}

      {/* Lenis enabled only after logo reveal (avoids freeze/conflict) */}
      <LenisProvider enabled={revealed}>
        <main id="main-content" style={{ position: 'relative', zIndex: 2 }}>
          {/* Rendered immediately (not opacity-gated behind `revealed`) so the hero —
              including its priority image, the page's LCP element — can paint as soon as
              it's ready instead of waiting for the intro to finish. The intro's own opaque
              fixed overlay covers it in the meantime, so nothing changes visually. */}
          <HeroSection revealed={revealed} />

          <div style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.45s ease',
            minHeight: '100vh',
          }}>

            {/* Trust bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 'clamp(16px,3vw,40px)',
              padding: 'clamp(14px,2vw,20px) clamp(16px,5vw,40px)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexWrap: 'wrap',
            }}>
              {[
                { value: String(guidesCount), label: 'guides publiés' },
                { value: String(universitesCount), label: 'universités couvertes' },
                { value: String(villesCount), label: 'villes décryptées' },
                { value: '200+', label: 'étudiants inscrits' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', letterSpacing: '0.06em', color: '#4d8fff', lineHeight: 1 }}>{stat.value}</span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>{stat.label}</span>
                </div>
              ))}
            </div>

            <SectionDivider />
            <ToolsSection />
            <SectionDivider />
            <ProblemSection />
            <SectionDivider />
            <JourneySection />
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
          </div>
        </main>

        <Footer />
      </LenisProvider>
    </>
  );
}
