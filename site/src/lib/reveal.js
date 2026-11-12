/** Triggered (never scrubbed) section reveals — spec §6.1. Each element can pick a variant via data-reveal="…". */
export const REVEAL_START = 'top 85%';

const VARIANTS = {
  // film title: text surfaces out of soft focus
  title: {
    from: { opacity: 0, scale: 1.12, filter: 'blur(14px)' },
    to: { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', stagger: 0.1 },
  },
  // lines of copy rising out of focus, one after another
  cine: {
    from: { opacity: 0, y: 28, filter: 'blur(8px)' },
    to: { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: 0.12 },
  },
  // brush-stroke wipe for titles
  wipe: {
    from: { opacity: 1, y: 0, clipPath: 'inset(0% 100% 0% 0%)' },
    to: { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut', stagger: 0.08 },
  },
  // tiles flipping into place (countdown)
  flip: {
    from: { opacity: 0, y: 0, rotationX: -75, transformOrigin: '50% 0%' },
    to: { opacity: 1, y: 0, rotationX: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.09 },
  },
  // polaroids dropping onto the string and swinging to rest
  drop: {
    from: { opacity: 0, y: -60, rotation: -10 },
    to: { opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)', stagger: 0.15 },
  },
  // cards tilting up from the page
  tilt: {
    from: { opacity: 0, y: 26, rotationX: 22, scale: 0.94, transformPerspective: 700, transformOrigin: '50% 100%' },
    to: { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.14 },
  },
  // content rising into an arch (map)
  'rise-arch': {
    from: { opacity: 1, y: 0, clipPath: 'inset(100% 0% 0% 0%)' },
    to: { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' },
  },
};

export function revealTween(reducedMotion, variant) {
  if (reducedMotion) {
    return { from: { opacity: 0 }, to: { opacity: 1, duration: 0.3, ease: 'none', stagger: 0 } };
  }
  if (VARIANTS[variant]) return VARIANTS[variant];
  return {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06 },
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
