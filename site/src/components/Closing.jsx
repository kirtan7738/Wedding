import wedding from '../content/wedding.js';
import Reveal from './Reveal.jsx';
import ShareBar from './ShareBar.jsx';

/** Shot 7 — the sky fills with fireworks; the blessing, the families, sharing. */
export default function Closing() {
  return (
    <Reveal id="closing" className="closing scene">
      <img className="closing-couple" data-reveal="title" src="/img/art/couple.webp" alt="" aria-hidden="true" width="1037" height="1600" loading="lazy" decoding="async" />
      <div className="closing-text">
        <p className="closing-blessing foil" data-reveal="cine">
          {wedding.copy.closing}
        </p>
        <p className="closing-mono" data-reveal="cine">
          {wedding.couple.monogram}
        </p>
        <p className="closing-family" data-reveal="cine">
          {wedding.signoff}
        </p>
      </div>
      <div className="closing-share" data-reveal="cine">
        <ShareBar />
      </div>
      <p className="closing-end" data-reveal="cine">
        ॥ શુભમ્ ભવતુ ॥
      </p>
    </Reveal>
  );
}
