/**
 * Single source of truth for every word, time, link, photo and song on the site.
 * Gujarati text: spec §5 + research/kankotri-content.md. Elders of BOTH families proofread before launch.
 * Bold spans in invitation lines are marked with **…**.
 */
const SITE_URL = (import.meta.env && import.meta.env.VITE_SITE_URL) || 'https://princy-parth.vercel.app';

const MAPS_QUERY = 'Atithi Party Plot, Davalpura Road, Petlad, Anand, Gujarat';

const wedding = {
  couple: { bride: 'પ્રિન્સી', groom: 'પાર્થકુમાર', groomShort: 'પાર્થ', monogram: 'પ ✤ પ' },
  invocation: '॥ શ્રી ગણેશાય નમઃ ॥',
  heading: 'મંગલ પરિણય',
  coverTitle: 'શુભ લગ્ન',
  dateText: 'રવિવાર, ૧૩ ડિસેમ્બર ૨૦૨૬',
  dateShort: 'રવિવાર, તા. ૧૩/૧૨/૨૦૨૬',
  samvatText: 'સંવત ૨૦૮૩, માગશર સુદ-૪',
  dateISO: '2026-12-13',
  countdownTarget: '2026-12-13T18:00:00+05:30',

  invitation: {
    lines: [
      'સહર્ષ જણાવવાનું કે',
      '**શ્રી ભાવેશકુમાર જીતેન્દ્રકુમાર મિસ્ત્રી** તથા **અ.સૌ. અર્પિતાબેન ભાવેશકુમાર મિસ્ત્રી**ની સુપુત્રી',
      '**ચિ. પ્રિન્સી**',
      'ના શુભ લગ્ન',
      'ગામ પોરડા નિવાસી હાલ પેટલાદ **શ્રી ધર્મેશભાઇ મનુભાઇ સોની** તથા **અ.સૌ. સોનલબેન ધર્મેશભાઇ સોની**ના સુપુત્ર',
      '**ચિ. પાર્થકુમાર**',
      'સાથે સંવત ૨૦૮૩ના માગશર સુદ-૪ ને રવિવાર, તા. ૧૩/૧૨/૨૦૨૬ના રોજ નિર્ધારેલ છે.',
      'તો આપશ્રી સહપરિવાર પધારી આ નવદંપતિને આશીર્વાદ આપવા',
      'આ શુભ લગ્નનું હરખનું તેડું વધાવી હૈયાના ટોલડે',
      'આપની હાજરીના લીલા તોરણે અમારા આંગણાને શોભાવશો.',
    ],
  },
  signoff: 'મિસ્ત્રી પરિવાર · સોની પરિવાર',

  events: [
    {
      id: 'hast-melap',
      name: 'હસ્ત મેળાપ',
      timeText: 'સાંજે ૬:૦૦ કલાકે',
      start: '2026-12-13T18:00:00+05:30',
      end: '2026-12-13T21:00:00+05:30',
      highlight: true,
      enabled: true,
    },
    {
      id: 'bhojan',
      name: 'ભોજન સમારંભ',
      timeText: 'સાંજે ૬:૩૦ કલાકે',
      start: '2026-12-13T18:30:00+05:30',
      end: '2026-12-13T21:00:00+05:30',
      highlight: false,
      enabled: true,
    },
  ],

  venue: {
    title: 'શુભ સ્થળ',
    name: 'અતિથી પાર્ટી પ્લોટ',
    short: 'અતિથી પાર્ટી પ્લોટ, પેટલાદ',
    address: 'અતિથી પાર્ટી પ્લોટ, દાવલપુરા રોડ, મુ. પેટલાદ તા. પેટલાદ જી. આણંદ',
    // TODO(user): replace with the exact Google Maps share link (Task 16).
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`,
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=15&output=embed`,
    mapsUrlIsPlaceholder: true,
  },


  music: { src: null, label: 'જુડી જોડી', loopStart: 0, loopEnd: null, volume: 0.4 },

  copy: {
    openCta: 'આમંત્રણ ખોલો',
    openHelper: 'Tap to open',
    skip: 'છોડો ›',
    scrollCue: 'નીચે સ્ક્રોલ કરો',
    invitationTitle: 'હરખનું તેડું',
    countdownTitle: 'શુભ ઘડીની રાહ',
    units: { days: 'દિવસ', hours: 'કલાક', minutes: 'મિનિટ', seconds: 'સેકન્ડ' },
    momentsTitle: 'શુભ મુહૂર્ત',
    directions: 'દિશા જુઓ',
    directionsHelper: 'Directions',
    share: 'WhatsApp પર મોકલો',
    copyLink: 'લિંક કોપી કરો',
    copied: 'કોપી થઈ ગઈ ✓',
    closing: 'આપની હાજરી અમારા આનંદને બમણો કરશે.',
    interlude: ['સાત ફેરા', 'સાત વચન', 'સાત જન્મનો સાથ'],
    todayText: 'આજે શુભ દિવસ છે!',
    afterText: 'શુભ લગ્ન સંપન્ન — આપના આશીર્વાદ બદલ આભાર',
    calendar: 'કેલેન્ડરમાં ઉમેરો',
    mapTitle: 'નકશો',
  },

  share: {
    url: SITE_URL,
    message:
      'ચિ. પ્રિન્સી ❀ ચિ. પાર્થકુમાર ના શુભ લગ્નનું આમંત્રણ 🌼\nરવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ',
  },

  og: {
    title: 'પ્રિન્સી ❀ પાર્થ — શુભ લગ્ન',
    description: 'રવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ',
  },
};

export default wedding;
