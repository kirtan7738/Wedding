import { useEffect, useRef, useState } from 'react';
import SvgDefs from './components/SvgDefs.jsx';
import Cover from './components/Cover.jsx';
import IntroEnvelope from './components/IntroEnvelope.jsx';
import OpeningLayer from './components/OpeningLayer.jsx';
import SkipButton from './components/SkipButton.jsx';
import MusicPill from './components/MusicPill.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Hero from './components/Hero.jsx';
import Invitation from './components/Invitation.jsx';
import Countdown from './components/Countdown.jsx';
import Moments from './components/Moments.jsx';
import Venue from './components/Venue.jsx';
import Interlude from './components/Interlude.jsx';
import Closing from './components/Closing.jsx';
import { initScroll } from './lib/scroll.js';
import { useOpening } from './opening/useOpening.js';
import { useCinema } from './cinema/useCinema.js';

/**
 * The page is a film (storyboard rev 4): one fixed WebGL world behind everything, the camera moving
 * between shots as the guest scrolls; each section is a title card over its shot.
 */
export default function App() {
  useEffect(() => initScroll(), []);
  const worldRef = useRef(null);
  const opening = useOpening(worldRef);
  const { refs, state, tier, player, sfx, open, skip } = opening;
  const { canvasRef } = useCinema(tier, worldRef);
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <SvgDefs />
      <canvas className="world" ref={canvasRef} aria-hidden="true" />
      <div className="film-veil" aria-hidden="true" />
      <div className="film-vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
      {state !== 'open' && <Cover refs={refs} onOpen={open} opening={state === 'opening'} />}
      {state === 'cover' && !introDone && <IntroEnvelope worldRef={worldRef} onBegin={() => {
            player?.start({ intro: true }); // the song's intro begins on the envelope tap and waits for the doors
            sfx.current?.intro();
          }} onDone={() => setIntroDone(true)} />}
      <OpeningLayer refs={refs} tier={tier} />
      <div className="letterbox letterbox--top" aria-hidden="true" />
      <div className="letterbox letterbox--bottom" aria-hidden="true" />
      {state === 'opening' && <SkipButton onSkip={skip} />}
      <main className="gu film">
        <Hero />
        <Invitation />
        <Countdown />
        <Moments />
        <Venue />
        <Interlude />
        <Closing />
      </main>
      <ScrollProgress />
      <MusicPill player={player} visible={state !== 'cover'} />
    </>
  );
}
