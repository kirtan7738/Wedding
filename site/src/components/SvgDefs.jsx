import defs from '../assets/ornaments/defs.svg?raw';

/** Shared gradients, symbols (marigold, leaf, bell, diya) and patterns — rendered once at the top of the page. */
export default function SvgDefs() {
  return <div className="svg-defs" aria-hidden="true" dangerouslySetInnerHTML={{ __html: defs }} />;
}
