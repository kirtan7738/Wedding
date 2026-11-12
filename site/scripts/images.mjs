// Image pipeline: grade + fine grain → AVIF + WebP at phone-friendly widths (spec §9.1).
// Also builds textures/art from the family's own card (assets/extracted, see extract-pdf.py).
// CLI: node scripts/images.mjs
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Deterministic monochrome noise tile used as a grain overlay. */
function grainTile(width, height, strength = 0.03) {
  const buf = Buffer.alloc(width * height * 4);
  let s = 12345;
  for (let i = 0; i < width * height; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const v = 128 + ((s >> 16) % 64) - 32;
    buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = Math.round(255 * strength * 4);
  }
  return sharp(buf, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/** Grade toward the site palette: slight warmth, greens nudged toward sage, natural skin. */
const GRADE = [
  [1.04, 0.0, 0.0],
  [0.03, 0.94, 0.03],
  [0.0, 0.02, 0.96],
];

export async function processImage({ input, outDir, name, widths = [480, 960], grain = 0.03 }) {
  await mkdir(outDir, { recursive: true });
  const meta = await sharp(input).metadata();
  const out = [];
  for (const requested of widths) {
    const w = Math.min(requested, meta.width);
    const base = sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).recomb(GRADE).modulate({ saturation: 0.95, brightness: 1.02 });
    const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
    const noise = await grainTile(info.width, info.height, grain);
    const graded = sharp(data, { raw: info }).composite([{ input: noise, blend: 'overlay' }]);
    const avif = path.join(outDir, `${name}-${requested}.avif`);
    const webp = path.join(outDir, `${name}-${requested}.webp`);
    await graded.clone().avif({ quality: 55, effort: 6 }).toFile(avif);
    await graded.clone().webp({ quality: 78, effort: 6 }).toFile(webp);
    out.push(avif, webp);
  }
  return out;
}

/** Seamless paper tile: mirror a clean fibre crop of the card into a 2×2 tile. */
export async function buildPaperTile({ input, outFile, crop = { left: 150, top: 500, width: 800, height: 800 }, size = 1200 }) {
  const piece = await sharp(input).extract(crop).toBuffer();
  const h = await sharp(piece).flop().toBuffer();
  const v = await sharp(piece).flip().toBuffer();
  const hv = await sharp(piece).flip().flop().toBuffer();
  const { width: w, height: hgt } = crop;
  await sharp({ create: { width: w * 2, height: hgt * 2, channels: 3, background: '#eef1e4' } })
    .composite([
      { input: piece, left: 0, top: 0 },
      { input: h, left: w, top: 0 },
      { input: v, left: 0, top: hgt },
      { input: hv, left: w, top: hgt },
    ])
    .resize(size, size)
    .webp({ quality: 72 })
    .toFile(outFile);
  return outFile;
}

/** Combine a JPEG and its separate soft mask (from the PDF) into one RGBA WebP. */
export async function withMask({ rgb, mask, out }) {
  const { data: c, info } = await sharp(rgb).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const m = await sharp(mask).resize(info.width, info.height).extractChannel(0).raw().toBuffer();
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    rgba[i * 4] = c[i * 3];
    rgba[i * 4 + 1] = c[i * 3 + 1];
    rgba[i * 4 + 2] = c[i * 3 + 2];
    rgba[i * 4 + 3] = m[i];
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 88, alphaQuality: 92 }).toFile(out);
  return out;
}

if (process.argv[1]?.endsWith('images.mjs')) {
  const pub = path.join(ROOT, 'public', 'img');
  const photos = path.join(ROOT, '..', 'assets', 'photos');
  const card = path.join(ROOT, '..', 'assets', 'extracted');
  for (const name of ['couple-facing', 'couple-walking']) {
    const files = await processImage({ input: path.join(photos, `${name}.jpeg`), outDir: pub, name });
    console.log('images:', files.map((f) => path.basename(f)).join(', '));
  }
  // The family's card: paper fibre tile, full card page (invitation background), Ganesh with alpha.
  // One large clean fibre crop (no tiling → no mirror seams); used with background-size: cover.
  await sharp(path.join(card, 'p1-x14-1200x1799.jpeg')).extract({ left: 120, top: 440, width: 960, height: 1060 }).webp({ quality: 74 }).toFile(path.join(pub, 'paper.webp'));
  // Warm ivory version of the same handmade fibres (red/gold palette).
  // Two passes: sharp applies ops in a fixed internal order, so the warm tint must be a separate pipeline.
  const greyFibres = await sharp(path.join(card, 'p1-x14-1200x1799.jpeg'))
    .extract({ left: 120, top: 440, width: 960, height: 1060 })
    .greyscale()
    .linear(1.67, -167)
    .toColourspace('srgb')
    .png()
    .toBuffer();
  await sharp(greyFibres).tint({ r: 255, g: 226, b: 178 }).webp({ quality: 74 }).toFile(path.join(pub, 'paper-warm.webp'));
  await sharp(path.join(card, 'p3-x775-1200x1799.jpeg')).resize({ width: 900 }).webp({ quality: 74 }).toFile(path.join(pub, 'card-page.webp'));
  await withMask({
    rgb: path.join(card, 'p1-x62-242x210.jpeg'),
    mask: path.join(card, 'p1-x63-242x210.png'),
    out: path.join(pub, 'ganesh.webp'),
  });
  console.log('images: paper.webp, card-page.webp, ganesh.webp');
}
