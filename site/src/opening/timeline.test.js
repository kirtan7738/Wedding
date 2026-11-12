import { describe, it, expect, vi } from 'vitest';
import { buildOpeningTimeline, LABELS } from './timeline.js';

const els = () => {
  const mk = () => document.createElement('div');
  return { cover: mk(), flap: mk(), card: mk(), seal: mk(), sealCrack: mk(), hero: mk(), heroPhoto: mk(), heroNames: mk() };
};
const fxSpy = () => ({ sealLeak: vi.fn(), burst: vi.fn(), glow: vi.fn(), ambient: vi.fn() });

describe('buildOpeningTimeline', () => {
  it('places the beats at the spec times (§5.1)', () => {
    const tl = buildOpeningTimeline({ el: els(), fx: fxSpy(), onDone: () => {} });
    expect(LABELS).toEqual({ seal: 0, flap: 0.4, burst: 1.9, glow: 2.4, reveal: 2.8 });
    for (const [k, v] of Object.entries(LABELS)) expect(tl.labels[k]).toBeCloseTo(v, 5);
    expect(tl.duration()).toBeGreaterThanOrEqual(4.3);
    expect(tl.duration()).toBeLessThanOrEqual(4.8);
    tl.kill();
  });

  it('fires the celebration burst exactly once, at the burst beat', () => {
    const fx = fxSpy();
    const tl = buildOpeningTimeline({ el: els(), fx, onDone: () => {} });
    tl.pause();
    tl.seek(1.8, false);
    expect(fx.burst).not.toHaveBeenCalled();
    tl.seek(2.0, false);
    expect(fx.burst).toHaveBeenCalledTimes(1);
    tl.seek(3.0, false);
    expect(fx.burst).toHaveBeenCalledTimes(1);
    expect(fx.sealLeak).toHaveBeenCalledTimes(1);
    expect(fx.glow).toHaveBeenCalled();
    tl.kill();
  });

  it('releases the page (onCoverGone) as soon as the cover has faded — before the reveal finishes', () => {
    const onCoverGone = vi.fn();
    const tl = buildOpeningTimeline({ el: els(), fx: fxSpy(), onDone: () => {}, onCoverGone });
    tl.pause();
    tl.seek(LABELS.glow + 0.7, false);
    expect(onCoverGone).not.toHaveBeenCalled();
    tl.seek(LABELS.glow + 0.8, false);
    expect(onCoverGone).toHaveBeenCalledTimes(1);
    tl.kill();
  });

  it('calls onDone at the end and turns ambient petals on', () => {
    const fx = fxSpy();
    const onDone = vi.fn();
    const tl = buildOpeningTimeline({ el: els(), fx, onDone });
    tl.pause();
    tl.seek(tl.duration(), false);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(fx.ambient).toHaveBeenCalledWith(true);
    tl.kill();
  });
});
