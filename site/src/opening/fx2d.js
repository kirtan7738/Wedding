import { createPetals2D } from '../fx/Petals2D.js';
import { goldBurst2D } from '../fx/goldBurst2D.js';

export const fxPalette = () => {
  const css = getComputedStyle(document.documentElement);
  return ['--marigold', '--marigold-deep', '--haldi', '--saffron', '--rose-light', '--rose-deep', '--kumkum', '--marigold'].map((v) => css.getPropertyValue(v).trim());
};

/** 2D implementation of the opening fx contract { sealLeak, burst, glow, ambient, setPaused, destroy }. */
export function create2DFx({ canvas, goldCanvas, sealEl, glowEl }) {
  if (!canvas) throw new Error('fx2d: petal canvas not mounted');
  const petals = createPetals2D(canvas, { palette: fxPalette() });
  let stopGold = null;
  return {
    sealLeak: () => sealEl?.classList.add('is-leaking'),
    burst: () => {
      petals.burst();
      if (goldCanvas) stopGold = goldBurst2D(goldCanvas);
    },
    glow: (p) => glowEl && (glowEl.style.opacity = String(p)),
    ambient: (on) => petals.ambient(on),
    setPaused: (b) => petals.setPaused(b),
    destroy: () => {
      petals.destroy();
      stopGold?.();
    },
  };
}
