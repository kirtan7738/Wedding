import { useEffect, useState } from 'react';

/**
 * Painted pieces arrive over time (Flow, round 9). A component draws its CSS stand-in until the painting exists and
 * has decoded, then switches to it — so the site always works, and new art slots in by just dropping the file.
 * Resolves false for a missing file (a 404, or the SPA fallback page, both fail to decode).
 */
const cache = new Map();
export function artReady(src) {
  if (typeof Image === 'undefined') return Promise.resolve(false);
  if (!cache.has(src)) {
    cache.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => (img.decode ? img.decode().then(() => resolve(true), () => resolve(true)) : resolve(true));
        img.onerror = () => resolve(false);
        img.src = src;
      }),
    );
  }
  return cache.get(src);
}

/** true once the painting at `src` is loaded (false on the server, while loading, or if it does not exist) */
export function useArt(src) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    artReady(src).then((v) => alive && setOk(v));
    return () => {
      alive = false;
    };
  }, [src]);
  return ok;
}
