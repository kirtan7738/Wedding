import { useEffect, useState } from 'react';
import wedding from '../content/wedding.js';
import { countdownParts, countdownState } from '../lib/time.js';
import { toGujaratiDigits } from '../lib/gujarati.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Shot 3 — low over the water, a horizon of floating diyas and the palace across the lake. Countdown to હસ્ત મેળાપ in IST.
 * Renders placeholders on the server / first paint, then ticks every second while visible.
 */
export default function Countdown({ now = Date.now }) {
  const [t, setT] = useState(null);

  useEffect(() => {
    const tick = () => setT(now());
    tick();
    const id = setInterval(() => {
      if (!document.hidden) tick();
    }, 1000);
    const onVis = () => !document.hidden && tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [now]);

  const target = wedding.countdownTarget;
  const state = t == null ? 'before' : countdownState(t, target);
  const p = t == null ? null : countdownParts(t, target);
  const { units } = wedding.copy;
  const cell = (key, value, label) => (
    <div className={`cd-cell cd-cell--${key}`} key={key} data-reveal="flip">
      <span className="cd-num" data-testid={`cd-${key}`} key={value ?? 'x'}>
        {value == null ? '—' : toGujaratiDigits(value)}
      </span>
      <span className="cd-label">{label}</span>
    </div>
  );

  return (
    <Reveal id="countdown" className="countdown scene">
      <SceneTitle n={3} kicker="Counting the moments">
        {wedding.copy.countdownTitle}
      </SceneTitle>
      <p className="cd-sub section-sub" data-reveal="cine">
        {wedding.events[0].name} · {wedding.events[0].timeText}
      </p>
      {state === 'after' ? (
        <p className="cd-message" data-reveal="cine">
          {wedding.copy.afterText}
        </p>
      ) : (
        <>
          {state === 'today' && (
            <p className="cd-message cd-message--today" data-reveal="cine">
              {wedding.copy.todayText}
            </p>
          )}
          <div className="cd-grid" role="timer" aria-live="off">
            {cell('days', p ? p.days : null, units.days)}
            {cell('hours', p ? pad2(p.hours) : null, units.hours)}
            {cell('minutes', p ? pad2(p.minutes) : null, units.minutes)}
            {cell('seconds', p ? pad2(p.seconds) : null, units.seconds)}
          </div>
        </>
      )}
    </Reveal>
  );
}
