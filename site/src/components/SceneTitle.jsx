/** Film title card: English scene kicker (helper), the Gujarati title, a gold flourish. */
export default function SceneTitle({ n, kicker, children }) {
  return (
    <header className="scene-title">
      <p className="scene-kicker latin" data-reveal="cine">
        <span className="scene-no">{String(n).padStart(2, '0')}</span>
        <span className="scene-kicker-text">{kicker}</span>
      </p>
      <h2 className="section-title" data-reveal="title">
        {children}
      </h2>
      <span className="scene-flourish" aria-hidden="true" data-reveal="cine">
        <i />
        <b>❖</b>
        <i />
      </span>
    </header>
  );
}
