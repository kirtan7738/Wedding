// QR code of the site URL: maroon modules on ivory (dark-on-light scans reliably), high error correction,
// framed in gold with a small monogram medallion. CLI: node scripts/qr.mjs
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = Object.fromEntries(
  readFileSync(path.join(root, '.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim())),
);
const url = `${(process.env.VITE_SITE_URL || env.VITE_SITE_URL).replace(/\/$/, '')}/`;

const svg = await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H', margin: 2, color: { dark: '#5E0B18', light: '#FFF7E8' } });
writeFileSync(path.join(root, 'public', 'qr.svg'), svg);

const qr = await QRCode.toBuffer(url, { errorCorrectionLevel: 'H', margin: 2, width: 880, color: { dark: '#5E0B18', light: '#FFF7E8' } });
const frame = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"><rect width="1000" height="1000" rx="40" fill="#5E0B18"/><rect x="24" y="24" width="952" height="952" rx="28" fill="none" stroke="#E8C36A" stroke-width="6"/><rect x="50" y="50" width="900" height="900" rx="16" fill="#FFF7E8"/></svg>`,
);
const medallion = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><defs><radialGradient id="g" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#FFF3C8"/><stop offset=".4" stop-color="#E8C36A"/><stop offset="1" stop-color="#8C6420"/></radialGradient></defs><circle cx="75" cy="75" r="72" fill="#FFF7E8"/><circle cx="75" cy="75" r="62" fill="url(#g)"/><text x="75" y="96" font-size="58" text-anchor="middle" fill="#5E0B18" font-family="serif">✤</text></svg>`,
);
await sharp(frame)
  .composite([
    { input: qr, left: 60, top: 60 },
    { input: medallion, left: 425, top: 425 },
  ])
  .png()
  .toFile(path.join(root, 'public', 'qr.png'));
console.log('qr:', url);
