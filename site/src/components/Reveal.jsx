import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { REVEAL_START, revealTween, prefersReducedMotion } from '../lib/reveal.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Section wrapper. Children marked [data-reveal] are visible in the prerendered HTML;
 * CSS hides them only under html.js, and this component reveals them once on enter.
 * `onReveal(el)` lets a section add its own choreography (Task 12).
 */
export default function Reveal({ as: Tag = 'section', id, className = '', children, onReveal, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const targets = [...el.querySelectorAll('[data-reveal]')];
      if (!targets.length) return;
      const reduced = prefersReducedMotion();
      // group targets by variant so each group staggers on its own
      const groups = new Map();
      for (const t of targets) {
        const v = t.dataset.reveal || 'rise';
        if (!groups.has(v)) groups.set(v, []);
        groups.get(v).push(t);
      }
      ScrollTrigger.create({
        trigger: el,
        start: REVEAL_START,
        once: true,
        onEnter: () => {
          let delay = 0;
          for (const [variant, els] of groups) {
            const { from, to } = revealTween(reduced, variant);
            gsap.fromTo(els, from, { ...to, delay, clearProps: 'transform,clipPath' });
            if (!reduced) delay += 0.12; // reduced motion: everything at once, no choreography
          }
          el.dataset.revealed = 'true';
          onReveal?.(el);
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} {...rest}>
      {children}
    </Tag>
  );
}
