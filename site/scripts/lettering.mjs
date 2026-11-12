// Build-time Gujarati lettering: shape text with HarfBuzz (correct conjuncts/matras),
// then emit each glyph's outline as an SVG <path class="glyph"> (spec §7.2.1).
// CLI: node scripts/lettering.mjs --font <ttf> --text <gu> --out <svg> [--wght 700]
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import * as hb from 'harfbuzzjs';

const r2 = (n) => Math.round(n * 100) / 100;

export async function shapeToSvg({ fontPath, text, variations = null, fontSize = 200, padding = 0.04, slant = 0, tracking = 0 }) {
  const skew = Math.tan((slant * Math.PI) / 180); // italic: x' = x + skew * height-above-baseline
  const data = await readFile(fontPath);
  const blob = new hb.Blob(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
  const face = new hb.Face(blob);
  const font = new hb.Font(face);
  if (variations) font.setVariations([hb.Variation.fromString(variations)]);

  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.setLanguage('gu');
  buffer.guessSegmentProperties(); // Gujarati script + LTR (explicit string props silently skip shaping)
  hb.shape(font, buffer);

  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();
  const scale = fontSize / face.upem;
  if (infos.some((g) => g.codepoint === 0)) {
    throw new Error(`lettering: ${path.basename(fontPath)} has missing glyphs for "${text}" (would render as boxes)`);
  }

  // Pass 1: glyph commands in font units, placed along the pen; track ink bounds.
  let pen = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const glyphs = [];
  for (const [i, info] of infos.entries()) {
    const pos = positions[i];
    const gid = info.codepoint;
    const cmds = font.glyphToJson(gid);
    const ox = pen + pos.xOffset;
    const oy = pos.yOffset;
    const placed = cmds.map(({ type, values }) => {
      const v = values.map((n, k) =>
        k % 2 === 0 ? (n + ox + skew * (values[k + 1] + oy)) * scale : -(n + oy) * scale,
      );
      for (let k = 0; k < v.length; k += 2) {
        minX = Math.min(minX, v[k]); maxX = Math.max(maxX, v[k]);
        minY = Math.min(minY, v[k + 1]); maxY = Math.max(maxY, v[k + 1]);
      }
      return { type, v };
    });
    glyphs.push({ gid, placed });
    // tracking (font units) only between spacing glyphs; zero-advance marks stay attached to their base.
    pen += pos.xAdvance + (pos.xAdvance > 0 && i < infos.length - 1 ? tracking : 0);
  }
  if (!Number.isFinite(minX)) throw new Error(`lettering: no outlines for "${text}"`);

  // Pass 2: translate to a padded, tight viewBox.
  const w = maxX - minX;
  const h = maxY - minY;
  const pad = Math.max(w, h) * padding;
  const tx = -minX + pad;
  const ty = -minY + pad;
  const width = r2(w + pad * 2);
  const height = r2(h + pad * 2);

  const inked = glyphs.filter((g) => g.placed.length);
  const glyphBoxes = inked.map((g) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const { v } of g.placed) {
      for (let k = 0; k < v.length; k += 2) {
        x0 = Math.min(x0, v[k] + tx); x1 = Math.max(x1, v[k] + tx);
        y0 = Math.min(y0, v[k + 1] + ty); y1 = Math.max(y1, v[k + 1] + ty);
      }
    }
    return { gid: g.gid, x0: r2(x0), y0: r2(y0), x1: r2(x1), y1: r2(y1) };
  });
  const paths = inked.map((g) => {
    const d = g.placed
      .map(({ type, v }) => type + v.map((n, k) => r2(n + (k % 2 === 0 ? tx : ty))).join(' '))
      .join('');
    return `<path class="glyph" data-gid="${g.gid}" d="${d}"/>`;
  });

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${text}">` +
    paths.join('') +
    '</svg>';

  return { svg, glyphIds: glyphs.map((g) => g.gid), inkGlyphs: paths.length, glyphBoxes, width, height };
}

// ---- CLI ----
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('lettering.mjs')) {
  const args = Object.fromEntries(
    process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith('--') ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []),
  );
  if (args.font && args.text && args.out) {
    const res = await shapeToSvg({ fontPath: args.font, text: args.text, variations: args.wght ? `wght=${args.wght}` : null, slant: Number(args.slant || 0) });
    await mkdir(path.dirname(args.out), { recursive: true });
    await writeFile(args.out, res.svg);
    console.log(`lettering: ${args.out} (${res.inkGlyphs} glyphs, ${res.width}×${res.height})`);
  }
}
