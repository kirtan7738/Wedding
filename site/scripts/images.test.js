import { describe, it, expect } from 'vitest';
import { mkdtemp, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { processImage } from './images.mjs';

// the source photos are private and are not in the public repo — the test runs only where they exist
const SRC = '../assets/photos/couple-facing.jpeg';

describe('processImage (photo pipeline)', () => {
  it.skipIf(!existsSync(SRC))('writes AVIF + WebP at each width, never upscaling, each under 220 KB', async () => {
    const outDir = await mkdtemp(path.join(tmpdir(), 'img-'));
    const files = await processImage({ input: SRC, outDir, name: 'couple-facing', widths: [480, 960] });
    expect(files.map((f) => path.basename(f)).sort()).toEqual(
      ['couple-facing-480.avif', 'couple-facing-480.webp', 'couple-facing-960.avif', 'couple-facing-960.webp'],
    );
    for (const f of files) {
      const meta = await sharp(f).metadata();
      expect(meta.width).toBeLessThanOrEqual(852);
      expect((await stat(f)).size).toBeLessThan(220 * 1024);
    }
    expect((await sharp(path.join(outDir, 'couple-facing-960.avif')).metadata()).width).toBe(852);
    expect((await sharp(path.join(outDir, 'couple-facing-480.webp')).metadata()).width).toBe(480);
  });
});
