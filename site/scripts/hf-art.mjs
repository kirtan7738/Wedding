// Generates the painted Mughal-miniature cut-outs with the Higgsfield API (user's account, billable).
// Credentials: HF_CREDENTIALS in site/.env.local (git-ignored), loaded by Node — never printed or logged.
//   node --env-file=.env.local scripts/hf-art.mjs --model <endpoint> [--only peacock,elephant] [--n 1]
// Raw results land in art-src/ (git-ignored); scripts/art-cut.mjs keys out the magenta and writes public/img/art/.
import { createHiggsfieldClient } from '@higgsfield/client/v2';
import { mkdirSync, writeFileSync, existsSync, readFileSync, appendFileSync } from 'node:fs';

const STYLE =
  'Mughal miniature painting, Rajasthani Indian wedding invitation illustration, exquisite fine detail, gouache and watercolour texture, delicate gold leaf outlines, soft warm daylight, rich jewel colours (deep green, kumkum red, ivory, gold, peacock blue)';
const CUT = 'isolated on a perfectly flat solid pure magenta (#FF00FF) background, no ground, no shadow, no frame, no border, no text, whole subject in view, centred';

export const ASSETS = {
  peacock: { ar: '3:4', prompt: `a single Indian peacock perched on a short carved ivory ledge, side view, head turned left, its long iridescent train cascading straight down below the ledge, every feather with detailed eye-spots` },
  elephant: { ar: '4:3', prompt: `a royal decorated Indian elephant walking left, side view, embroidered red and gold caparison, gold headpiece and anklets, painted trunk, a small ornate gold umbrella (chhatra) raised on its back` },
  chhatri: { ar: '3:4', prompt: `a Rajasthani chhatri pavilion of ivory sandstone, ribbed onion dome with gold kalash finial, four slender pillars with cusped arches, sloping chhajja eave, stepped plinth, delicate red and green inlay` },
  cypress: { ar: '1:3', prompt: `one tall slender cypress tree with dense layered dark green foliage, a flowering vine with small white and pink blossoms twining up it, small tuft of grass at the base` },
  plantain: { ar: '4:5', prompt: `a lush banana plantain plant clump with broad arching green leaves with fine veins, a hanging red banana flower, small grass tuft at the base` },
  bougainvillea: { ar: '16:9', prompt: `a low rounded flowering bush of crimson and magenta-red roses and bougainvillea with dark green leaves and a few small white jasmine flowers` },
  grass: { ar: '21:9', prompt: `a wide strip of lush ornamental garden foreground: tufts of grass, ferns, small white flowers, red poppies and low leafy plants, seen from the front` },
  gate: { ar: '2:3', prompt: `a grand ivory marble jharokha gateway facade seen straight on, cusped multifoil arch opening, bangaldar curved roof with ribbed vault and three gold finials, pietra dura inlay borders of red flowers and green leaves, small hanging gold bells; the arch opening itself filled with solid magenta` },
  'door-leaf': { ar: '1:3', prompt: `one ivory painted wooden door leaf seen straight on, filling the whole image edge to edge, three arched niches each painted with a symmetrical flowering tree of life with red flowers and green leaves, gold borders and small brass studs` },
  lamp: { ar: '3:4', prompt: `an ornate brass Indian hanging lamp lantern (kandil) with pierced jaali pattern and a warm glowing flame inside, hanging chain at top` },
  diya: { ar: '1:1', prompt: `a traditional clay diya oil lamp with painted red and yellow rim, a bright teardrop flame, three-quarter view` },
  boota: { ar: '3:4', prompt: `an ornamental gold tree-of-life boota emblem in a teardrop shape, symmetrical flowering branches, fine gold line art, like a wedding monogram crest` },
  birds: { ar: '16:9', prompt: `three white doves in graceful flight, wings spread, painted in miniature style` },
};

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]]] : a), []));
const model = args.model;
if (!model) throw new Error('pass --model <endpoint>');
const only = args.only ? args.only.split(',') : Object.keys(ASSETS);
if (!process.env.HF_CREDENTIALS) throw new Error('HF_CREDENTIALS is not set (put it in site/.env.local)');

// Spending guard: a hard cap on paid images across ALL runs (ledger in art-src/ledger.csv). Override with --cap.
const CAP = Number(args.cap ?? 40);
const PRICE = Number(args.price ?? 0.04); // USD per image, for the running estimate only
const client = createHiggsfieldClient({ credentials: process.env.HF_CREDENTIALS, maxPollTime: 600000, maxRetries: 0 }); // no silent paid retries
mkdirSync('art-src', { recursive: true });
const LEDGER = 'art-src/ledger.csv';
if (!existsSync(LEDGER)) writeFileSync(LEDGER, 'time,asset,model,status,file\n');
const spent = () => readFileSync(LEDGER, 'utf8').trim().split('\n').slice(1).filter((l) => l.split(',')[3] === 'completed').length;
const log = (asset, status, file = '') => appendFileSync(LEDGER, `${new Date().toISOString()},${asset},${model},${status},${file}\n`);
const version = (name) => {
  let v = 1;
  while (['png', 'jpg', 'webp'].some((e) => existsSync(`art-src/${name}-v${v}.${e}`))) v++;
  return v;
};
console.log(`ledger: ${spent()} paid image(s) so far (~$${(spent() * PRICE).toFixed(2)}), cap ${CAP}`);

for (const name of only) {
  if (spent() >= CAP) {
    console.log(`STOP: spending cap reached (${CAP} images). Nothing more will be requested.`);
    break;
  }
  const a = ASSETS[name];
  if (!a) throw new Error(`unknown asset ${name}`);
  const AR = { '1:3': '9:16', '4:5': '3:4' }; // map to the aspect ratios the model accepts
  const input = { prompt: `${STYLE}. ${a.prompt}. ${CUT}.`, aspect_ratio: AR[a.ar] || a.ar, ...(args.extra ? JSON.parse(args.extra) : {}) };
  try {
    const r = await client.subscribe(model, { input, withPolling: true });
    const status = r.status ?? (r.isCompleted ? 'completed' : r.isNsfw ? 'nsfw' : r.isFailed ? 'failed' : 'unknown');
    const urls = r.images?.map((i) => i.url) ?? r.jobs?.map((j) => j.results?.raw?.url).filter(Boolean) ?? [];
    if (status !== 'completed' || !urls.length) {
      console.log(`${name}: NOT completed — status ${status}${r.error ? ` (${r.error})` : ''}`);
      log(name, status);
      continue;
    }
    for (const [i, url] of urls.entries()) {
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = (res.headers.get('content-type') || '').includes('png') ? 'png' : (res.headers.get('content-type') || '').includes('webp') ? 'webp' : 'jpg';
      const file = `art-src/${name}-v${version(name)}.${ext}`; // never overwrite a paid image
      writeFileSync(file, buf);
      log(name, 'completed', file);
      console.log(`${name}: saved ${file}`);
    }
  } catch (e) {
    // never echo request config (it carries the auth header)
    console.log(`${name}: error ${e?.status ?? ''} ${String(e?.message ?? e).split('\n')[0].slice(0, 200)}`);
    log(name, 'error');
    if (/credit|balance|401|403/i.test(String(e?.message))) break; // account problem: stop, don't hammer
  }
}
console.log(`done: ${spent()} paid image(s) in total (~$${(spent() * PRICE).toFixed(2)})`);
