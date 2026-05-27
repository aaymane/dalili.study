'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  enabled?: boolean;
}

export default function LenisProvider({ children, enabled = true }: Props) {
  useEffect(() => {
    if (!enabled) return;

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

    return () => {
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, [enabled]);

  return <>{children}</>;
}
