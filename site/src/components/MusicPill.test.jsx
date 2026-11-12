import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import MusicPill from './MusicPill.jsx';

afterEach(cleanup);

function fakePlayer() {
  const ls = new Set();
  let playing = false;
  return {
    isPlaying: () => playing,
    onChange: (cb) => (ls.add(cb), () => ls.delete(cb)),
    toggle() { playing = !playing; ls.forEach((cb) => cb(playing)); },
    emit(v) { playing = v; ls.forEach((cb) => cb(v)); },
  };
}

describe('MusicPill', () => {
  it('renders nothing when there is no music file', () => {
    const { container } = render(<MusicPill player={fakePlayer()} src={null} label="x" />);
    expect(container.innerHTML).toBe('');
  });

  it('reflects playing state and toggles on tap', () => {
    const player = fakePlayer();
    render(<MusicPill player={player} src="/audio/theme.m4a" label="જુડી જોડી" />);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    act(() => player.emit(true));
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    act(() => btn.click());
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByText('જુડી જોડી')).toBeTruthy();
  });
});
