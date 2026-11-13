import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wedding from '../content/wedding.js';
import { useArt } from '../lib/art.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

gsap.registerPlugin(ScrollTrigger);

/** "**bold**" spans in content → <strong>. */
function rich(line) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}
const isName = (line) => /^\*\*(ચિ\.|Chi\.)[^*]*\*\*$/.test(line);

/**
 * હરખનું તેડું (redesign, 13 Nov): a carved jharokha window. As it comes into view its two painted shutters swing
 * open onto Shri Ganesh, and the couple's names are written in gold, one after the other, like a hand with a pen —
 * then the formal invitation follows below on the kankotri patra, which unrolls.
 * The painted window and shutters (round 9 #52, #53) replace the CSS ones as soon as they exist.
 */
export default function Invitation() {
  const ref = useRef(null);
  const win = useRef(null);
  const frameArt = useArt('/img/art/jharokha-frame.webp');
  const shutterArt = useArt('/img/art/jharokha-shutter.webp');

  useEffect(() => {
    const el = ref.current;
    const w = win.current;
    if (!el || !w || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      w?.classList.add('is-open', 'is-written');
      return undefined;
    }
    const page = el.querySelector('.patrika-page');
    const rod = el.querySelector('.patrika-rod--bottom');
    const ctx = gsap.context(() => {
      // the window: shutters swing in, then the names are written
      ScrollTrigger.create({
        trigger: w,
        start: 'top 62%',
        once: true,
        onEnter: () => {
          w.classList.add('is-open');
          setTimeout(() => w.classList.add('is-written'), 900);
        },
      });
      // the patra unrolls once as it comes into view (a timed unroll never hides text from a fast scroller)
      gsap.set(page, { clipPath: 'inset(0 0 88% 0)' });
      gsap.set(rod, { y: () => -page.offsetHeight * 0.88 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .to(page, { clipPath: 'inset(0 0 0% 0)', duration: 2.2, ease: 'power2.inOut' }, 0)
            .to(rod, { y: 0, duration: 2.2, ease: 'power2.inOut' }, 0);
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const { couple } = wedding;
  return (
    <Reveal id="invitation" className="invitation scene">
      <SceneTitle n={2} kicker={wedding.copy.kickers.invitation}>
        {wedding.copy.invitationTitle}
      </SceneTitle>

      <div className={`jharokha ${frameArt ? 'has-art' : ''}`} ref={win}>
        {frameArt && <img className="jh-art" src="/img/art/jharokha-frame.webp" alt="" aria-hidden="true" decoding="async" />}
        <div className="jh-opening">
          <div className="jh-inside">
            <span className="jh-rays" aria-hidden="true" />
            <img className="jh-ganesh" src="/img/art/gate/ganesh-art.webp" alt={wedding.copy.ganeshAlt} width="300" height="315" loading="lazy" decoding="async" />
            <p className="jh-invocation">{wedding.invocation}</p>
            <p className="jh-names">
              <span className="jh-name jh-name--1">
                {couple.honorific} {couple.bride}
              </span>
              <span className="jh-amp" aria-hidden="true">
                ❀
              </span>
              <span className="jh-name jh-name--2">
                {couple.honorific} {couple.groom}
              </span>
            </p>
            <p className="jh-date">{wedding.dateText}</p>
          </div>
          {['l', 'r'].map((s) => (
            <span key={s} className={`jh-shutter jh-shutter--${s} ${shutterArt ? 'has-art' : ''}`} aria-hidden="true">
              <span className="jh-jaali" />
              <span className="jh-panel" />
              <span className="jh-handle" />
            </span>
          ))}
        </div>
        <span className="jh-sill" aria-hidden="true" />
      </div>

      <div className="patrika silk-panel" ref={ref}>
        <span className="patrika-rod patrika-rod--top" aria-hidden="true" />
        <div className="patrika-page">
          <div className="inv-body">
            {wedding.invitation.lines.map((line) => (
              <p key={line} className={isName(line) ? 'inv-line inv-name' : 'inv-line'} data-reveal="cine">
                {rich(line)}
              </p>
            ))}
          </div>
          <div className="patrika-sign" data-reveal="cine">
            <img src="/img/art/gate/kalash.webp" alt="" aria-hidden="true" width="60" height="94" loading="lazy" />
            <p className="inv-signoff">{wedding.signoff}</p>
            <img src="/img/art/gate/kalash.webp" alt="" aria-hidden="true" width="60" height="94" loading="lazy" className="flip" />
          </div>
        </div>
        <span className="patrika-rod patrika-rod--bottom" aria-hidden="true" />
      </div>
    </Reveal>
  );
}
