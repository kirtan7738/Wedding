import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMusicPlayer, attachVisibilityPause } from './audio.js';

class FakeParam {
  constructor() { this.value = 0; this.events = []; }
  setValueAtTime(v, t) { this.events.push(['set', v, t]); }
  linearRampToValueAtTime(v, t) { this.events.push(['ramp', v, t]); }
  cancelScheduledValues() { this.events.push(['cancel']); }
}
class FakeCtx {
  constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = {}; this.calls = []; FakeCtx.last = this; }
  resume() { this.calls.push('resume'); this.state = 'running'; return Promise.resolve(); }
  suspend() { this.calls.push('suspend'); this.state = 'suspended'; return Promise.resolve(); }
  close() { this.calls.push('close'); return Promise.resolve(); }
  createGain() { const g = { gain: new FakeParam(), connect() {} }; this.gainNode = g; return g; }
  createBufferSource() { const s = { connect() {}, start: vi.fn(), stop: vi.fn(), loop: false }; this.source = s; return s; }
  decodeAudioData() { return Promise.resolve({ duration: 90 }); }
}
const okFetch = () => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
const make = (over = {}) => createMusicPlayer({ src: '/audio/theme.m4a', AudioContextImpl: FakeCtx, fetchImpl: okFetch, ...over });

afterEach(() => vi.useRealTimers());

describe('createMusicPlayer', () => {
  it('start() unlocks audio synchronously inside the tap, then fades in to 0.4 over 1.5 s', async () => {
    const player = make();
    const p = player.start();
    expect(FakeCtx.last.calls).toContain('resume'); // before any await — iOS unlock
    await p;
    expect(player.isPlaying()).toBe(true);
    expect(FakeCtx.last.gainNode.gain.events).toContainEqual(['ramp', 0.4, 1.5]);
    expect(FakeCtx.last.source.loop).toBe(true);
  });

  it('loops the configured segment', async () => {
    const player = make({ loopStart: 12, loopEnd: 72 });
    await player.start();
    expect(FakeCtx.last.source.loopStart).toBe(12);
    expect(FakeCtx.last.source.loopEnd).toBe(72);
    expect(FakeCtx.last.source.start).toHaveBeenCalledWith(0, 12);
  });

  it('pause/resume toggle playing and notify listeners', async () => {
    const player = make();
    const seen = [];
    player.onChange((v) => seen.push(v));
    await player.start();
    player.pause();
    expect(player.isPlaying()).toBe(false);
    player.resume();
    expect(player.isPlaying()).toBe(true);
    player.toggle();
    expect(seen).toEqual([true, false, true, false]);
  });

  it('gives up silently when the file never arrives (6 s)', async () => {
    vi.useFakeTimers();
    const player = make({ fetchImpl: () => new Promise(() => {}) });
    const p = player.start();
    await vi.advanceTimersByTimeAsync(6100);
    await expect(p).resolves.toBeUndefined();
    expect(player.isPlaying()).toBe(false);
  });

  it('with no src does nothing and never throws', async () => {
    const player = make({ src: null });
    await expect(player.start()).resolves.toBeUndefined();
    expect(player.isPlaying()).toBe(false);
  });
});

describe('attachVisibilityPause', () => {
  let doc;
  beforeEach(() => {
    doc = new EventTarget();
    doc.hidden = false;
  });
  const flip = (hidden) => {
    doc.hidden = hidden;
    doc.dispatchEvent(new Event('visibilitychange'));
  };

  it('pauses when the guest leaves and resumes when they return, if it was playing', async () => {
    const player = make();
    await player.start();
    attachVisibilityPause(player, doc);
    flip(true);
    expect(player.isPlaying()).toBe(false);
    flip(false);
    expect(player.isPlaying()).toBe(true);
  });

  it('stays paused on return if the guest had paused it', async () => {
    const player = make();
    await player.start();
    player.pause();
    attachVisibilityPause(player, doc);
    flip(true);
    flip(false);
    expect(player.isPlaying()).toBe(false);
  });
});

describe('review fixes', () => {
  it('does not start playing while the page is hidden; starts when the guest returns (review #3)', async () => {
    let resolveFetch;
    const doc = new EventTarget();
    doc.hidden = false;
    const player = make({ fetchImpl: () => new Promise((r) => (resolveFetch = r)), doc });
    const p = player.start();
    doc.hidden = true; // guest switches chat while the song is still downloading
    resolveFetch({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
    await p;
    expect(player.isPlaying()).toBe(false);
    doc.hidden = false;
    doc.dispatchEvent(new Event('visibilitychange'));
    await Promise.resolve();
    expect(player.isPlaying()).toBe(true);
  });

  it('a pill tap after a timed-out start retries instead of being a dead button (review #4)', async () => {
    vi.useFakeTimers();
    let calls = 0;
    const fetchImpl = () => (++calls === 1 ? new Promise(() => {}) : okFetch());
    const player = make({ fetchImpl });
    const p = player.start();
    await vi.advanceTimersByTimeAsync(6100);
    await p;
    expect(player.isPlaying()).toBe(false);
    player.toggle();
    await vi.advanceTimersByTimeAsync(10);
    expect(player.isPlaying()).toBe(true);
  });
});
