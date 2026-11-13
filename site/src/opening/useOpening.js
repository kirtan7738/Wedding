import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wedding from '../content/wedding.js';
import { createMusicPlayer, attachVisibilityPause } from '../lib/audio.js';
import { createSfx } from '../lib/sfx.js';
import { detectTier } from '../lib/tier.js';
import { buildStaticOpening } from './timeline.js';
import { buildCinemaOpening, buildStillsOpening } from './cinemaTimeline.js';
import { create2DFx } from './fx2d.js';
import { preloadConfetti } from '../fx/goldBurst2D.js';

export const OPENED_KEY = 'kankotri-opened';

/**
 * Owns the cover → opening → open lifecycle.
 * - open() is idempotent and does the gesture-bound work synchronously (audio unlock, haptic).
 * - With the cinema world ready, the doors open and the camera flies in (cinemaTimeline); otherwise the
 *   pre-rendered door still pushes in with 2D petals; reduced motion gets a cross-fade. Never a wait.
 */
export function useOpening(worldRef) {
  const refs = {
    cover: useRef(null),
    still: useRef(null),
    glow: useRef(null),
    petals: useRef(null),
    gold: useRef(null),
  };
  const [state, setState] = useState('cover');
  const [tier, setTier] = useState(null);
  const [player, setPlayer] = useState(null);
  const tierRef = useRef('2d');
  const openedRef = useRef(false);
  const tlRef = useRef(null);
  const fxRef = useRef(null);
  const ambientRef = useRef(null);
  const skippedRef = useRef(false);
  const sfxRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    window.__openCount = window.__openCount || 0;
    if (html.classList.contains('opened') || !html.classList.contains('js')) {
      openedRef.current = true;
      html.classList.add('opened');
      setState('open');
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    tierRef.current = reduced ? 'static' : '2d';
    if (reduced) setTier('static');
    else
      detectTier().then((t) => {
        tierRef.current = t;
        setTier(t);
      });
    const p = createMusicPlayer(wedding.music);
    window.__music = p;
    sfxRef.current = createSfx({ getContext: () => p.context(), shehnaiSrc: wedding.music.shehnai });
    setPlayer(p);
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    idle(() => {
      p.preload();
      sfxRef.current?.preload();
      preloadConfetti();
    });
    const detach = attachVisibilityPause(p);
    return () => {
      detach();
      p.destroy();
      tlRef.current?.kill();
      fxRef.current?.destroy?.();
    };
  }, []);

  const release = useCallback(() => {
    document.documentElement.classList.add('opened'); // unlocks scroll
    try {
      sessionStorage.setItem(OPENED_KEY, '1');
    } catch {
      /* private mode */
    }
  }, []);

  const finish = useCallback(() => {
    release();
    setState('open');
    worldRef?.current?.setOverride(null); // scroll drives the camera from here on
    worldRef?.current?.measure?.();
    if (ambientRef.current) {
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        onLeave: () => ambientRef.current(false),
        onEnterBack: () => ambientRef.current(true),
      });
    }
    document.getElementById('hero')?.focus({ preventScroll: true });
  }, [release, worldRef]);

  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    window.__openCount = (window.__openCount || 0) + 1;
    // doors: creak (+ shehnai) now; the song jumps on the beat so its first verse lands with the camera
    player?.unlock();
    sfxRef.current?.door();
    player?.cue({ arriveIn: tierRef.current === 'static' ? 0.8 : 3.9 }); // the first verse lands with the camera
    navigator.vibrate?.(15);
    setState('opening');

    const hero = document.getElementById('hero');
    const cover = refs.cover.current;
    const el = {
      cover,
      coverStill: refs.still.current,
      coverCopy: cover ? [...cover.querySelectorAll('[data-cover-copy]')] : [],
      letterbox: [...document.querySelectorAll('.letterbox')],
      hero,
      heroLead: hero ? [...hero.querySelectorAll('[data-hero-lead]')] : [],
      heroMangal: hero?.querySelector('.hero-mangal svg'),
      heroPrincy: hero?.querySelector('.hero-name--princy'),
      heroParth: hero?.querySelector('.hero-name--parth'),
      heroAmp: hero?.querySelector('.hero-amp'),
      heroDetails: hero ? [...hero.querySelectorAll('[data-hero-detail]')] : [],
    };
    const t = tierRef.current;
    if (t === 'static') {
      tlRef.current = buildStaticOpening({ el, onDone: finish });
      return;
    }
    const world = worldRef?.current;
    const fx = {
      burst: () => {
        if (skippedRef.current) return; // skip means skip: no cannon over the invitation
        window.__burstCount = (window.__burstCount || 0) + 1;
        if (world) world.storm();
        else fxRef.current?.burst();
      },
      shower: (v) => world?.setShower(v),
      glow: (p) => fxRef.current?.glow(p),
      ambient: (on) => {
        window.__ambientOn = on;
        if (world) world.setAmbient(on ? 0.6 : 0.22);
        else fxRef.current?.ambient(on);
      },
    };
    ambientRef.current = fx.ambient;
    try {
      if (world) {
        window.__fxMode = '3d';
        tlRef.current = buildCinemaOpening({ world, el, fx, onDone: finish, onCoverGone: release });
      } else {
        fxRef.current = create2DFx({ canvas: refs.petals.current, goldCanvas: refs.gold.current, sealEl: null, glowEl: refs.glow.current });
        window.__fxMode = '2d';
        tlRef.current = buildStillsOpening({ el, fx, onDone: finish, onCoverGone: release });
      }
    } catch (err) {
      console.warn('opening: falling back to static', err);
      tlRef.current = buildStaticOpening({ el, onDone: finish });
    }
  }, [player, finish, release, worldRef]);

  // Replay a tap that landed on the cover before the app was listening (index.html head script).
  useEffect(() => {
    if (!player || !window.__pendingOpen || openedRef.current) return;
    window.__pendingOpen = false;
    document.documentElement.classList.remove('pending-open');
    open();
  }, [player, open]);

  const skip = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    skippedRef.current = true;
    tl.progress(1, false);
  }, []);

  return { refs, state, tier, player, sfx: sfxRef, open, skip, fxRef };
}
