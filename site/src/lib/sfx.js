/**
 * Small ceremonial sound effects, synthesised with Web Audio (no files, ~0 KB):
 *   intro() — on the envelope tap: a temple bell, the wax seal cracking, paper as the flap opens and the card is
 *             drawn out, two soft page turns for the gatefold, and a rising chime into the zoom.
 *   knock() — on the brass knocker: two knocks of a brass ring on teak (a dull thud + a short metallic clink).
 *   door()  — on the door tap: a low wooden creak as the doors swing, and the shehnai recording (if provided at
 *             shehnaiSrc) rising over it; tiny chimes as the gods' flowers begin to fall.
 * Timings mirror IntroEnvelope's and the cinema opening's timelines. All quiet: the song stays the star.
 */
export function createSfx({ getContext, fetchImpl = globalThis.fetch?.bind(globalThis), shehnaiSrc = null, volume = 0.5 } = {}) {
  let shehnai = null; // AudioBuffer once decoded
  let bytes = null;
  let noise = null;

  const out = (ctx) => {
    const g = ctx.createGain();
    g.gain.value = volume;
    g.connect(ctx.destination);
    return g;
  };

  const noiseBuffer = (ctx) => {
    if (noise) return noise;
    const len = Math.floor(ctx.sampleRate * 1.5);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noise;
  };

  /** a decaying sine partial */
  const tone = (ctx, dest, t, freq, peak, decay, type = 'sine') => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + decay + 0.05);
  };

  /** filtered noise burst (paper, seal crack, swish) */
  const hiss = (ctx, dest, t, { dur = 0.3, freq = 3000, q = 0.8, peak = 0.3, sweepTo = null, type = 'bandpass' } = {}) => {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuffer(ctx);
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    f.Q.setValueAtTime(q, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.03, dur / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(dest);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  };

  /** a small brass temple bell: inharmonic partials with long tails */
  const bell = (ctx, dest, t, base = 880, peak = 0.22) => {
    [
      [1, 1, 2.6],
      [2.01, 0.55, 1.8],
      [2.76, 0.35, 1.4],
      [5.4, 0.18, 0.8],
      [8.9, 0.08, 0.5],
    ].forEach(([r, a, d]) => tone(ctx, dest, t, base * r, peak * a, d));
  };

  /** glassy chimes for petals */
  const chimes = (ctx, dest, t, n = 5, peak = 0.06) => {
    const notes = [1568, 1760, 2093, 2349, 2637, 3136];
    for (let i = 0; i < n; i++) tone(ctx, dest, t + i * 0.13 + Math.random() * 0.05, notes[(i * 3) % notes.length], peak, 1.1);
  };

  /** a soft wooden creak: a slow, wavering low tone through a resonant filter */
  const creak = (ctx, dest, t, dur = 1.8) => {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(70, t);
    o.frequency.linearRampToValueAtTime(95, t + dur * 0.4);
    o.frequency.linearRampToValueAtTime(62, t + dur);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(420, t);
    f.Q.setValueAtTime(6, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.15);
    g.gain.setValueAtTime(0.05, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  };

  function preload() {
    if (!shehnaiSrc || !fetchImpl || bytes) return bytes || Promise.resolve();
    bytes = fetchImpl(shehnaiSrc)
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null);
    // decode as soon as there is an audio context, so the door tap can start it instantly
    return bytes.then(() => {
      const ctx = getContext();
      return ctx ? decodeShehnai(ctx).then(() => undefined) : undefined;
    });
  }

  async function decodeShehnai(ctx) {
    if (shehnai || !bytes) return shehnai;
    const b = await bytes;
    if (!b) return null;
    try {
      shehnai = await ctx.decodeAudioData(b.slice ? b.slice(0) : b);
    } catch {
      shehnai = null;
    }
    return shehnai;
  }

  return {
    preload,
    /** call right after the envelope tap (inside the gesture, once the context exists) */
    intro() {
      const ctx = getContext();
      if (!ctx) return;
      const t = ctx.currentTime + 0.01;
      const d = out(ctx);
      bell(ctx, d, t, 880, 0.2);
      hiss(ctx, d, t + 0.12, { dur: 0.09, freq: 2400, q: 1.2, peak: 0.35, type: 'highpass' }); // seal cracks
      tone(ctx, d, t + 0.12, 140, 0.12, 0.12, 'triangle');
      hiss(ctx, d, t + 0.4, { dur: 0.7, freq: 1800, sweepTo: 4200, q: 0.7, peak: 0.12 }); // flap folds open
      hiss(ctx, d, t + 1.05, { dur: 1.1, freq: 900, sweepTo: 2600, q: 0.6, peak: 0.1 }); // card drawn out
      hiss(ctx, d, t + 3.3, { dur: 0.5, freq: 2600, sweepTo: 1200, q: 0.9, peak: 0.1 }); // left page
      hiss(ctx, d, t + 3.65, { dur: 0.5, freq: 2800, sweepTo: 1300, q: 0.9, peak: 0.1 }); // right page
      chimes(ctx, d, t + 4.45, 6, 0.05); // into the zoom
      decodeShehnai(ctx); // get it ready for the door tap
    },
    /** call on the knocker tap, before the doors open */
    knock() {
      const ctx = getContext();
      if (!ctx) return;
      const t = ctx.currentTime + 0.01;
      const d = out(ctx);
      [0, 0.3].forEach((k, i) => {
        const p = i ? 0.8 : 1;
        tone(ctx, d, t + k, 118, 0.32 * p, 0.16, 'triangle'); // the teak
        tone(ctx, d, t + k, 1660, 0.07 * p, 0.22); // the brass ring
        tone(ctx, d, t + k + 0.004, 2490, 0.04 * p, 0.14);
        hiss(ctx, d, t + k, { dur: 0.05, freq: 1500, q: 1.4, peak: 0.25 * p });
      });
    },
    /** call on the door tap */
    door() {
      const ctx = getContext();
      if (!ctx) return;
      const t = ctx.currentTime + 0.01;
      const d = out(ctx);
      creak(ctx, d, t + 0.45, 1.9);
      if (shehnai) {
        const s = ctx.createBufferSource();
        s.buffer = shehnai;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.25);
        // hand over to the song: the shehnai fades as Judi Jodi fades in (World lands at ~4.2 s)
        g.gain.setValueAtTime(0.9, t + Math.max(0.3, Math.min(shehnai.duration, 5.5) - 1.6));
        g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(shehnai.duration, 5.5));
        s.connect(g).connect(d);
        s.start(t);
        s.stop(t + Math.min(shehnai.duration, 5.5) + 0.05);
      } else {
        bell(ctx, d, t, 660, 0.16);
        bell(ctx, d, t + 0.9, 880, 0.12);
      }
      chimes(ctx, d, t + 2.5, 7, 0.045); // the gods' flowers begin to fall
    },
  };
}
