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
  // --- shot 1: the hero tableau (HZ = −16), composed straight-on like a miniature painting
  // spaced out (user, 13 Nov: "too noisy, add some space") — each element gets its own band of the frame
  // chhatri, cypress and plantain each own a separate band of the frame (they used to stack behind one another)
  { src: 'cypress', pos: [-9.6, 0, -19], h: 8.4, sway: 0.5 },
  { src: 'cypress', pos: [9.6, 0, -19], h: 8.1, sway: 0.5, flip: true },
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

const SOFT = new Set(['grass', 'bougainvillea']);

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
    const soft = SOFT.has(l.src);
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

/** Swap to the portrait placements (narrow phone frame) or back to the wide ones. */
export function fitLayers(meshes, aspect) {
  const portrait = aspect < 0.8;
  for (const m of meshes) {
    const l = m.userData.layer;
    if (!l.portrait) continue;
    const use = portrait ? l.portrait : l;
    m.position.set(...use.pos);
    const k = use.h / m.userData.baseH;
    m.scale.set(l.flip ? -k : k, k, k);
  }
}
