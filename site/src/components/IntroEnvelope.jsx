import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import wedding from '../content/wedding.js';

export const INTRO_DONE = 'intro-done';

/**
 * First frame (user, 13 Nov): a traditional Gujarati kankotri envelope. One tap and —
 *   the Ganesh seal lifts off, the toran is taken down, the flap folds open,
 *   the kankotri is drawn up out of the envelope, the envelope falls away, the card is presented,
 *   its left panel opens, then its right, and the camera pushes into the painting inside until it
 *   exactly covers the screen — the live gate scene underneath — and the layer dissolves.
 *
 * Precision notes (user, 13 Nov: "jerking / position issue"):
 *  - no preserve-3d on shared parents: every rotating piece carries its own perspective, so z-index layering
 *    (back → open flap → card → pocket → closed flap → seal → toran) is exact, with the flap swapped edge-on;
 *  - the card is centred on the viewport the whole time; all offsets are measured in px at tap time;
 *  - the painting inside the card is sized so that at the final zoom it is *exactly* the viewport;
 *  - the scene snapshot is taken ahead of time (idle), never during the animation.
 */
export default function IntroEnvelope({ worldRef, onBegin, onDone }) {
  const root = useRef(null);
  const [scene, setScene] = useState('/img/shots/cover.webp');
  const snapped = useRef(false);
  const started = useRef(false);

  // snapshot the live cover ahead of time (and freeze its slow drift so the hand-over matches)
  useEffect(() => {
    let alive = true;
    let tries = 0;
    const poll = () => {
      if (!alive || started.current) return;
      const w = worldRef.current;
      if (w && document.documentElement.classList.contains('cinema')) {
        w.coverDrift = false;
        setTimeout(() => {
          if (!alive || started.current) return;
          takeSnapshot();
        }, 700);
        return;
      }
      if (++tries < 80) setTimeout(poll, 250);
    };
    poll();
    if (window.__pendingIntro) start();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeSnapshot = () => {
    try {
      const url = worldRef.current?.snapshot?.();
      if (url) {
        snapped.current = true;
        setScene(url);
        return url;
      }
    } catch {
      /* keep the still */
    }
    return null;
  };

  const start = () => {
    if (started.current) return;
    started.current = true;
    onBegin?.(); // gesture-bound: unlock audio here
    navigator.vibrate?.(12);
    if (!snapped.current && worldRef.current) {
      worldRef.current.coverDrift = false;
      takeSnapshot();
    }
    // let React paint the snapshot, then run on the next frame
    requestAnimationFrame(() => requestAnimationFrame(play));
  };

  const play = () => {
    const el = root.current;
    if (!el) return;
    const q = (s) => el.querySelector(s);
    const qa = (s) => [...el.querySelectorAll(s)];
    const finish = () => {
      document.documentElement.classList.add(INTRO_DONE);
      if (worldRef.current) worldRef.current.coverDrift = true;
      onDone?.();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(el, { autoAlpha: 0, duration: 0.5, onComplete: finish });
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const card = q('.kk-card');
    const env = q('.env-back');
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const ew = env.offsetWidth;
    const eh = env.offsetHeight;
    const k0 = Math.min((ew * 0.88) / cw, (eh * 0.9) / ch); // card scale while inside the envelope
    const S = Math.max(vw / cw, vh / ch); // final zoom: the card's painting = the viewport
    // the painting inside the card: exactly vw×vh at scale S
    const pic = q('.kk-pic');
    gsap.set(pic, { width: vw / S, height: vh / S });

    const envParts = qa('.env-part');
    const sink = vh * 0.2; // the envelope is lowered while the card is drawn up, so the card stays on screen
    const cardUp = sink - eh * 0.6;

    // keep GSAP's lag smoothing on: after a long pause (tab wake, screenshot, slow first frame) the film must
    // resume where it was — never jump to the end
    const tl = gsap.timeline({ defaults: { force3D: true }, onComplete: finish });
    window.__introTl = tl; // for frame-accurate checks
    tl.set(card, { scale: k0, y: eh * 0.03 }, 0)
      .to(q('.kk-hint'), { autoAlpha: 0, y: 8, duration: 0.3, ease: 'power1.out' }, 0)
      // the seal: pressed, then lifted away
      .to(q('.env-seal'), { scale: 0.92, duration: 0.12, ease: 'power2.out' }, 0)
      .to(q('.env-seal'), { scale: 0.55, y: -eh * 0.18, rotate: -18, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0.12)
      // the toran is taken down
      .to(q('.env-toran'), { y: -eh * 0.08, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0.15)
      // the flap folds open toward the viewer; it passes edge-on at the half-way point, where it drops behind the card
      .fromTo(q('.env-flap'), { rotateX: 0, transformPerspective: 900 }, { rotateX: 180, duration: 0.8, ease: 'power2.inOut' }, 0.4)
      .set(q('.env-flap'), { zIndex: 2 }, 0.8)
      // the kankotri is drawn up while the envelope is lowered a little
      .to(envParts, { y: sink, duration: 1.15, ease: 'power2.inOut' }, 1.05)
      .to(card, { y: cardUp, duration: 1.15, ease: 'power2.inOut' }, 1.05)
      // the envelope falls away; the card is presented, centred
      .to(envParts, { y: vh * 1.15, duration: 0.9, ease: 'power2.in' }, 2.2)
      .to(envParts, { autoAlpha: 0, duration: 0.25, ease: 'none' }, 2.85)
      .to(card, { y: 0, scale: 1, duration: 1.0, ease: 'power3.inOut' }, 2.3)
      // gatefold: left panel, then right panel (overlapping, like a hand opening it)
      .fromTo(q('.kk-flap--l'), { rotateY: 0, transformPerspective: 1500 }, { rotateY: -180, duration: 1.15, ease: 'power2.inOut' }, 3.3)
      .fromTo(q('.kk-flap--r'), { rotateY: 0, transformPerspective: 1500 }, { rotateY: 180, duration: 1.15, ease: 'power2.inOut' }, 3.65)
      // light: each panel darkens as it turns edge-on, then brightens as it lies open
      .to(q('.kk-flap--l .kk-shade--front'), { opacity: 0.35, duration: 0.55, ease: 'power1.in' }, 3.3)
      .to(q('.kk-flap--l .kk-shade--back'), { opacity: 0, duration: 0.6, ease: 'power1.out' }, 3.85)
      .to(q('.kk-flap--r .kk-shade--front'), { opacity: 0.35, duration: 0.55, ease: 'power1.in' }, 3.65)
      .to(q('.kk-flap--r .kk-shade--back'), { opacity: 0, duration: 0.6, ease: 'power1.out' }, 4.2)
      // the push-in: the painting grows until it is exactly the screen
      .to(card, { scale: S, duration: 1.75, ease: 'power2.inOut' }, 4.45)
      .to(q('.kk-backdrop'), { autoAlpha: 0, duration: 0.9, ease: 'power1.in' }, 5.1)
      // hand over to the live scene underneath (same picture, same place)
      .to(el, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, 6.2);
  };

  return (
    <div className="intro" ref={root} role="dialog" aria-modal="true" aria-label={wedding.coverTitle}>
      <div className="kk-backdrop" aria-hidden="true" />
      <button type="button" className="intro-hit" onClick={start} aria-label={`${wedding.copy.introCta} — ${wedding.copy.introHelper}`}>
        {/* one flat stacking context: every piece is centred on the viewport and layered by z-index */}
        <span className="env-part env-back" />
        <span className="env-part env-flap">
          <span className="env-flap-face env-flap-face--out" />
          <span className="env-flap-face env-flap-face--in" />
        </span>
        <span className="kk-card">
          <span className="kk-inside">
            <img className="kk-pic" src={scene} alt="" decoding="async" />
          </span>
          {['l', 'r'].map((s) => (
            <span key={s} className={`kk-flap kk-flap--${s}`}>
              <span className="kk-face kk-face--front">
                <CardCover half={s} />
                <span className="kk-shade kk-shade--front" />
              </span>
              <span className="kk-face kk-face--back">
                <span className="kk-shade kk-shade--back" />
              </span>
            </span>
          ))}
        </span>
        <span className="env-part env-pocket">
          <span className="env-title">
            <span className="env-kalash" aria-hidden="true" />
            <span>{wedding.coverTitle}</span>
            <span className="env-kalash" aria-hidden="true" />
          </span>
          <span className="env-invocation">{wedding.invocation}</span>
        </span>
        <span className="env-part env-seal" />
        <span className="env-part env-toran">
          <img src="/img/art/toran.webp" alt="" width="1600" height="688" />
          <span className="env-hook env-hook--l" />
          <span className="env-hook env-hook--r" />
        </span>
        <span className="kk-hint">
          <span className="kk-hint-gu">{wedding.copy.introCta}</span>
          <span className="kk-hint-en latin">{wedding.copy.introHelper}</span>
        </span>
      </button>
    </div>
  );
}

/** The kankotri's front, drawn once at full width; each panel shows its half. */
function CardCover({ half }) {
  return (
    <span className={`kk-cover kk-cover--${half}`}>
      <span className="kk-cover-inner">
        <span className="kk-cover-title">{wedding.coverTitle}</span>
        <span className="kk-cover-sub">{wedding.heading}</span>
        <span className="kk-cover-date">{wedding.dateText}</span>
      </span>
    </span>
  );
}
