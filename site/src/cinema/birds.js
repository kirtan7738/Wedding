import * as THREE from 'three';
import { makeCanvas } from './paint.js';

/**
 * White doves that really fly (user, 13 Nov: the swapped painted poses "look very very poor").
 * Each dove is a small 3D bird — body, head, beak, fanned tail and two-jointed wings with a painted feather
 * texture. Wings beat with a proper down/up stroke (the outer wing trails the inner), birds alternate
 * flapping and gliding, bank into their turns, and rise a little on each downstroke.
 * API: paintedDoves(scene) → { update(time, camera) } (name kept for World.js).
 */

const FLOCKS = [
  // far away and high up (user, 13 Nov: close doves feel artificial) — small distant flocks drifting across the sky
  { c: [-14, 24, -70], r: 18, n: 5, speed: 0.05, y: 2 },
  { c: [16, 29, -95], r: 22, n: 5, speed: 0.04, y: 2.5 },
  { c: [2, 34, -130], r: 26, n: 4, speed: 0.035, y: 3 },
];

/** Gouache-style feather texture: rows of scalloped coverts over long primaries, soft grey shading, fine gold edge. */
function featherTexture() {
  const W = 512;
  const H = 256;
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fbf8f2';
  ctx.fillRect(0, 0, W, H);
  // long primaries along the trailing edge (bottom of the texture), longest towards the tip (right)
  for (let i = 0; i < 14; i++) {
    const x = 20 + i * 34;
    const len = 70 + i * 6;
    const g = ctx.createLinearGradient(x, H - len, x, H);
    g.addColorStop(0, '#ebe6de');
    g.addColorStop(0.6, '#c9c3bb');
    g.addColorStop(1, '#8d8780'); // darker wing tips so the bird reads on a white sky
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - 16, H - len);
    ctx.quadraticCurveTo(x - 18, H - 10, x + 2, H);
    ctx.quadraticCurveTo(x + 20, H - 10, x + 16, H - len);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(70,62,56,0.75)';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(150,145,140,0.35)';
    ctx.beginPath();
    ctx.moveTo(x, H - len + 4);
    ctx.lineTo(x + 1, H - 6);
    ctx.stroke();
  }
  // scalloped coverts, three rows, smaller towards the leading edge (top)
  for (let row = 0; row < 3; row++) {
    const y = 40 + row * 38;
    const r = 18 - row * 3;
    for (let x = r; x < W; x += r * 1.7) {
      ctx.fillStyle = row === 0 ? '#ffffff' : '#f7f4ee';
      ctx.beginPath();
      ctx.arc(x + (row % 2) * r * 0.8, y, r, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'rgba(95,88,80,0.6)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }
  // fine gold leading-edge line (miniature-painting touch)
  ctx.strokeStyle = 'rgba(190,150,70,0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(W, 4);
  ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Wing panel in the XZ plane, hinge on x = 0, forward = +z. u runs out along the span, v from leading edge back. */
function wingPanel(span, chordIn, chordOut, u0, u1, scallop) {
  const shape = new THREE.Shape();
  shape.moveTo(0, chordIn * 0.35);
  shape.quadraticCurveTo(span * 0.55, chordIn * 0.45, span, chordOut * 0.25);
  // trailing edge: feather tips
  const n = scallop;
  for (let i = 0; i <= n; i++) {
    const t = 1 - i / n;
    const x = span * t;
    const back = -(chordOut + (chordIn - chordOut) * (1 - t)) * 0.75;
    shape.lineTo(x + span * 0.02, back - 0.012);
    shape.lineTo(x, back);
  }
  shape.lineTo(0, -chordIn * 0.4);
  shape.closePath();
  const g = new THREE.ShapeGeometry(shape, 6);
  g.rotateX(Math.PI / 2); // (x, y) → (x, 0, y): forward along +z
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const pos = g.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    uv[i * 2] = u0 + ((x - bb.min.x) / (bb.max.x - bb.min.x)) * (u1 - u0);
    uv[i * 2 + 1] = (z - bb.min.z) / (bb.max.z - bb.min.z);
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

function buildDove(mats, geo) {
  const bird = new THREE.Group();
  const body = new THREE.Mesh(geo.body, mats.body);
  body.scale.set(0.085, 0.075, 0.2);
  bird.add(body);
  const head = new THREE.Mesh(geo.body, mats.body);
  head.scale.set(0.052, 0.05, 0.056);
  head.position.set(0, 0.055, 0.19);
  bird.add(head);
  const beak = new THREE.Mesh(geo.beak, mats.beak);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.048, 0.25);
  bird.add(beak);
  const tail = new THREE.Mesh(geo.tail, mats.wing);
  tail.position.set(0, 0.0, -0.17);
  bird.add(tail);
  const wings = [];
  for (const s of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.05, 0.03, 0.04);
    shoulder.scale.x = s; // mirror the left wing
    const inner = new THREE.Mesh(geo.inner, mats.wing);
    shoulder.add(inner);
    const elbow = new THREE.Group();
    elbow.position.set(0.2, 0, 0);
    const outer = new THREE.Mesh(geo.outer, mats.wing);
    elbow.add(outer);
    shoulder.add(elbow);
    bird.add(shoulder);
    wings.push({ shoulder, elbow, side: s });
  }
  bird.userData.wings = wings;
  return bird;
}

export function paintedDoves(scene) {
  const feather = featherTexture();
  const mats = {
    wing: new THREE.MeshStandardMaterial({ map: feather, side: THREE.DoubleSide, roughness: 0.85, color: '#e9e4dc' }),
    body: new THREE.MeshStandardMaterial({ color: '#dcd6ce', roughness: 0.75 }),
    beak: new THREE.MeshStandardMaterial({ color: '#e8a39a', roughness: 0.6 }),
    eye: new THREE.MeshBasicMaterial({ color: '#2a1a14' }),
  };
  const tailShape = new THREE.Shape();
  tailShape.moveTo(-0.03, 0.02);
  tailShape.lineTo(-0.09, -0.16);
  tailShape.quadraticCurveTo(0, -0.2, 0.09, -0.16);
  tailShape.lineTo(0.03, 0.02);
  tailShape.closePath();
  const tailGeo = new THREE.ShapeGeometry(tailShape);
  tailGeo.rotateX(Math.PI / 2);
  const geo = {
    body: new THREE.SphereGeometry(1, 16, 12),
    beak: new THREE.ConeGeometry(0.014, 0.05, 8),
    eye: new THREE.SphereGeometry(0.009, 6, 6),
    tail: tailGeo,
    inner: wingPanel(0.2, 0.2, 0.17, 0, 0.45, 4),
    outer: wingPanel(0.27, 0.17, 0.07, 0.45, 1, 7),
  };
  const birds = [];
  let k = 0;
  for (const f of FLOCKS) {
    for (let i = 0; i < f.n; i++, k++) {
      const b = buildDove(mats, geo);
      const size = 1.7 + ((k * 37) % 10) / 14;
      b.scale.setScalar(size);
      b.userData.f = f;
      b.userData.phase = i / f.n + ((k * 0.13) % 0.2);
      b.userData.beatOff = (k * 0.37) % 1;
      b.userData.dir = k % 3 === 0 ? -1 : 1; // a few fly the other way round
      b.userData.alt = ((k * 53) % 10) / 10 - 0.5;
      scene.add(b);
      birds.push(b);
    }
  }
  const target = new THREE.Vector3();
  const smooth = (a, b, x) => {
    const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return u * u * (3 - 2 * u);
  };
  return {
    update(time) {
      for (const b of birds) {
        const { f, phase, beatOff, dir, alt } = b.userData;
        const w = f.speed * dir;
        const a = time * w + phase * Math.PI * 2;
        // flight path: an ellipse with a gentle rise and fall
        const px = f.c[0] + Math.cos(a) * f.r;
        const pz = f.c[2] + Math.sin(a) * f.r * 0.5;
        // flap for ~1.6 s, glide for ~1.4 s
        const cyc = (time / 3 + beatOff) % 1;
        const flapping = smooth(0.0, 0.08, cyc) * (1 - smooth(0.5, 0.6, cyc));
        const beat = (time * 4.2 + beatOff * 10) * Math.PI * 2;
        const stroke = Math.sin(beat);
        const py = f.c[1] + alt * f.y + Math.sin(a * 2) * 0.35 + flapping * Math.sin(beat - 1.2) * 0.04 - (1 - flapping) * 0.05 * cyc;
        b.position.set(px, py, pz);
        // face along the path
        const ah = a + 0.05 * Math.sign(w);
        target.set(f.c[0] + Math.cos(ah) * f.r, py, f.c[2] + Math.sin(ah) * f.r * 0.5);
        b.lookAt(target);
        // bank into the turn
        b.rotateZ(-0.38 * Math.sign(w));
        // wings: downstroke/upstroke while flapping, held in a shallow dihedral while gliding
        const shoulderAng = flapping * (0.15 + 0.75 * stroke) + (1 - flapping) * 0.12;
        const elbowAng = flapping * (0.35 * Math.sin(beat - 0.9)) + (1 - flapping) * -0.06;
        for (const wg of b.userData.wings) {
          wg.shoulder.rotation.z = shoulderAng;
          wg.elbow.rotation.z = elbowAng;
        }
      }
    },
  };
}
