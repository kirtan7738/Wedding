import { useEffect, useRef, useState } from 'react';
import wedding from '../content/wedding.js';
import { countdownParts, countdownState } from '../lib/time.js';
import { localDigits } from '../lib/gujarati.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * શુભ ઘડી (redesign, 13 Nov): three gold-foil tiles — દિવસ · માસ · વર્ષ. The guest scratches the gold away with a
 * finger to find ૧૩ · ડિસેમ્બર · ૨૦૨૬ (a tap reveals a tile too); when all three are open, petals burst over them.
 * Below, the live countdown to હસ્ત મેળાપ in IST (placeholders on the server / first paint, ticking while visible).
 * The date is always in the DOM for screen readers; the foil is decoration.
 */
export default function Countdown({ now = Date.now }) {
  const [t, setT] = useState(null);
  const [open, setOpen] = useState({});
  const grid = useRef(null);

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

  const parts = wedding.copy.dateParts;
  const allOpen = parts.every((p) => open[p.key]);
  useEffect(() => {
    if (!allOpen || !grid.current) return;
    const tiles = [...grid.current.querySelectorAll('.scratch')];
    const points = tiles.map((el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    });
    window.dispatchEvent(new CustomEvent('kk-celebrate', { detail: { points } }));
    navigator.vibrate?.([10, 60, 10]);
  }, [allOpen]);

  const target = wedding.countdownTarget;
  const state = t == null ? 'before' : countdownState(t, target);
  const p = t == null ? null : countdownParts(t, target);
  const { units } = wedding.copy;
  const cell = (key, value, label) => (
    <div className={`cd-cell cd-cell--${key}`} key={key} data-reveal="flip">
      <span className="cd-num" data-testid={`cd-${key}`} key={value ?? 'x'}>
        {value == null ? '—' : localDigits(value, wedding.lang)}
      </span>
      <span className="cd-label">{label}</span>
    </div>
  );

  return (
    <Reveal id="countdown" className="countdown scene">
      <SceneTitle n={3} kicker={wedding.copy.kickers.countdown}>
        {wedding.copy.countdownTitle}
      </SceneTitle>

      <p className="scratch-hint" data-reveal="cine">
        <span>{wedding.copy.scratchHint}</span>
        <span className="scratch-hint-en">{wedding.copy.scratchHelper}</span>
      </p>
      <div className={`scratch-row ${allOpen ? 'is-all-open' : ''}`} ref={grid} data-reveal="tilt">
        {parts.map((part) => (
          <ScratchTile key={part.key} part={part} label={wedding.copy.scratchTile} open={!!open[part.key]} onOpen={() => setOpen((o) => ({ ...o, [part.key]: true }))} />
        ))}
      </div>

      <p className="cd-sub section-sub" data-reveal="cine">
        {wedding.copy.countdownLead} · {wedding.events[0].name} · {wedding.events[0].timeShort}
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

/**
 * One gold-foil tile. The foil is a canvas over the value: dragging a finger erases it (destination-out); once
 * about half is gone the rest melts away. A plain tap (or Enter/Space) reveals it with a wipe.
 */
function ScratchTile({ part, label, open, onOpen }) {
  const canvas = useRef(null);
  const drag = useRef(null);
  const scratched = useRef(0);

  // paint the foil once the tile has its size
  useEffect(() => {
    const c = canvas.current;
    if (!c || open) return undefined;
    const paint = () => {
      const r = c.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      const g = c.getContext('2d');
      g.scale(dpr, dpr);
      const w = r.width;
      const h = r.height;
      const foil = g.createLinearGradient(0, 0, w, h);
      foil.addColorStop(0, '#a8751f');
      foil.addColorStop(0.22, '#f6dc8f');
      foil.addColorStop(0.42, '#c4912f');
      foil.addColorStop(0.52, '#fff4cf');
      foil.addColorStop(0.62, '#c4912f');
      foil.addColorStop(0.8, '#f1d37f');
      foil.addColorStop(1, '#a8751f');
      g.fillStyle = foil;
      g.fillRect(0, 0, w, h);
      // a fine embossed paisley-dot texture and sparkle
      for (let i = 0; i < 70; i++) {
        g.fillStyle = `rgba(${i % 2 ? '255,248,220' : '120,80,20'},${0.12 + (i % 5) * 0.03})`;
        g.beginPath();
        g.arc(((i * 37) % 100) / 100 * w, ((i * 61) % 100) / 100 * h, 0.8 + (i % 3) * 0.6, 0, Math.PI * 2);
        g.fill();
      }
      // a border and the word "scratch"
      g.strokeStyle = 'rgba(110,70,15,0.55)';
      g.lineWidth = 1.5;
      g.strokeRect(5, 5, w - 10, h - 10);
      g.fillStyle = 'rgba(95,55,10,0.75)';
      g.font = `600 ${Math.round(Math.min(w, h) * 0.17)}px Rasa, "Noto Serif Gujarati", "Cormorant Garamond", serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(label, w / 2, h / 2);
      g.globalCompositeOperation = 'destination-out';
    };
    paint();
    document.fonts?.ready?.then(paint);
    return undefined;
  }, [open, label]);

  const scratchAt = (e) => {
    const c = canvas.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const g = c.getContext('2d');
    const rad = Math.max(14, r.width * 0.11);
    g.beginPath();
    const last = drag.current?.last;
    if (last) {
      g.lineWidth = rad * 2;
      g.lineCap = 'round';
      g.moveTo(last[0], last[1]);
      g.lineTo(x, y);
      g.stroke();
    }
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
    drag.current.last = [x, y];
    drag.current.moved += 1;
  };

  // how much of the foil is gone (sampled)
  const cleared = () => {
    const c = canvas.current;
    if (!c || !c.width) return 0;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let clear = 0;
    let n = 0;
    for (let i = 3; i < d.length; i += 4 * 24) {
      n++;
      if (d[i] < 40) clear++;
    }
    return n ? clear / n : 0;
  };

  const onPointerDown = (e) => {
    if (open) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { last: null, moved: 0 };
    scratchAt(e);
  };
  const onPointerMove = (e) => {
    if (!drag.current || open) return;
    scratchAt(e);
    if (drag.current.moved % 6 === 0) navigator.vibrate?.(3);
  };
  const onPointerUp = () => {
    if (!drag.current || open) return;
    const { moved } = drag.current;
    drag.current = null;
    scratched.current = cleared();
    if (moved <= 2 || scratched.current > 0.45) onOpen(); // a tap, or enough gold scratched away
  };

  return (
    <div
      className={`scratch ${open ? 'is-open' : ''}`}
      role="button"
      tabIndex={open ? -1 : 0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
    >
      <span className="scratch-label">{part.label}</span>
      <span className={`scratch-value scratch-value--${part.key}`}>{part.value}</span>
      <span className="scratch-sub">{part.sub}</span>
      <canvas className="scratch-foil" ref={canvas} aria-hidden="true" />
    </div>
  );
}
