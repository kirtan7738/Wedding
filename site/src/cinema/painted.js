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
  { src: 'chhatri', pos: [-7.4, 0, -21], h: 6.4 },
  { src: 'chhatri', pos: [7.4, 0, -21], h: 6.4, flip: true },
  { src: 'cypress', pos: [-4.5, 0, -18], h: 8.6, sway: 0.5 },
  { src: 'cypress', pos: [4.5, 0, -18], h: 8.3, sway: 0.5, flip: true },
  { src: 'gate', pos: [0, 0, -16], h: 9, tag: 'hero-gate' },
  // kalash on the arch's floor at the foot of the names panel
  { src: 'kalash', pos: [-0.78, 0.86, -15.97], h: 0.78 },
  { src: 'kalash', pos: [0.78, 0.86, -15.97], h: 0.78, flip: true },
  // marigold strands in the hero gate's arch, in front of the names panel, tops hidden behind the crown
  ...[-0.85, -0.6375, -0.425, -0.2125, 0, 0.2125, 0.425, 0.6375, 0.85].map((x, i) => ({ src: `strand${((i + 3) % 7) + 1}`, pos: [x, 6.6 - (i % 2 ? 2.3 : 2.65), -16.06], h: i % 2 ? 2.3 : 2.65, sway: 0.5, hang: true })),
  // painted peacocks on the gate's eaves (scaled from the cover placement)
  { src: 'peacock', pos: [-1.66, 4.27, -15.7], h: 2.5 },
  { src: 'peacock', pos: [1.66, 4.27, -15.7], h: 2.5, flip: true },
  { src: 'plantain', pos: [-3.5, 0, -14.6], h: 4.3, sway: 0.7 },
  { src: 'plantain', pos: [3.5, 0, -14.6], h: 4.1, sway: 0.7, flip: true },
  // brass lamps hang from gold wall-brackets on the gate's outer pillars (scenery.js draws the brackets)
  { src: 'lamp', pos: [-3.12, 3.95, -15.85], h: 2.4 },
  { src: 'lamp', pos: [3.12, 3.95, -15.85], h: 2.4 },
  { src: 'bougainvillea', pos: [-2.15, 0, -14], h: 1.35, sway: 0.25 },
  { src: 'bougainvillea', pos: [2.15, 0, -14], h: 1.3, sway: 0.25, flip: true },
  { src: 'diya', pos: [-0.7, 0, -13.5], h: 0.3 },
  { src: 'diya', pos: [0.7, 0, -13.5], h: 0.3, flip: true },
  { src: 'diya', pos: [-1.35, 0, -13.3], h: 0.3, flip: true },
  { src: 'diya', pos: [1.35, 0, -13.3], h: 0.3 },
  // garden beds across the whole foreground, two rows deep
  ...[-9.2, -6.9, -4.6, -2.3, 0, 2.3, 4.6, 6.9, 9.2].map((x, i) => ({ src: 'grass', pos: [x, 0, -12.7], h: 1.25, flip: i % 2 === 1 })),
  ...[-8, -5.7, -3.4, -1.15, 1.15, 3.4, 5.7, 8].map((x, i) => ({ src: 'grass', pos: [x, 0, -11.6], h: 1.2, flip: i % 2 === 0 })),
  ...[-6.8, -4.5, -2.25, 0, 2.25, 4.5, 6.8].map((x, i) => ({ src: 'grass', pos: [x, 0, -10.5], h: 1.15, flip: i % 2 === 1 })),
  ...[-5.6, -3.4, -1.15, 1.15, 3.4, 5.6].map((x, i) => ({ src: 'grass', pos: [x, -0.15, -9.4], h: 1.1, flip: i % 2 === 0 })),
  { src: 'bougainvillea', pos: [-3.9, 0, -10.2], h: 1.5, sway: 0.25 },
  { src: 'bougainvillea', pos: [3.9, 0, -10.2], h: 1.45, sway: 0.25, flip: true },
  // far shore: a palace skyline of chhatris and cypress across the lake (countdown → finale)
  ...[-70, -48, -30, -12, 8, 26, 46, 68].map((x, i) => ({ src: 'chhatri', pos: [x, 0, -175 - (i % 3) * 8], h: 16 + (i % 3) * 5, glow: 0.05, far: true, flip: i % 2 === 1 })),
  ...[-60, -40, -21, -3, 17, 36, 57].map((x, i) => ({ src: 'cypress', pos: [x, 0, -168 - (i % 2) * 6], h: 20 + (i % 3) * 4, glow: 0.04, far: true, flip: i % 2 === 0 })),
];

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
    const mat = new THREE.MeshBasicMaterial({ map: t, alphaTest: 0.45, side: THREE.DoubleSide, toneMapped: false, fog: false });
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
