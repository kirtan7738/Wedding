import { createWorld } from '../cinema/World.js';
const q = new URLSearchParams(location.search);
const world = await createWorld(document.getElementById('c'), { tier: q.get('tier') || 'high', ganeshUrl: '/img/ganesh.webp' });
window.world = world;
const t = parseFloat(q.get('t') || '0');
world.setOverride(t);
world.setDoor(parseFloat(q.get('door') || (t > 0.2 ? '1' : '0')));
world.setAmbient(parseFloat(q.get('amb') || '0.6'));
world.setShower(parseFloat(q.get('shower') || '0'));
if (q.has('storm')) world.storm();
await world.paintedReady; // stills must show the painted gate and doors
window.__worldReady = true;
