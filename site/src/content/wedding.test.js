import { describe, it, expect } from 'vitest';
import wedding from './wedding.js';

describe('wedding content', () => {
  const all = JSON.stringify(wedding);

  it('contains none of the removed bride-side items (spec §4.1)', () => {
    for (const banned of ['મોસાળ', 'સ્નેહાધિન', 'ટહુકો', 'નિમંત્રક', 'અંબાજી', 'કૃષ્ણ', '99240', '૯૯૨૪૦', 'રાધે કોમ્પ્લેક્ષ', 'ગણેશ સ્થાપના', 'મંડપ', 'ગ્રહશાંતિ', 'વરધ']) {
      expect(all, banned).not.toContain(banned);
    }
  });

  it('shows exactly hast melap and bhojan, in that order, in IST', () => {
    const enabled = wedding.events.filter((e) => e.enabled);
    expect(enabled.map((e) => e.id)).toEqual(['hast-melap', 'bhojan']);
    expect(enabled[0]).toMatchObject({ name: 'હસ્ત મેળાપ', timeText: 'સાંજે ૬:૦૦ કલાકે', start: '2026-12-13T18:00:00+05:30', highlight: true });
    expect(enabled[1]).toMatchObject({ name: 'ભોજન સમારંભ', timeText: 'સાંજે ૬:૩૦ કલાકે', start: '2026-12-13T18:30:00+05:30' });
  });

  it('has the fixed dates, venue and countdown target', () => {
    expect(wedding.countdownTarget).toBe('2026-12-13T18:00:00+05:30');
    expect(wedding.dateText).toBe('રવિવાર, ૧૩ ડિસેમ્બર ૨૦૨૬');
    expect(wedding.samvatText).toBe('સંવત ૨૦૮૩, માગશર સુદ-૪');
    expect(wedding.venue.address).toBe('અતિથી પાર્ટી પ્લોટ, દાવલપુરા રોડ, મુ. પેટલાદ તા. પેટલાદ જી. આણંદ');
    expect(wedding.invocation).toBe('॥ શ્રી ગણેશાય નમઃ ॥');
  });

  it('invitation is the neutral both-families text with the corrected wording', () => {
    const text = wedding.invitation.lines.join(' ');
    expect(text).toContain('નિર્ધારેલ છે');
    expect(text).toContain('ચિ. પ્રિન્સી');
    expect(text).toContain('ચિ. પાર્થકુમાર');
    expect(text).toContain('ધર્મેશભાઇ મનુભાઇ સોની');
    expect(text).toContain('ભાવેશકુમાર જીતેન્દ્રકુમાર મિસ્ત્રી');
    expect(wedding.signoff).toBe('મિસ્ત્રી પરિવાર · સોની પરિવાર');
  });

  it('shows no couple photos (user, 12 Nov: "images appear forcefully")', () => {
    expect(wedding.photos).toBeUndefined();
    expect(wedding.copy.interlude).toBeTruthy();
  });

  it('plays Judi Jodi on the 135 BPM beat grid: verse at 17.115 s, a 225-beat loop minus the 27-beat monologue', () => {
    const m = wedding.music;
    expect(m.src).toBe('/audio/judi-jodi.m4a');
    expect(m.startAt).toBe(0);
    expect(m.beat).toBeCloseTo(0.4444, 4);
    const onGrid = (t) => Math.abs((t - m.beatPhase) / m.beat - Math.round((t - m.beatPhase) / m.beat)) < 0.01;
    expect(m.verseAt).toBeCloseTo(17.115, 3);
    expect(onGrid(m.verseAt)).toBe(true);
    expect(m.loopStart).toBe(m.verseAt);
    // 225 beats of song, minus the 27-beat spoken passage (1:10.9–1:22.9) cut from the file
    expect((m.loopEnd - m.loopStart) / m.beat).toBeCloseTo(198, 1);
    expect(m.introLoop.every(onGrid)).toBe(true);
    expect(((m.introLoop[1] - m.introLoop[0]) / m.beat) % 3).toBeCloseTo(0, 1); // whole bars
  });
});
