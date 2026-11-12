// Builds the painted arch-panel pieces from the Flow arch frame (public/img/art/arch-frame.webp):
//   arch-crown-<tone>.webp  top of the arch, its cusped window filled with the panel's paper colour
//   arch-side.webp          the left column strip (vine band + pillar shaft), tiled down the panel sides
//   arch-base.webp          pillar bases + carved sill
import sharp from 'sharp';

const SRC = 'public/img/art/arch-frame.webp';
const TONES = { red: [143, 20, 36], emerald: [31, 93, 58], mustard: [168, 116, 28] };
const CROWN = 0.52; // crop line (fraction of height): just below the pillar capitals
const SIDE = [0.56, 0.8]; // a clean stretch of the pillar shafts + vine band
const BASE = 0.84;
const OPEN = 0.2079; // the window's straight sides start at 20.79 % / 79.21 % of the width

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const ch = Math.round(H * CROWN);

// crown: flood the transparent area from the top/left/right edges = outside; the rest of the transparent area = window
const outside = new Uint8Array(W * ch);
const stack = [];
const push = (x, y) => {
  const k = y * W + x;
  if (outside[k] || data[k * 4 + 3] > 40) return;
  outside[k] = 1;
  stack.push(k);
};
for (let x = 0; x < W; x++) push(x, 0);
for (let y = 0; y < ch; y++) push(0, y), push(W - 1, y);
// the window opens downwards: seed the outer margins at the bottom edge only (outside the frame)
for (let x = 0; x < Math.round(W * 0.02); x++) push(x, ch - 1), push(W - 1 - x, ch - 1);
while (stack.length) {
  const k = stack.pop();
  const x = k % W;
  const y = (k / W) | 0;
  if (x > 0) push(x - 1, y);
  if (x < W - 1) push(x + 1, y);
  if (y > 0) push(x, y - 1);
  if (y < ch - 1) push(x, y + 1);
}
for (const [tone, rgb] of Object.entries(TONES)) {
  // the window shows the painted paper (Flow) when present, else the flat tone
  let paper = null;
  try {
    paper = (await sharp(`public/img/art/paper-${tone}.webp`).resize({ width: W }).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
  } catch {
    paper = null;
  }
  const out = Buffer.alloc(W * ch * 4);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      const i = k * 4;
      const a = data[i + 3] / 255;
      const inWindow = !outside[k] && x > W * 0.15 && x < W * 0.85;
      if (inWindow) {
        // paint over the paper colour
        const py = paper ? Math.min(y, paper.info.height - 1) : 0;
        const pi = paper ? (py * paper.info.width + x) * 4 : 0;
        for (let c = 0; c < 3; c++) out[i + c] = Math.round(data[i + c] * a + (paper ? paper.data[pi + c] : rgb[c]) * (1 - a));
        out[i + 3] = 255;
      } else {
        for (let c = 0; c < 4; c++) out[i + c] = data[i + c];
      }
    }
  }
  await sharp(out, { raw: { width: W, height: ch, channels: 4 } }).webp({ quality: 86, alphaQuality: 95 }).toFile(`public/img/art/arch-crown-${tone}.webp`);
}
const sw = Math.round(W * OPEN);
await sharp(SRC).extract({ left: 0, top: Math.round(H * SIDE[0]), width: sw, height: Math.round(H * (SIDE[1] - SIDE[0])) }).webp({ quality: 86, alphaQuality: 95 }).toFile('public/img/art/arch-side.webp');
await sharp(SRC).extract({ left: 0, top: Math.round(H * BASE), width: W, height: H - Math.round(H * BASE) }).webp({ quality: 86, alphaQuality: 95 }).toFile('public/img/art/arch-base.webp');
console.log('arch panels', W, ch, 'side', sw);
