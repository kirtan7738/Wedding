# Indian / Gujarati digital invitation sites — teardown notes

Captured 2026-11-12 with REA (headless Chrome, 390x844 mobile viewport, Asia/Kolkata, reduced-motion off).
Screenshots: `C:/Users/OMEN/Desktop/wed/research/screens/`. Raw HTML/JS/CSS pulled for code reading: `C:/Users/OMEN/Desktop/wed/research/raw/`.
Note: headless Chrome allows autoplay after a click, so "music starts on tap" was confirmed from code, not by ear.

Sites torn down (guest-facing, live): 1 Vikash weds Jyoti, 2 Riya & Abhishek (Gujarati), 3 Bafna web-invites (3 live client sites, one template), 4 interactive-wedding-card, 5 Sonali / Rudra Shahdeo (Netlify, same template), 6 Premium Wedding Invites "Royal Gold" preview.
Checked but not usable: thedigitalmandap.pages.dev (template placeholder page, "Logo" and stock photos, no demo), colorsnpromises.lovable.app (sells *video* invites, no web invite), kankotri-seven.vercel.app (404), wedding-invitation-ayush-1e73.vercel.app (Vercel login wall), wedding-invitation-without-about-us.vercel.app (deployment not found), varmoraj.github.io/Digital-Kankotri (guest-list generator tool, not an invite).

---

## 1. Vikash weds Jyoti — https://vikash-weds-jyoti.vercel.app/  (STRONGEST REFERENCE)
Screens: `screens/vikash_1.png` (envelope), `screens/vikash-open_2.png`, `_3`, `_4` (open + light bloom), `_5` (names mid-animation), `_7` (hero settled).

- **Opening:** dark plum velvet envelope with gold filigree corners and a 3D gold wax-seal coin ("V ✤ J"), heading "॥ श्री गणेशाय नमः ॥ / VIKASH WEDS JYOTI", pill button "TAP TO UNLOCK" (lucide mail-open + sparkles icons) and an italic line "A beautiful celebration awaits". On tap: flap opens, ivory card rises out, then a **radial ivory light bloom** expands from the card until it fills the screen (~2–3 s), dissolving into the ivory hero. Hero names then animate in **letter by letter** (letters drop/settle — see `_5` "JYOT," mid-flight).
- **Effects / libraries:** React + Vite (rolldown), **Framer Motion** (`motion-vendor-*.js`, `whileTap` scale .97), lucide-react icons. Faint rose petals drift over the hero (DOM/motion, no canvas lib). Code-split sections: GaneshBlessing, CoupleStory, Timeline, Celebrations, VenueMap, OurMoments, DivineBlessings, RSVPSection, ClosingSection, TiltCard.
- **Music:** `https://vikash-weds-jyoti.vercel.app/audio/Krishna%20Flute.mp3` (fallback `/audio/krishna-flute.mp3`), config title "Peaceful Krishna Flute Instrumental" — devotional bansuri instrumental, ~10.5 MB. `new Audio()`, loop, **volume 0.38**, preload metadata. **Not autoplayed** — a floating bottom-left pill "♫ DEVOTIONAL MUSIC / Click to play"; when playing it reads "KRISHNA FLUTE / Devotional Bansuri" with animated equaliser bars; shows "Muted" state; graceful catch with toast if play is blocked.
- **Fonts:** Cormorant Garamond (display, caps with wide tracking) + DM Sans (UI/labels); Devanagari via system font.
- **Palette:** plum `#702d43` (accent text), champagne gold `#c4a36a` / `#a88647`, warm ivory `#f8f3ec`, blush `#f0dedd`, rose `#ddafb6`; per-event palettes: haldi `#fcf7ee`/`#d49024`, mehendi `#f2f6f3`/`#4e6b56`. Paper-texture overlay.
- **Structure:** envelope → hero (marigold toran garland + bells, monogram medallion, Ganesh shlok, "Together with our families", names, Hindi couplet, date/place card "20 NOVEMBER 2026 / MAU, UTTAR PRADESH", "scroll to discover") → Ganesh blessing → couple story → timeline → celebrations (per-event colour themes) → venue map → moments → blessings → RSVP → closing. Hamburger nav top-right, monogram top-left.
- **Verdict:** Premium. Restraint (one dark→light transition, slow bloom, small type with letter-spacing, muted gold not yellow), cultural cues done tastefully (toran, shlok), music is opt-in and labelled. Weakness: no celebratory burst at all; 10 MB audio.

## 2. Riya & Abhishek (Gujarati bilingual) — https://riya-abhishek-wedding.vercel.app/  (BEST GUJARATI CONTENT MODEL)
Repo: github.com/uatdevprod/e-invite ("Building a Bilingual Gujarati Wedding E-Invite"). Screens: `screens/riya-abhishek_1.png` (gate), `screens/riya-open_2.png`, `_5` (hero).

- **Opening:** off-white `#FAF9F6` page, frosted card (bg-white/40 + backdrop-blur, rounded-2xl, white border, big shadow) with a round rose-gold "RA" monogram, Gujarati names "રીયા & અભિષેક" and a pulsing "TAP TO ENTER". Whole card is the tap target. On tap the card fades out and the hero fades/slides in (Framer Motion).
- **Effects:** rose-gold petal divs (`bg-rosegold/40 backdrop-blur-sm`, `border-radius: 50% 5%` = petal shape, random size/left/rotation) falling via **Framer Motion** — no particle lib, no confetti.
- **Music:** `https://riya-abhishek-wedding.vercel.app/DinShagnaDaPhillauri.mp3` — "Din Shagna Da" (Phillauri, Bollywood wedding song), ~7.1 MB, loop. The gate holds the `<audio>`; tap → play; after entering a second `<audio autoPlay loop>` is mounted. Control: round white speaker-icon button top-left; EN | ગુજરાતી language toggle pill top-right; green WhatsApp FAB bottom-right (wa.me prefilled "We will be attending").
- **Fonts:** Luxurious Script (Latin cursive "&"), Playfair Display (serif); **Gujarati falls back to system font** (no Noto Serif Gujarati / Hind Vadodara loaded) — still looks fine on Android but inconsistent.
- **Palette:** rose-gold `#b76e79`, blush `#fde8e9`, ivory `#FAF9F6`, white glass cards.
- **Structure (mirrors a printed kankotri — very relevant):** ॥ શ્રી ગણેશાય નમઃ ॥ + kuldevi + ॥ શ્રી મહાવીરાય નમઃ ॥ → monogram → names → date card "રવિવાર, ૧૦.૫.૨૦૨૬ / સંવત ૨૦૮૨, વૈશાખ વદ ૮" (Gujarati numerals + Vikram Samvat tithi) → poem about a daughter → bride block (name, parents "અ. સૌ. … ની સુપુત્રી", grandparents, ગામ) → groom block → પ્રસંગ list (સામૈયું 3.00, સ્વરૂચિ ભોજન 5.30–10, હસ્ત મેળાપ 6.56, ચૌવિહાર note) → સ્થળ with Google Maps iframe (rounded-3xl, white border) → મામેરું (nana-nani) → દર્શનાભિલાષી → સ્નેહાધીન → સ્વર્ગસ્થ family. Language toggle Gujarati/English.
- **Verdict:** Content/structure is exactly the Gujarati template to follow; visuals are clean but plain (no reveal moment, no hero photo above the fold, system Gujarati font). A Bollywood song is fun but less "premium" than an instrumental.

## 3. Bafna web-invites (Paresh Bafna portfolio) — 3 live client sites, one shared template
Portfolio: https://pareshbafna.notion.site/Portfolio-Web-Invites-323fa71653ca80f0b409fc78c745f944
Live: https://sample-invitation-premium-pink-envelope-shreyawedsjayesh.pages.dev/ , https://suranas-invitation-siddhikomilaanand.pages.dev/ , https://bafnas-invitation-lk-pdr.pages.dev/ (also -lk-pr, -lk-r).
Screens: `screens/bafna-pink_0.png` (envelope), `screens/bafna-pink-open_2.png` (flap opening), `_4`, `_6` (hero + petal storm), `screens/bafna-surana_0.png` (photo variant).

- **Opening:** full-bleed background photo (gazebo/aisle or couple photo) darkened, flat maroon CSS envelope with a red circular **wax seal holding the couple's monogram logo**, label "TAP TO OPEN" (seal bounces 2 s loop; fades in after 600 ms). Tap → `flap-open` (CSS 3D rotate 0.8 s) → `splash-open` fade → content.
- **Effects:** **custom `<canvas id="particles">`** petal/heart system (colours `rgba(220,0,40,.85)`, `rgba(255,120,180,.9)`, `rgba(255,150,200,.8)`); petals fall from load, and the density **jumps after opening** into a heavy pink-heart storm. Script is javascript-obfuscator'd (vanilla JS, no libs). Full-page **scroll-snap sections** with right-side nav dots and "Next: The Couple ↓" buttons; glassmorphism card (backdrop-filter blur 8–14 px).
- **Music:** `/assets/audio/jashn-e-bahara-instrumental.mp3` — "Jashn-e-Bahara" (Jodhaa Akbar, A.R. Rahman) **instrumental**, ~8.7 MB, loop, preload auto; started by the seal tap. Same file on all three client sites. No visible play/pause control found in screenshots/CSS.
- **Fonts:** "Best Signature Font" (custom woff) for names, Georgia serif, Lucida Handwriting, Copperplate/Papyrus fallbacks, system-ui.
- **Palette:** maroon/wine envelope, crimson seal, pink accents over photo.
- **Structure:** envelope → hero card ("BAFNA'S WEDDING INVITATION", monogram, names, hashtag "#ShreyGotHerJay", date/city, 4-box countdown) → couple → each function as its own snap page → contacts (WhatsApp / phone / Instagram icons).
- **Verdict:** Mid. The seal-with-monogram + tap-to-open is good; the petal storm is too dense (reads as gimmick), names overflow the card ("Jayesh" clipped at 390 px), mixed system fonts, hashtag. Nice idea: open = petal intensity increase.

## 4. interactive-wedding-card — https://interactive-wedding-card.vercel.app/
Screens: `screens/iwc_0.png` (gate), `screens/iwc-open_2.png` (doors opening), `screens/iwc-open_4.png` (hero).

- **Opening:** forest-green double "gate" doors with a gold vertical seam and a round "V&A" monogram seal in the centre, bouncing chevron "PULL DOWN TO OPEN". Tap or swipe-down >80 px → the two panels slide apart (`translateX(±100%)`, 1.2 s `cubic-bezier(0.25,1,0.5,1)`), revealing the hero.
- **Effects:** hand-written **canvas confetti** (rectangles, rotation, gravity, 4 s) fired when a **scratch-card** (date hidden under a scratch layer) is scratched enough, and on RSVP submit. Petals in hero are part of the photo. Scroll fade-ups (IntersectionObserver). Tailwind CDN 3.4.17, Font Awesome 6.4.
- **Music:** `/Edd_Sheeran.mp3` — Ed Sheeran (English pop, likely "Perfect"), loop; `bgMusic.play()` inside `openGate()`; then a round 48 px glass button top-right (gold border, forest bg, backdrop-blur) toggling fa-music / fa-volume-mute.
- **Fonts:** Great Vibes (names), Playfair Display, Montserrat (spaced caps).
- **Palette:** forest `#2B4234`, gold `#D4AF37`.
- **Structure:** hero photo + names → welcome + scratch-to-reveal date → couple photo → countdown → timeline → venue (Google Maps embed) → pre-wedding events → gifts → RSVP form → footer.
- **Verdict:** Gate-door reveal is classy and simple; Western content (stock Unsplash couple, Ed Sheeran). Scratch-to-reveal → confetti is a clever, earned "burst" moment.

## 5. Sonali & Gagan / Rudra Shahdeo (Vinit Shahdeo template) — https://sonali.netlify.app/ , https://rudrashahdeo.netlify.app/
Repo: github.com/maybeayush/Wedding, github.com/vinitshahdeo/wedding-website ("Animated website for my elder sister's wedding"). Fork: https://www.sarthakj.me/WeddingEvite/. Screen: `screens/sonali_3.png`.

- **Opening:** none — straight to content; purple watercolour floral corners.
- **Effects:** **jQuery-Sakura** (`cdn.jsdelivr.net/gh/timoschaefer/jQuery-Sakura`) falling cherry-blossom petals (CSS-animated DOM nodes) over a white page.
- **Music:** `https://sonali.netlify.app/assets/mp3/song.mp3` = "Din Shagna Da" (Phillauri, Bollywood), ~3.4 MB; `/assets/mp3/background.mp3` on Rudra. Starts on **first click anywhere** (`$(document).on('click', play)`); no visible control.
- **Fonts:** Dancing Script + Arvo. **Palette:** purple `#6a4fb0`-ish, rose.
- **Structure:** names → date/venue → countdown → "see the venue" + "download invitation card" (PDF) → contact phone.
- **Verdict:** Cheap-looking but charming; proof that "brother builds sister's invite" goes viral. Avoid: no control for music, generic fonts, countdown expiring to a grey box.

## 6. Premium Wedding Invites — "Royal Gold" preview — https://premium-wedding-invites.pages.dev/preview/royal-gold
Screen: `screens/pwi-royalgold_1.png`.

- **Opening:** none (preview mode), straight to hero: AI-generated palace/mandap photo, names "Arjun & Diya" in large black serif over a busy image, gold spaced date.
- **Music:** `https://premium-wedding-invites.pages.dev/music/wedding-romantic.mp3` (generic romantic instrumental); round dark play-triangle button bottom-right.
- **Stack:** Next.js, Poppins; webp section backgrounds (countdown_bg, events_bg, venue_bg, gallery).
- **Verdict:** Cheap — black text on busy photo (poor contrast), AI-art backgrounds, watermark ghosting, INR 1,499 template feel.

---

## Patterns worth adopting
1. **Seal-as-monogram tap gate** (Vikash, Bafna, iwc): a single, centred wax/gold seal carrying the couple's initials + one short label ("ખોલવા માટે સ્પર્શ કરો"). The tap is also the browser-autoplay unlock for music.
2. **Dark → light reveal** (Vikash): dark plum/maroon envelope screen, then a warm ivory light bloom that floods the screen and becomes the hero. Feels cinematic without fireworks.
3. **Letter-by-letter name reveal** on the hero after the bloom (Vikash) — this is the "big couple reveal".
4. **Earned celebration burst** (iwc): fire confetti once at a meaningful moment (gate open / names land / scratch-reveal of date), ~2–4 s, then stop. Do it in gold + marigold + rose, not rainbow.
5. **Petals with restraint**: 15–30 petal-shaped elements (`border-radius: 50% 5%`, Riya) drifting slowly; optionally a short density spike at the moment of opening (Bafna) that settles back.
6. **Kankotri content order from Riya**: ॥ શ્રી ગણેશાય નમઃ ॥ (+ kuldevi) → names → date in Gujarati numerals + સંવત / tithi → bride & groom blocks with parents, grandparents, ગામ → પ્રસંગ list with times → સ્થળ + map → મોસાળ / દર્શનાભિલાષી / સ્નેહાધીન → closing.
7. **Labelled music pill** (Vikash): small floating pill with icon + track name + equaliser bars when playing, volume ~0.35–0.4, loop. Clear mute state.
8. Toran / marigold garland + bells at top of hero (Vikash) as an Indian cue that still feels luxurious.
9. Per-event colour accents (haldi yellow, mehendi sage) on otherwise ivory/gold base (Vikash).
10. WhatsApp FAB / prefilled wa.me RSVP (Riya) — matches how guests receive it.

## Avoid
- Dense, saturated pink-heart petal storms that never calm down (Bafna).
- Names that overflow at 390 px; always test 360 px Android width (Bafna clips "Jayesh").
- Black or low-contrast text over busy/AI-generated photos (PWI Royal Gold).
- Music with no visible control, or music that starts on any random click (Sonali).
- Western stock couples and English pop tracks for a Gujarati family audience (iwc).
- 7–10 MB MP3s on a WhatsApp-shared page — compress to ~96–128 kbps mono/stereo AAC/MP3, 1–1.5 MB, trim to a 60–90 s loop.
- System-fallback Gujarati font (Riya) — load a real Gujarati webfont (e.g. Noto Serif Gujarati, Hind Vadodara, Mukta Vaani, Rasa/Yrsa for serif) with `font-display: swap`.
- Hashtags, watermark overlays, "Buy now" style chrome, countdowns that collapse into a grey box after the date.

## Libraries seen for petals / confetti / motion
| Site | Petals | Burst | Motion |
|---|---|---|---|
| Vikash weds Jyoti | DOM petals (Framer Motion) | none | Framer Motion (React/Vite) |
| Riya & Abhishek | DOM petal divs, `border-radius:50% 5%` (Framer Motion) | none | Framer Motion (React/Vite, Tailwind v4) |
| Bafna invites | custom `<canvas>` particle system (obfuscated vanilla JS) | density spike on open | CSS transitions, scroll-snap |
| interactive-wedding-card | (in photo) | hand-rolled canvas confetti | CSS + IntersectionObserver, Tailwind CDN |
| Sonali / Rudra | jQuery-Sakura plugin | none | CSS |
No site used canvas-confetti, tsparticles, particles.js, GSAP or Lottie — all hand-rolled or Framer Motion. (canvas-confetti remains the easiest drop-in for the cracker burst.)

## Music findings
| Site | File URL | Track | Genre | Trigger | Control |
|---|---|---|---|---|---|
| Vikash weds Jyoti | https://vikash-weds-jyoti.vercel.app/audio/Krishna%20Flute.mp3 (~10.5 MB) | "Peaceful Krishna Flute Instrumental" | Devotional bansuri instrumental | Opt-in: tap pill (not on unlock); vol 0.38, loop | Floating pill bottom-left "♫ Devotional Music / Click to play" → "Krishna Flute / Devotional Bansuri" + EQ bars, Muted state |
| Riya & Abhishek (Gujarati) | https://riya-abhishek-wedding.vercel.app/DinShagnaDaPhillauri.mp3 (~7.1 MB) | Din Shagna Da (Phillauri) | Bollywood wedding song (Punjabi) | "Tap to Enter" gate tap; loop | Round white speaker button top-left |
| Bafna invites (3 sites) | https://sample-invitation-premium-pink-envelope-shreyawedsjayesh.pages.dev/assets/audio/jashn-e-bahara-instrumental.mp3 (~8.7 MB) | Jashn-e-Bahara (Jodhaa Akbar, A.R. Rahman) | Bollywood instrumental | Wax-seal "Tap to Open"; loop | None visible |
| interactive-wedding-card | https://interactive-wedding-card.vercel.app/Edd_Sheeran.mp3 | Ed Sheeran track (likely "Perfect") | English pop | Gate open (tap / pull-down); loop | 48 px round glass button top-right, music / mute icons |
| Sonali (Vinit Shahdeo) | https://sonali.netlify.app/assets/mp3/song.mp3 (~3.4 MB) | Din Shagna Da (Phillauri) | Bollywood wedding song | First click anywhere on page | None |
| Rudra Shahdeo | https://rudrashahdeo.netlify.app/assets/mp3/background.mp3 | (unnamed) | — | First click anywhere | None |
| PWI Royal Gold | https://premium-wedding-invites.pages.dev/music/wedding-romantic.mp3 | "wedding-romantic" | Generic romantic instrumental | Play button | Round dark play button bottom-right |
No site used shehnai. For a Gujarati kankotri, a shehnai/sitar or soft instrumental (e.g. a licensed/royalty-free shehnai "mangal dhun") fits better than a Punjabi song; keep copyright in mind for Bollywood tracks.
