import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wedding from '../content/wedding.js';
import { localDigits } from '../lib/gujarati.js';
import Reveal from './Reveal.jsx';

/**
 * સાત ફેરા (redesign, 13 Nov): the pheras painting, then seven diyas in a row — one for each step of the saptapadi.
 * As the guest scrolls through, they light one after another and each lights its vow below. Every vow is always
 * in the page (readable without scrolling effects); only the light follows the scroll.
 */
export default function Interlude() {
  const ref = useRef(null);
  const vows = wedding.copy.vows;
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(vows.length);
      return undefined;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 78%',
      end: 'bottom 62%',
      onUpdate: (self) => setLit((n) => Math.max(n, Math.min(vows.length, Math.ceil(self.progress * vows.length + 0.01)))),
    });
    return () => st.kill();
  }, [vows.length]);

  return (
    <Reveal id="interlude" className="interlude scene">
      <img className="interlude-art" data-reveal="title" src="/img/art/pheras.webp" alt="" aria-hidden="true" width="1600" height="1398" loading="lazy" decoding="async" />
      <p className="interlude-lines">
        {wedding.copy.interlude.map((line) => (
          <span key={line} className="interlude-line" data-reveal="title">
            {line}
          </span>
        ))}
      </p>
      <div className="vows" ref={ref}>
        <p className="vows-lead">{wedding.copy.vowsLead}</p>
        <div className="vow-diyas" aria-hidden="true">
          {vows.map((v, i) => (
            <span key={v} className={`vow-diya ${i < lit ? 'is-lit' : ''}`} style={{ '--i': i }}>
              <span className="vow-flame" />
              <img src="/img/art/gate/diya.webp" alt="" width="260" height="178" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
        <ol className="vow-list">
          {vows.map((v, i) => (
            <li key={v} className={`vow ${i < lit ? 'is-lit' : ''}`}>
              <span className="vow-no">{localDigits(i + 1, wedding.lang)}</span>
              <span className="vow-text">{v}</span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
