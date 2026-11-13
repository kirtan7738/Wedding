import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wedding from '../content/wedding.js';
import { googleCalendarUrl, buildIcs } from '../lib/share.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

gsap.registerPlugin(ScrollTrigger);

/** Painted medallion per event (Flow art); a missing thali falls back to the kalash. */
const ART = { 'hast-melap': '/img/art/couple-havan.webp', bhojan: '/img/art/thali.webp' };
/** "સાંજે ૬:૦૦ કલાકે" → { period: 'સાંજે', clock: '૬:૦૦' } */
const splitTime = (t) => {
  const m = t.match(/^(\S+)\s+([^\s]+)/);
  return m ? { period: m[1], clock: m[2] } : { period: '', clock: t };
};

/**
 * શુભ મુહૂર્ત as a "shubh ghadi" timeline (user, 13 Nov: unique frames): a gold thread draws itself down the page
 * with the scroll, joining a painted medallion for each moment; the gap between them is written along the thread.
 */
export default function Moments() {
  const events = wedding.events.filter((e) => e.enabled);
  const main = events.find((e) => e.highlight) || events[0];
  const [calOpen, setCalOpen] = useState(false);
  const ref = useRef(null);
  const calEvent = {
    title: `${wedding.couple.bride} ❀ ${wedding.couple.groom} — ${main.name}`,
    start: main.start,
    end: main.end,
    location: wedding.venue.address,
    details: `${wedding.heading} · ${wedding.dateShort}`,
  };
  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(calEvent))}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const thread = el.querySelector('.muhurat-thread');
      gsap.set(thread, { scaleY: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        once: true,
        onEnter: () => gsap.to(thread, { scaleY: 1, duration: 1.8, ease: 'power2.inOut', delay: 0.3 }),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const gapText = (a, b) => {
    const mins = Math.round((new Date(b.start) - new Date(a.start)) / 60000);
    const gu = String(mins).replace(/\d/g, (d) => '૦૧૨૩૪૫૬૭૮૯'[d]);
    return `${gu} મિનિટ પછી`;
  };

  return (
    <Reveal id="moments" className="moments scene">
      <SceneTitle n={4} kicker="The Auspicious Hour">
        {wedding.copy.momentsTitle}
      </SceneTitle>
      <p className="moments-date" data-reveal="cine">
        {wedding.dateShort}
      </p>
      <ol className="muhurat" ref={ref}>
        <span className="muhurat-thread" aria-hidden="true" />
        {events.map((e, i) => {
          const { period, clock } = splitTime(e.timeText);
          return (
            <li key={e.id} className="muhurat-item">
              {i > 0 && (
                <span className="muhurat-gap" aria-hidden="true" data-reveal="cine">
                  {gapText(events[i - 1], e)}
                </span>
              )}
              <article data-event={e.id} className={e.highlight ? 'muhurat-step muhurat-step--hl' : 'muhurat-step'}>
                <span className="muhurat-medal" data-reveal="tilt">
                  <img
                    src={ART[e.id] || '/img/art/kalash.webp'}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(ev) => {
                      ev.currentTarget.onerror = null;
                      ev.currentTarget.src = '/img/art/kalash.webp';
                    }}
                  />
                </span>
                <div className="muhurat-text" data-reveal="cine">
                  <p className="muhurat-time" aria-hidden="true">
                    <span className="muhurat-period">{period}</span>
                    <span className="muhurat-clock">{clock}</span>
                  </p>
                  <h3 className="moment-name">{e.name}</h3>
                  <p className="moment-time sr-only">{e.timeText}</p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
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
    </Reveal>
  );
}
