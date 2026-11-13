import * as THREE from 'three';
import * as S from './shaders.js';
import { paintDoor, paintWall, paintRangoli, paintSilk, paintArchFrame, paintDomeRibs, paintNamesPanel } from './paint.js';
import { petalGeometry } from '../fx/three/petalGeometry.js';
import { arcade } from './art.js';

/**
 * Procedural scenery for the cinema world (storyboard rev 4). Each builder adds to `scene` and returns
 * { update?(time, dt, state) }. Layout (metres, −z is "into the film"):
 *   doors z=0 · mandap centre z=−14 · backdrop z=−17.6 · water from z=−22 · colonnade x=−16 ·
 *   light mandala (0,0,−70) · palace skyline z −170…−190 · fireworks z −125…−150
 */

export const FOG = new THREE.Color('#f3eadb'); // ivory haze (daylight theme)
/** Muted carpet palette for the mandap floor (deep red, ivory, green, gold). */
const CARPET = ['#7a1020', '#c99a3b', '#efe2c4', '#2f5d3a', '#5a0a14', '#b8283a', '#fff4dc'];

function rand(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const tex = (canvas, { repeat = null, srgb = true } = {}) => {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
};

/** Shared uniforms every custom material reads (time, fog, point scale). */
export function sharedUniforms() {
  return {
    uTime: { value: 0 },
    uFogDensity: { value: 0.009 },
    uFogColor: { value: FOG.clone() },
    uScale: { value: 600 },
  };
}

// ------------------------------------------------------------------ glow points
export function glowPoints(U, pts, { bokeh = 0, twinkle = 1, intensity = 1, mirror = false, fog = true, order = 3 } = {}) {
  const n = pts.length;
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const size = new Float32Array(n);
  const phase = new Float32Array(n);
  const c = new THREE.Color();
  pts.forEach((p, i) => {
    pos.set(p.p, i * 3);
    c.set(p.c || '#ffd38a');
    col.set([c.r, c.g, c.b], i * 3);
    size[i] = p.s ?? 0.2;
    phase[i] = p.ph ?? Math.random();
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  const mk = (mir) => {
    const m = new THREE.ShaderMaterial({
      vertexShader: S.glowVert,
      fragmentShader: S.glowFrag,
      uniforms: {
        uTime: U.uTime,
        uScale: U.uScale,
        uFogDensity: fog ? U.uFogDensity : { value: 0 },
        uMirror: { value: mir ? 1 : 0 },
        uIntensity: { value: intensity },
        uTwinkle: { value: twinkle },
        uBokeh: { value: bokeh },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending, // daylight: additive light vanishes on white
      premultipliedAlpha: true,
    });
    const o = new THREE.Points(g, m);
    o.frustumCulled = false;
    o.renderOrder = order;
    return o;
  };
  const main = mk(false);
  const group = new THREE.Group();
  group.add(main);
  if (mirror) group.add(mk(true));
  group.userData.set = (k, v) => group.children.forEach((o) => (o.material.uniforms[k].value = v));
  return group;
}

// ------------------------------------------------------------------ flowers (strings, toran, spirals)
export function flowerField(U, flowers) {
  const n = flowers.length;
  const base = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = base.index;
  g.setAttribute('position', base.getAttribute('position'));
  const off = new Float32Array(n * 3);
  const size = new Float32Array(n);
  const type = new Float32Array(n);
  const phase = new Float32Array(n);
  const hang = new Float32Array(n);
  flowers.forEach((f, i) => {
    off.set(f.p, i * 3);
    size[i] = f.s;
    type[i] = f.t;
    phase[i] = f.ph;
    hang[i] = f.h;
  });
  g.setAttribute('aOffset', new THREE.InstancedBufferAttribute(off, 3));
  g.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 1));
  g.setAttribute('aType', new THREE.InstancedBufferAttribute(type, 1));
  g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
  g.setAttribute('aHang', new THREE.InstancedBufferAttribute(hang, 1));
  g.instanceCount = n;
  const m = new THREE.ShaderMaterial({
    vertexShader: S.flowerVert,
    fragmentShader: S.flowerFrag,
    uniforms: {
      uTime: U.uTime,
      uFogDensity: U.uFogDensity,
      uFogColor: U.uFogColor,
      uWind: { value: 1 },
      uWarm: { value: new THREE.Color('#ff9a40') },
    },
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  return mesh;
}

/** A hanging "ladi": flowers stacked down from `top`, every 5th a rose, a jasmine tassel at the end. */
export function ladi(out, lights, top, length, r, { size = 0.13, palette = 0, tassel = true, light = true, kind = 'marigold' } = {}) {
  const step = size * 1.18;
  const n = Math.max(2, Math.floor(length / step));
  for (let i = 0; i < n; i++) {
    const y = top[1] - i * step;
    let t = (i + palette) % 2;
    if (i % 6 === 5) t = 2;
    if (kind === 'jasmine') t = i % 5 === 2 ? 2 : 4; // white mogra with a red rose every few
    out.push({ p: [top[0], y, top[2]], s: size * (0.92 + r() * 0.16), t, ph: r(), h: (i * step) / 2 });
    if (light && i % 4 === 2) lights.push({ p: [top[0] + (r() - 0.5) * 0.06, y - step * 0.5, top[2] + 0.06], s: 0.09, c: r() > 0.3 ? '#ffd27a' : '#fff1c9' });
  }
  if (tassel) {
    for (let k = 0; k < 2; k++) out.push({ p: [top[0], top[1] - n * step - k * size * 0.55, top[2]], s: size * 0.42, t: 4, ph: r(), h: (n * step) / 2 });
  }
}

/** Swag between two points (catenary) — toran over the doorway, between pillars. */
export function swag(out, a, b, sag, r, { size = 0.12, leaves = true } = {}) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.floor(len / (size * 1.5));
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - sag * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u];
    out.push({ p, s: size, t: i % 7 === 3 ? 2 : i % 2, ph: r(), h: 0.6 });
    if (leaves && i % 3 === 0) out.push({ p: [p[0], p[1] - size * 1.4, p[2] + 0.02], s: size * 1.1, t: 3, ph: r(), h: 1 });
  }
}

// ------------------------------------------------------------------ GPU petals
export function petalCloud(U, n, { mode = 1, palette, scale = 1 } = {}) {
  const geo = petalGeometry({ across: 4, along: 6 });
  const g = new THREE.InstancedBufferGeometry();
  g.index = geo.index;
  g.setAttribute('position', geo.getAttribute('position'));
  g.setAttribute('normal', geo.getAttribute('normal'));
  g.setAttribute('uv', geo.getAttribute('uv'));
  const seed = new Float32Array(n * 4);
  const col = new Float32Array(n * 3);
  const r = rand(91 + n);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    seed.set([r(), r(), r(), r()], i * 4);
    c.set(palette[Math.floor(r() * palette.length)]);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4));
  g.setAttribute('aColor', new THREE.InstancedBufferAttribute(col, 3));
  g.instanceCount = n;
  const m = new THREE.ShaderMaterial({
    vertexShader: S.petalsVert,
    fragmentShader: S.petalsFrag,
    uniforms: {
      uTime: { value: mode === 0 ? -10 : 0 },
      uMode: { value: mode },
      uCenter: { value: new THREE.Vector3() },
      uBox: { value: new THREE.Vector3(14, 10, 14) },
      uDensity: { value: 1 },
      uScale: { value: scale },
      uFall: { value: 1 },
      uDir: { value: new THREE.Vector3(1, 0, 0) },
      uFogDensity: U.uFogDensity,
      uFogColor: U.uFogColor,
    },
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  return mesh;
}

// ------------------------------------------------------------------ fireworks
export function fireworks(U, perBurst = 160) {
  const B = 8;
  const n = B * (perBurst + 1);
  const dir = new Float32Array(n * 3);
  const burst = new Float32Array(n);
  const rocket = new Float32Array(n);
  const rr = new Float32Array(n);
  const pos = new Float32Array(n * 3);
  const r = rand(5);
  let k = 0;
  for (let b = 0; b < B; b++) {
    for (let i = 0; i <= perBurst; i++, k++) {
      const u = r() * 2 - 1;
      const a = r() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const shell = b % 3 === 0 ? 1 : 0.75 + r() * 0.25;
      dir.set([Math.cos(a) * s * shell, u * shell, Math.sin(a) * s * shell], k * 3);
      burst[k] = b;
      rocket[k] = i === perBurst ? 1 : 0;
      rr[k] = r();
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
  g.setAttribute('aBurst', new THREE.BufferAttribute(burst, 1));
  g.setAttribute('aRocket', new THREE.BufferAttribute(rocket, 1));
  g.setAttribute('aRand', new THREE.BufferAttribute(rr, 1));
  const origins = Array.from({ length: B }, () => new THREE.Vector3(0, -999, 0));
  const starts = new Array(B).fill(-99);
  const colors = Array.from({ length: B }, () => new THREE.Color('#ffcc66'));
  const mk = (mir) => {
    const m = new THREE.ShaderMaterial({
      vertexShader: S.fireVert,
      fragmentShader: S.fireFrag,
      uniforms: {
        uTime: U.uTime,
        uScale: U.uScale,
        uFogDensity: { value: 0.006 },
        uOrigin: { value: origins },
        uStart: { value: starts },
        uColor: { value: colors },
        uMirror: { value: mir ? 1 : 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending, // daylight: additive light vanishes on white
      premultipliedAlpha: true,
    });
    const o = new THREE.Points(g, m);
    o.frustumCulled = false;
    o.renderOrder = 4;
    return o;
  };
  const group = new THREE.Group();
  group.add(mk(false), mk(true));
  const PAL = ['#ffb43a', '#ff5a3c', '#ffe08a', '#ff7ab8', '#fff4d6', '#ffcf4d'];
  let slot = 0;
  let next = 0;
  group.userData.update = (time, active) => {
    if (!active || time < next) return;
    const b = slot++ % B;
    origins[b].set((r() - 0.5) * 36, 13 + r() * 14, -128 - r() * 22);
    starts[b] = time + 1.1; // rocket rises for 1.1 s first
    colors[b].set(PAL[Math.floor(r() * PAL.length)]);
    next = time + 0.45 + r() * 0.7;
  };
  return group;
}

// ------------------------------------------------------------------ diyas
/** Clay diya with a pinched spout and a painted rim band (vertex colours). ~0.34 m across. */
export function diyaGeometry() {
  const prof = [[0, 0], [0.07, 0.004], [0.12, 0.02], [0.155, 0.05], [0.17, 0.075], [0.165, 0.088], [0.15, 0.09], [0.12, 0.07], [0.06, 0.055], [0, 0.055]];
  const g = new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 28);
  const pos = g.getAttribute('position');
  const col = new Float32Array(pos.count * 3);
  const terracotta = new THREE.Color('#9a4019');
  const band = new THREE.Color('#c8102e');
  const dot = new THREE.Color('#ffd34d');
  const inside = new THREE.Color('#4a1a08');
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let z = pos.getZ(i);
    const y = pos.getY(i);
    const a = Math.atan2(z, x);
    const spout = Math.pow(Math.max(0, Math.cos(a)), 8);
    x *= 1 + spout * 0.75;
    z *= 1 - spout * 0.25;
    pos.setXYZ(i, x, y + spout * y * 0.35, z);
    const r = Math.hypot(x, z);
    let c = terracotta;
    if (y > 0.06 && y < 0.08 && r > 0.14) c = Math.sin(a * 18) > 0.6 ? dot : band;
    if (y > 0.05 && r < 0.15 && y < 0.075) c = inside;
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

export function flameField(U, list) {
  const base = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = base.index;
  g.setAttribute('position', base.getAttribute('position'));
  const off = new Float32Array(list.length * 3);
  const size = new Float32Array(list.length);
  const ph = new Float32Array(list.length);
  list.forEach((f, i) => {
    off.set(f.p, i * 3);
    size[i] = f.s;
    ph[i] = f.ph;
  });
  g.setAttribute('aOffset', new THREE.InstancedBufferAttribute(off, 3));
  g.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 1));
  g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(ph, 1));
  g.instanceCount = list.length;
  const m = new THREE.ShaderMaterial({
    vertexShader: S.flameVert,
    fragmentShader: S.flameFrag,
    uniforms: { uTime: U.uTime, uFogDensity: U.uFogDensity },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending, // daylight: additive light vanishes on white
    premultipliedAlpha: true,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  return mesh;
}

// ------------------------------------------------------------------ the set
const PILLAR_PROFILE = [
  [0.0, 0], [0.42, 0], [0.42, 0.12], [0.36, 0.14], [0.36, 0.26], [0.3, 0.3], [0.24, 0.36], [0.22, 0.5],
  [0.2, 2.6], [0.26, 2.7], [0.2, 2.8], [0.19, 3.9], [0.25, 4.0], [0.19, 4.1], [0.21, 4.5], [0.32, 4.7],
  [0.38, 4.86], [0.3, 5.0], [0.42, 5.08], [0.42, 5.2], [0, 5.2],
];
const pillarGeo = (h = 5.2) =>
  new THREE.LatheGeometry(PILLAR_PROFILE.map(([x, y]) => new THREE.Vector2(x, (y * h) / 5.2)), 20);

export async function buildSet(scene, U, { tier, photoUrl, ganeshUrl }) {
  const hi = tier === 'high';
  const r = rand(42);
  const updates = [];
  const mats = {
    gold: new THREE.MeshStandardMaterial({ color: '#e0b25c', metalness: 0.9, roughness: 0.32 }),
    ivory: new THREE.MeshStandardMaterial({ color: '#f1dcb4', metalness: 0.1, roughness: 0.55 }),
    stone: new THREE.MeshStandardMaterial({ color: '#e4d3b4', roughness: 0.9, metalness: 0.0 }),
    grass: new THREE.MeshStandardMaterial({ color: '#7f9c5c', roughness: 1 }),
    clay: new THREE.MeshStandardMaterial({ color: '#a4471c', roughness: 0.8, emissive: '#3a0d00' }),
    maroon: new THREE.MeshStandardMaterial({ color: '#6a0d1a', roughness: 0.6 }),
  };

  // ground (land) and water
  const land = new THREE.Mesh(new THREE.PlaneGeometry(90, 48), mats.stone);
  land.rotation.x = -Math.PI / 2;
  land.position.set(0, 0, 1);
  scene.add(land);
  const bank = new THREE.Mesh(new THREE.PlaneGeometry(14, 140), mats.grass);
  bank.rotation.x = -Math.PI / 2;
  bank.position.set(-21, 0.01, -90);
  // (left bank removed with the colonnade)
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.ShaderMaterial({
      vertexShader: S.waterVert,
      fragmentShader: S.waterFrag,
      uniforms: {
        uTime: U.uTime,
        uFogDensity: U.uFogDensity,
        uFogColor: U.uFogColor,
        uDeep: { value: new THREE.Color('#5f9a97') },
        uSky: { value: new THREE.Color('#f6efe3') },
      },
      transparent: true,
      depthWrite: false,
    }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.02, -222);
  water.renderOrder = 1;
  scene.add(water);

  // ---------------- haveli wall + carved doors (z = 0)
  const wallTex = tex(paintWall(), { repeat: [3, 1] });
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85 });
  const W = 1.6;
  const H = 4.6;
  const WALL = 5.4;
  const wl = new THREE.Mesh(new THREE.BoxGeometry(14, WALL, 0.8), wallMat);
  wl.position.set(-W - 7, WALL / 2, -0.4);
  const wr = wl.clone();
  wr.position.x = W + 7;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(W * 2 + 0.01, WALL - H, 0.8), wallMat);
  lintel.position.set(0, H + (WALL - H) / 2, -0.4);
  scene.add(wl, wr, lintel);
  // door frame: gold jambs + carved arch crest
  const jamb = new THREE.Mesh(new THREE.BoxGeometry(0.26, H + 0.3, 0.95), mats.gold);
  jamb.position.set(-W - 0.1, H / 2, -0.35);
  const jamb2 = jamb.clone();
  jamb2.position.x = W + 0.1;
  const head = new THREE.Mesh(new THREE.BoxGeometry(W * 2 + 0.5, 0.3, 0.95), mats.gold);
  head.position.set(0, H + 0.12, -0.35);
  const crest = new THREE.Mesh(new THREE.TorusGeometry(W + 0.1, 0.09, 8, 40, Math.PI), mats.gold);
  crest.position.set(0, H + 0.25, 0.05);
  crest.scale.y = 0.55;
  scene.add(jamb, jamb2, head, crest);
  // door leaves (hinged at the jambs, swing inward)
  const doorGeo = new THREE.BoxGeometry(W, H, 0.12);
  doorGeo.translate(W / 2, H / 2, 0);
  const leafMat = (mirror) =>
    new THREE.MeshStandardMaterial({ map: tex(paintDoor(512, 1472, { mirror })), roughness: 0.42, metalness: 0.25 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#4a0912', roughness: 0.6 });
  const leafL = new THREE.Mesh(doorGeo, [edgeMat, edgeMat, edgeMat, edgeMat, leafMat(false), edgeMat]);
  const hingeL = new THREE.Group();
  hingeL.position.set(-W, 0, -0.3);
  hingeL.add(leafL);
  const leafR = new THREE.Mesh(doorGeo, [edgeMat, edgeMat, edgeMat, edgeMat, leafMat(true), edgeMat]);
  leafR.position.x = -W;
  const hingeR = new THREE.Group();
  hingeR.position.set(W, 0, -0.3);
  hingeR.add(leafR);
  scene.add(hingeL, hingeR);

  // threshold rangoli + diyas
  // the painted petal rangoli (Flow) with its own ring of diyas; the code-drawn one is the fallback
  const rangoliImg = await loadImage('/img/art/rangoli.webp').catch(() => null);
  const rangoli = new THREE.Mesh(
    rangoliImg ? new THREE.PlaneGeometry(4.3, 4.3) : new THREE.CircleGeometry(1.9, 64),
    rangoliImg
      ? new THREE.MeshBasicMaterial({ map: tex(rangoliImg), alphaTest: 0.4, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 })
      : new THREE.MeshStandardMaterial({ map: tex(paintRangoli(1024, 3)), transparent: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }),
  );
  rangoli.userData.painted = !!rangoliImg;
  rangoli.rotation.x = -Math.PI / 2;
  rangoli.position.set(0, 0.012, 3.1);
  scene.add(rangoli);

  const diyaGeo = diyaGeometry();
  const diyaMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, emissive: '#2a0800' });
  const flames = [];
  const flameTips = [];
  const doorDiyas = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    doorDiyas.push([Math.cos(a) * 2.15, 0, 3.1 + Math.sin(a) * 2.15]);
  }
  [-2.3, -1.95, 1.95, 2.3].forEach((x) => doorDiyas.push([x, 0, 0.45]));

  // floating diyas on the water
  const floatDiyas = [];
  const nFloat = hi ? 260 : 140;
  for (let i = 0; i < nFloat; i++) {
    const z = -25 - Math.pow(r(), 0.8) * 115;
    const x = (r() - 0.5) * (18 + (-z - 25) * 0.9);
    if (x < -13) continue;
    floatDiyas.push([x, 0.02, z]);
  }
  const allDiyas = [...doorDiyas, ...floatDiyas];
  const diyaMesh = new THREE.InstancedMesh(diyaGeo, diyaMat, allDiyas.length);
  const mtx = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const petalRing = [];
  allDiyas.forEach((p, i) => {
    const s = i < doorDiyas.length ? 1.15 : 1.6;
    const yaw = r() * Math.PI * 2;
    quat.setFromAxisAngle(up, yaw);
    mtx.compose(new THREE.Vector3(p[0], p[1], p[2]), quat, new THREE.Vector3(s, s, s));
    diyaMesh.setMatrixAt(i, mtx);
    // the wick sits in the spout (local +x rotated by yaw)
    const sx = p[0] + Math.cos(yaw) * 0.22 * s;
    const sz = p[2] - Math.sin(yaw) * 0.22 * s;
    flameTips.push({ p: [sx, p[1] + 0.085 * s, sz], s: 0.16 * s, ph: r() });
    flames.push({ p: [sx, p[1] + 0.14 * s, sz], s: 0.7 * s, c: '#ff7a1a', ph: r() });
    if (i >= doorDiyas.length) {
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2 + r() * 0.3;
        petalRing.push([p[0] + Math.cos(a) * 0.36 * s, 0.012, p[2] + Math.sin(a) * 0.36 * s, a]);
      }
    }
  });
  scene.add(diyaMesh);
  const flameTipsMesh = flameField(U, flameTips);
  scene.add(flameTipsMesh);
  const flameGlow = glowPoints(U, flames, { twinkle: 0.35, intensity: 0.3, mirror: false });
  scene.add(flameGlow);
  // rose and marigold petals floating round each water diya
  {
    const pgeo = petalGeometry({ across: 3, along: 4 });
    const pm = new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide });
    const ring = new THREE.InstancedMesh(pgeo, pm, petalRing.length);
    const e = new THREE.Euler();
    const cc = new THREE.Color();
    petalRing.forEach(([x, y, z, a], i) => {
      e.set(-Math.PI / 2 + (r() - 0.5) * 0.3, 0, -a + Math.PI / 2);
      quat.setFromEuler(e);
      mtx.compose(new THREE.Vector3(x, y, z), quat, new THREE.Vector3(0.2, 0.2, 0.2));
      ring.setMatrixAt(i, mtx);
      ring.setColorAt(i, cc.set(i % 3 ? '#c8102e' : '#f59e1b'));
    });
    scene.add(ring);
  }

  // ---------------- hero courtyard (z = HZ): a straight-on painted tableau — the painted gate (painted.js) frames
  // a red painted-paper panel that carries the couple's names (user, 12 Nov: the 3D mandap "looks very bad").
  const pg = pillarGeo(5.2); // still used by the colonnade
  const flowers = [];
  const fairy = [];
  const HZ = -16;
  const panelImg = await loadImage('/img/art/paper-red.webp').catch(() => null);
  const emblem = await loadImage('/img/art/boota.webp').catch(() => null);
  const silkPanel = await loadImage('/img/art/names-panel.webp').catch(() => null);
  // the courtyard behind the doors: a soft lawn with an ivory marble walk leading to the hero gate
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(90, 22.4), new THREE.MeshBasicMaterial({ color: '#9fb37c', toneMapped: false }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, 0.004, -11.7);
  scene.add(lawn);
  const walk = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 15.6), new THREE.MeshStandardMaterial({ color: '#f1e6d0', roughness: 0.6 }));
  walk.rotation.x = -Math.PI / 2;
  walk.position.set(0, 0.008, -8.3);
  scene.add(walk);
  for (const x of [-1.45, 1.45]) {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 15.6), new THREE.MeshStandardMaterial({ color: '#b8893a', roughness: 0.5, metalness: 0.3 }));
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(x, 0.01, -8.3);
    scene.add(edge);
  }
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 4.5),
    new THREE.MeshBasicMaterial({ map: tex(silkPanel || paintNamesPanel(panelImg, emblem)), toneMapped: false, fog: false }),
  );
  frame.position.set(0, 3.05, HZ - 0.12);
  scene.add(frame);

  const silk = new THREE.Object3D(); // legacy handle (the silk backdrop is gone)
  const lanternMesh = new THREE.Object3D();
  const lanternPositions = [];

  // ---------------- toran over the doors + side strings
  // (3D toran removed: painted marigold strands hang in the gate's arch — painted.js)
  // (side strings removed: the painted gate's inlaid pillars carry the decoration)
  // wall string lights (top edge) — the haveli is dressed for the wedding
  for (let i = 0; i < 70; i++) {
    const x = -16 + i * 0.47;
    const sag = 0.25 * Math.sin(((x + 16) % 3.2) / 3.2 * Math.PI);
    fairy.push({ p: [x, 5.3 - sag, 0.05], s: 0.12, c: i % 3 ? '#ffcf70' : '#fff0c0', ph: r() });
  }

  const bankLights = [];

  // ---------------- flowers + fairy lights + bokeh
  scene.add(flowerField(U, flowers));
  scene.add(glowPoints(U, [...fairy, ...bankLights], { twinkle: 0.8, intensity: 1.0 }));
  const bokeh = [];
  const nb = hi ? 220 : 120;
  for (let i = 0; i < nb; i++) {
    const z = 18 - r() * 170;
    bokeh.push({ p: [(r() - 0.5) * 60, 1 + r() * 16, z], s: 0.7 + r() * 1.6, c: ['#f2b8a0', '#f3d58a', '#e9a0a8', '#ffffff'][Math.floor(r() * 4)], ph: r() });
  }
  // daylight: no bokeh discs (they read as dust on white)
  // stars
  const stars = [];
  for (let i = 0; i < (hi ? 700 : 400); i++) {
    const u = 0.08 + r() * 0.9;
    const a = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    stars.push({ p: [Math.cos(a) * s * 300, u * 300, Math.sin(a) * s * 300 - 60], s: 1.2 + r() * 2.2, c: r() > 0.8 ? '#ffd9a8' : '#fff6ea', ph: r() });
  }
  // daylight: no stars

  return {
    doors: { hingeL, hingeR, leafL, leafR },
    doorFrame: [jamb, jamb2, head, crest],
    lanterns: { mesh: lanternMesh, positions: lanternPositions },
    doorDiyas: { mesh: diyaMesh, flames: flameTipsMesh, count: doorDiyas.length, positions: doorDiyas },
    frame,
    lawn,
    walk,
    rangoli,
    silk,
    flameGlow,
    mats,
    updates,
  };
}

export function loadImage(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
}
