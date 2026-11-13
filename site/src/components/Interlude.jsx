import wedding from '../content/wedding.js';
import Reveal from './Reveal.jsx';

/** Shot 6 — doves over the palace across the lake. A quiet title card between the venue and the finale. */
export default function Interlude() {
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
    </Reveal>
  );
}
