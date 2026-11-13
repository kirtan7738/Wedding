import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wedding from '../content/wedding.js';
import { googleCalendarUrl, buildIcs } from '../lib/share.js';
import { localDigits } from '../lib/gujarati.js';
import { useArt } from '../lib/art.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

gsap.registerPlugin(ScrollTrigger);

/** Painted medallion per event (Flow art); a missing thali falls back to the kalash. */
const ART = { 'hast-melap': '/img/art/couple-havan.webp', bhojan: '/img/art/thali.webp' };

/**
 * શુભ મુહૂર્ત (redesign, 13 Nov): a gold thread runs down the page and each moment hangs from it as a kumkum-red silk
 * scroll with gold rods and tassels. Each scroll swings in on its cord and unfurls as it arrives; a marigold bead
 * with a little brass bell slides down the thread as the guest scrolls. The gap between the moments is written on
 * the thread. The painted silk (round 9 #57) replaces the CSS one as soon as it exists.
 */
export default function Moments() {
  const events = wedding.events.filter((e) => e.enabled);
  const main = events.find((e) => e.highlight) || events[0];
  const [calOpen, setCalOpen] = useState(false);
  const ref = useRef(null);
  const silkArt = useArt('/img/art/silk-scroll.webp');
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
      const thread = el.querySelector('.silk-thread');
      const bead = el.querySelector('.silk-bead');
      gsap.set(thread, { scaleY: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        once: true,
        onEnter: () => gsap.to(thread, { scaleY: 1, duration: 1.6, ease: 'power2.inOut' }),
      });
      // the bead rides down the thread with the scroll
      gsap.fromTo(
        bead,
        { top: '0%' },
        { top: '100%', ease: 'none', scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 55%', scrub: 0.6 } },
      );
      // each scroll: swings in on its cord and unfurls
      el.querySelectorAll('.silk-scroll').forEach((s) => {
        const cloth = s.querySelector('.silk-cloth');
        const rod = s.querySelector('.silk-rod--bottom');
        const tassels = s.querySelectorAll('.silk-tassel');
        gsap.set(s, { autoAlpha: 0 });
        gsap.set(cloth, { scaleY: 0.06 });
        gsap.set([rod, ...tassels], { y: () => -cloth.offsetHeight * 0.94 });
        ScrollTrigger.create({
          trigger: s,
          start: 'top 78%',
          once: true,
          onEnter: () =>
            gsap
              .timeline()
              .to(s, { autoAlpha: 1, duration: 0.3 }, 0)
              .fromTo(s, { rotate: -9 }, { rotate: 0, duration: 1.6, ease: 'elastic.out(1, 0.45)', clearProps: 'rotate' }, 0)
              .to(cloth, { scaleY: 1, duration: 1.1, ease: 'power3.inOut' }, 0.25)
              .to([rod, ...tassels], { y: 0, duration: 1.1, ease: 'power3.inOut' }, 0.25),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const gapText = (a, b) => {
    const mins = Math.round((new Date(b.start) - new Date(a.start)) / 60000);
    return wedding.copy.minutesLater(localDigits(mins, wedding.lang));
  };

  return (
    <Reveal id="moments" className="moments scene">
      <SceneTitle n={4} kicker={wedding.copy.kickers.moments}>
        {wedding.copy.momentsTitle}
      </SceneTitle>
      <p className="moments-date" data-reveal="cine">
        {wedding.dateShort}
      </p>
      <ol className="silk-line" ref={ref}>
        <span className="silk-thread" aria-hidden="true" />
        <span className="silk-bead" aria-hidden="true">
          <i className="silk-bead-flower" />
          <i className="silk-bead-bell" />
        </span>
        {events.map((e, i) => (
          <li key={e.id} className="silk-item">
            {i > 0 && (
              <span className="silk-gap" aria-hidden="true">
                {gapText(events[i - 1], e)}
              </span>
            )}
            <article data-event={e.id} className={`silk-scroll ${e.highlight ? 'silk-scroll--hl' : ''} ${silkArt ? 'has-art' : ''}`}>
              <span className="silk-cord" aria-hidden="true" />
              <span className="silk-rod silk-rod--top" aria-hidden="true" />
              <div className="silk-cloth">
                <span className="silk-medal">
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
                <h3 className="moment-name silk-name">{e.name}</h3>
                <p className="silk-time" aria-hidden="true">
                  <span className="silk-period">{e.period}</span>
                  <span className="silk-clock">{e.clock}</span>
                </p>
                <p className="moment-time sr-only">{e.timeText}</p>
              </div>
              <span className="silk-rod silk-rod--bottom" aria-hidden="true" />
              <span className="silk-tassel silk-tassel--l" aria-hidden="true" />
              <span className="silk-tassel silk-tassel--r" aria-hidden="true" />
            </article>
          </li>
        ))}
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
