import { forwardRef } from 'react';
import princy from '../assets/lettering/princy.svg?raw';
import parth from '../assets/lettering/parth.svg?raw';
import mangal from '../assets/lettering/mangal.svg?raw';

const LETTERING = { princy, parth, mangal };

/**
 * Hand-lettered Gujarati word as SVG outlines (scripts/lettering.mjs). Never split into characters —
 * Task 11 animates the glyph paths as a pen stroke. The SVG carries role="img" + aria-label.
 */
const NameLettering = forwardRef(function NameLettering({ name, className = '' }, ref) {
  const markup = LETTERING[name];
  if (!markup) throw new Error(`Unknown lettering "${name}"`);
  return <span ref={ref} className={`lettering lettering--${name} ${className}`} dangerouslySetInnerHTML={{ __html: markup }} />;
});

export default NameLettering;
