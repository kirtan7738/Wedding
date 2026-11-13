import { useEffect, useRef, useState } from 'react';

/**
 * Owns the cinema world's lifecycle: lazy-loads Three.js for 'high' / 'lite' tiers, pauses when hidden,
 * and falls back to a pre-rendered still (html.stills) if the world can't run. Sets html.cinema once the
 * first frame is ready.
 *
 * Camera (user, 12 Nov): the only camera move is the opening — closed doors → doors open → fly into the
 * mandap. After that the camera holds on the mandap and the sections scroll over it.
 */
export function useCinema(tier, worldRef) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tier) return undefined;
    const html = document.documentElement;
    if (tier !== 'high' && tier !== 'lite') {
      html.classList.add('stills');
      return undefined;
    }
    let cancelled = false;
    let cleanup = () => {};
    const canvas = canvasRef.current;
    import('./World.js')
      .then(({ createWorld }) => createWorld(canvas, { tier, ganeshUrl: '/img/ganesh.webp' }))
      .then((world) => {
        if (cancelled) return world.destroy();
        worldRef.current = world;
        window.__world = world;
        const opened = html.classList.contains('opened');
        // already opened this session → land straight on the couple's scene (no fly-in from the doors)
        world.setOverride(opened ? 1 : 0);
        if (opened) world.setOverride(null);
        world.setDoor(opened ? 1 : 0);
        world.setAmbient(opened ? 0.5 : 0.28); // a few petals drift past the doors while the guest reads the cover
        if (opened) world.setShower(1); // the gods' flower shower over the couple
        if (!opened) world.coverDrift = true;

        // the names on the arch fade as soon as the guest starts scrolling (the hero copy scrolls up past them)
        const onScroll = () => {
          const vh = window.innerHeight;
          html.style.setProperty('--nv', String(Math.max(0, 1 - window.scrollY / (vh * 0.22))));
          // past the hero, an ivory veil settles over the (now still) mandap so every section reads cleanly
          html.style.setProperty('--veil', String(Math.min(1, Math.max(0, (window.scrollY - vh * 0.35) / (vh * 0.5)))));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        // tap anywhere on the page (not on a control) → petals burst from that spot
        const onTap = (e) => {
          if (!html.classList.contains('opened')) return;
          if (e.target.closest?.('a, button, iframe, input, .cover, .arch-panel, .scratch')) return;
          world.tapBurst(e.clientX, e.clientY);
          navigator.vibrate?.(8);
        };
        window.addEventListener('pointerdown', onTap, { passive: true });
        // a section celebrates (e.g. the date fully revealed): petals burst from the given points
        const onCelebrate = (e) => (e.detail?.points || []).forEach(([x, y], i) => setTimeout(() => world.tapBurst(x, y), i * 140));
        window.addEventListener('kk-celebrate', onCelebrate);

        const onVis = () => world.setPaused(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        world.onContextLost(() => {
          html.classList.remove('cinema');
          html.classList.add('stills');
          worldRef.current = null;
        });
        requestAnimationFrame(() => {
          html.classList.add('cinema');
          setReady(true);
        });
        cleanup = () => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('pointerdown', onTap);
          window.removeEventListener('kk-celebrate', onCelebrate);
          document.removeEventListener('visibilitychange', onVis);
          world.destroy();
        };
        return undefined;
      })
      .catch((err) => {
        console.warn('cinema world unavailable — using stills', err);
        html.classList.add('stills');
      });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [tier]);

  return { canvasRef, worldRef, ready };
}
