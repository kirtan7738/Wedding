/**
 * Tiny Web Audio music player (spec §5.10, §7.1).
 * - start() must be called synchronously from the guest's tap: it creates/resumes the AudioContext
 *   immediately (iOS/WhatsApp unlock), then plays as soon as the file is decoded.
 * - Fades use a GainNode (iOS ignores HTMLAudioElement.volume).
 * - If the file isn't ready within 6 s, it gives up silently — the invitation never waits for music.
 */
export function createMusicPlayer({
  src,
  loopStart = 0,
  loopEnd = null,
  volume = 0.4,
  fadeMs = 1500,
  startTimeoutMs = 6000,
  AudioContextImpl = globalThis.AudioContext ?? globalThis.webkitAudioContext,
  fetchImpl = globalThis.fetch?.bind(globalThis),
  doc = globalThis.document,
} = {}) {
  let ctx = null;
  let gain = null;
  let source = null;
  let fileBytes = null; // Promise<ArrayBuffer>
  let playing = false;
  let pauseTimer = null;
  let starting = null; // in-flight start() promise
  const listeners = new Set();
  const notify = () => listeners.forEach((cb) => cb(playing));

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

  const ramp = (to, seconds) => {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(to, now + seconds);
  };

  const beginPlayback = (buffer) => {
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = loopStart;
    if (loopEnd != null) source.loopEnd = loopEnd;
    source.connect(gain);
    source.start(0, loopStart);
    gain.gain.value = 0;
    ramp(volume, fadeMs / 1000);
    playing = true;
    notify();
  };

  function start() {
    if (!src || !AudioContextImpl || playing) return Promise.resolve();
    // ---- synchronous part (inside the user gesture) ----
    if (!ctx) {
      ctx = new AudioContextImpl();
      gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
    }
    ctx.resume?.();
    if (starting) return starting;
    preload();
    starting = (async () => {
      let timer;
      const timeout = new Promise((resolve) => (timer = setTimeout(() => resolve(null), startTimeoutMs)));
      const bytes = await Promise.race([fileBytes.catch(() => null), timeout]);
      clearTimeout(timer);
      if (!bytes) {
        fileBytes = null; // a later tap re-fetches instead of waiting on a stuck request
        return;
      }
      let buffer;
      try {
        buffer = await ctx.decodeAudioData(bytes.slice ? bytes.slice(0) : bytes);
      } catch {
        return;
      }
      if (doc?.hidden) {
        // guest left while the song was loading: wait for them to come back before playing
        const onVisible = () => {
          if (doc.hidden) return;
          doc.removeEventListener('visibilitychange', onVisible);
          if (!source) beginPlayback(buffer);
        };
        doc.addEventListener('visibilitychange', onVisible);
        return;
      }
      beginPlayback(buffer);
    })().finally(() => {
      starting = null;
    });
    return starting;
  }

  function pause() {
    if (!playing || !ctx) return;
    ramp(0, 0.3);
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => !playing && ctx.suspend?.(), 320);
    playing = false;
    notify();
  }

  function resume() {
    if (playing) return;
    if (!source) return void start(); // never a dead button: (re)load and play from this tap
    if (!ctx) return;
    clearTimeout(pauseTimer);
    ctx.resume?.();
    ramp(volume, 0.6);
    playing = true;
    notify();
  }

  return {
    preload,
    start,
    pause,
    resume,
    toggle: () => (playing ? pause() : resume()),
    isPlaying: () => playing,
    onChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    destroy() {
      clearTimeout(pauseTimer);
      try { source?.stop(); } catch { /* already stopped */ }
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
