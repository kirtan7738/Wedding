import { useEffect, useState } from 'react';
import wedding from '../content/wedding.js';

/** Always-visible music control, bottom-left in the thumb zone (spec §5.10). Hidden when no song is configured. */
export default function MusicPill({ player, src = wedding.music.src, label = wedding.music.label, visible = true }) {
  const [playing, setPlaying] = useState(() => player?.isPlaying() ?? false);
  const [mounted, setMounted] = useState(false); // client-only: avoids SSR/hydration mismatch

  useEffect(() => setMounted(true), []);
  useEffect(() => player?.onChange(setPlaying), [player]);

  if (!mounted || !src || !player) return null;
  return (
    <button
      type="button"
      className={`music-pill ${playing ? 'is-playing' : ''} ${visible ? 'is-visible' : ''}`}
      aria-pressed={playing}
      aria-label={playing ? wedding.copy.musicOff : wedding.copy.musicOn}
      onClick={() => player.toggle()}
    >
      <span className="music-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 18.5a2.5 2.5 0 1 1-2.5-2.5c.5 0 1 .1 1.5.4V5.6l11-2.1v12a2.5 2.5 0 1 1-2.5-2.5c.5 0 1 .1 1.5.4V7.2l-9 1.7Z" />
        </svg>
      </span>
      <span className="music-label">{label}</span>
      <span className="music-eq" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
