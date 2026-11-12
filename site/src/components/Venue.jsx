import { useEffect, useRef, useState } from 'react';
import wedding from '../content/wedding.js';
import Reveal from './Reveal.jsx';
import SceneTitle from './SceneTitle.jsx';
import ArchPanel from './ArchPanel.jsx';

/** Shot 5 — aerial over the mandala of lights. The map iframe mounts only when near the viewport. */
export default function Venue() {
  const mapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const { venue, copy } = wedding;

  useEffect(() => {
    const el = mapRef.current;
    if (!el || !('IntersectionObserver' in window)) return setShowMap(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal id="venue" className="venue scene">
      <SceneTitle n={5} kicker="The Venue">
        {venue.title}
      </SceneTitle>
      <ArchPanel tone="mustard" className="venue-card">
        <p className="venue-name" data-reveal="cine">
          {venue.name}
        </p>
        <p className="venue-address" data-reveal="cine">
          {venue.address}
        </p>
        <div className="venue-map" ref={mapRef} data-reveal="rise-arch">
          {showMap && <iframe title={copy.mapTitle} src={venue.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
        </div>
        <a className="btn btn--primary" data-directions href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" data-reveal="cine">
          <span>{copy.directions}</span>
          <span className="btn-helper latin">{copy.directionsHelper}</span>
        </a>
      </ArchPanel>
    </Reveal>
  );
}
