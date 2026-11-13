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
  createBufferSource() { const s = { connect() {}, start: vi.fn(), stop: vi.fn(), loop: false }; this.source = s; (this.sources ||= []).push(s); return s; }
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

describe('music arc (13 Nov): intro once, then a bar-aligned loop; unlock on the envelope, song after the doors', () => {
  it('plays the intro from startAt, then loops loopStart..loopEnd', async () => {
    const player = make({ startAt: 0, loopStart: 17.745, loopEnd: 117.867 });
    await player.start();
    expect(FakeCtx.last.source.start).toHaveBeenCalledWith(0, 0);
    expect(FakeCtx.last.source.loopStart).toBe(17.745);
    expect(FakeCtx.last.source.loopEnd).toBe(117.867);
  });

  it('unlock() opens the audio context inside the tap without playing, and start() reuses it', async () => {
    const player = make();
    player.unlock();
    const ctx = FakeCtx.last;
    expect(ctx.calls).toContain('resume');
    expect(player.isPlaying()).toBe(false);
    expect(player.context()).toBe(ctx);
    await player.start();
    expect(FakeCtx.last).toBe(ctx);
    expect(player.isPlaying()).toBe(true);
  });

  it('start({ delay }) schedules the song and its fade-in for later', async () => {
    const player = make({ startAt: 0 });
    await player.start({ delay: 2.5 });
    expect(FakeCtx.last.source.start).toHaveBeenCalledWith(2.5, 0);
    expect(FakeCtx.last.gainNode.gain.events).toContainEqual(['ramp', 0.4, 4]);
  });
});

describe('verse sync (13 Nov): the intro waits on the envelope, the first verse lands when the doors open', () => {
  const opts = { startAt: 0, loopStart: 17.745, loopEnd: 117.867, introLoop: [6.157, 16.981], verseAt: 17.745, beat: 0.451, beatPhase: 0.745 };

  it('start() plays the intro and loops its bars 4–12 while the guest waits', async () => {
    const player = make(opts);
    await player.start({ intro: true });
    const src = FakeCtx.last.sources[0];
    expect(src.start).toHaveBeenCalledWith(0, 0);
    expect(src.loopStart).toBe(6.157);
    expect(src.loopEnd).toBe(16.981);
  });

  it('cue() jumps on the next beat so the first verse arrives with the camera', async () => {
    const player = make(opts);
    await player.start({ intro: true });
    const ctx = FakeCtx.last;
    ctx.currentTime = 10; // the guest taps the door 10 s after the envelope
    player.cue({ arriveIn: 4 });
    const song = ctx.sources[1];
    const [when, offset] = song.start.mock.calls[0];
    expect(when).toBeCloseTo(10.216, 3); // the next beat of the intro (0.745 + 21 × 0.451)
    // the verse (17.745) sounds k whole beats later, as close as possible to 10 + 4 s
    const verseAt = when + (17.745 - offset);
    expect(Math.abs(verseAt - 14)).toBeLessThanOrEqual(0.451 / 2 + 1e-6);
    expect(Math.abs(((17.745 - offset) / 0.451) - Math.round((17.745 - offset) / 0.451))).toBeLessThan(1e-6);
    expect(song.loopStart).toBe(17.745);
    expect(song.loopEnd).toBe(117.867);
    expect(ctx.sources[0].stop).toHaveBeenCalled(); // the intro bows out after the crossfade
  });

  it('a plain start() (the music button for a returning guest) plays the whole song from the top', async () => {
    const player = make(opts);
    await player.start();
    const src = FakeCtx.last.sources[0];
    expect(src.start).toHaveBeenCalledWith(0, 0);
    expect(src.loopStart).toBe(17.745);
  });

  it('cue() without a running intro starts the song so the verse still lands on time', async () => {
    const player = make(opts);
    player.unlock();
    await player.cue({ arriveIn: 4 });
    const [when, offset] = FakeCtx.last.sources[0].start.mock.calls[0];
    expect(when).toBe(0);
    expect(offset).toBeCloseTo(17.745 - 4, 6);
    expect(player.isPlaying()).toBe(true);
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
