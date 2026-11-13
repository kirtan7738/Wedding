import * as THREE from 'three';

/**
 * Painted miniature-style layers (after the user's reference reel): flat cut-out paintings stood up in the
 * 3D world like a theatre set, so the moving camera gives them real parallax. Lit by the scene's diyas and
 * lamps (MeshStandard) with a little self-glow so the gouache colours still read at night.
 * Every entry is optional — a missing file is skipped, the world never waits for art.
 *
 * pos = bottom-centre of the painting (metres), h = height (width follows the image aspect).
 */
export const LAYERS = [
  // --- shot 0: the gate
  // painted gate (Flow): opening is 40.5 % of the width, its floor 90.4 % down and crown 42.75 % down → 10 m tall,
  // sunk 0.96 m so the opening's floor meets the ground and the crown (4.76 m) clears the 4.6 m doors
  { src: 'gate', pos: [0, -0.96, 0.12], h: 10, tag: 'gate' },
  { src: 'cypress', pos: [-3.25, 0, 0.75], h: 6.8, sway: 0.6 },
  { src: 'cypress', pos: [3.3, 0, 0.75], h: 6.5, sway: 0.6, flip: true },
  { src: 'bougainvillea', pos: [-2.1, 0, 1.35], h: 1.2, sway: 0.3 },
  { src: 'bougainvillea', pos: [2.15, 0, 1.35], h: 1.15, sway: 0.3, flip: true },
  { src: 'cypress', pos: [-7.2, 0, 0.3], h: 8.6, sway: 0.5, flip: true },
  { src: 'cypress', pos: [7.4, 0, 0.3], h: 8.2, sway: 0.5 },
  { src: 'bougainvillea', pos: [-3.1, 0, 1.2], h: 1.7, sway: 0.3 },
  { src: 'bougainvillea', pos: [3.2, 0, 1.2], h: 1.6, sway: 0.3, flip: true },
  // painted toran (Flow) across the cover gate's arch, its rope tucked under the carved crown
  { src: 'toran', pos: [0, 3.62, 0.05], h: 1.12, sway: 0.4, hang: true },
  // auspicious kalash either side of the doorway
  { src: 'kalash', pos: [-1.0, 0, 1.05], h: 0.82 },
  { src: 'kalash', pos: [1.0, 0, 1.05], h: 0.82, flip: true },
  // painted elephants (Flow) flanking the gate, both facing the doors — a royal welcome
  // phones (portrait) see a narrow frame: the elephants step in to the foot of the doors
  { src: 'elephant', pos: [-3.75, 0, 1.75], h: 2.9, flip: true, portrait: { pos: [-1.5, 0, 2.8], h: 1.72 } },
  { src: 'elephant', pos: [3.75, 0, 1.75], h: 2.9, portrait: { pos: [1.5, 0, 2.8], h: 1.72 } },
  { src: 'bougainvillea', pos: [-5.6, 0, 1.0], h: 2.1, sway: 0.3, flip: true },
  { src: 'bougainvillea', pos: [5.8, 0, 1.0], h: 2.0, sway: 0.3 },
  { src: 'plantain', pos: [-9.6, 0, 0.6], h: 4.2, sway: 0.8 },
  { src: 'plantain', pos: [9.8, 0, 0.6], h: 4.0, sway: 0.8, flip: true },
  // painted peacock (Flow): its ledge stub sits 61.5 % up the image, feet 22 % in from the left — perched on the roof's eaves (~5.5 m)
  { src: 'peacock', pos: [-1.84, 3.78, 0.4], h: 2.8 },
  { src: 'peacock', pos: [1.84, 3.78, 0.4], h: 2.8, flip: true },
  { src: 'chhatri', pos: [-5.4, 5.4, -0.3], h: 3.4, portrait: { pos: [-3.05, 5.4, -0.35], h: 2.7 } },
  { src: 'chhatri', pos: [5.4, 5.4, -0.3], h: 3.4, flip: true, portrait: { pos: [3.05, 5.4, -0.35], h: 2.7 } },
  { src: 'chhatri', pos: [-9.5, 0, -6], h: 8, glow: 0.12 },
  { src: 'chhatri', pos: [9.5, 0, -6], h: 8, glow: 0.12, flip: true },
  // painted garden foreground (Flow) at the lower corners of the gate scene
  { src: 'grass', pos: [-2.5, 0, 4.9], h: 0.95 },
  { src: 'grass', pos: [2.5, 0, 4.9], h: 0.9, flip: true },
  { src: 'grass', pos: [-4.2, 0, 3.6], h: 1.2, flip: true },
  { src: 'grass', pos: [4.2, 0, 3.6], h: 1.2 },
  // painted Mughal clouds drifting slowly across the sky (parallax: nearer banks drift faster)
  { src: 'clouds', pos: [-6, 8.6, 0.6], h: 2.2, drift: { speed: 0.12, span: 22 }, soft: true },
  { src: 'clouds', pos: [7, 10.6, 0.4], h: 2.6, drift: { speed: 0.08, span: 26 }, soft: true, flip: true },
  // --- shot 1: the hero tableau (HZ = −16), composed straight-on like a miniature painting
  { src: 'clouds', pos: [-3, 8.3, -24], h: 2.6, drift: { speed: 0.09, span: 30 }, soft: true },
  { src: 'clouds', pos: [9, 10.2, -26], h: 3.2, drift: { speed: 0.06, span: 34 }, soft: true, flip: true },
  { src: 'clouds', pos: [-12, 7.2, -22], h: 2.0, drift: { speed: 0.1, span: 30 }, soft: true },
  // spaced out (user, 13 Nov: "too noisy, add some space") — each element gets its own band of the frame
  // chhatri, cypress and plantain each own a separate band of the frame (they used to stack behind one another)
  { src: 'cypress', pos: [-9.6, 0, -19], h: 8.4, sway: 0.5 },
  { src: 'cypress', pos: [9.6, 0, -19], h: 8.1, sway: 0.5, flip: true },
  // pushpa vrishti: Shiv-Parvati (left) and Lakshmi-Narayan (right) lean out of clouds beside the dome and shower
  // flowers on the couple (the falling petals are the live 3D shower in World.js). Phones: smaller, at the top corners.
  // hand: where the petals leave the painting (u, v from the image's top-left); pour: direction, toward the couple
  { src: 'devta-left', pos: [-4.9, 5.85, -15.5], h: 3.1, float: 0.1, soft: true, divine: { hand: [0.76, 0.46], pour: [1, -0.15, 0.25] }, portrait: { pos: [-1.85, 7.35, -14.9], h: 1.9 } },
  { src: 'devta-right', pos: [4.9, 5.85, -15.5], h: 3.1, float: 0.1, soft: true, flip: true, divine: { hand: [0.74, 0.47], pour: [-1, -0.15, 0.25] }, portrait: { pos: [1.85, 7.35, -14.9], h: 1.9 } },
  { src: 'gate', pos: [0, 0, -16], h: 9, tag: 'hero-gate' },
  // the couple, painted (Flow), framed by the arch on the crimson silk — the havan scene replaces the standing pair
  { src: 'couple', pos: [0, 0.86, -15.96], h: 2.6 },
  { src: 'couple-havan', pos: [0, 0.82, -15.9], h: 1.85 },
  // marigold strands in the hero gate's arch, in front of the names panel, tops hidden behind the crown
  ...[-0.85, -0.6375, -0.425, -0.2125, 0, 0.2125, 0.425, 0.6375, 0.85].map((x, i) => ({ src: `strand${((i + 3) % 7) + 1}`, pos: [x, 6.6 - (i % 2 ? 2.3 : 2.65), -16.06], h: i % 2 ? 2.3 : 2.65, sway: 0.5, hang: true })),
  // painted peacocks on the gate's eaves (scaled from the cover placement)
  { src: 'peacock', pos: [-1.66, 4.27, -15.7], h: 2.5 },
  { src: 'peacock', pos: [1.66, 4.27, -15.7], h: 2.5, flip: true },
  { src: 'plantain', pos: [-4.6, 0, -13.8], h: 3.2, sway: 0.7 },
  { src: 'plantain', pos: [4.6, 0, -13.8], h: 3.1, sway: 0.7, flip: true },
  // painted brass lamp on its wall bracket (Flow): the plate sits on the gate's outer pillar, the lamp hangs outward
  { src: 'lamp-bracket', pos: [-3.33, 3.75, -15.85], h: 2.5, flip: true },
  { src: 'lamp-bracket', pos: [3.33, 3.75, -15.85], h: 2.5 },
  { src: 'bougainvillea', pos: [-2.15, 0, -14], h: 1.35, sway: 0.25 },
  { src: 'bougainvillea', pos: [2.15, 0, -14], h: 1.3, sway: 0.25, flip: true },
  // (diyas at the walk removed: the marble steps carry their own)
  // garden beds across the whole foreground, two rows deep
  ...[-10.4, -8.1, -5.8, -3.5, 3.5, 5.8, 8.1, 10.4].map((x, i) => ({ src: 'grass', pos: [x, 0, -12.7], h: 1.25, flip: i % 2 === 1 })),
  ...[-9.4, -6.8, -4.2, 4.2, 6.8, 9.4].map((x, i) => ({ src: 'grass', pos: [x, 0, -11.6], h: 1.2, flip: i % 2 === 0 })),
  ...[-10.4, -8.1, -5.8, -3.5, 3.5, 5.8, 8.1, 10.4].map((x, i) => ({ src: 'grass', pos: [x, 0, -10.5], h: 1.15, flip: i % 2 === 1 })),
  ...[-9.4, -6.8, -4.2, 4.2, 6.8, 9.4].map((x, i) => ({ src: 'grass', pos: [x, -0.15, -9.4], h: 1.1, flip: i % 2 === 0 })),
  // ivory marble steps (Flow) up to the gate's arch, diyas and petals on every tread
  { src: 'marble-steps', pos: [0, 0, -14.7], h: 1.5 },
  // flowering bushes line the marble walk so the garden beds end softly at the path
  ...[-9.5, -11.6].flatMap((z, i) => [
    { src: 'bougainvillea', pos: [-2.35, -0.06, z], h: 0.95 - i * 0.1, sway: 0.25, flip: i % 2 === 1 },
    { src: 'bougainvillea', pos: [2.35, -0.06, z], h: 0.95 - i * 0.1, sway: 0.25, flip: i % 2 === 0 },
  ]),
  // a lotus pond (Flow) along the lake's edge behind the courtyard — softens the line where lawn meets water
  ...[-16.2, -10.8, -5.4, 0, 5.4, 10.8, 16.2].map((x, i) => ({ src: 'lotus-pond', pos: [x, -0.05, -22.75], h: 1.4, flip: i % 2 === 1 })),
  { src: 'bougainvillea', pos: [-3.9, 0, -10.2], h: 1.5, sway: 0.25 },
  { src: 'bougainvillea', pos: [3.9, 0, -10.2], h: 1.45, sway: 0.25, flip: true },
  // (far-shore skyline removed: the open lake gives the couple's scene room to breathe — user, 13 Nov)
];

// --- the hero, redesigned (user, 13 Nov): inside the haveli chowk. These pieces switch on as soon as the painted
// back wall (round 10 #61) exists; until then the garden hero above stays. Placements are provisional until the art
// is in (re-measured then). Camera at the hero: [0, 3.9, −3.6] looking at [0, 3.55, −16]; phones see ±2.7 m at z −16.
export const CHOWK = [
  { src: 'chowk-backwall', pos: [0, 0, -21], h: 9.2 },
  { src: 'chowk-sidewall', pos: [-7.2, 0, -15.5], h: 7.4, rotY: 0.95 },
  { src: 'chowk-sidewall', pos: [7.2, 0, -15.5], h: 7.4, rotY: -0.95, flip: true },
  { src: 'peacock', pos: [-5.6, 8.2, -20.8], h: 2.2 },
  { src: 'peacock', pos: [5.6, 8.2, -20.8], h: 2.2, flip: true },
  { src: 'plantain', pos: [-3.1, 0, -16.2], h: 3.6, sway: 0.7 },
  { src: 'plantain', pos: [3.1, 0, -16.2], h: 3.5, sway: 0.7, flip: true },
  { src: 'couple-havan', pos: [0, 0.5, -15.9], h: 1.75 },
  { src: 'chori', pos: [0, 0, -15.6], h: 5.0 },
  { src: 'tulsi-kyaro', pos: [-3.3, 0, -12.6], h: 1.55, portrait: { pos: [-1.95, 0, -12.2], h: 1.15 } },
  { src: 'samai-pair', pos: [3.2, 0, -12.8], h: 2.1, portrait: { pos: [1.95, 0, -12.3], h: 1.5 } },
  { src: 'kalash', pos: [-1.55, 0, -13.2], h: 0.7 },
  { src: 'kalash', pos: [1.55, 0, -13.2], h: 0.7, flip: true },
  { src: 'garland-swag', pos: [0, 6.6, -11.2], h: 2.2, sway: 0.3, hang: true },
  { src: 'garland-swag', pos: [0, 7.8, -17.5], h: 3.4, sway: 0.25, hang: true, flip: true },
  { src: 'brass-jhoomar', pos: [0, 7.4, -13.4], h: 2.2, sway: 0.15, hang: true },
].map((l) => ({ ...l, set: 'chowk' }));
// everything of the garden hero (behind the doors, except the gods and their clouds) is the 'garden' set
for (const l of LAYERS) if (l.pos[2] < -5 && !['clouds', 'devta-left', 'devta-right'].includes(l.src)) l.set ||= 'garden';
LAYERS.push(...CHOWK);

/** Show the chowk hero if its back wall is painted, else the garden one. Returns true when the chowk is on. */
export function chooseHero(meshes) {
  const chowk = meshes.loaded.has('chowk-backwall');
  for (const m of meshes) {
    const set = m.userData.layer.set;
    if (set === 'chowk' || set === 'garden') m.visible = set === (chowk ? 'chowk' : 'garden');
  }
  return chowk;
}

// --- the cover, redesigned (round 9): the Gujarati pol-haveli doorway. Measured on the painting (746×1282 px):
// the door opening spans x 227–516 and y 787–1196 (its sill to 1220), the plinths stand on the bottom row. At 9 m tall
// (7.02 mm/px) the opening is 2.04 m wide, from 0.59 m (sill) to 3.47 m — the camera's flight line (y ≈ 2.6 at the
// door) passes cleanly through it, and the whole facade fits a phone's frame.
export const HAVELI = { h: 9, openW: 2.04, openTop: 3.47, sill: 0.59 };
export const COVER_HAVELI = [
  { src: 'haveli-doorway', pos: [0, 0, 0.12], h: HAVELI.h, tag: 'gate' },
  // the toran hangs from the lintel, its marigolds ending just above the sathiya on the doors
  { src: 'door-toran', pos: [0, 3.2, 0.2], h: 0.64, sway: 0.35, hang: true },
  // the threshold: three steps and a rangoli in front of the door
  { src: 'haveli-threshold', pos: [0, 0, 1.15], h: 1.45 },
  // tall brass samai lamps either side
  { src: 'samai-pair', pos: [-1.95, 0, 0.95], h: 1.85, portrait: { pos: [-1.22, 0.05, 1.55], h: 1.45 } },
  { src: 'samai-pair', pos: [1.95, 0, 0.95], h: 1.85, flip: true, portrait: { pos: [1.22, 0.05, 1.55], h: 1.45 } },
].map((l) => ({ ...l, set: 'haveli' }));
// the Mughal ivory gate and the pieces placed on it make way for the haveli
for (const l of LAYERS) if (l.pos[2] > -5 && ['gate', 'toran', 'kalash', 'peacock'].includes(l.src)) l.set ||= 'mughal';
LAYERS.push(...COVER_HAVELI);

/** Show the haveli cover if its doorway is painted, else the Mughal gate. Returns true when the haveli is on. */
export function chooseCover(meshes) {
  const haveli = meshes.loaded.has('haveli-doorway');
  for (const m of meshes) {
    const set = m.userData.layer.set;
    if (set === 'haveli' || set === 'mughal') m.visible = set === (haveli ? 'haveli' : 'mughal');
  }
  return haveli;
}

const SOFT = new Set(['grass', 'bougainvillea']);
/** a soft round glow, drawn once (halo + sparkle sprites) */
const GLOW = (() => {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})();
const STAR = new THREE.PlaneGeometry(1, 1);

const swayChunk = /* glsl */ `
  #include <begin_vertex>
  float _h = uHang > 0.5 ? 1.0 - clamp(uv.y, 0.0, 1.0) : clamp(uv.y, 0.0, 1.0);
  transformed.x += sin(uTime * 1.1 + uPhase) * uSway * 0.06 * _h * _h;
  transformed.z += cos(uTime * 0.8 + uPhase) * uSway * 0.03 * _h * _h;
`;

/** Loads whatever art exists under /img/art/<name>.webp and stands it in the world. Returns the meshes. */
export async function addPaintedLayers(scene, U, { base = '/img/art/', onGate, extra = [] } = {}) {
  const loader = new THREE.TextureLoader();
  const ALL = [...LAYERS, ...extra];
  const names = [...new Set(ALL.map((l) => l.src))];
  const tex = {};
  await Promise.all(
    names.map(
      (n) =>
        new Promise((res) =>
          loader.load(
            `${base}${n}.webp`,
            (t) => {
              t.colorSpace = THREE.SRGBColorSpace;
              t.anisotropy = 4;
              tex[n] = t;
              res();
            },
            undefined,
            () => res(), // missing art: skip
          ),
        ),
    ),
  );
  const meshes = [];
  ALL.forEach((l, i) => {
    const t = tex[l.src];
    if (!t) return;
    const aspect = t.image.width / t.image.height;
    const w = l.h * aspect;
    const geo = new THREE.PlaneGeometry(w, l.h, 1, l.sway ? 8 : 1);
    geo.translate(0, l.h / 2, 0);
    // painted art keeps its exact colours (unlit, not tone-mapped) — it is already painted with light and shade
    // garden pieces have soft (faded) edges: blend them — an alpha cut-off would turn the fade back into a hard line
    const soft = SOFT.has(l.src) || l.soft;
    const mat = new THREE.MeshBasicMaterial({ map: t, alphaTest: soft ? 0.02 : 0.45, transparent: soft, depthWrite: !soft, side: THREE.DoubleSide, toneMapped: false, fog: false });
    mat.color.setScalar(0.97);
    if (l.far) mat.color.set('#e8d2c4'); // sandstone palace across the lake in soft daylight haze
    if (l.sway) {
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uTime = U.uTime;
        sh.uniforms.uSway = { value: l.sway };
        sh.uniforms.uPhase = { value: i * 1.7 };
        sh.uniforms.uHang = { value: l.hang ? 1 : 0 };
        sh.vertexShader = 'uniform float uTime; uniform float uSway; uniform float uPhase; uniform float uHang;\n' + sh.vertexShader.replace('#include <begin_vertex>', swayChunk);
      };
      mat.customProgramCacheKey = () => (l.hang ? 'painted-hang' : 'painted-sway');
    }
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...l.pos);
    m.userData.baseH = l.h;
    m.userData.baseW = w;
    if (l.divine) {
      // a soft golden glow behind the gods
      const halo = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 1.25, l.h * 1.0),
        new THREE.MeshBasicMaterial({ map: GLOW, color: '#ffd77a', transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false, fog: false }),
      );
      halo.position.set(0, l.h * 0.55, -0.06);
      m.add(halo);
      m.userData.halo = halo;
      // gold sparkles around them
      const sparks = new THREE.Group();
      for (let k = 0; k < 16; k++) {
        const sp = new THREE.Mesh(STAR, new THREE.MeshBasicMaterial({ map: GLOW, color: k % 3 ? '#ffe9a8' : '#ffffff', transparent: true, depthWrite: false, toneMapped: false, fog: false }));
        const ang = (k / 16) * Math.PI * 2 + k;
        sp.position.set(Math.cos(ang) * w * (0.38 + (k % 4) * 0.05), l.h * (0.55 + Math.sin(ang) * 0.36), 0.05);
        sp.userData.s = 0.08 + (k % 3) * 0.05;
        sparks.add(sp);
      }
      m.add(sparks);
      m.userData.sparks = sparks;
    }
    m.userData.phase = i * 0.9;
    m.rotation.y = l.rotY || 0;
    if (l.flip) m.scale.x = -1;
    m.userData.layer = l;
    scene.add(m);
    meshes.push(m);
    if (l.tag === 'gate') onGate?.(m);
  });
  meshes.loaded = new Set(Object.keys(tex));
  return meshes;
}

/** Floating pieces (the gods): bob, sway like a cloud in a breeze, and descend from the sky when the scene opens
 * (`arrive` 0 → 1). Their halo breathes and their sparkles twinkle. */
export function floatLayers(meshes, time, arrive = 1) {
  const a = arrive * arrive * (3 - 2 * arrive);
  for (const m of meshes) {
    const d = m.userData.layer.drift;
    if (d) {
      // drift right, wrap at the far edge, fade in/out near the ends so the wrap is never seen
      if (m.userData.baseX == null) m.userData.baseX = m.position.x;
      const u = (((m.userData.baseX + time * d.speed + d.span / 2) % d.span) + d.span) % d.span;
      m.position.x = u - d.span / 2;
      const edge = Math.min(u, d.span - u) / (d.span * 0.15);
      m.material.opacity = Math.min(1, edge);
      m.material.transparent = true;
      continue;
    }
    const f = m.userData.layer.float;
    if (!f) continue;
    if (m.userData.baseY == null) m.userData.baseY = m.position.y;
    const ph = m.userData.phase;
    m.position.y = m.userData.baseY + Math.sin(time * 0.55 + ph) * f + (1 - a) * 2.6;
    m.rotation.z = Math.sin(time * 0.4 + ph * 1.3) * 0.025;
    m.material.opacity = a;
    m.material.transparent = a < 1 || !!m.userData.layer.soft; // soft pieces always blend (else they draw before the clouds and get covered)
    const halo = m.userData.halo;
    if (halo) halo.material.opacity = a * (0.55 + 0.2 * Math.sin(time * 1.1 + ph));
    const sparks = m.userData.sparks;
    if (sparks) {
      sparks.children.forEach((sp, i) => {
        const tw = 0.5 + 0.5 * Math.sin(time * (1.6 + (i % 5) * 0.37) + i * 2.1);
        sp.material.opacity = a * tw * tw;
        sp.scale.setScalar(sp.userData.s * (0.6 + 0.6 * tw));
      });
    }
  }
}

/** The world position a god's petals leave from (follows bob, sway, flip and the portrait placement). */
export function handPoint(m, out) {
  const { hand } = m.userData.layer.divine;
  const w = m.userData.baseW;
  const h = m.userData.baseH;
  out.set((hand[0] - 0.5) * w, (1 - hand[1]) * h, 0.12);
  return m.localToWorld(out);
}

/** Swap to the portrait placements (narrow phone frame) or back to the wide ones. */
export function fitLayers(meshes, aspect) {
  const portrait = aspect < 0.8;
  for (const m of meshes) {
    const l = m.userData.layer;
    if (!l.portrait) continue;
    const use = portrait ? l.portrait : l;
    m.position.set(...use.pos);
    m.userData.baseY = use.pos[1];
    const k = use.h / m.userData.baseH;
    m.scale.set(l.flip ? -k : k, k, k);
  }
}
