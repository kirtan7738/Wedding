// Inject the server-rendered app into dist/index.html so every section is readable before JS runs.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'dist', 'index.html');
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

const html = await readFile(htmlPath, 'utf8');
if (!html.includes('<!--app-->')) throw new Error('prerender: <!--app--> slot missing in dist/index.html');
await writeFile(htmlPath, html.replace('<!--app-->', render()));
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('prerender: dist/index.html written');
