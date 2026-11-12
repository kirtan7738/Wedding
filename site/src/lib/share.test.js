import { describe, it, expect } from 'vitest';
import { whatsappShareUrl, googleCalendarUrl, buildIcs } from './share.js';

const ev = {
  title: 'પ્રિન્સી ❀ પાર્થ — હસ્ત મેળાપ',
  start: '2026-12-13T18:00:00+05:30',
  end: '2026-12-13T21:00:00+05:30',
  location: 'અતિથી પાર્ટી પ્લોટ, પેટલાદ',
  details: 'શુભ લગ્ન',
};

describe('whatsappShareUrl', () => {
  it('encodes message and url on separate lines', () => {
    expect(whatsappShareUrl('શુભ લગ્ન', 'https://x.vercel.app')).toBe(
      'https://wa.me/?text=' + encodeURIComponent('શુભ લગ્ન\nhttps://x.vercel.app'),
    );
  });
});

describe('googleCalendarUrl', () => {
  it('uses UTC timestamps', () => {
    const u = new URL(googleCalendarUrl(ev));
    expect(u.origin + u.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(u.searchParams.get('action')).toBe('TEMPLATE');
    expect(u.searchParams.get('dates')).toBe('20261213T123000Z/20261213T153000Z');
    expect(u.searchParams.get('text')).toBe(ev.title);
    expect(u.searchParams.get('location')).toBe(ev.location);
  });
});

describe('buildIcs', () => {
  const ics = buildIcs(ev);
  it('is a CRLF VCALENDAR with UTC start/end', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('DTSTART:20261213T123000Z\r\n');
    expect(ics).toContain('DTEND:20261213T153000Z\r\n');
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });
  it('keeps Gujarati summary and escapes commas', () => {
    expect(ics).toContain('SUMMARY:પ્રિન્સી ❀ પાર્થ — હસ્ત મેળાપ\r\n');
    expect(ics).toContain('LOCATION:અતિથી પાર્ટી પ્લોટ\\, પેટલાદ\r\n');
  });
});
