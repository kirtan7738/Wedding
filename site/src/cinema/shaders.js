/* GLSL for the cinema world. All custom materials end with three's tonemapping + colorspace chunks so they
   sit in the same colour pipeline as the MeshStandard scenery. Fog is done by hand (exp²) so additive
   lights can fade to black instead of to the fog colour. */

const FOG_V = /* glsl */ `
  uniform float uFogDensity;
  varying float vFog;
`;
const fogCalc = (mv) => /* glsl */ `vFog = 1.0 - exp(-pow(uFogDensity * length(${mv}.xyz), 2.0));`;
const OUT = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

// ------------------------------------------------------------------ glow points (fairy lights, bokeh, flames, stars)
export const glowVert = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uScale;
  uniform float uMirror;
  uniform float uIntensity;
  uniform float uTwinkle;
  uniform float uBokeh;
  ${FOG_V}
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    if (uMirror > 0.5) {
      p.y = -p.y;
      p.x += sin(uTime * 2.2 + p.z * 0.9 + p.y) * 0.05;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float tw = 1.0 - uTwinkle + uTwinkle * (0.55 + 0.45 * sin(uTime * (1.2 + fract(aPhase * 7.31) * 2.6) + aPhase * 6.2831));
    gl_PointSize = clamp(aSize * uScale / max(0.05, -mv.z), 0.0, mix(600.0, 140.0, uBokeh));
    ${fogCalc('mv')}
    vColor = aColor;
    float near = mix(smoothstep(0.25, 1.2, -mv.z), smoothstep(3.0, 9.0, -mv.z), uBokeh);
    vAlpha = tw * uIntensity * near * (uMirror > 0.5 ? 0.38 : 1.0) * (1.0 - vFog);
    gl_Position = projectionMatrix * mv;
  }
`;
export const glowFrag = /* glsl */ `
  uniform float uBokeh;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 q = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(q, q);
    if (r2 > 1.0) discard;
    float glow = exp(-r2 * 5.0) * 0.7 + exp(-r2 * 38.0) * 0.9;
    float disc = smoothstep(1.0, 0.82, sqrt(r2)) * (0.35 + 0.35 * r2);
    float a = mix(glow, disc, uBokeh) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ flower impostors (marigold, rose, jasmine, leaf)
export const flowerVert = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aSize;
  attribute float aType;
  attribute float aPhase;
  attribute float aHang;
  uniform float uTime;
  uniform float uWind;
  ${FOG_V}
  varying vec2 vUv;
  varying float vType;
  varying float vPhase;
  void main() {
    vec3 c = aOffset;
    float sway = sin(uTime * 0.9 + aPhase * 6.2831 + c.x * 0.3) * 0.05 * aHang * uWind;
    c.x += sway + sin(uTime * 2.3 + aPhase * 21.0) * 0.008 * aHang;
    c.z += cos(uTime * 0.7 + aPhase * 6.2831) * 0.03 * aHang * uWind;
    vec4 mv = modelViewMatrix * vec4(c, 1.0);
    vec2 k = position.xy;
    float leaf = step(2.5, aType) * step(aType, 3.5);
    // leaves hang down and tilt with the string; flowers are round
    float ang = (aPhase - 0.5) * 0.9;
    k = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * k;
    mv.xy += k * aSize * mix(vec2(1.0), vec2(0.62, 1.7), leaf);
    vUv = position.xy * 2.0;
    vType = aType;
    vPhase = aPhase;
    ${fogCalc('mv')}
    gl_Position = projectionMatrix * mv;
  }
`;
export const flowerFrag = /* glsl */ `
  uniform vec3 uFogColor;
  uniform vec3 uWarm;
  varying vec2 vUv;
  varying float vType;
  varying float vPhase;
  varying float vFog;
  void main() {
    vec2 q = vUv;
    float r = length(q);
    float ang = atan(q.y, q.x);
    vec3 col;
    vec3 L = normalize(vec3(-0.45, 0.65, 0.65));
    if (vType > 2.5 && vType < 3.5) {
      // mango leaf
      float e = q.x * q.x / 0.22 + q.y * q.y;
      if (e > 1.0) discard;
      float vein = smoothstep(0.06, 0.0, abs(q.x)) * 0.35;
      float side = q.x * 1.4;
      col = mix(vec3(0.05, 0.22, 0.03), vec3(0.18, 0.42, 0.08), 0.5 + side * 0.4);
      col *= 1.0 - vein;
      col *= 0.65 + 0.35 * (1.0 - e);
    } else {
      float frill = 0.86 + 0.07 * sin(ang * 17.0 + vPhase * 31.0) + 0.05 * sin(ang * 7.0 + vPhase * 11.0);
      if (vType > 3.5) frill = 0.78 + 0.18 * pow(abs(cos(ang * 2.5 + vPhase * 9.0)), 3.0); // jasmine bud: 5 petals
      if (r > frill) discard;
      float z = sqrt(max(0.0, 1.0 - r * r));
      vec3 n = normalize(vec3(q * 0.9, z));
      vec3 base;
      if (vType < 0.5) base = vec3(0.98, 0.42, 0.03);       // marigold orange
      else if (vType < 1.5) base = vec3(1.0, 0.68, 0.05);   // marigold yellow
      else if (vType < 2.5) base = vec3(0.62, 0.02, 0.06);  // rose
      else base = vec3(1.0, 0.95, 0.86);                    // jasmine
      float layers = fract(r * 5.0 - 0.18 * sin(ang * 9.0 + vPhase * 10.0));
      float crevice = smoothstep(0.0, 0.45, layers);
      float spikes = 0.5 + 0.5 * sin(ang * 26.0 + r * 18.0 + vPhase * 7.0);
      col = base * (0.5 + 0.5 * crevice) * (0.82 + 0.18 * spikes);
      float diff = max(dot(n, L), 0.0);
      col = col * (0.28 + 0.95 * diff) + base * uWarm * 0.18 * (1.0 - z);
      col = mix(col, base * 0.32, smoothstep(0.2, 0.0, r) * 0.8);
      col *= smoothstep(1.02, 0.6, r / frill) * 0.35 + 0.65;
    }
    col = mix(col, uFogColor, vFog);
    gl_FragColor = vec4(col, 1.0);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ GPU petals (storm through the doors, shower, ambient drift)
export const petalsVert = /* glsl */ `
  attribute vec4 aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uMode;      // 0 storm (camera space), 1 volume (world wrap)
  uniform vec3 uCenter;
  uniform vec3 uBox;
  uniform float uDensity;
  uniform float uScale;
  uniform float uFall;
  uniform vec3 uDir;
  ${FOG_V}
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vColor;
  vec3 rot(vec3 v, vec3 k, float a) {
    float c = cos(a), s = sin(a);
    return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
  }
  void main() {
    vec3 axis = normalize(aSeed.xyz - 0.5 + vec3(0.001));
    float vis = 1.0;
    vec3 p;
    float spin;
    if (uMode > 2.5) {
      // pour: petals leave the hand (uCenter) toward uDir with a little spread, arc down under gravity, flutter, fade
      float life = 3.4;
      float t = mod(uTime + aSeed.w * life, life);
      vec3 v0 = uDir * (0.35 + aSeed.x * 0.55) + vec3((aSeed.y - 0.5) * 0.35, (aSeed.z - 0.2) * 0.25, (aSeed.x - 0.5) * 0.4);
      p = uCenter + v0 * t + vec3(sin(t * 2.4 + aSeed.w * 9.0) * 0.12, -0.42 * uFall * t * t, cos(t * 1.9 + aSeed.y * 7.0) * 0.08);
      vis = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(life * 0.7, life, t)) * step(aSeed.w, uDensity);
      spin = t * (2.0 + aSeed.z * 4.0) + aSeed.x * 6.28;
    } else if (uMode > 1.5) {
      // tap burst (camera space): petals erupt from uCenter toward the viewer, then fall and fade
      float t = uTime - aSeed.z * 0.08;
      vec3 dir = normalize(aSeed.xyz - 0.5 + vec3(0.001));
      dir.z = abs(dir.z) * 0.7 + 0.15;
      float sp = 2.2 + aSeed.w * 3.4;
      p = uCenter + dir * sp * (1.0 - exp(-max(t, 0.0) * 2.6)) / 1.3 + vec3(sin(t * 2.0 + aSeed.w * 9.0) * 0.12, -0.55 * t * t, 0.0);
      vis = step(0.0, t) * (1.0 - smoothstep(2.2, 3.2, t));
      spin = t * (3.0 + aSeed.z * 5.0) + aSeed.x * 6.28;
    } else if (uMode < 0.5) {
      float t = uTime - aSeed.z * 1.1;
      vis = step(0.0, t) * step(aSeed.w, uDensity);
      float z0 = -24.0 - aSeed.x * 34.0;
      float speed = 15.0 + aSeed.y * 18.0;
      float z = z0 + speed * max(t, 0.0);
      vis *= step(z, 0.6);
      float ang = aSeed.w * 6.2831 * 7.0 + t * (0.5 + aSeed.x * 0.9);
      float rad = 0.25 + pow(fract(aSeed.w * 13.7 + aSeed.y), 0.8) * 3.4;
      p = vec3(cos(ang) * rad * 1.15, sin(ang) * rad * 1.5, z);
      spin = t * (2.5 + aSeed.z * 5.0) + aSeed.x * 6.28;
    } else {
      vec3 base = aSeed.xyz * uBox * 3.0;
      float t = uTime;
      vec3 drift = vec3(sin(aSeed.w * 6.28) * 0.35, -(0.5 + aSeed.y * 0.55) * uFall, cos(aSeed.w * 6.28) * 0.25) * t;
      vec3 sw = vec3(sin(t * 1.3 + aSeed.w * 20.0) * 0.3, 0.0, cos(t * 1.1 + aSeed.x * 20.0) * 0.3);
      vec3 local = mod(base + drift - uCenter + uBox * 0.5, uBox) - uBox * 0.5;
      vec3 e = abs(local) / (uBox * 0.5);
      vis = step(aSeed.w, uDensity) * smoothstep(1.0, 0.8, max(max(e.x, e.y), e.z));
      p = uCenter + local + sw;
      spin = t * (1.2 + aSeed.z * 2.5) + aSeed.x * 6.28;
    }
    float s = (0.14 + aSeed.y * 0.12) * uScale * vis;
    if (uMode > 0.5 && uMode < 1.5) s *= smoothstep(0.9, 2.8, -(modelViewMatrix * vec4(p, 1.0)).z); // no giant petals on the lens
    vec3 lp = rot(position * s, axis, spin);
    vec3 n = rot(normal, axis, spin);
    vec4 mv = modelViewMatrix * vec4(p + lp, 1.0);
    vNormal = normalize(normalMatrix * n);
    vUv = uv;
    vColor = aColor;
    ${fogCalc('mv')}
    gl_Position = projectionMatrix * mv;
  }
`;
export const petalsFrag = /* glsl */ `
  uniform vec3 uFogColor;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vFog;
  void main() {
    vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 L = normalize(vec3(-0.3, 0.7, 0.65));
    float diff = max(dot(n, L), 0.0);
    float back = max(dot(-n, L), 0.0);
    float across = abs(vUv.x - 0.5) * 2.0;
    float vein = smoothstep(0.08, 0.0, abs(vUv.x - 0.5)) * 0.18;
    vec3 base = mix(vColor * 1.1, vColor * 0.62, smoothstep(0.3, 1.0, across));
    base = mix(base, vec3(1.0, 0.93, 0.8) * vColor.r, (1.0 - smoothstep(0.0, 0.3, vUv.y)) * 0.3);
    vec3 col = base * (0.42 + 0.75 * diff) + vColor * back * 0.45 - vColor * vein;
    col = mix(col, uFogColor, vFog);
    gl_FragColor = vec4(col, 1.0);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ fireworks (rockets + bursts, all GPU)
export const fireVert = /* glsl */ `
  attribute vec3 aDir;
  attribute float aBurst;
  attribute float aRocket;
  attribute float aRand;
  uniform float uTime;
  uniform vec3 uOrigin[8];
  uniform float uStart[8];
  uniform vec3 uColor[8];
  uniform float uScale;
  uniform float uMirror;
  ${FOG_V}
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    int b = int(aBurst);
    float age = uTime - uStart[b];
    vec3 o = uOrigin[b];
    vec3 p;
    float a = 0.0;
    float size = 0.0;
    if (aRocket > 0.5) {
      float rise = 1.1;
      float k = clamp((age + rise) / rise, 0.0, 1.0);
      p = o - vec3(0.0, (1.0 - k) * (1.0 - k) * 14.0, 0.0) + vec3(sin(age * 30.0) * 0.05, 0.0, 0.0);
      a = step(-rise, age) * step(age, 0.0);
      size = 0.35;
      vColor = vec3(1.0, 0.85, 0.55);
    } else {
      float speed = 5.0 + aRand * 4.0;
      float k = 1.0 - exp(-max(age, 0.0) * 2.4);
      p = o + aDir * speed * k + vec3(0.0, -0.9 * age * age, 0.0);
      float life = 2.2 + aRand * 0.9;
      a = step(0.0, age) * smoothstep(life, life * 0.45, age);
      a *= 0.75 + 0.25 * sin(age * 28.0 + aRand * 50.0);
      size = mix(0.55, 0.22, clamp(age / life, 0.0, 1.0));
      vColor = uColor[b] * mix(1.3, 1.0, smoothstep(0.0, 0.5, age));
    }
    if (uMirror > 0.5) { p.y = -p.y; a *= 0.3; }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(size * uScale / max(0.1, -mv.z), 0.0, 120.0);
    ${fogCalc('mv')}
    vAlpha = a * (1.0 - vFog * 0.6);
    gl_Position = projectionMatrix * mv;
  }
`;
export const fireFrag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 q = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(q, q);
    if (r2 > 1.0 || vAlpha <= 0.001) discard;
    float a = (exp(-r2 * 6.0) * 0.8 + exp(-r2 * 40.0)) * vAlpha;
    gl_FragColor = vec4(vColor * a * 1.6, a);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ sky dome
export const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;
export const skyFrag = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGlow;
  uniform float uFlash;
  varying vec3 vDir;
  void main() {
    float h = vDir.y;
    vec3 col = mix(uHorizon, uZenith, smoothstep(-0.02, 0.45, h));
    col += uGlow * exp(-abs(h) * 9.0) * (0.6 + 0.4 * smoothstep(0.0, 1.0, -vDir.z));
    col += vec3(1.0, 0.75, 0.4) * uFlash * smoothstep(-0.1, 0.6, h);
    gl_FragColor = vec4(col, 1.0);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ water
export const waterVert = /* glsl */ `
  ${FOG_V}
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vec4 mv = viewMatrix * w;
    ${fogCalc('mv')}
    gl_Position = projectionMatrix * mv;
  }
`;
export const waterFrag = /* glsl */ `
  uniform float uTime;
  uniform float uFogDensity;
  uniform vec3 uDeep;
  uniform vec3 uSky;
  uniform vec3 uFogColor;
  varying vec3 vWorld;
  varying float vFog;
  void main() {
    vec3 V = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - max(V.y, 0.0), 4.0);
    float rip = sin(vWorld.x * 1.7 + uTime * 0.9) * sin(vWorld.z * 2.3 - uTime * 1.2) + 0.5 * sin(vWorld.x * 5.1 - vWorld.z * 3.7 + uTime * 2.0);
    vec3 col = mix(uDeep, uSky, clamp(fres * 0.22 + rip * 0.06, 0.0, 1.0));
    col += vec3(1.0, 0.97, 0.9) * pow(max(rip, 0.0), 6.0) * 0.1; // sun glints
    // per-pixel haze: the lake is one big quad, so vertex fog would wash it out everywhere
    float fogF = 1.0 - exp(-pow(uFogDensity * length(cameraPosition - vWorld), 2.0));
    col = mix(col, uFogColor, fogF);
    gl_FragColor = vec4(col, 0.93);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ silk backdrop with folds
export const silkVert = /* glsl */ `
  uniform float uTime;
  ${FOG_V}
  varying vec2 vUv;
  varying float vShade;
  void main() {
    vUv = uv;
    vec3 p = position;
    float f = sin(uv.x * 62.0) * 0.5 + sin(uv.x * 23.0 + 1.3) * 0.5;
    p.z += f * 0.07 + sin(uTime * 0.6 + uv.x * 6.0) * 0.03 * uv.y;
    vShade = 0.62 + 0.38 * (0.5 + 0.5 * cos(uv.x * 62.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    ${fogCalc('mv')}
    gl_Position = projectionMatrix * mv;
  }
`;
export const silkFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uFogColor;
  uniform float uLight;
  varying vec2 vUv;
  varying float vShade;
  varying float vFog;
  void main() {
    vec3 c = texture2D(uMap, vUv * vec2(4.0, 3.0)).rgb;
    float border = step(vUv.y, 0.06) + step(0.94, vUv.y);
    c = mix(c, vec3(0.95, 0.72, 0.3), border * 0.85);
    float spot = exp(-pow(length((vUv - vec2(0.5, 0.55)) * vec2(1.4, 1.0)) * 1.8, 2.0));
    c *= vShade * (0.25 + uLight * (0.5 + 0.9 * spot));
    c = mix(c, uFogColor, vFog);
    gl_FragColor = vec4(c, 1.0);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ door light flood (additive planes / shafts)
export const floodVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const floodFrag = /* glsl */ `
  uniform float uAmount;
  uniform vec3 uColor;
  uniform float uShape;   // 0 = doorway plane, 1 = shaft, 2 = full-screen flash
  varying vec2 vUv;
  void main() {
    float a;
    if (uShape < 0.5) {
      vec2 q = vUv - 0.5;
      a = exp(-dot(q * vec2(1.6, 1.0), q * vec2(1.6, 1.0)) * 3.0);
    } else if (uShape < 1.5) {
      a = (1.0 - vUv.y) * smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x) * 0.5;
    } else {
      vec2 q = vUv - 0.5;
      a = 0.75 + 0.25 * exp(-dot(q, q) * 5.0);
    }
    a *= uAmount;
    gl_FragColor = vec4(uColor * a, a);
    ${OUT}
  }
`;

// ------------------------------------------------------------------ diya flames (teardrop, flickering, upright billboards)
export const flameVert = /* glsl */ `
  attribute vec3 aOffset;
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  ${FOG_V}
  varying vec2 vUv;
  varying float vPhase;
  void main() {
    vec4 mv = modelViewMatrix * vec4(aOffset, 1.0);
    float sway = sin(uTime * 3.1 + aPhase * 17.0) * 0.12 + sin(uTime * 7.3 + aPhase * 5.0) * 0.05;
    vec2 k = vec2(position.x * 0.62 + sway * (position.y + 0.5), position.y + 0.5);
    float stretch = 1.0 + 0.12 * sin(uTime * 9.0 + aPhase * 31.0);
    mv.xy += vec2(k.x, k.y * stretch) * aSize;
    vUv = vec2(position.x * 2.0, position.y + 0.5);
    vPhase = aPhase;
    ${fogCalc('mv')}
    gl_Position = projectionMatrix * mv;
  }
`;
export const flameFrag = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vPhase;
  varying float vFog;
  void main() {
    float y = vUv.y;
    float x = vUv.x + sin(y * 7.0 + uTime * 13.0 + vPhase * 9.0) * 0.07 * y;
    float w = sin(3.14159 * pow(clamp(y, 0.0, 1.0), 0.55)) * 0.55 * (1.0 - y * 0.35);
    float d = abs(x) / max(w, 1e-3);
    if (d > 1.0 || y <= 0.0 || y >= 1.0) discard;
    float edge = smoothstep(1.0, 0.55, d);
    float core = smoothstep(0.75, 0.0, d) * smoothstep(0.85, 0.15, y);
    vec3 col = mix(vec3(1.0, 0.36, 0.05), vec3(1.0, 0.75, 0.25), edge);
    col = mix(col, vec3(1.0, 0.97, 0.85), core);
    col = mix(col, vec3(0.35, 0.45, 1.0), smoothstep(0.12, 0.0, y) * 0.6 * edge);
    float a = edge * (1.0 - smoothstep(0.7, 1.0, y) * 0.6) * (1.0 - vFog);
    gl_FragColor = vec4(col * a * 1.6, a);
    ${OUT}
  }
`;
