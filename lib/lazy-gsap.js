// Loads gsap + ScrollTrigger via a dynamic import, once, shared across every
// caller. Client-only — never call this during SSR.
//
// Why: gsap + ScrollTrigger were previously statically imported at module
// scope in LenisProvider, HeroSection, and DALILIPhones — the three
// homepage components that must stay OUT of next/dynamic's ssr:false (their
// markup, including the LCP hero image, needs to be in the server-rendered
// HTML). That pinned ~50KB gzipped of gsap/ScrollTrigger into the homepage's
// critical, render-blocking-for-hydration bundle for every visitor,
// including the mobile users on constrained connections this is meant to
// serve. None of these three actually need gsap synchronously: every gsap
// call site lives inside a useEffect, and the two effects that drive
// visible animation (HeroSection's entrance/scroll effect, DALILIPhones'
// mobile entrance effect) are already gated on `revealed`, which only
// becomes true after the intro animation finishes — by which point this
// dynamic import (kicked off on mount, well before `revealed` flips) has
// had seconds to resolve. The one effect that runs unconditionally on
// mount (HeroSection's pre-paint gsap.set calls) is still safe to defer:
// the whole hero sits under the intro's opaque full-screen cover the
// entire time `revealed` is false, so whatever state those elements are in
// before gsap loads is never actually visible.
let promise;

export function loadGsap() {
  if (!promise) {
    promise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapMod, stMod]) => {
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }
  return promise;
}
