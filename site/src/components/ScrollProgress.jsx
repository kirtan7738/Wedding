import { useEffect, useRef } from 'react';

/** A thin gold thread across the top that fills as the guest scrolls (visible once the invitation is open). */
export default function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current?.style.setProperty('--p', String(max > 0 ? Math.min(1, scrollY / max) : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}
