import * as THREE from 'three';

/**
 * A single marigold/rose petal as a real 3D surface: narrow at the base, widest near a rounded tip,
 * cupped across its width and gently curled along its length. ~1 unit long, centred at the origin.
 * uv.x runs across the petal (0..1), uv.y from base (0) to tip (1) — the petal shader relies on it.
 */
export function petalGeometry({ across = 8, along = 14, cup = 0.13, curl = 0.09 } = {}) {
  const pos = [];
  const uv = [];
  const idx = [];
  const maxHalf = 0.34;
  for (let j = 0; j <= along; j++) {
    const v = j / along;
    const half = maxHalf * Math.pow(Math.sin(Math.PI * (0.04 + v * 0.88)), 0.72) * (1 - 0.18 * v);
    for (let i = 0; i <= across; i++) {
      const u = i / across;
      const s = u * 2 - 1;
      const x = s * half;
      const y = v - 0.5;
      const z = cup * s * s * (half / maxHalf) + curl * (v - 0.5) * (v - 0.5);
      pos.push(x, y, z);
      uv.push(u, v);
    }
  }
  const row = across + 1;
  for (let j = 0; j < along; j++) {
    for (let i = 0; i < across; i++) {
      const a = j * row + i;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // centre the ink (cup/curl shift z only; keep x/y centred)
  return g;
}
