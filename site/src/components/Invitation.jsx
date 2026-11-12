import { Fragment } from 'react';
import wedding from '../content/wedding.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';
import ArchPanel from './ArchPanel.jsx';

/** "**bold**" spans in content → <strong>. */
function rich(line) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}
const isName = (line) => /^\*\*ચિ\./.test(line);

/** Shot 2 — the mandap from the side; the families' invitation on a silk panel. */
export default function Invitation() {
  return (
    <Reveal id="invitation" className="invitation scene">
      <SceneTitle n={2} kicker="The Invitation">
        {wedding.copy.invitationTitle}
      </SceneTitle>
      <ArchPanel tone="red" className="silk-panel">
        <div className="ganesh-medallion" data-reveal="cine">
          <img src="/img/ganesh.webp" alt="શ્રી ગણેશ" width="80" height="69" loading="lazy" decoding="async" />
        </div>
        <p className="inv-invocation" data-reveal="cine">
          {wedding.invocation}
        </p>
        <div className="inv-body">
          {wedding.invitation.lines.map((line) => (
            <p key={line} className={isName(line) ? 'inv-line inv-name' : 'inv-line'} data-reveal="cine">
              {rich(line)}
            </p>
          ))}
        </div>
        <p className="inv-signoff" data-reveal="cine">
          {wedding.signoff}
        </p>
      </ArchPanel>
    </Reveal>
  );
}
