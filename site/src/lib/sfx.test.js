import { describe, it, expect, vi } from 'vitest';
import { createSfx } from './sfx.js';

/** A fake AudioContext that records what was built and scheduled. */
function fakeCtx() {
  const made = [];
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() });
  const node = (type, extra = {}) => {
    const n = { kind: type, connect: vi.fn(() => n), start: vi.fn(), stop: vi.fn(), ...extra };
    made.push(n);
    return n;
  };
  const ctx = {
    currentTime: 0,
    sampleRate: 8000,
    destination: {},
    made,
    createOscillator: () => node('osc', { frequency: param(), detune: param() }),
    createGain: () => node('gain', { gain: param() }),
    createBiquadFilter: () => node('filter', { frequency: param(), Q: param() }),
    createBuffer: (ch, len) => ({ getChannelData: () => new Float32Array(len) }),
    createBufferSource: () => node('src', { playbackRate: param() }),
    decodeAudioData: () => Promise.resolve({ duration: 6 }),
  };
  return ctx;
}

describe('createSfx', () => {
  it('does nothing (and never throws) before audio is unlocked', () => {
    const sfx = createSfx({ getContext: () => null });
    expect(() => sfx.intro()).not.toThrow();
    expect(() => sfx.door()).not.toThrow();
  });

  it('intro() schedules the bell, seal, paper and chime sounds across the envelope opening', () => {
    const ctx = fakeCtx();
    createSfx({ getContext: () => ctx }).intro();
    const starts = ctx.made.filter((n) => n.start.mock.calls.length).flatMap((n) => n.start.mock.calls.map((c) => c[0]));
    expect(starts.length).toBeGreaterThan(8);
    expect(Math.min(...starts)).toBeLessThan(0.05); // the bell rings on the tap
    expect(Math.max(...starts)).toBeGreaterThan(3.2); // the gatefold pages at ~3.3 s
  });

  it('door() creaks the doors even when the shehnai recording is missing', async () => {
    const ctx = fakeCtx();
    const fetchImpl = () => Promise.resolve({ ok: false, status: 404 });
    const sfx = createSfx({ getContext: () => ctx, fetchImpl, shehnaiSrc: '/audio/shehnai.m4a' });
    await sfx.preload();
    sfx.door();
    expect(ctx.made.some((n) => n.kind === 'osc' || n.kind === 'src')).toBe(true);
  });

  it('door() plays the shehnai recording when it is available', async () => {
    const ctx = fakeCtx();
    const fetchImpl = () => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
    const sfx = createSfx({ getContext: () => ctx, fetchImpl, shehnaiSrc: '/audio/shehnai.m4a' });
    await sfx.preload();
    sfx.door();
    const sample = ctx.made.find((n) => n.kind === 'src' && n.buffer?.duration === 6);
    expect(sample).toBeTruthy();
  });
});
