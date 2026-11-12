// Dev/tuning panel — loaded only when the URL contains ?tune (never part of the main bundle).
// FPS overlay + quick controls to replay the opening and switch render tiers on a real phone.
export async function startTune() {
  const [{ default: GUI }, { default: Stats }] = await Promise.all([import('lil-gui'), import('stats-gl')]);
  const stats = new Stats({ trackGPU: false, minimal: true });
  document.body.appendChild(stats.dom);
  stats.dom.style.cssText += ';position:fixed;top:0;right:0;left:auto;z-index:99;';
  const loop = () => {
    stats.update();
    requestAnimationFrame(loop);
  };
  loop();

  const url = new URL(location.href);
  const gui = new GUI({ title: 'Tune' });
  gui.domElement.style.zIndex = '99';
  const state = { tier: url.searchParams.get('tier') || 'auto' };
  gui
    .add(state, 'tier', ['auto', 'high', 'lite', '2d', 'static'])
    .name('Render tier')
    .onChange((t) => {
      if (t === 'auto') url.searchParams.delete('tier');
      else url.searchParams.set('tier', t);
      location.href = url.toString();
    });
  gui.add(
    {
      replay() {
        try {
          sessionStorage.removeItem('kankotri-opened');
        } catch {
          /* ignore */
        }
        location.reload();
      },
    },
    'replay',
  ).name('Replay opening');
  gui.close();
}
