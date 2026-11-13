import { useState } from 'react';
import wedding from '../content/wedding.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

/**
 * શુભ સ્થળ as a haldi-yellow travel ticket (user, 13 Nov: unique frames): venue, date, time and town on the front with
 * a perforated stub; «નકશો જુઓ» flips the ticket over to the map on its back (the iframe loads only then);
 * «દિશા જુઓ» opens Google Maps.
 */
export default function Venue() {
  const [flipped, setFlipped] = useState(false);
  const [mapOn, setMapOn] = useState(false);
  const { venue, copy } = wedding;
  const main = wedding.events.find((e) => e.highlight) || wedding.events[0];
  const flip = (v) => {
    if (v) setMapOn(true);
    setFlipped(v);
  };

  return (
    <Reveal id="venue" className="venue scene">
      <SceneTitle n={5} kicker={wedding.copy.kickers.venue}>
        {venue.title}
      </SceneTitle>
      <div className={`ticket ${flipped ? 'is-flipped' : ''}`} data-reveal="tilt">
        <div className="ticket-face ticket-front" aria-hidden={flipped}>
          <div className="ticket-head">
            <span className="latin">Wedding Pass</span>
            <span className="ticket-mono">{wedding.couple.monogram}</span>
          </div>
          {/* the venue at dusk (painted) — its sky is cut away so the ticket's own paper shows through */}
          <img className="ticket-scene" src="/img/art/venue-illustration.webp" alt="" aria-hidden="true" width="1600" height="1089" loading="lazy" decoding="async" />
          <div className="ticket-main">
            <p className="venue-name">{venue.name}</p>
            <p className="venue-address">{venue.address}</p>
          </div>
          <dl className="ticket-facts">
            <div>
              <dt>{copy.ticketDate}</dt>
              <dd>{wedding.dateNumeric}</dd>
            </div>
            <div>
              <dt>{copy.ticketTime}</dt>
              <dd>{main.timeShort}</dd>
            </div>
            <div>
              <dt>{copy.ticketTown}</dt>
              <dd>{copy.ticketTownName}</dd>
            </div>
          </dl>
          <div className="ticket-stub">
            <button type="button" className="btn btn--ghost ticket-btn" onClick={() => flip(true)} tabIndex={flipped ? -1 : 0}>
              {copy.showMap}
            </button>
            <a className="btn btn--primary ticket-btn" data-directions href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" tabIndex={flipped ? -1 : 0}>
              <span>{copy.directions}</span>
              <span className="btn-helper latin">{copy.directionsHelper}</span>
            </a>
          </div>
        </div>
        <div className="ticket-face ticket-back" aria-hidden={!flipped}>
          <div className="venue-map">{mapOn && <iframe title={copy.mapTitle} src={venue.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</div>
          <button type="button" className="btn btn--ghost ticket-btn" onClick={() => flip(false)} tabIndex={flipped ? 0 : -1}>
            {copy.backToTicket}
          </button>
        </div>
      </div>
    </Reveal>
  );
}
