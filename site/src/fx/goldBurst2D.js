
const GOLDS = ['#FFF1BF', '#F3DA9A', '#D9BF7F', '#C9A04F', '#B8934A'];

/**
 * Gold-flake "cracker" burst (spec §5.1) on its own canvas layer — canvas-confetti clears the
 * whole canvas every frame, so it must not share a canvas with the petals.
 */
export const preloadConfetti = () => import('canvas-confetti');

export function goldBurst2D(canvas, { scale = 1 } = {}) {
  let stop = () => {};
  preloadConfetti().then(({ default: confetti }) => {
    stop = fireGold(confetti, canvas, scale);
  });
  return () => stop();
}

function fireGold(confetti, canvas, scale) {
  const fire = confetti.create(canvas, { resize: true, useWorker: true, disableForReducedMotion: true });
  const flake = confetti.shapeFromPath({ path: 'M0 0 L5 1.2 L4 4.6 L-0.8 3.6 Z' });
  const small = window.innerWidth < 640;
  const count = Math.round((small ? 46 : 80) * scale);
  const common = {
    colors: GOLDS,
    shapes: [flake, 'circle'],
    scalar: small ? 0.75 : 0.9,
    gravity: 0.7,
    ticks: 240,
    decay: 0.92,
    drift: 0,
    startVelocity: small ? 42 : 55,
    spread: 55,
    flat: false,
  };
  fire({ ...common, particleCount: count, angle: 62, origin: { x: 0.05, y: 0.95 } });
  fire({ ...common, particleCount: count, angle: 118, origin: { x: 0.95, y: 0.95 } });
  setTimeout(() => fire({ ...common, particleCount: Math.round(count * 0.6), angle: 90, spread: 120, startVelocity: 30, origin: { x: 0.5, y: 0.45 } }), 260);
  return () => fire.reset();
}
