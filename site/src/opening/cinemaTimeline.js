import { gsap } from 'gsap';
import { writeIn, nameIn } from './timeline.js';

/**
 * Cinema opening (storyboard rev 4, shot 0 → 1). Seconds after the tap:
 *   0.0  letterbox bars close in, cover copy lifts away, camera eases toward the doors
 *   0.2  latch gives · 0.5–2.4 the carved doors swing inward, light floods out
 *   0.95 petal storm bursts out of the doorway at the lens
 *   1.0–4.2 camera flies through the doorway into the mandap (film t 0.1 → 1)
 *   1.85–3.4 white-gold flash as we cross the threshold (the cover dissolves inside it)
 *   2.6  pushpa-vrishti: petals shower over the couple
 *   3.0  names write themselves in · 4.1 letterbox opens · 5.0 done
 */
export const CINEMA_END = 5.0;

export function buildCinemaOpening({ world, el, fx, onCoverGone, onDone }) {
  // The opening keeps wall-clock time even if a frame hitches (shader warm-up on a slow phone):
  // a stalled cover is worse than a skipped frame.
  gsap.ticker.lagSmoothing(1200, 33); // absorb only real stalls (>1.2 s); slow frames still keep wall-clock time
  const tl = gsap.timeline({ onComplete: () => gsap.ticker.lagSmoothing(500, 33) });
  world.coverDrift = false;
  const film = { t: world.state.override ?? 0 };
  const door = { p: 0 };
  const flash = { a: 0 };
  const setFilm = () => world.setOverride(film.t);
  const setDoor = () => world.setDoor(door.p);
  const setFlash = () => world.setFlash(flash.a);

  if (el.letterbox?.length) tl.fromTo(el.letterbox, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power3.out' }, 0);
  if (el.coverCopy?.length) tl.to(el.coverCopy, { autoAlpha: 0, y: -14, filter: 'blur(6px)', duration: 0.5, stagger: 0.05, ease: 'power2.in' }, 0);

  tl.to(door, { p: 0.04, duration: 0.2, ease: 'power2.out', onUpdate: setDoor }, 0.2);
  tl.to(door, { p: 1, duration: 1.9, ease: 'power2.inOut', onUpdate: setDoor }, 0.5);
  tl.to(film, { t: 0.1, duration: 1.0, ease: 'sine.inOut', onUpdate: setFilm }, 0);
  tl.call(() => fx.burst(), null, 0.95);
  tl.to(film, { t: 1, duration: 3.2, ease: 'power2.inOut', onUpdate: setFilm }, 1.0);

  tl.to(flash, { a: 0.72, duration: 0.4, ease: 'power2.in', onUpdate: setFlash }, 1.95);
  tl.call(() => onCoverGone?.(), null, 2.35);
  if (el.cover) tl.set(el.cover, { autoAlpha: 0 }, 2.35);
  tl.to(flash, { a: 0, duration: 0.9, ease: 'power2.out', onUpdate: setFlash }, 2.38);
  tl.call(() => fx.shower?.(1), null, 2.5);

  heroIn(tl, el, 3.0);
  if (el.letterbox?.length) tl.to(el.letterbox, { scaleY: 0, duration: 1.0, ease: 'power3.inOut' }, 4.1);
  tl.call(() => fx.ambient(true), null, CINEMA_END - 0.3);
  tl.call(() => onDone?.(), null, CINEMA_END);
  return tl;
}

/**
 * Fallback for phones without the 3D world: the pre-rendered door shot pushes in toward the doorway,
 * 2D petals burst, a warm glow washes over, and the hero still is revealed.
 */
export function buildStillsOpening({ el, fx, onCoverGone, onDone }) {
  gsap.ticker.lagSmoothing(1200, 33); // absorb only real stalls (>1.2 s); slow frames still keep wall-clock time // wall-clock: never stall the cover on a slow phone
  const tl = gsap.timeline({ onComplete: () => gsap.ticker.lagSmoothing(500, 33) });
  const glow = { p: 0 };
  if (el.letterbox?.length) tl.fromTo(el.letterbox, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power3.out' }, 0);
  if (el.coverCopy?.length) tl.to(el.coverCopy, { autoAlpha: 0, y: -14, duration: 0.45, stagger: 0.05, ease: 'power2.in' }, 0);
  if (el.coverStill) tl.to(el.coverStill, { scale: 2.8, duration: 2.3, ease: 'power3.in', transformOrigin: '50% 47%' }, 0.2);
  tl.call(() => fx.burst(), null, 0.9);
  tl.to(glow, { p: 1, duration: 0.55, ease: 'power1.in', onUpdate: () => fx.glow(glow.p) }, 1.8);
  tl.call(() => onCoverGone?.(), null, 2.4);
  if (el.cover) tl.set(el.cover, { autoAlpha: 0 }, 2.4);
  tl.to(glow, { p: 0, duration: 1.0, ease: 'power2.out', onUpdate: () => fx.glow(glow.p) }, 2.45);
  heroIn(tl, el, 2.7);
  if (el.letterbox?.length) tl.to(el.letterbox, { scaleY: 0, duration: 1.0, ease: 'power3.inOut' }, 3.8);
  tl.call(() => fx.ambient(true), null, 4.4);
  tl.call(() => onDone?.(), null, 4.7);
  return tl;
}

function heroIn(tl, el, at) {
  if (el.heroLead?.length) tl.fromTo(el.heroLead, { autoAlpha: 0, y: 12, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.1, ease: 'power3.out' }, at - 0.3);
  writeIn(tl, el.heroMangal, at, { draw: 0.75 });
  nameIn(tl, el.heroPrincy, at + 0.15, { draw: 0.85 });
  if (el.heroAmp) tl.fromTo(el.heroAmp, { scale: 0, autoAlpha: 0, rotate: -90 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.5)' }, at + 0.9);
  nameIn(tl, el.heroParth, at + 0.45, { draw: 0.8 });
  if (el.heroDetails?.length) {
    tl.fromTo(el.heroDetails, { autoAlpha: 0, y: 14, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.1, ease: 'power3.out' }, at + 1.2);
  }
}
