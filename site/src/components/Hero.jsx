import wedding from '../content/wedding.js';
import NameLettering from './NameLettering.jsx';

/**
 * Shot 1 — inside the mandap. The couple's photo hangs in the 3D world (gold arch on the stage);
 * this layer carries the words: invocation and મંગલ પરિણય above, the names and details below.
 */
export default function Hero() {
  return (
    <section id="hero" className="hero scene" tabIndex={-1}>
      <div className="hero-top">
        <p className="hero-invocation" data-hero-lead>
          {wedding.invocation}
        </p>
        <h1 className="hero-heading">
          <NameLettering name="mangal" className="hero-mangal" />
        </h1>
      </div>
      <div className="hero-bottom">
        <div className="hero-names" data-hero-names>
          <span className="hero-name hero-name--princy" data-name>
            {wedding.couple.bride}
          </span>
          <span className="hero-amp" aria-hidden="true">
            <i />
            <b>❀</b>
            <i />
          </span>
          <span className="hero-name hero-name--parth" data-name>
            {wedding.couple.groomShort}
          </span>
        </div>
        <div className="hero-card" data-hero-detail>
          <p className="hero-date">{wedding.dateText}</p>
          <p className="hero-samvat">{wedding.samvatText}</p>
          <p className="hero-venue">{wedding.venue.short}</p>
        </div>
        <p className="scroll-cue" data-hero-detail>
          <span>{wedding.copy.scrollCue}</span>
          <span aria-hidden="true" className="scroll-cue-line" />
        </p>
      </div>
    </section>
  );
}
