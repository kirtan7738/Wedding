import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(CustomEase, DrawSVGPlugin);

/** Beat times from spec §5.1 (seconds after the tap). */
export const LABELS = { seal: 0, flap: 0.4, burst: 1.9, glow: 2.4, reveal: 2.8 };
export const END = 4.5;

const FLAP_EASE = CustomEase.create('flap', 'M0,0 C0.65,0 0.35,1 1,1'); // cubic-bezier(.65,0,.35,1)

/**
 * One master timeline for the opening. `fx` is the shared contract implemented by both the
 * 2D fallback (opening/fx2d.js) and the Three.js scene: { sealLeak(), burst(), glow(p), ambient(on) }.
 */
export function buildOpeningTimeline({ el, fx, onDone, onCoverGone }) {
  const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
  Object.entries(LABELS).forEach(([k, v]) => tl.addLabel(k, v));

  // seal: press, crack, light leak
  tl.call(() => fx.sealLeak(), null, LABELS.seal + 0.05);
  tl.to(el.seal, { scale: 0.92, duration: 0.14, ease: 'power2.in' }, LABELS.seal);
  tl.to(el.seal, { scale: 1.04, duration: 0.24, ease: 'back.out(3)' }, LABELS.seal + 0.14);
  tl.to(el.sealCrack, { opacity: 1, duration: 0.18 }, LABELS.seal + 0.12);

  // flap opens, seal falls away, card rises out of the envelope
  tl.to(el.seal, { opacity: 0, scale: 0.7, y: 18, duration: 0.45, ease: 'power2.in' }, LABELS.flap + 0.15);
  tl.to(el.flap, { rotationX: 178, duration: 1.7, ease: FLAP_EASE, transformOrigin: '50% 0%' }, LABELS.flap);
  tl.to(el.card, { yPercent: -58, duration: 1.25, ease: 'power3.out' }, LABELS.flap + 0.75);

  // celebration
  tl.call(() => fx.burst(), null, LABELS.burst);

  // ivory glow wash: in over the envelope, cover dissolves, then glow out over the hero
  const glow = { p: 0 };
  tl.to(glow, { p: 1, duration: 0.5, ease: 'power1.in', onUpdate: () => fx.glow(glow.p) }, LABELS.glow);
  tl.to(el.cover, { autoAlpha: 0, duration: 0.45, ease: 'power1.out' }, LABELS.glow + 0.3);
  // Cover gone → release scrolling right away (don't make a swiping guest wait for the reveal to end).
  tl.call(() => onCoverGone?.(), null, LABELS.glow + 0.75);
  tl.to(glow, { p: 0, duration: 0.9, ease: 'power2.out', onUpdate: () => fx.glow(glow.p) }, LABELS.reveal + 0.2);

  // couple reveal: photo settles, then the hand-lettered words write themselves in (spec §5.1/§7.2.1)
  tl.fromTo(el.heroPhoto, { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, LABELS.reveal);
  writeIn(tl, el.heroMangal, LABELS.reveal, { draw: 0.75 });
  nameIn(tl, el.heroPrincy, LABELS.reveal + 0.12, { draw: 0.8 });
  if (el.heroAmp) tl.fromTo(el.heroAmp, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)' }, LABELS.reveal + 0.85);
  nameIn(tl, el.heroParth, LABELS.reveal + 0.4, { draw: 0.75 });
  if (el.heroDetails?.length) {
    tl.fromTo(el.heroDetails, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, LABELS.reveal + 1.05);
  }

  tl.call(() => fx.ambient(true), null, END - 0.2);
  tl.call(() => onDone?.(), null, END);
  return tl;
}

/**
 * Pen-writing: trace each glyph's outline (DrawSVG), let the ink fill in, lift the pen,
 * then draw the calligraphic flourishes out of the letters. Whole word ≈ draw + 0.75 s.
 */
export function writeIn(tl, svg, at, { draw = 0.8, stagger = 0.05 } = {}) {
  if (!svg) return;
  const glyphs = svg.querySelectorAll('.glyph');
  const swashes = svg.querySelectorAll('.swash');
  const all = svg.querySelectorAll('path');
  if (!all.length) return;
  const ink = getComputedStyle(svg).fill || 'currentColor';
  tl.set(svg, { autoAlpha: 1 }, at);
  tl.fromTo(all, { fillOpacity: 0, stroke: ink, strokeWidth: 1.6, strokeOpacity: 1, drawSVG: '0%' }, { drawSVG: '0%', duration: 0.001, immediateRender: true }, 0);
  tl.to(glyphs, { drawSVG: '100%', duration: draw, stagger, ease: 'power1.inOut' }, at);
  tl.to(glyphs, { fillOpacity: 1, duration: 0.35, stagger, ease: 'power1.out' }, at + draw * 0.65);
  if (swashes.length) {
    tl.to(swashes, { drawSVG: '100%', duration: 0.5, stagger: 0.08, ease: 'power2.inOut' }, at + draw * 0.75);
    tl.to(swashes, { fillOpacity: 1, duration: 0.3 }, at + draw * 0.75 + 0.35);
  }
  tl.to(all, { strokeOpacity: 0, duration: 0.25 }, at + draw + 0.5);
  tl.set(all, { clearProps: 'stroke,strokeWidth,strokeOpacity,strokeDasharray,strokeDashoffset' }, at + draw + 0.75);
}

/** Names in display type: revealed left→right like ink, with a focus pull. Works for SVG lettering too. */
export function nameIn(tl, node, at, { draw = 0.8 } = {}) {
  if (!node) return;
  if (node.tagName?.toLowerCase() === 'svg') return writeIn(tl, node, at, { draw });
  tl.fromTo(
    node,
    { autoAlpha: 0, clipPath: 'inset(-20% 100% -20% 0%)', filter: 'blur(6px)', y: 6 },
    { autoAlpha: 1, clipPath: 'inset(-20% 0% -20% 0%)', filter: 'blur(0px)', y: 0, duration: draw + 0.5, ease: 'power2.out', clearProps: 'clipPath,filter' },
    at,
  );
}

/** Reduced-motion path: a 0.6 s cross-fade, no particles. */
export function buildStaticOpening({ el, onDone }) {
  const tl = gsap.timeline();
  tl.to(el.cover, { autoAlpha: 0, duration: 0.6, ease: 'none' });
  tl.call(() => onDone?.());
  return tl;
}
