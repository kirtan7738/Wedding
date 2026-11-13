import { useRef } from 'react';
import wedding from '../content/wedding.js';
import { useArt } from '../lib/art.js';

/**
 * Shot 0 — the carved haveli doors. In cinema mode the doors are the live 3D world behind this transparent layer;
 * until it is ready (and on phones without it) the pre-rendered still shows.
 * «દ્વાર ખોલો» (user, 13 Nov): the guest knocks with the brass kadi — two knocks, then the doors swing — or swipes the
 * doors apart (opens at once). The whole screen knocks too; the button is the accessible control.
 */
export default function Cover({ refs, onOpen, onKnock = onOpen, knocked = false, opening }) {
  const swipe = useRef(null);
  const kadiArt = useArt('/img/art/door-kadi.webp'); // the painted lion knocker (round 9 #46)
  const onPointerDown = (e) => (swipe.current = { x: e.clientX, y: e.clientY, done: false });
  const onPointerMove = (e) => {
    const s = swipe.current;
    if (!s || s.done) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      s.done = true;
      onOpen(); // pushed the doors apart
    }
  };
  return (
    <div
      className={`cover ${opening ? 'is-opening' : ''} ${knocked ? 'is-knocked' : ''}`}
      ref={refs.cover}
      role="dialog"
      aria-modal="true"
      aria-label={wedding.coverTitle}
      onClick={() => (swipe.current?.done ? null : onKnock())}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => setTimeout(() => (swipe.current = null), 0)}
    >
      <div className="cover-still" ref={refs.still} aria-hidden="true" />
      <div className="cover-shade" aria-hidden="true" />
      <header className="cover-head">
        <p className="cover-invocation" data-cover-copy>
          {wedding.invocation}
        </p>
        <p className="cover-kicker latin" data-cover-copy>
          The Wedding Invitation
        </p>
        <h1 className="cover-title" data-cover-copy>
          {wedding.coverTitle}
        </h1>
        <p className="cover-names" data-cover-copy>
          {wedding.couple.bride} <span aria-hidden="true">❀</span> {wedding.couple.groom}
        </p>
        <p className="cover-date" data-cover-copy>
          {wedding.dateText}
        </p>
      </header>
      <div className="cover-foot" data-cover-copy>
        <button type="button" className="cta cta--kadi" onClick={(e) => (e.stopPropagation(), onKnock())}>
          <span className="cta-ring" aria-hidden="true" />
          <span className={`kadi ${kadiArt ? 'has-art' : ''}`} aria-hidden="true">
            {kadiArt ? (
              <img className="kadi-art" src="/img/art/door-kadi.webp" alt="" decoding="async" />
            ) : (
              <>
                <span className="kadi-plate" />
                <span className="kadi-ring" />
              </>
            )}
          </span>
          <span className="cta-gu">{wedding.copy.openCta}</span>
          <span className="cta-en latin">{wedding.copy.openHelper}</span>
        </button>
      </div>
    </div>
  );
}
