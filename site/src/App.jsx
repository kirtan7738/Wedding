import { Fragment, useEffect, useRef, useState } from 'react';
import SvgDefs from './components/SvgDefs.jsx';
import Cover from './components/Cover.jsx';
import IntroEnvelope from './components/IntroEnvelope.jsx';
import LanguageGate, { LangToggle } from './components/LanguageGate.jsx';
import wedding, { setLang, saveLang } from './content/wedding.js';
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
export default function App({ initialLang = null }) {
  useEffect(() => initScroll(), []);
  // Language (user, 13 Nov): null until chosen — the server and first client render always include the gate (hidden by
  // CSS when a choice is already stored), so hydration matches; a stored choice or a same-session return skips it.
  const [lang, setLangState] = useState(null);
  const [gate, setGate] = useState(true);
  useEffect(() => {
    const l = initialLang || (document.documentElement.classList.contains('opened') ? 'gu' : null);
    if (l) {
      setLangState(l);
      setGate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const chooseLang = (l) => {
    const used = setLang(l); // refill the content before React re-renders
    saveLang(used);
    const html = document.documentElement;
    html.lang = used;
    html.classList.toggle('lang-en', used === 'en');
    document.title = wedding.og.title;
    setLangState(used);
  };
  const worldRef = useRef(null);
  const opening = useOpening(worldRef);
  const { refs, state, tier, player, sfx, open, knock, knocked, skip } = opening;
  const { canvasRef } = useCinema(tier, worldRef);
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <SvgDefs />
      <canvas className="world" ref={canvasRef} aria-hidden="true" />
      <div className="film-veil" aria-hidden="true" />
      <div className="film-vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
      {gate && (
        <LanguageGate
          onPick={(l) => {
            chooseLang(l);
            player?.start({ intro: true }); // the first tap: the song's intro begins and waits for the doors
          }}
          onDone={() => setGate(false)}
        />
      )}
      {state !== 'open' && <Cover refs={refs} onOpen={open} onKnock={knock} knocked={knocked} opening={state === 'opening'} />}
      {state === 'cover' && !introDone && <IntroEnvelope worldRef={worldRef} onBegin={() => {
            player?.start({ intro: true }); // the song's intro begins on the envelope tap and waits for the doors
            sfx.current?.intro();
          }} onDone={() => {
            setIntroDone(true);
            // the doors open on their own (user, 13 Nov): half a second on the gate, then the brass knocker knocks twice and
            // they swing. A guest who knocks sooner simply goes sooner (knock() runs once).
            setTimeout(() => knock(), 500);
          }} />}
      <OpeningLayer refs={refs} tier={tier} />
      <div className="letterbox letterbox--top" aria-hidden="true" />
      <div className="letterbox letterbox--bottom" aria-hidden="true" />
      {state === 'opening' && <SkipButton onSkip={skip} />}
      <main className={`${lang === 'en' ? 'en' : 'gu'} film`} lang={lang || 'gu'}>
        <Hero />
        {/* switching language later remounts these so their reveals re-arm (the hero keeps its opening styles) */}
        <Fragment key={lang || 'gu'}>
          <Invitation />
          <Countdown />
          <Moments />
          <Venue />
          <Interlude />
          <Closing />
        </Fragment>
      </main>
      <ScrollProgress />
      <MusicPill player={player} visible={state !== 'cover'} />
      {lang && (
        <LangToggle
          label={wedding.copy.langSwitch}
          ariaLabel={wedding.copy.langSwitchLabel}
          visible={state === 'open'}
          onToggle={() => {
            chooseLang(lang === 'en' ? 'gu' : 'en');
            requestAnimationFrame(() => window.dispatchEvent(new Event('resize'))); // ScrollTrigger re-measures
          }}
        />
      )}
    </>
  );
}
