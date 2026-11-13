import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import wedding from '../content/wedding.js';
import { useArt } from '../lib/art.js';

export const INTRO_DONE = 'intro-done';

/**
 * First frame (user, 13 Nov: "change the envelope design entirely"): the kankotri arrives in a carved, lacquered
 * Sankheda box (the lacquered teak woodwork of Sankheda, Gujarat) resting on red bandhani silk. The guest slides the
 * brass latch (or taps), and —
 *   the latch flips up, the lid swings back on its hinge (a real CSS 3D box), light glows from the silk inside,
 *   the kankotri rises out of the box, the box sinks away, the card is presented, its left panel opens, then its
 *   right, and the camera pushes into the painting inside until it exactly covers the screen — the live gate scene
 *   underneath — and the layer dissolves.
 *
 * The box faces take painted Flow textures (round 9 #47–50) as soon as they exist; lacquer stand-ins until then.
 *
 * Precision notes (user, 13 Nov: "jerking / position issue"):
 *  - the box is one self-contained preserve-3d object; the card is a separate flat layer above it, so layering is exact;
 *  - the card rises behind a clip that stays on the box's rim, so it truly comes out of the box;
 *  - the card is presented exactly centred; all offsets are measured in px at tap time;
 *  - the painting inside the card is sized so that at the final zoom it is *exactly* the viewport;
 *  - the scene snapshot is taken ahead of time (idle), never during the animation.
 */
export default function IntroEnvelope({ worldRef, onBegin, onDone }) {
  const root = useRef(null);
  const [scene, setScene] = useState('/img/shots/cover.webp');
  const backdropArt = useArt('/img/art/pitara-backdrop.webp');
  const lidArt = useArt('/img/art/pitara-lid.webp');
  const frontArt = useArt('/img/art/pitara-front.webp');
  const swipe = useRef(null);
  const snapped = useRef(false);
  const started = useRef(false);

  // snapshot the live cover ahead of time (and freeze its slow drift so the hand-over matches)
  useEffect(() => {
    let alive = true;
    let tries = 0;
    const poll = () => {
      if (!alive) return; // keep polling even after an early tap — the snapshot can still swap in
      const w = worldRef.current;
      if (w && document.documentElement.classList.contains('cinema')) {
        w.coverDrift = false;
        // only once the painted gate and doors are in (else the card would show the code-drawn red doors)
        Promise.resolve(w.paintedReady).then(() =>
          setTimeout(() => {
            if (alive) takeSnapshot();
          }, 300),
        );
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
    if (snapped.current) return null;
    // too late to swap once the push-in has started
    if (window.__introTl && window.__introTl.time() > 4.2) return null;
    try {
      const url = worldRef.current?.snapshot?.();
      if (url) {
        snapped.current = true;
        const img = new Image();
        img.src = url;
        img.decode().then(
          () => setScene(url),
          () => setScene(url),
        );
        return url;
      }
    } catch {
      /* keep the still */
    }
    return null;
  };

  // sliding the latch (a drag in any direction) opens the box; a tap does too
  const onPointerDown = (e) => (swipe.current = { x: e.clientX, y: e.clientY });
  const onPointerMove = (e) => {
    const sw = swipe.current;
    if (!sw || started.current) return;
    if (Math.hypot(e.clientX - sw.x, e.clientY - sw.y) > 30) start();
  };

  const start = () => {
    if (started.current) return;
    started.current = true;
    onBegin?.(); // gesture-bound: unlock audio here
    navigator.vibrate?.(12);
    if (worldRef.current) worldRef.current.coverDrift = false;
    // let React paint the snapshot, then run on the next frame
    requestAnimationFrame(() => requestAnimationFrame(play));
  };

  const play = () => {
    const el = root.current;
    if (!el) return;
    const q = (s) => el.querySelector(s);
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
    const box = q('.pitara-stage');
    const rim = q('.pitara-rim').getBoundingClientRect(); // the box's opening, on screen
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    // the card while it rises: about as wide as the box's opening
    const k0 = Math.min((rim.width * 0.62) / cw, 1);
    const S = Math.max(vw / cw, vh / ch); // final zoom: the card's painting = the viewport
    gsap.set(q('.kk-pic'), { width: vw / S, height: vh / S });

    // the card's centre sits at the screen centre (CSS); place it so its top edge starts at the rim, hidden
    const rimY = rim.top + rim.height * 0.5 - vh / 2; // rim line, relative to the screen centre
    const startY = rimY + (ch * k0) / 2; // card top on the rim
    const riseY = startY - ch * k0 * 1.02; // card bottom just clears the rim

    const tl = gsap.timeline({ defaults: { force3D: true }, onComplete: finish });
    window.__introTl = tl; // for frame-accurate checks
    tl.set(card, { scale: k0, y: startY, autoAlpha: 1, clipPath: 'inset(0% 0% 100% 0%)' }, 0)
      .to(q('.kk-hint'), { autoAlpha: 0, y: 8, duration: 0.3, ease: 'power1.out' }, 0)
      .to(box, { '--sway': 0, duration: 0.3 }, 0)
      // the latch: pressed, then flipped up off its staple
      .to(q('.pitara-latch'), { scale: 0.92, duration: 0.1, ease: 'power2.out' }, 0)
      .to(q('.pitara-latch'), { rotateX: -150, y: -6, scale: 1, duration: 0.45, ease: 'power2.inOut' }, 0.1)
      // the lid swings back on its hinge; light wells up from the silk inside
      .to(q('.pitara-lid'), { rotateX: 112, duration: 1.25, ease: 'power2.inOut' }, 0.35)
      .to(q('.pitara-glow'), { opacity: 1, scale: 1.25, duration: 1.0, ease: 'power1.out' }, 0.6)
      // the kankotri rises out of the box: it climbs while its clip opens at the same pace, so the clip edge stays
      // on the rim — it comes out of the box, not through it
      .to(card, { y: riseY, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power2.inOut' }, 1.1)
      // the box sinks away; the card is presented, centred
      .to(box, { y: vh * 0.5, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, 2.15)
      .to(q('.pitara-scene'), { autoAlpha: 0.35, duration: 1.0, ease: 'power1.inOut' }, 2.3)
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
      .to([q('.kk-backdrop'), q('.pitara-scene')], { autoAlpha: 0, duration: 0.9, ease: 'power1.in' }, 5.1)
      // hand over to the live scene underneath (same picture, same place)
      .to(el, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, 6.2);
  };

  return (
    <div className="intro" ref={root} role="dialog" aria-modal="true" aria-label={wedding.coverTitle}>
      <div className="kk-backdrop" aria-hidden="true" />
      <div className={`pitara-scene ${backdropArt ? 'has-art' : ''}`} aria-hidden="true">
        {backdropArt ? (
          <img className="pitara-backdrop" src="/img/art/pitara-backdrop.webp" alt="" decoding="async" />
        ) : (
          <>
            <span className="pitara-cloth" />
            <img className="pitara-prop pitara-prop--diya" src="/img/art/gate/diya.webp" alt="" width="260" height="178" decoding="async" />
            <img className="pitara-prop pitara-prop--kalash" src="/img/art/gate/kalash.webp" alt="" width="260" height="405" decoding="async" />
            <span className="pitara-petals">
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} style={{ '--i': i }} />
              ))}
            </span>
          </>
        )}
      </div>
      <button
        type="button"
        className="intro-hit"
        onClick={start}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        aria-label={`${wedding.copy.introCta} — ${wedding.copy.introHelper}`}
      >
        {/* the box: one self-contained 3D object */}
        <span className="pitara-stage">
          <span className="pitara">
            <span className="pf pf-front">
              <span className="pitara-title">{wedding.coverTitle}</span>
              <span className={`pitara-latch ${frontArt ? 'has-art' : ''}`}>
                <i />
              </span>
            </span>
            <span className="pf pf-back" />
            <span className="pf pf-left" />
            <span className="pf pf-right" />
            <span className="pf pf-silk">
              <span className="pitara-glow" />
            </span>
            <span className="pitara-rim" />
            <span className="pitara-lid">
              <span className={`pf pl-top ${lidArt ? 'has-art' : ''}`}>
                {!lidArt && (
                  <span className="pitara-medal">
                    <img src="/img/art/gate/ganesh-art.webp" alt="" width="300" height="315" decoding="async" />
                  </span>
                )}
              </span>
              <span className="pf pl-under" />
              <span className="pf pl-front" />
              <span className="pf pl-back" />
              <span className="pf pl-left" />
              <span className="pf pl-right" />
            </span>
          </span>
          <span className="pitara-shadow" />
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
