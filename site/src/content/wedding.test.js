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

  it('shows no couple photos (user, 12 Nov: "images appear forcefully") and starts with no music file', () => {
    expect(wedding.photos).toBeUndefined();
    expect(wedding.copy.interlude).toBeTruthy();
    expect(wedding.music.src).toBeNull();
  });
});
