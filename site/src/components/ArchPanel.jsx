/**
 * A painted Mughal arch window (Google Flow art, after the reference reel): the carved ivory crown with its cusped
 * window filled with the panel's paper colour, inlaid vine-and-pillar sides that run the full height of the content,
 * and the carved sill at the foot. `tone` picks the paper colour (red, emerald, mustard).
 * The pieces are built by scripts/arch-panels.mjs from public/img/art/arch-frame.webp.
 */
export default function ArchPanel({ tone = 'red', className = '', children }) {
  return (
    <div className={`arch-panel arch-panel--${tone} ${className}`}>
      <img className="arch-crown" src={`/img/art/arch-crown-${tone}.webp`} alt="" aria-hidden="true" width="1260" height="832" loading="lazy" decoding="async" />
      <div className="arch-body">{children}</div>
      <img className="arch-base" src="/img/art/arch-base.webp" alt="" aria-hidden="true" width="1260" height="256" loading="lazy" decoding="async" />
    </div>
  );
}
