import { useEffect, useRef, useState } from 'react';

/**
 * The very first screen (user, 13 Nov): the guest chooses ગુજરાતી or English before the envelope.
 * Themed like a mandir doorway: ivory handmade paper, the marigold toran swaying across the top, Shri Ganesh in a gold
 * ring, and two arched doorways, each with a diya. Tapping one lights its diya, the other bows out, and the screen lifts
 * away to the envelope underneath.
 * - Both labels are always shown in both scripts, so either guest can read the choice.
 * - onPick(lang) runs synchronously inside the tap (it starts the song's intro: the browser only allows sound there);
 *   onDone() runs once the screen has gone.
 * - Before the app boots, a tap is remembered by the inline script in index.html (window.__pendingLang).
 */
export default function LanguageGate({ onPick, onDone }) {
  const root = useRef(null);
  const [picked, setPicked] = useState(null);

  const pick = (lang) => {
    if (picked) return;
    setPicked(lang);
    onPick(lang);
    navigator.vibrate?.(10);
    // The exit is pure CSS (.is-picked): compositor-driven, so it keeps real time even while the 3D world is loading
    // (GSAP's lag smoothing would slow it to a crawl then). onDone fires on the last animation, or after a fallback.
    clearTimeout(fallback.current);
    fallback.current = setTimeout(done, 2600);
  };
  const fallback = useRef(0);
  const finished = useRef(false);
  const done = () => {
    if (finished.current) return;
    finished.current = true;
    clearTimeout(fallback.current);
    onDone();
  };
  useEffect(() => () => clearTimeout(fallback.current), []);

  // a tap that landed before the app was listening
  useEffect(() => {
    const pending = window.__pendingLang;
    if (pending) {
      window.__pendingLang = null;
      pick(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`lang-gate ${picked ? 'is-picked' : ''}`}
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-gate-title"
      onAnimationEnd={(e) => e.target === root.current && e.animationName === 'lg-out' && done()}
    >
      <img className="lg-toran" src="/img/art/gate/toran.webp" alt="" aria-hidden="true" width="760" height="327" decoding="async" fetchPriority="high" />
      <div className="lg-petals" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} style={{ '--i': i }} />
        ))}
      </div>
      <div className="lg-inner">
        <div className="lg-ganesh" aria-hidden="true">
          <img src="/img/art/gate/ganesh-art.webp" alt="" width="300" height="315" decoding="async" />
        </div>
        <p className="lg-invocation gu" lang="gu">
          ॥ શ્રી ગણેશાય નમઃ ॥
        </p>
        <h2 id="lang-gate-title" className="lg-title">
          <span className="lg-title-gu gu" lang="gu">
            ભાષા પસંદ કરો
          </span>
          <span className="lg-title-en latin" lang="en">
            Choose your language
          </span>
        </h2>
        <div className="lg-choices">
          <button type="button" className={`lg-choice ${picked === 'gu' ? 'is-lit' : ''}`} data-lang="gu" lang="gu" onClick={() => pick('gu')} aria-label="ગુજરાતી — Gujarati">
            <span className="lg-door" aria-hidden="true">
              <span className="lg-name lg-name--gu gu">ગુજરાતી</span>
              <span className="lg-sub latin">Gujarati</span>
              <span className="lg-diya">
                <span className="lg-flame" />
                <img src="/img/art/gate/diya.webp" alt="" width="260" height="178" decoding="async" />
              </span>
            </span>
          </button>
          <button type="button" className={`lg-choice ${picked === 'en' ? 'is-lit' : ''}`} data-lang="en" lang="en" onClick={() => pick('en')} aria-label="English — અંગ્રેજી">
            <span className="lg-door" aria-hidden="true">
              <span className="lg-name lg-name--en latin">English</span>
              <span className="lg-sub gu">અંગ્રેજી</span>
              <span className="lg-diya">
                <span className="lg-flame" />
                <img src="/img/art/gate/diya.webp" alt="" width="260" height="178" decoding="async" />
              </span>
            </span>
          </button>
        </div>
        <p className="lg-couple">
          <span className="gu" lang="gu">
            પ્રિન્સી ❀ પાર્થ
          </span>
          <span className="lg-dot" aria-hidden="true">
            ·
          </span>
          <span className="latin" lang="en">
            Princy ❀ Parth
          </span>
        </p>
        <p className="lg-note">
          <span className="gu" lang="gu">
            પછીથી પણ બદલી શકાશે
          </span>
          <span className="latin" lang="en">
            You can switch any time
          </span>
        </p>
      </div>
      <img className="lg-kalash lg-kalash--l" src="/img/art/gate/kalash.webp" alt="" aria-hidden="true" width="260" height="405" decoding="async" />
      <img className="lg-kalash lg-kalash--r" src="/img/art/gate/kalash.webp" alt="" aria-hidden="true" width="260" height="405" decoding="async" />
    </div>
  );
}

/** Small pill (top right, after the doors open) to switch language at any time. */
export function LangToggle({ label, ariaLabel, onToggle, visible }) {
  return (
    <button type="button" className={`lang-toggle ${visible ? 'is-visible' : ''}`} onClick={onToggle} aria-label={ariaLabel} tabIndex={visible ? 0 : -1}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4ZM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3Zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.4-3.6A15.7 15.7 0 0 0 8.1 8ZM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20Zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4Zm.3 5.6a15.7 15.7 0 0 0 1.4-3.6h3a8 8 0 0 1-4.4 3.6Zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4Z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
