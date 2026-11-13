import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wedding from '../content/wedding.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';

gsap.registerPlugin(ScrollTrigger);

/** "**bold**" spans in content → <strong>. */
function rich(line) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}
const isName = (line) => /^\*\*ચિ\./.test(line);

/**
 * હરખનું તેડું as a kankotri patra (user, 13 Nov: "each frame unique"): an ivory handmade-paper scroll between two
 * gold rods, the painted toran across its head. It unrolls as it comes into view — and the lower rod travels down with the edge of the paper.
 */
export default function Invitation() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const page = el.querySelector('.patrika-page');
    const rod = el.querySelector('.patrika-rod--bottom');
    const ctx = gsap.context(() => {
      // unrolls once as it comes into view (a timed unroll never hides text from a fast scroller)
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
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Reveal id="invitation" className="invitation scene">
      <SceneTitle n={2} kicker="The Invitation">
        {wedding.copy.invitationTitle}
      </SceneTitle>
      <div className="patrika silk-panel" ref={ref}>
        <span className="patrika-rod patrika-rod--top" aria-hidden="true" />
        <img className="patrika-toran" src="/img/art/toran.webp" alt="" aria-hidden="true" width="1600" height="688" loading="lazy" decoding="async" />
        <div className="patrika-page">
          <div className="patrika-ganesh" data-reveal="cine">
            <img src="/img/art/ganesh-art.webp" alt="શ્રી ગણેશ" width="882" height="927" loading="lazy" decoding="async" />
          </div>
          <p className="inv-invocation" data-reveal="cine">
            {wedding.invocation}
          </p>
          <span className="patrika-rule" aria-hidden="true" />
          <div className="inv-body">
            {wedding.invitation.lines.map((line) => (
              <p key={line} className={isName(line) ? 'inv-line inv-name' : 'inv-line'} data-reveal="cine">
                {rich(line)}
              </p>
            ))}
          </div>
          <div className="patrika-sign" data-reveal="cine">
            <img src="/img/art/kalash.webp" alt="" aria-hidden="true" width="60" height="94" loading="lazy" />
            <p className="inv-signoff">{wedding.signoff}</p>
            <img src="/img/art/kalash.webp" alt="" aria-hidden="true" width="60" height="94" loading="lazy" className="flip" />
          </div>
        </div>
        <span className="patrika-rod patrika-rod--bottom" aria-hidden="true" />
      </div>
    </Reveal>
  );
}
