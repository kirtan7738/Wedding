import { describe, it, expect } from 'vitest';
import { shapeToSvg } from './lettering.mjs';

const RASA = 'fonts-src/Rasa[wght].ttf';

describe('shapeToSvg (Gujarati lettering → SVG outlines)', () => {
  it('shapes પ્રિન્સી with every conjunct supported (no .notdef glyphs)', async () => {
    const r = await shapeToSvg({ fontPath: RASA, text: 'પ્રિન્સી', variations: 'wght=700' });
    expect(r.glyphIds.length).toBeGreaterThan(0);
    expect(r.glyphIds).not.toContain(0);
    // Real shaping merges conjuncts/matras: fewer glyphs than codepoints, and no raw codepoints left.
    expect(r.glyphIds.length).toBeLessThan([...'પ્રિન્સી'].length);
    expect(r.glyphIds.some((g) => g >= 0x0a80 && g <= 0x0aff)).toBe(false);
  });

  it('emits one <path class="glyph"> per inked glyph and a tight viewBox', async () => {
    const r = await shapeToSvg({ fontPath: RASA, text: 'પાર્થ' });
    expect(r.inkGlyphs).toBeGreaterThan(0);
    expect((r.svg.match(/<path class="glyph"/g) || []).length).toBe(r.inkGlyphs);
    expect(r.svg).toMatch(/viewBox="0 0 [\d.]+ [\d.]+"/);
    expect(r.width).toBeGreaterThan(r.height * 0.8); // a horizontal word
    expect(r.svg).not.toMatch(/fill="/); // styled via CSS only
  });

  it('rejects a font that lacks Gujarati glyphs instead of emitting tofu boxes', async () => {
    await expect(shapeToSvg({ fontPath: 'fonts-src/Rasa-Italic[wght].ttf', text: 'પ્રિન્સી' })).rejects.toThrow(/missing glyphs/);
  });

  it('slant option skews outlines into an italic (wider ink box, same glyphs)', async () => {
    const upright = await shapeToSvg({ fontPath: RASA, text: 'પાર્થ', variations: 'wght=600' });
    const slanted = await shapeToSvg({ fontPath: RASA, text: 'પાર્થ', variations: 'wght=600', slant: 12 });
    expect(slanted.glyphIds).toEqual(upright.glyphIds);
    expect(slanted.width).toBeGreaterThan(upright.width);
  });

  it('reports a box per inked glyph inside the viewBox (for attaching flourishes)', async () => {
    const r = await shapeToSvg({ fontPath: RASA, text: 'પ્રિન્સી', variations: 'wght=600' });
    expect(r.glyphBoxes.length).toBe(r.inkGlyphs);
    for (const b of r.glyphBoxes) {
      expect(b.x0).toBeGreaterThanOrEqual(0);
      expect(b.x1).toBeLessThanOrEqual(r.width);
      expect(b.y1).toBeLessThanOrEqual(r.height);
      expect(b.x1).toBeGreaterThan(b.x0);
    }
  });

  it('negative tracking pulls letters together like joined calligraphy', async () => {
    const normal = await shapeToSvg({ fontPath: RASA, text: 'પ્રિન્સી' });
    const tight = await shapeToSvg({ fontPath: RASA, text: 'પ્રિન્સી', tracking: -40 });
    expect(tight.width).toBeLessThan(normal.width);
    expect(tight.glyphIds).toEqual(normal.glyphIds);
  });

  it('a multi-word phrase keeps the space as advance only', async () => {
    const r = await shapeToSvg({ fontPath: 'fonts-src/Mogra-Regular.ttf', text: 'મંગલ પરિણય' });
    expect(r.glyphIds).not.toContain(0);
    expect(r.glyphIds.some((g) => g >= 0x0a80 && g <= 0x0aff)).toBe(false); // really shaped
    expect(r.inkGlyphs).toBeLessThan(r.glyphIds.length);
  });
});
