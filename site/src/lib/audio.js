/**
 * Tiny Web Audio music player (spec §5.10, §7.1).
 * - start()/unlock() must be called synchronously from the guest's tap: the AudioContext is created/resumed at once
 *   (iOS/WhatsApp unlock), then playback begins as soon as the file is decoded.
 * - Fades use per-source GainNodes into a master gain (iOS ignores HTMLAudioElement.volume). Pause/resume ride the
 *   master gain, so scheduled fades and the verse jump keep their timing.
 * - Verse sync (user, 13 Nov): with `introLoop`, start() plays the intro and loops its bars while the guest waits;
 *   cue({ arriveIn }) — on the door tap — jumps on the next beat so the first sung line (`verseAt`) sounds when the
 *   camera reaches the couple, then the song continues and loops loopStart..loopEnd.
 * - If the file isn't ready within 6 s, it gives up silently — the invitation never waits for music.
 */
export function createMusicPlayer({
  src,
  loopStart = 0,
  loopEnd = null,
  startAt = loopStart, // where the song begins when played from the top
  introLoop = null, // [start, end] — bars of the intro looped while waiting (seconds, bar-aligned)
  verseAt = null, // when the first sung line begins (seconds)
  beat = null, // beat length (s) and a beat line (s) — the jump lands on the beat grid
  beatPhase = 0,
  volume = 0.4,
  fadeMs = 1500,
  startTimeoutMs = 6000,
  AudioContextImpl = globalThis.AudioContext ?? globalThis.webkitAudioContext,
  fetchImpl = globalThis.fetch?.bind(globalThis),
  doc = globalThis.document,
} = {}) {
  let ctx = null;
  let master = null;
  let buffer = null; // the decoded song
  let introBuffer = null; // the song's intro with its waiting loop crossfaded (built once)
  let current = null; // { kind: 'intro' | 'song', node, gain, startedAt, offset, loopA, loopB }
  let fileBytes = null; // Promise<ArrayBuffer>
  let playing = false;
  let pauseTimer = null;
  let starting = null; // in-flight load
  let pendingCue = null; // a door tap that arrived before the song was decoded
  const listeners = new Set();
  const notify = () => listeners.forEach((cb) => cb(playing));
  const XF = 0.4; // crossfade at the verse jump (s)

  const preload = () => {
    if (!src || !fetchImpl) return Promise.resolve();
    if (!fileBytes) {
      fileBytes = fetchImpl(src).then((r) => {
        if (!r.ok) throw new Error(`music: ${r.status}`);
        return r.arrayBuffer();
      });
      fileBytes.catch(() => {});
    }
    return fileBytes.then(() => undefined, () => undefined);
  };

  function unlock() {
    if (!AudioContextImpl) return null;
    if (!ctx) {
      ctx = new AudioContextImpl();
      master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
    }
    ctx.resume?.();
    return ctx;
  }

  const ramp = (param, to, seconds) => {
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(to, now + seconds);
  };

  /** Copy the intro and crossfade its waiting loop's seam (end → start), so the loop never clicks. */
  const buildIntro = (buf) => {
    if (!introLoop || !buf.getChannelData || !ctx.createBuffer) return buf;
    const sr = buf.sampleRate;
    const [a, b] = introLoop.map((t) => Math.round(t * sr));
    const cf = Math.round(0.25 * sr);
    const out = ctx.createBuffer(buf.numberOfChannels, b, sr);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const x = buf.getChannelData(c);
      const y = out.getChannelData(c);
      y.set(x.subarray(0, b));
      for (let k = 0; k < cf; k++) {
        const f = k / cf;
        y[b - cf + k] = x[b - cf + k] * Math.cos((f * Math.PI) / 2) + x[a - cf + k] * Math.sin((f * Math.PI) / 2);
      }
    }
    return out;
  };

  /** Start a looping source at ctx time `when` from `offset`, fading its own gain in over `fade` seconds. */
  const play = (kind, buf, when, offset, fade, [loopA, loopB]) => {
    const node = ctx.createBufferSource();
    node.buffer = buf;
    node.loop = true;
    node.loopStart = loopA;
    if (loopB != null) node.loopEnd = loopB;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    node.connect(gain);
    gain.connect(master);
    node.start(when, offset);
    if (when > ctx.currentTime) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0, when);
      gain.gain.linearRampToValueAtTime(volume, when + fade);
    } else ramp(gain.gain, volume, fade);
    current = { kind, node, gain, startedAt: when, offset, loopA, loopB };
    playing = true;
    notify();
  };

  const playSong = (when, offset, fade = fadeMs / 1000) => play('song', buffer, when, offset, fade, [loopStart, loopEnd]);

  /** Where the current source is in the song (seconds), allowing for its loop. */
  const position = () => {
    const c = current;
    let p = c.offset + (ctx.currentTime - c.startedAt);
    if (c.loopB != null && p >= c.loopB) p = c.loopA + ((p - c.loopA) % (c.loopB - c.loopA));
    return p;
  };

  /** Jump from the intro to the song so the verse lands ~arriveIn s from now, on the beat. */
  const jumpToVerse = (arriveIn) => {
    const now = ctx.currentTime;
    const intro = current;
    const p = position();
    const b = beat || 0.5;
    const k = Math.ceil((p - beatPhase) / b + 1e-9);
    const tb = now + (beatPhase + k * b - p); // the next beat of the intro
    const beats = Math.max(0, Math.round((now + arriveIn - tb) / b));
    const offset = Math.max(0, verseAt - beats * b);
    intro.gain.gain.cancelScheduledValues(now);
    intro.gain.gain.setValueAtTime(intro.gain.gain.value, tb);
    intro.gain.gain.linearRampToValueAtTime(0, tb + XF);
    intro.node.stop(tb + XF + 0.05);
    play('song', buffer, tb, offset, XF, [loopStart, loopEnd]);
  };

  const load = () => {
    if (starting) return starting;
    if (buffer) return Promise.resolve(true);
    preload();
    starting = (async () => {
      let timer;
      const timeout = new Promise((resolve) => (timer = setTimeout(() => resolve(null), startTimeoutMs)));
      const bytes = await Promise.race([fileBytes.catch(() => null), timeout]);
      clearTimeout(timer);
      if (!bytes) {
        fileBytes = null; // a later tap re-fetches instead of waiting on a stuck request
        return false;
      }
      try {
        buffer = await ctx.decodeAudioData(bytes.slice ? bytes.slice(0) : bytes);
      } catch {
        return false;
      }
      return true;
    })().finally(() => {
      starting = null;
    });
    return starting;
  };

  /** Begin once decoded — honouring a door tap that came in while loading, and a guest who switched away. */
  const begin = (delay, intro = false) => {
    const go = () => {
      if (current) return;
      if (pendingCue) {
        const { at, arriveIn } = pendingCue;
        pendingCue = null;
        const left = at + arriveIn - ctx.currentTime;
        return playSong(ctx.currentTime, Math.max(0, verseAt - Math.max(0.5, left)));
      }
      if (intro && introLoop && verseAt != null) {
        introBuffer ||= buildIntro(buffer);
        return play('intro', introBuffer, ctx.currentTime + delay, 0, fadeMs / 1000, introLoop);
      }
      return playSong(ctx.currentTime + delay, startAt);
    };
    if (doc?.hidden) {
      const onVisible = () => {
        if (doc.hidden) return;
        doc.removeEventListener('visibilitychange', onVisible);
        go();
      };
      doc.addEventListener('visibilitychange', onVisible);
      return;
    }
    go();
  };

  /** intro: true (the envelope tap) → play the intro and wait for cue(); otherwise play the song from the top. */
  function start({ delay = 0, intro = false } = {}) {
    if (!src || !AudioContextImpl || playing) return Promise.resolve();
    unlock(); // synchronous, inside the gesture
    return load().then((ok) => {
      if (ok) begin(delay, intro);
    });
  }

  /** The door tap: make the first verse land ~arriveIn s from now. */
  function cue({ arriveIn = 4 } = {}) {
    if (!src || !AudioContextImpl || verseAt == null) return start();
    unlock();
    if (current?.kind === 'song') return Promise.resolve(); // already in the song
    if (current?.kind === 'intro' && buffer) {
      jumpToVerse(arriveIn);
      return Promise.resolve();
    }
    pendingCue = { at: ctx.currentTime, arriveIn };
    return load().then((ok) => {
      if (ok) begin(0);
    });
  }

  function pause() {
    if (!playing || !ctx) return;
    ramp(master.gain, 0, 0.3);
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => !playing && ctx.suspend?.(), 320);
    playing = false;
    notify();
  }

  function resume() {
    if (playing) return;
    if (!current) return void start(); // never a dead button: (re)load and play from this tap
    if (!ctx) return;
    clearTimeout(pauseTimer);
    ctx.resume?.();
    ramp(master.gain, 1, 0.6);
    playing = true;
    notify();
  }

  return {
    preload,
    unlock,
    context: () => ctx,
    start,
    cue,
    pause,
    resume,
    toggle: () => (playing ? pause() : resume()),
    isPlaying: () => playing,
    /** what is playing and where (song seconds) — for checks */
    where: () => (current && ctx ? { kind: current.kind, t: position(), now: ctx.currentTime, startedAt: current.startedAt, offset: current.offset } : null),
    onChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    destroy() {
      clearTimeout(pauseTimer);
      try {
        current?.node.stop();
      } catch {
        /* already stopped */
      }
      ctx?.close?.();
      listeners.clear();
      playing = false;
    },
  };
}

/** Pause when the guest leaves (WhatsApp in background, screen locked); resume only if it was playing. */
export function attachVisibilityPause(player, doc = document) {
  let wasPlaying = false;
  const onVis = () => {
    if (doc.hidden) {
      wasPlaying = player.isPlaying();
      if (wasPlaying) player.pause();
    } else if (wasPlaying) {
      player.resume();
      wasPlaying = false;
    }
  };
  doc.addEventListener('visibilitychange', onVis);
  return () => doc.removeEventListener('visibilitychange', onVis);
}
