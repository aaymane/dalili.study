'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

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

// Lenis only starts AFTER intro animation to avoid GSAP ticker conflicts
const LenisProvider   = dynamic(() => import('./LenisProvider'),   { ssr: false });
const IntroAnimation  = dynamic(() => import('./IntroAnimation'),  { ssr: false }) as React.ComponentType<{ onComplete: () => void }>;
const StarCanvas      = dynamic(() => import('./StarCanvas'),      { ssr: false });
const HeroSection     = dynamic(() => import('./HeroSection'),     { ssr: false }) as React.ComponentType<{ revealed: boolean }>;
const ProblemSection  = dynamic(() => import('./ProblemSection'),  { ssr: false });
const JourneySection  = dynamic(() => import('./JourneySection'),  { ssr: false });
const FeaturesSection       = dynamic(() => import('./FeaturesSection'),       { ssr: false });
const TestimonialsSection   = dynamic(() => import('./TestimonialsSection'),   { ssr: false });
const PartnersSection       = dynamic(() => import('./PartnersSection'),       { ssr: false });
const FAQSection            = dynamic(() => import('./FAQSection'),            { ssr: false });
const BlogPreviewSection    = dynamic(() => import('./BlogPreviewSection'),    { ssr: false });
const EmailCapture          = dynamic(() => import('./EmailCapture'),          { ssr: false });
const Footer          = dynamic(() => import('./Footer'),          { ssr: false });

export default function ClientHomePage() {
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
                { value: '23', label: 'guides publiés' },
                { value: '4', label: 'universités couvertes' },
                { value: '4', label: 'villes décryptées' },
                { value: '200+', label: 'étudiants inscrits' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', letterSpacing: '0.06em', color: '#4d8fff', lineHeight: 1 }}>{stat.value}</span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{stat.label}</span>
                </div>
              ))}
            </div>

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
          </main>

          <Footer />
        </div>
      </LenisProvider>
    </>
  );
}
