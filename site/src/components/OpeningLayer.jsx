/** Fallback opening layers (phones without the 3D world): warm glow wash + 2D petal/gold canvases. */
export default function OpeningLayer({ refs, tier }) {
  const particles = tier !== 'static';
  return (
    <>
      <div className="opening-glow" ref={refs.glow} aria-hidden="true" />
      {particles && (
        <>
          <canvas className="fx-canvas" data-fx="petals" data-scene="2d" ref={refs.petals} aria-hidden="true" />
          <canvas className="fx-canvas" data-fx="gold" ref={refs.gold} aria-hidden="true" />
        </>
      )}
    </>
  );
}
