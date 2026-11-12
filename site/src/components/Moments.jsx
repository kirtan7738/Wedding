import { useState } from 'react';
import wedding from '../content/wedding.js';
import { googleCalendarUrl, buildIcs } from '../lib/share.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';
import ArchPanel from './ArchPanel.jsx';

/** Shot 4 — tracking along the lit colonnade; the two moments as chapter cards. */
export default function Moments() {
  const events = wedding.events.filter((e) => e.enabled);
  const main = events.find((e) => e.highlight) || events[0];
  const [calOpen, setCalOpen] = useState(false);
  const calEvent = {
    title: `${wedding.couple.bride} ❀ ${wedding.couple.groom} — ${main.name}`,
    start: main.start,
    end: main.end,
    location: wedding.venue.address,
    details: `${wedding.heading} · ${wedding.dateShort}`,
  };
  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(calEvent))}`;

  return (
    <Reveal id="moments" className="moments scene">
      <SceneTitle n={4} kicker="The Auspicious Hour">
        {wedding.copy.momentsTitle}
      </SceneTitle>
      <p className="moments-date" data-reveal="cine">
        {wedding.dateShort}
      </p>
      <ArchPanel tone="emerald" className="moment-panel">
        <div className="moment-list">
        {events.map((e, i) => (
          <article key={e.id} data-event={e.id} className={e.highlight ? 'moment moment--hl' : 'moment'} data-reveal="tilt">
            <span className="moment-no latin" aria-hidden="true">
              {['I', 'II', 'III'][i]}
            </span>
            <h3 className="moment-name">{e.name}</h3>
            <p className="moment-time">{e.timeText}</p>
          </article>
        ))}
      </div>
      <div className="calendar" data-reveal="cine">
        <button type="button" className="btn btn--ghost" aria-expanded={calOpen} onClick={() => setCalOpen((v) => !v)}>
          {wedding.copy.calendar}
        </button>
        {calOpen && (
          <div className="calendar-options">
            <a className="btn btn--small" href={googleCalendarUrl(calEvent)} target="_blank" rel="noopener noreferrer">
              <span className="latin">Google Calendar</span>
            </a>
            <a className="btn btn--small" href={ics} download="princy-parth.ics">
              <span className="latin">Apple / Other (.ics)</span>
            </a>
          </div>
        )}
      </div>
      </ArchPanel>
    </Reveal>
  );
}
