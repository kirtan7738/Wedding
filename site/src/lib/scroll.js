import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Native scroll on touch devices; Lenis only on desktop pointers ≥ 1024 px (spec §6.1).
 * Returns a cleanup function.
 */
export function initScroll() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  const desktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!desktop || reduced) return () => {};

  let lenis;
  let cancelled = false;
  const tick = (time) => lenis && lenis.raf(time * 1000);
  import('lenis').then(({ default: Lenis }) => {
    if (cancelled) return;
    lenis = new Lenis({ syncTouch: false, lerp: 0.1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  });
  return () => {
    cancelled = true;
    gsap.ticker.remove(tick);
    lenis?.destroy();
    delete window.__lenis;
  };
}
