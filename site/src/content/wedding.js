/**
 * Single source of truth for every word, time, link, photo and song on the site — in Gujarati and English.
 * Gujarati text: spec §5 + research/kankotri-content.md. Elders of BOTH families proofread before launch.
 * Bold spans in invitation lines are marked with **…**; a line that is only a bold name is shown large.
 *
 * Language (user, 13 Nov): the guest chooses ગુજરાતી or English on the first screen. `wedding` is one live object that
 * every component reads while rendering; setLang() refills it, and the App re-renders. Shared facts (dates, times,
 * links, music) live once in `shared`; only the words differ per language.
 * TODO(user): the English wording, family names and the map link are placeholders until the families confirm them.
 */
const SITE_URL = (import.meta.env && import.meta.env.VITE_SITE_URL) || 'https://princy-parth.netlify.app';

const MAPS_QUERY = 'Atithi Party Plot, Davalpura Road, Petlad, Anand, Gujarat';

export const LANGS = ['gu', 'en'];
export const LANG_KEY = 'kankotri-lang';

const shared = {
  dateISO: '2026-12-13',
  countdownTarget: '2026-12-13T18:00:00+05:30',
  events: [
    { id: 'hast-melap', start: '2026-12-13T18:00:00+05:30', end: '2026-12-13T21:00:00+05:30', highlight: true, enabled: true },
    { id: 'bhojan', start: '2026-12-13T18:30:00+05:30', end: '2026-12-13T21:00:00+05:30', highlight: false, enabled: true },
  ],
  venue: {
    // TODO(user): replace with the exact Google Maps share link (Task 16).
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`,
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=15&output=embed`,
    mapsUrlIsPlaceholder: true,
  },
  // Judi Jodi (Ramayana, A.R. Rahman) — everything on the song's 135 BPM beat grid (beat 0.4444 s, phase 0.228 s):
  // the intro (0–17.1 s) plays from the first tap and loops 24 beats (5.56–16.23 s) while the guest waits; the door
  // tap jumps on the beat so the first sung line (17.115 s) lands as the camera reaches the couple; the song then loops
  // a 225-beat (100 s) section. The spoken monologue (1:10.9–1:22.9, 27 beats) is cut out of the file, so the loop
  // ends at 105.106 s. Seams are crossfaded in the file. The shehnai plays on the door tap when `shehnai` is set.
  music: {
    src: '/audio/judi-jodi.m4a',
    startAt: 0,
    verseAt: 17.1152,
    loopStart: 17.1152,
    loopEnd: 105.1064,
    introLoop: [5.5608, 16.2264],
    beat: 0.4444,
    beatPhase: 0.228,
    volume: 0.4,
    shehnai: null,
  },
  share: { url: SITE_URL },
};

const text = {
  gu: {
    lang: 'gu',
    couple: { honorific: 'ચિ.', bride: 'પ્રિન્સી', groom: 'પાર્થકુમાર', groomShort: 'પાર્થ', monogram: 'પ ✤ પ' },
    invocation: '॥ શ્રી ગણેશાય નમઃ ॥',
    blessing: '॥ શુભમ્ ભવતુ ॥',
    heading: 'મંગલ પરિણય',
    coverTitle: 'શુભ લગ્ન',
    dateText: 'રવિવાર, ૧૩ ડિસેમ્બર ૨૦૨૬',
    dateShort: 'રવિવાર, તા. ૧૩/૧૨/૨૦૨૬',
    dateNumeric: '૧૩/૧૨/૨૦૨૬',
    samvatText: 'સંવત ૨૦૮૩, માગશર સુદ-૪',
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
    events: {
      'hast-melap': { name: 'હસ્ત મેળાપ', timeText: 'સાંજે ૬:૦૦ કલાકે', period: 'સાંજે', clock: '૬:૦૦', timeShort: 'સાંજે ૬:૦૦' },
      bhojan: { name: 'ભોજન સમારંભ', timeText: 'સાંજે ૬:૩૦ કલાકે', period: 'સાંજે', clock: '૬:૩૦', timeShort: 'સાંજે ૬:૩૦' },
    },
    venue: {
      title: 'શુભ સ્થળ',
      name: 'અતિથી પાર્ટી પ્લોટ',
      short: 'અતિથી પાર્ટી પ્લોટ, પેટલાદ',
      address: 'અતિથી પાર્ટી પ્લોટ, દાવલપુરા રોડ, મુ. પેટલાદ તા. પેટલાદ જી. આણંદ',
    },
    musicLabel: 'જુડી જોડી',
    copy: {
      openCta: 'દ્વાર ખોલો',
      openHelper: 'Knock · or swipe the doors',
      introCta: 'કંકોતરી ખોલો',
      introHelper: 'Slide the brass latch · or tap',
      skip: 'છોડો ›',
      scrollCue: 'નીચે સ્ક્રોલ કરો',
      invitationTitle: 'હરખનું તેડું',
      countdownTitle: 'શુભ ઘડીની રાહ',
      units: { days: 'દિવસ', hours: 'કલાક', minutes: 'મિનિટ', seconds: 'સેકન્ડ' },
      dateParts: [
        { key: 'day', label: 'દિવસ', value: '૧૩', sub: 'રવિવાર' },
        { key: 'month', label: 'માસ', value: 'ડિસેમ્બર', sub: 'માગશર સુદ-૪' },
        { key: 'year', label: 'વર્ષ', value: '૨૦૨૬', sub: 'સંવત ૨૦૮૩' },
      ],
      scratchHint: 'સોનું ઘસીને શુભ તારીખ જુઓ',
      scratchHelper: 'Scratch the gold',
      scratchTile: 'ઘસો',
      countdownLead: 'શુભ ઘડીને બાકી',
      momentsTitle: 'શુભ મુહૂર્ત',
      minutesLater: (n) => `${n} મિનિટ પછી`,
      directions: 'દિશા જુઓ',
      directionsHelper: 'Directions',
      share: 'WhatsApp પર મોકલો',
      copyLink: 'લિંક કોપી કરો',
      copied: 'કોપી થઈ ગઈ ✓',
      closing: 'આપની હાજરી અમારા આનંદને બમણો કરશે.',
      interlude: ['સાત ફેરા', 'સાત વચન', 'સાત જન્મનો સાથ'],
      // TODO(user): saptapadi wording — family to confirm
      vows: [
        'અન્ન અને સુખ-સમૃદ્ધિ',
        'શક્તિ અને આરોગ્ય',
        'ધન અને ધર્મ',
        'પ્રેમ અને આદર',
        'સંતાન અને પરિવાર',
        'દરેક ઋતુમાં સાથ',
        'જીવનભરની મૈત્રી',
      ],
      vowsLead: 'એક એક ફેરે, એક એક વચન',
      ringText: 'શુભ લગ્ન ✦ ૧૩ ડિસેમ્બર ૨૦૨૬ ✦ પ્રિન્સી ❀ પાર્થ ✦ અતિથી પાર્ટી પ્લોટ, પેટલાદ ✦ ',
      todayText: 'આજે શુભ દિવસ છે!',
      afterText: 'શુભ લગ્ન સંપન્ન — આપના આશીર્વાદ બદલ આભાર',
      calendar: 'કેલેન્ડરમાં ઉમેરો',
      mapTitle: 'નકશો',
      showMap: 'નકશો જુઓ',
      backToTicket: '‹ પાછા',
      ticketDate: 'તારીખ',
      ticketTime: 'સમય',
      ticketTown: 'ગામ',
      ticketTownName: 'પેટલાદ',
      musicOn: 'સંગીત ચાલુ કરો',
      musicOff: 'સંગીત બંધ કરો',
      ganeshAlt: 'શ્રી ગણેશ',
      kickers: { invitation: 'The Invitation', countdown: 'Counting the moments', moments: 'The Auspicious Hour', venue: 'The Venue' },
      langSwitch: 'English',
      langSwitchLabel: 'Switch to English',
    },
    shareMessage: 'ચિ. પ્રિન્સી ❀ ચિ. પાર્થકુમાર ના શુભ લગ્નનું આમંત્રણ 🌼\nરવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ',
    og: {
      title: 'પ્રિન્સી ❀ પાર્થ — શુભ લગ્ન',
      description: 'રવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ',
    },
  },

  // TODO(user): placeholder English — family to confirm wording and spellings of names.
  en: {
    lang: 'en',
    couple: { honorific: 'Chi.', bride: 'Princy', groom: 'Parthkumar', groomShort: 'Parth', monogram: 'P ✤ P' },
    invocation: '॥ Shri Ganeshaya Namah ॥',
    blessing: '॥ Shubham Bhavatu ॥',
    heading: 'Mangal Parinay',
    coverTitle: 'Shubh Lagna',
    dateText: 'Sunday, 13 December 2026',
    dateShort: 'Sunday, 13/12/2026',
    dateNumeric: '13/12/2026',
    samvatText: 'Samvat 2083, Magshar Sud 4',
    invitation: {
      lines: [
        'With joyful hearts, we announce the wedding of',
        '**Chi. Princy**',
        'daughter of **Shri Bhaveshkumar Jitendrakumar Mistry** and **Smt. Arpitaben Bhaveshkumar Mistry**',
        'with',
        '**Chi. Parthkumar**',
        'son of **Shri Dharmeshbhai Manubhai Soni** and **Smt. Sonalben Dharmeshbhai Soni**, of Porda, now of Petlad',
        'on Sunday, 13 December 2026 — Samvat 2083, Magshar Sud 4.',
        'We warmly invite you and your family to bless the couple',
        'and to grace our courtyard with your presence,',
        'as fresh and welcome as a green toran at our door.',
      ],
    },
    signoff: 'The Mistry Family · The Soni Family',
    events: {
      'hast-melap': { name: 'Hast Melap', timeText: '6:00 in the evening', period: 'Evening', clock: '6:00', timeShort: '6:00 PM' },
      bhojan: { name: 'Wedding Feast', timeText: '6:30 in the evening', period: 'Evening', clock: '6:30', timeShort: '6:30 PM' },
    },
    venue: {
      title: 'The Venue',
      name: 'Atithi Party Plot',
      short: 'Atithi Party Plot, Petlad',
      address: 'Atithi Party Plot, Davalpura Road, Petlad, Dist. Anand, Gujarat',
    },
    musicLabel: 'Judi Jodi',
    copy: {
      openCta: 'Open the doors',
      openHelper: 'Knock · or swipe them apart',
      introCta: 'Open the kankotri',
      introHelper: 'Slide the brass latch · or tap',
      skip: 'Skip ›',
      scrollCue: 'Scroll down',
      invitationTitle: 'Our Invitation',
      countdownTitle: 'Awaiting the Auspicious Hour',
      units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
      dateParts: [
        { key: 'day', label: 'Day', value: '13', sub: 'Sunday' },
        { key: 'month', label: 'Month', value: 'December', sub: 'Magshar Sud 4' },
        { key: 'year', label: 'Year', value: '2026', sub: 'Samvat 2083' },
      ],
      scratchHint: 'Scratch the gold to reveal the date',
      scratchHelper: 'સોનું ઘસો',
      scratchTile: 'Scratch',
      countdownLead: 'Until the auspicious hour',
      momentsTitle: 'The Auspicious Hour',
      minutesLater: (n) => `${n} minutes later`,
      directions: 'Get directions',
      directionsHelper: 'Google Maps',
      share: 'Send on WhatsApp',
      copyLink: 'Copy link',
      copied: 'Copied ✓',
      closing: 'Your presence will double our joy.',
      interlude: ['Seven pheras', 'Seven vows', 'Together for seven lifetimes'],
      vows: [
        'Nourishment and plenty',
        'Strength and health',
        'Prosperity and righteousness',
        'Love and respect',
        'Children and family',
        'Together through every season',
        'Friendship for a lifetime',
      ],
      vowsLead: 'With every phera, a promise',
      ringText: 'Shubh Lagna ✦ 13 December 2026 ✦ Princy ❀ Parth ✦ Atithi Party Plot, Petlad ✦ ',
      todayText: 'Today is the auspicious day!',
      afterText: 'The wedding is complete — thank you for your blessings',
      calendar: 'Add to calendar',
      mapTitle: 'Map',
      showMap: 'Show map',
      backToTicket: '‹ Back',
      ticketDate: 'Date',
      ticketTime: 'Time',
      ticketTown: 'Town',
      ticketTownName: 'Petlad',
      musicOn: 'Play music',
      musicOff: 'Pause music',
      ganeshAlt: 'Shri Ganesh',
      kickers: { invitation: 'હરખનું તેડું', countdown: 'શુભ ઘડીની રાહ', moments: 'શુભ મુહૂર્ત', venue: 'શુભ સ્થળ' },
      langSwitch: 'ગુજરાતી',
      langSwitchLabel: 'ગુજરાતીમાં જુઓ',
    },
    shareMessage: 'You are invited to the wedding of Princy ❀ Parthkumar 🌼\nSunday, 13/12/2026 · Atithi Party Plot, Petlad',
    og: {
      title: 'Princy ❀ Parth — Shubh Lagna',
      description: 'Sunday, 13/12/2026 · Atithi Party Plot, Petlad',
    },
  },
};

/** The full content for one language: shared facts merged with that language's words. */
export function buildContent(lang) {
  const t = text[lang] || text.gu;
  const { events, venue, musicLabel, shareMessage, ...rest } = t;
  return {
    ...rest,
    dateISO: shared.dateISO,
    countdownTarget: shared.countdownTarget,
    events: shared.events.map((e) => ({ ...e, ...events[e.id] })),
    venue: { ...venue, ...shared.venue },
    music: { ...shared.music, label: musicLabel },
    share: { url: shared.share.url, message: shareMessage },
  };
}

/** The live content object every component reads. */
const wedding = {};

/** Refill `wedding` with another language (call before re-rendering). Returns the language actually used. */
export function setLang(lang) {
  const l = LANGS.includes(lang) ? lang : 'gu';
  for (const k of Object.keys(wedding)) delete wedding[k];
  Object.assign(wedding, buildContent(l));
  return l;
}

/** The language saved on this device, or null on a first visit. */
export function storedLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return LANGS.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* private mode — the choice still holds for this visit */
  }
}

setLang('gu');

export default wedding;
