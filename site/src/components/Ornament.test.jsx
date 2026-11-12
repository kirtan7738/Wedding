import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Ornament, { ORNAMENT_NAMES } from './Ornament.jsx';
import SvgDefs from './SvgDefs.jsx';

describe('Ornament', () => {
  it('exposes the planned ornament set', () => {
    expect(ORNAMENT_NAMES).toEqual(
      expect.arrayContaining(['seal', 'toran', 'toran-bottom', 'garland-side', 'arch', 'divider', 'union', 'thali', 'diyas']),
    );
  });

  it.each(['seal', 'toran', 'toran-bottom', 'garland-side', 'arch', 'divider', 'union', 'thali', 'diyas'])(
    '%s renders a decorative inline SVG with a viewBox, content and no hard-coded hex fills',
    (name) => {
      const { container } = render(<Ornament name={name} className="x" />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg.getAttribute('viewBox')).toMatch(/^[\d.\- ]+$/);
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.children.length).toBeGreaterThan(0);
      expect(svg.outerHTML).not.toMatch(/fill="#/);
      expect(svg.outerHTML).not.toMatch(/stroke="#/);
    },
  );

  it('seal exposes body, crack (hidden) and monogram groups for the opening timeline', () => {
    const { container } = render(<Ornament name="seal" />);
    expect(container.querySelector('#seal-body')).not.toBeNull();
    expect(container.querySelector('#seal-crack')).not.toBeNull();
    expect(container.querySelector('#seal-monogram')).not.toBeNull();
  });

  it('toran exposes swingable bells', () => {
    const { container } = render(<Ornament name="toran" />);
    expect(container.querySelectorAll('.bell').length).toBeGreaterThanOrEqual(8);
  });

  it('shared defs provide the symbols ornaments reference', () => {
    const { container } = render(<SvgDefs />);
    for (const id of ['genda', 'leaf', 'bell', 'diya', 'g-orange', 'g-yellow', 'g-red', 'damask-gold']) {
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
    }
  });
});
