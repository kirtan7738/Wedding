export function whatsappShareUrl(message, url) {
  return 'https://wa.me/?text=' + encodeURIComponent(`${message}\n${url}`);
}

/** ISO (with offset) → 'YYYYMMDDTHHMMSSZ' in UTC */
const utcStamp = (iso) =>
  new Date(Date.parse(iso)).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function googleCalendarUrl({ title, start, end, location, details }) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    location,
    details,
    ctz: 'Asia/Kolkata',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

const icsEscape = (s) =>
  String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

export function buildIcs({ title, start, end, location, details }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//princy-parth//invite//GU',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${utcStamp(start)}-princy-parth@invite`,
    `DTSTAMP:${utcStamp(start)}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${icsEscape(title)}`,
    `LOCATION:${icsEscape(location)}`,
    `DESCRIPTION:${icsEscape(details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}
