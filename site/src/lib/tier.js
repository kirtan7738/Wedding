/**
 * Render tier for the opening (spec §7.2.3): 'high' | 'lite' | '2d' | 'static'.
 * Every tier must look intentional; 'static' = reduced motion (cross-fade only).
 */
export function chooseTier({ gpuTier, isMobile, reducedMotion, webgl2, cores }) {
  if (reducedMotion) return 'static';
  if (!webgl2) return '2d';
  if (gpuTier <= 1) return '2d';
  if (gpuTier === 2 || (isMobile && cores <= 4)) return 'lite';
  return 'high';
}

const TIERS = ['high', 'lite', '2d', 'static'];

function probeWebGL2() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    const ok = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/** Detects the tier on the guest's device. `?tier=high|lite|2d|static` overrides (testing/tuning). */
export async function detectTier({ timeoutMs = 1500 } = {}) {
  const forced = new URLSearchParams(location.search).get('tier');
  if (TIERS.includes(forced)) return forced;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webgl2 = probeWebGL2();
  const isMobile = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  if (reducedMotion || !webgl2) return chooseTier({ gpuTier: 0, isMobile, reducedMotion, webgl2, cores });

  const gpu = await Promise.race([
    import('detect-gpu')
      .then(({ getGPUTier }) => getGPUTier({ benchmarksURL: '/benchmarks', failIfMajorPerformanceCaveat: true }))
      .catch(() => null),
    new Promise((r) => setTimeout(() => r(null), timeoutMs)),
  ]);
  if (!gpu) return '2d'; // unknown or slow detection → the light, always-smooth path
  return chooseTier({ gpuTier: gpu.tier, isMobile: gpu.isMobile ?? isMobile, reducedMotion, webgl2, cores });
}

/** Calls onDrop() once if the average FPS over `windowMs` falls below `threshold`. */
export function createFpsWatchdog({ threshold = 40, windowMs = 500, onDrop }) {
  const stamps = [];
  let fired = false;
  let stopped = false;
  return {
    tick(now) {
      if (fired || stopped) return;
      stamps.push(now);
      while (stamps.length > 2 && now - stamps[0] > windowMs) stamps.shift();
      const span = now - stamps[0];
      if (span < windowMs * 0.9 || stamps.length < 2) return;
      const fps = ((stamps.length - 1) * 1000) / span;
      if (fps < threshold) {
        fired = true;
        onDrop?.();
      }
    },
    stop() {
      stopped = true;
    },
  };
}
