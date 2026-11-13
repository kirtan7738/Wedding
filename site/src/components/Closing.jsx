import { useEffect, useRef } from 'react';
import wedding from '../content/wedding.js';
import { useArt } from '../lib/art.js';
import Reveal from './Reveal.jsx';
import ShareBar from './ShareBar.jsx';

/**
 * The finale (redesign, 13 Nov): the couple, the blessing, and the monogram inside a slowly turning ring of gold
 * words — શુભ લગ્ન ✦ ૧૩ ડિસેમ્બર ૨૦૨૬ ✦ … — then the dhol-shehnai and sharing. The painted dusk courtyard (round 9 #60)
 * sits behind it once it exists.
 */
export default function Closing() {
  const dusk = useArt('/img/art/farewell-scene.webp');
  const ring = wedding.copy.ringText;
  // the ring's words fill the circle exactly by font size — never by letter-spacing, which breaks Gujarati conjuncts
  const textRef = useRef(null);
  useEffect(() => {
    const t = textRef.current;
    if (!t?.getComputedTextLength) return;
    const fit = () => {
      t.style.fontSize = '13px';
      const len = t.getComputedTextLength();
      if (len > 0) t.style.fontSize = `${Math.min(17, (13 * 480) / len)}px`; // 2π·77 ≈ 484
    };
    fit();
    document.fonts?.ready?.then(fit);
  }, [ring]);
  return (
    <Reveal id="closing" className={`closing scene ${dusk ? 'has-art' : ''}`}>
      <img className="closing-couple" data-reveal="title" src="/img/art/couple.webp" alt="" aria-hidden="true" width="1037" height="1600" loading="lazy" decoding="async" />
      <div className="closing-text">
        <p className="closing-blessing foil" data-reveal="cine">
          {wedding.copy.closing}
        </p>
        <div className="closing-ring" data-reveal="cine">
          <svg className="closing-ring-text" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="ring-path" d="M100,100 m-77,0 a77,77 0 1,1 154,0 a77,77 0 1,1 -154,0" />
            </defs>
            <circle cx="100" cy="100" r="98" className="ring-line" />
            <circle cx="100" cy="100" r="68" className="ring-line ring-line--in" />
            <text ref={textRef}>
              <textPath href="#ring-path">
                {ring}
              </textPath>
            </text>
          </svg>
          <p className="closing-mono">{wedding.couple.monogram}</p>
        </div>
        <p className="closing-family" data-reveal="cine">
          {wedding.signoff}
        </p>
      </div>
      <img className="closing-band" data-reveal="cine" src="/img/art/dhol-shehnai.webp" alt="" aria-hidden="true" width="636" height="445" loading="lazy" decoding="async" />
      <div className="closing-share" data-reveal="cine">
        <ShareBar />
      </div>
      <p className="closing-end" data-reveal="cine">
        {wedding.blessing}
      </p>
    </Reveal>
  );
}
