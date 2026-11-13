import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import * as S from './shaders.js';
import { sampleRig, springTo } from './rig.js';
import { sharedUniforms, buildSet, petalCloud, FOG } from './scenery.js';
import { addPaintedLayers, fitLayers } from './painted.js';
import { paintedDoves } from './birds.js';

/**
 * Shot list. The only camera move is the opening (user, 12 Nov): closed doors (0) → through the doorway
 * (0.55) → the mandap (1), where the camera then holds while the page scrolls. Whole t = a shot the page holds on; fractional = via points.
 * fov is the vertical fov for a 9:16 phone; other aspects keep the same horizontal coverage.
 * `push` = slow dolly applied while a shot is held (per unit of film time around the shot).
 */
export const SHOTS = [
  { t: 0, pos: [0, 3.1, 11.2], target: [0, 3.4, 0], fov: 50, push: [0, 0, -1.2] },
  { t: 0.55, pos: [0, 2.6, 0.4], target: [0, 2.8, -8], fov: 60, via: true },
  { t: 1, pos: [0, 3.9, -3.6], target: [0, 3.55, -16], fov: 50 },
];
const SHOT_INDEX = SHOTS.filter((k) => !k.via);

const PETALS = ['#f59e1b', '#e8681a', '#ffc83a', '#c8102e', '#b81f2c', '#ffb02e', '#f2a03a', '#d8392f'];
const STORM = ['#f59e1b', '#e8681a', '#ffc83a', '#c8102e', '#b81f2c', '#f2a03a', '#d8392f', '#ff8c1a'];
const COUNTS = {
  high: { storm: 900, shower: 420, ambient: 160, dpr: 1.75 },
  lite: { storm: 520, shower: 240, ambient: 90, dpr: 1.25 },
};

export async function createWorld(canvas, { tier = 'high', photoUrl, ganeshUrl } = {}) {
  const C = COUNTS[tier] || COUNTS.lite;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier === 'high', powerPreference: 'high-performance', alpha: false });
  const forcedDpr = parseFloat(new URLSearchParams(location.search).get('dpr')); // tuning / tests
  let dprCap = forcedDpr > 0 ? forcedDpr : C.dpr;
  const setDpr = () => renderer.setPixelRatio(forcedDpr > 0 ? dprCap : Math.min(window.devicePixelRatio || 1, dprCap));
  setDpr();
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(FOG);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.08, 900);
  scene.add(camera);
  const U = sharedUniforms();

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();

  // sky
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(500, 32, 16),
    new THREE.ShaderMaterial({
      vertexShader: S.skyVert,
      fragmentShader: S.skyFrag,
      uniforms: {
        uZenith: { value: new THREE.Color('#fbf7f0') },
        uHorizon: { value: new THREE.Color('#f8ead6') },
        uGlow: { value: new THREE.Color('#f0b48a') },
        uFlash: { value: 0 },
      },
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false, // the sky is the page's white: keep it exact, not tone-mapped grey
    }),
  );
  sky.renderOrder = -1;
  scene.add(sky);

  // lights
  scene.add(new THREE.HemisphereLight('#fff6e6', '#a48a64', 2.1));
  const sun = new THREE.DirectionalLight('#fff0d8', 2.4);
  sun.position.set(-8, 14, 10);
  scene.add(sun);
  const key = new THREE.PointLight('#ffb366', 7, 16, 1.6);
  key.position.set(0, 3.4, 5.2);
  const diyaL = new THREE.PointLight('#ff8a2a', 5, 7, 2);
  diyaL.position.set(-2, 0.6, 2.6);
  const diyaR = diyaL.clone();
  diyaR.position.x = 2;
  const inner = new THREE.PointLight('#ffc27a', 0, 18, 1.4);
  inner.position.set(0, 3.2, -3);
  const mandapL = new THREE.PointLight('#ffb05a', 30, 16, 1.5);
  mandapL.position.set(0, 4.6, -9.8);
  const colL = new THREE.PointLight('#ff9a4a', 40, 26, 1.4);
  colL.position.set(-11, 4, -40);
  scene.add(key, diyaL, diyaR, inner, mandapL, colL);

  const set = await buildSet(scene, U, { tier, photoUrl, ganeshUrl });

  // doorway light: glowing plane inside, haze in front, light pool on the ground, full-screen flash
  const floodMat = (shape, color = '#ffd9a0') =>
    new THREE.ShaderMaterial({
      vertexShader: S.floodVert,
      fragmentShader: S.floodFrag,
      uniforms: { uAmount: { value: 0 }, uColor: { value: new THREE.Color(color) }, uShape: { value: shape } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      premultipliedAlpha: true,
    });
  const doorway = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6), floodMat(0, '#ffc070'));
  doorway.position.set(0, 2.3, -1.2);
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), floodMat(0, '#ffb070'));
  haze.position.set(0, 2.6, 0.5);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 7), floodMat(1, '#ffc888'));
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0.03, 3.4);
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), floodMat(2, '#ffcf8a'));
  flash.position.z = -0.5;
  flash.renderOrder = 10;
  flash.material.depthTest = false;
  camera.add(flash);
  scene.add(doorway, haze, pool);

  // petals: storm (camera space), shower over the couple, ambient drift around the camera
  const storm = petalCloud(U, C.storm, { mode: 0, palette: STORM, scale: 1.25 });
  camera.add(storm);
  const shower = petalCloud(U, C.shower, { mode: 1, palette: PETALS, scale: 1 });
  shower.material.uniforms.uCenter.value.set(0, 3.1, -14.2);
  shower.material.uniforms.uBox.value.set(7, 6.4, 5);
  shower.material.uniforms.uDensity.value = 0;
  const ambient = petalCloud(U, C.ambient, { mode: 1, palette: PETALS, scale: 1 });
  ambient.material.uniforms.uBox.value.set(12, 9, 12);
  ambient.material.uniforms.uFall.value = 0.6;
  ambient.material.uniforms.uDensity.value = 0;
  scene.add(shower, ambient);

  // tap bursts: three camera-space clouds used round-robin
  const taps = [0, 1, 2].map(() => {
    const m = petalCloud(U, tier === 'high' ? 170 : 110, { mode: 2, palette: STORM, scale: 0.8 });
    m.material.uniforms.uTime.value = 99;
    m.userData.start = -99;
    camera.add(m);
    return m;
  });
  let tapSlot = 0;

  // daylight: no sky lanterns (they read as pale candle boxes on a white sky — user, 12 Nov)
  const dovesFx = paintedDoves(scene);
  // painted miniature layers (reference reel) stream in after the first frame — never block the cover
  let paintedMeshes = [];
  const painted = addPaintedLayers(scene, U, {
    onGate: () => set.doorFrame.forEach((m) => (m.visible = false)),
    // painted brass lamps hang where the 3D lanterns were; painted diyas sit where the gate's 3D diyas were
    extra: [
      // the painted rangoli carries its own ring of diyas → only the four by the doors stay as painted diyas
      ...set.doorDiyas.positions.slice(9).map(([x, , z], i) => ({ src: 'diya', pos: [x, 0, z], h: 0.34, flip: i % 2 === 1 })),
    ],
  }).then(async (meshes) => {
    paintedMeshes = meshes;
    fitLayers(meshes, W / H);
    if (meshes.loaded.has('couple-havan')) meshes.filter((m) => m.userData.layer.src === 'couple').forEach((m) => (m.visible = false));
    if (meshes.loaded.has('diya')) {
      // hide the gate's 3D diyas and their shader flames (the painted diyas carry their own flame); keep the warm halo
      const { mesh, flames, count } = set.doorDiyas;
      const zero = new THREE.Matrix4().makeScale(0, 0, 0);
      for (let i = 0; i < count; i++) mesh.setMatrixAt(i, zero);
      mesh.instanceMatrix.needsUpdate = true;
      const sz = flames.geometry.getAttribute('aSize');
      for (let i = 0; i < count; i++) sz.setX(i, 0);
      sz.needsUpdate = true;
    }
    // ivory carved door leaves, if painted
    const t = await new THREE.TextureLoader().loadAsync('/img/art/door-leaf-2.webp').catch(() => null);
    if (t) {
      t.colorSpace = THREE.SRGBColorSpace;
      const mk = (mirror) => {
        const tt = t.clone();
        if (mirror) {
          tt.wrapS = THREE.RepeatWrapping;
          tt.repeat.x = -1;
        }
        tt.needsUpdate = true;
        return new THREE.MeshStandardMaterial({ map: tt, color: '#cdbb98', roughness: 0.7, emissive: '#ffffff', emissiveMap: tt, emissiveIntensity: 0.06 });
      };
      set.doors.leafL.material[4] = mk(false);
      set.doors.leafR.material[4] = mk(true);
    }
    return meshes;
  });

  // ---------------------------------------------------------------- state
  const state = {
    scrollT: 1,
    t: 0,
    v: 0,
    override: 0, // film time forced by the opening (null = follow scroll)
    door: 0,
    stormStart: -1,
    paused: false,
    destroyed: false,
  };
  let W = 1;
  let H = 1;
  const resize = () => {
    W = Math.max(1, canvas.clientWidth || window.innerWidth);
    H = Math.max(1, canvas.clientHeight || window.innerHeight);
    renderer.setSize(W, H, false);
    fitLayers(paintedMeshes, W / H);
  };
  resize();
  window.addEventListener('resize', resize);

  const tmpPos = new THREE.Vector3();
  const tmpTgt = new THREE.Vector3();
  const fovFor = (vfov) => {
    const aspect = W / H;
    const ref = 9 / 16;
    if (aspect >= 1) return vfov * 0.95;
    const hHalf = Math.tan(THREE.MathUtils.degToRad(vfov / 2)) * ref;
    return Math.min(78, THREE.MathUtils.radToDeg(2 * Math.atan(hHalf / aspect)));
  };

  let lost = null;
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    state.paused = true;
    lost?.();
  });

  // FPS guard: sustained < 28 fps → drop resolution (never swaps the look)
  let frames = 0;
  let acc = 0;
  let strikes = 0;

  const NAME_OFFSET = new THREE.Vector3(0, -0.55, 0.02); // below the boota on the hero panel
  const NAME_EDGE = new THREE.Vector3(1.08, -0.55, 0.02);
  let lastName = [0, 0, 0];
  const clock = new THREE.Clock();
  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (state.paused || state.destroyed) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    U.uTime.value += dt;
    const time = U.uTime.value;

    // cover: a very slow dolly toward the doors while the guest reads
    if (world.coverDrift && state.override != null && state.override < 0.05 && state.door === 0) state.override = Math.min(0.05, state.override + dt * 0.0035);
    // film time
    if (state.override != null) {
      state.t = state.override;
      state.v = 0;
    } else {
      [state.t, state.v] = springTo(state.t, state.v, state.scrollT, dt, 0.45);
    }
    const t = state.t;
    const rig = sampleRig(SHOTS, t);
    const nearest = SHOT_INDEX.reduce((a, k) => (Math.abs(k.t - t) < Math.abs(a.t - t) ? k : a));
    const d = t - nearest.t;
    const w = Math.max(0, 1 - Math.abs(d) / 0.5);
    const ww = w * w * (3 - 2 * w);
    const push = nearest.push || [0, 0, 0];
    tmpPos.set(rig.pos[0] + push[0] * d * ww, rig.pos[1] + push[1] * d * ww, rig.pos[2] + push[2] * d * ww);
    // a breath of hand-held life on the closed doors only; the mandap shot holds perfectly still
    const breathe = 1 - smooth(0.6, 1, t);
    // phones (portrait): step 1.7 m closer on the hero so the names panel reads large
    if (W / H < 0.75) tmpPos.z -= 1.7 * smooth(0.6, 1, t);
    tmpPos.x += Math.sin(time * 0.31) * 0.06 * breathe;
    tmpPos.y += Math.sin(time * 0.43 + 1) * 0.04 * breathe;
    tmpTgt.set(rig.target[0], rig.target[1], rig.target[2]);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpTgt);
    camera.rotateZ(rig.roll + Math.sin(time * 0.27) * 0.004 * breathe);
    camera.fov = fovFor(rig.fov);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    U.uScale.value = renderer.getDrawingBufferSize(tmpTgt).y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

    // doors + light
    const door = state.door;
    set.doors.hingeL.rotation.y = -door * 1.95;
    set.doors.hingeR.rotation.y = door * 1.95;
    const flick = 0.85 + 0.15 * Math.sin(time * 13) * Math.sin(time * 7.3 + 1);
    diyaL.intensity = 5 * flick;
    diyaR.intensity = 5 * (1.7 - flick);
    inner.intensity = 60 * door;
    doorway.material.uniforms.uAmount.value = (smooth(0, 0.12, door) * (1 - smooth(0.25, 0.85, door)) * 1.1 + door * 0.18) * (1 - smooth(0.3, 0.6, t));
    haze.material.uniforms.uAmount.value = door * 0.3 * (1 - smooth(0.15, 0.45, t));
    pool.material.uniforms.uAmount.value = door * 0.9;
    flash.material.uniforms.uAmount.value = state.flash ?? 0;
    flash.scale.setScalar(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, W / H) * 1.2);

    // petals
    storm.material.uniforms.uTime.value = state.stormStart < 0 ? -10 : time - state.stormStart;
    ambient.material.uniforms.uTime.value = time;
    for (const m of taps) m.material.uniforms.uTime.value = time - m.userData.start;
    shower.material.uniforms.uTime.value = time;
    camera.getWorldDirection(tmpTgt);
    ambient.material.uniforms.uCenter.value.copy(camera.position).addScaledVector(tmpTgt, 5);
    ambient.material.uniforms.uDensity.value = state.ambient ?? 0;
    shower.material.uniforms.uDensity.value = (state.shower ?? 0) * (1 - smooth(1.6, 2.4, t));

    sky.material.uniforms.uFlash.value = 0;

    // pin the couple's names onto the arch on the mandap stage (DOM text, 3D position)
    if (t < 2.2) {
      tmpPos.copy(set.frame.position).add(NAME_OFFSET).project(camera);
      const nx = ((tmpPos.x + 1) / 2) * W;
      const ny = ((1 - tmpPos.y) / 2) * H;
      tmpTgt.copy(set.frame.position).add(NAME_EDGE).project(camera);
      const nw = Math.abs(((tmpTgt.x + 1) / 2) * W - nx) * 2;
      if (Math.abs(nx - lastName[0]) + Math.abs(ny - lastName[1]) + Math.abs(nw - lastName[2]) > 0.6) {
        const st = document.documentElement.style;
        st.setProperty('--nx', `${nx.toFixed(1)}px`);
        st.setProperty('--ny', `${ny.toFixed(1)}px`);
        st.setProperty('--nw', `${nw.toFixed(1)}px`);
        lastName = [nx, ny, nw];
      }
    }
    dovesFx.update(time, camera);
    renderer.render(scene, camera);

    // watchdog
    frames++;
    acc += dt;
    if (acc > 2) {
      const fps = frames / acc;
      frames = 0;
      acc = 0;
      if (fps < 28 && dprCap > 0.8) {
        if (++strikes >= 2) {
          dprCap = Math.max(0.75, dprCap - 0.35);
          setDpr();
          resize();
          strikes = 0;
        }
      } else strikes = 0;
      window.__worldFps = Math.round(fps);
    }
  };
  // warm up: compile every program before the first visible frame
  renderer.compile(scene, camera);
  raf = requestAnimationFrame(frame);

  const world = {
    renderer,
    scene,
    camera,
    state,
    setScrollTime(t) {
      state.scrollT = t;
    },
    setOverride(t) {
      if (t == null && state.override != null) {
        state.t = state.override;
        state.v = 0;
      }
      state.override = t;
    },
    setDoor(p) {
      state.door = p;
    },
    setFlash(a) {
      state.flash = a;
    },
    /** A still of exactly what the camera sees now (the intro's kankotri shows it inside, then zooms into it). */
    snapshot() {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/jpeg', 0.88);
    },
    storm() {
      state.stormStart = U.uTime.value;
      // test hook: simulate a GPU reset in the middle of the opening
      if (new URLSearchParams(location.search).has('forceContextLoss')) setTimeout(() => renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext(), 200);
    },
    /** Petals erupt from a tapped point (client px). */
    tapBurst(x, y) {
      const m = taps[tapSlot++ % taps.length];
      const d = 4.5;
      const th = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      m.material.uniforms.uCenter.value.set(((x / W) * 2 - 1) * d * th * (W / H), (1 - (y / H) * 2) * d * th, -d);
      m.userData.start = U.uTime.value;
    },
    setShower(v) {
      state.shower = v;
    },
    setAmbient(v) {
      state.ambient = v;
    },
    setPaused(p) {
      state.paused = p;
      if (!p) clock.getDelta();
    },
    onContextLost(cb) {
      lost = cb;
    },
    destroy() {
      state.destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        const m = o.material;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => {
          x.map?.dispose?.();
          x.uniforms?.uMap?.value?.dispose?.();
          x.dispose();
        });
      });
      env.dispose();
      renderer.dispose();
    },
  };
  return world;
}

function smooth(a, b, x) {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
}
