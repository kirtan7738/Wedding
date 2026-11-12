// Serve detect-gpu's benchmark data from our own origin (no third-party CDN request from guests' phones).
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const from = path.join(root, 'node_modules', 'detect-gpu', 'dist', 'benchmarks');
const to = path.join(root, 'public', 'benchmarks');
await mkdir(to, { recursive: true });
await cp(from, to, { recursive: true });
console.log('benchmarks → public/benchmarks');
