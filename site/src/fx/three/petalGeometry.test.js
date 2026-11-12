import { describe, it, expect } from 'vitest';
import { petalGeometry } from './petalGeometry.js';

describe('petalGeometry', () => {
  const g = petalGeometry({ across: 6, along: 10 });

  it('is a grid mesh with uvs, normals and indices', () => {
    expect(g.attributes.position.count).toBe(7 * 11);
    expect(g.attributes.uv.count).toBe(7 * 11);
    expect(g.attributes.normal.count).toBe(7 * 11);
    expect(g.index.count).toBe(6 * 10 * 6);
  });

  it('is about one unit long, narrower than long, and cupped (not flat)', () => {
    g.computeBoundingBox();
    const b = g.boundingBox;
    expect(b.max.y - b.min.y).toBeCloseTo(1, 1);
    expect(b.max.x - b.min.x).toBeLessThan(0.8);
    expect(b.max.z - b.min.z).toBeGreaterThan(0.03);
  });

  it('is centred so it rotates around its middle', () => {
    g.computeBoundingBox();
    const c = g.boundingBox.getCenter(new (g.boundingBox.min.constructor)());
    expect(Math.abs(c.x)).toBeLessThan(0.02);
    expect(Math.abs(c.y)).toBeLessThan(0.1);
  });
});
