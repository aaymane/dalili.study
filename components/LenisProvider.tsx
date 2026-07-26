'use client';

import { useEffect } from 'react';
import { loadGsap } from '@/lib/lazy-gsap';

interface Props {
  children: React.ReactNode;
  enabled?: boolean;
}

export default function LenisProvider({ children, enabled = true }: Props) {
  useEffect(() => {
    if (!enabled) return;
    // Skip smooth scroll on touch devices — native momentum feels better.
    // Checked BEFORE loading anything: touch devices (our primary mobile
    // audience) never fetch Lenis or gsap/ScrollTrigger here at all.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cancelled = false;
    let cleanup = () => {};

    Promise.all([loadGsap(), import('lenis')]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const rafFn = (time: number) => { lenis.raf(time * 1000); };
      gsap.ticker.add(rafFn);
      // NOTE: No lagSmoothing(0) — it breaks concurrent GSAP timelines (LogoReveal, etc.)

      cleanup = () => {
        gsap.ticker.remove(rafFn);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);

  return <>{children}</>;
}
