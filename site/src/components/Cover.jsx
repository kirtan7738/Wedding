import wedding from '../content/wedding.js';

/**
 * Shot 0 — the carved haveli doors at night. In cinema mode the doors are the live 3D world behind this
 * transparent layer; until it is ready (and on phones without it) the pre-rendered still shows.
 * The whole screen is tappable; the button is the accessible control.
 */
export default function Cover({ refs, onOpen, opening }) {
  return (
    <div className={`cover ${opening ? 'is-opening' : ''}`} ref={refs.cover} role="dialog" aria-modal="true" aria-label={wedding.coverTitle} onClick={onOpen}>
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
        <button type="button" className="cta" onClick={(e) => (e.stopPropagation(), onOpen())}>
          <span className="cta-ring" aria-hidden="true" />
          <span className="cta-gu">{wedding.copy.openCta}</span>
          <span className="cta-en latin">{wedding.copy.openHelper}</span>
        </button>
      </div>
    </div>
  );
}
