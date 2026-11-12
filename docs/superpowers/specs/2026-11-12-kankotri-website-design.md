# પ્રિન્સી ❀ પાર્થ — Digital Wedding Invitation Website · Design

**Date:** 2026-11-12 (rev. 3)  **Wedding:** Sunday 13 Dec 2026, Petlad  **Link goes out:** **Sun 22 – Mon 23 Nov 2026**
**Author's role:** the bride's brother (a developer) is building this as a gift for his sister — free, out of love — and his reputation rides on it.
**Supersedes:** `gujarati_wedding_kankotri_project_brief.md` (ChatGPT draft). Where they disagree, this document wins.

Supporting material:
- Content source (Unicode Gujarati, proofreading flags): `research/kankotri-content.md`
- Printed card (bride's side): `PRINCY-PARTH-wt.pdf`
- Couple photos: `assets/photos/couple-facing.jpeg`, `assets/photos/couple-walking.jpeg`
- Reference teardowns: `research/notes-indian-invites.md`, `research/notes-premium-refs.md`, screenshots in `research/screens/`

---

## 1. Intent — why this exists

A brother's wedding gift to his sister: a premium digital wedding invitation, in Gujarati, that **both families — the bride's (Mistry) and the groom's (Soni) — send** to their guests over WhatsApp. The first minute should feel like a celebration — **flowers falling, a burst like crackers / a confetti cannon for a few seconds, then a big reveal of the couple** — then the guest learns the two key moments of the day and how to get there.

**Quality bar (user's words):** "no compromise… 1000% quality over time… it's all about reputation." When quality and speed conflict, quality wins (that's why the share date moved from 19 to 22–23 Nov).

Success = both families forward the link proudly; elders read every word comfortably in Gujarati; a guest on a mid-range Android over 4G in WhatsApp's in-app browser gets the full experience without waiting, stutter or confusion.

## 2. Goals, non-goals, anti-goals

**Goals**
1. A premium, cinematic but short opening (tap → envelope opens → 3D petal + gold burst → couple reveal) with music.
2. A **family-neutral** invitation that works for guests of either side.
3. Practical info that works: the two event times, one-tap directions, countdown.
4. Easy to share: WhatsApp share, Gujarati link-preview card, QR code.
5. All content in one config file so text/photos/song can be changed in minutes.

**Non-goals (decided)**
- No RSVP, guestbook, admin panel, database or backend.
- No English language toggle — Gujarati only; small English helper labels only where they aid an action ("Tap to open", "Directions").
- **No side-specific content** (see §4.1): no મોસાળપક્ષ, સ્નેહાધિન, ટહુકો, નિમંત્રક/home address, bride-home morning rituals, family-specific deities.
- No personalised per-guest links — **one common link** for everyone.
- No phone numbers or home addresses on the site.
- Not a template/product. Taken down ~2 weeks after the wedding.

**Anti-goals (a failure even if it "works")**
- Feels like a game or cheap e-card: endless dense petal storms, rainbow rectangle confetti, stock photos.
- Any misspelled name or wrong time.
- Gujarati in a fallback system font, broken conjuncts, or names clipped on a 360 px phone.
- Music with no visible way to stop it, or that keeps playing after the guest leaves.
- A black, frozen or stuttering opening on an older phone.
- Slow first screen (> ~2.5 s on 4G).

## 3. Constraints

- **Timeline:** today Thu 12 Nov. Shareable link Sun 22 – Mon 23 Nov (≈10 days). Wedding Sun 13 Dec.
- **Audience/device:** mostly Android, opened inside **WhatsApp's in-app browser**; also iPhone. Many elders. Mobile-first at 360–430 px; desktop must also look polished (centered composition, Lenis scroll).
- **Hosting:** free URL (e.g. `princy-parth.vercel.app`). No custom domain.
- **Photos:** two couple photos supplied (WhatsApp-compressed, 852×1280 and 1040×1280); originals/more may come later and must drop in via config.
- **Music:** commercial song acceptable for the site's ~2-week life; user supplies the file.
- **Browsers block audio autoplay** — music starts from the guest's tap.

## 4. Decisions made with the user

| Topic | Decision |
|---|---|
| Opening moment | Falling flowers + celebration burst (crackers / confetti cannon) for a few seconds + big couple reveal; "whatever looks most professional" |
| Audience | **Both families send the same site** (bride's Mistry side and groom's Soni side) |
| Events shown | **Only હસ્ત મેળાપ (6:00 pm) and ભોજન સમારંભ (6:30 pm)** |
| Language | Gujarati only; English only as small helper text |
| Scope | Invitation only — no RSVP |
| Photos | Use the two supplied couple photos everywhere for now (§9.1) |
| Music | Lead candidate **"Judi Jodi" — Ramayana: Part 1 (A.R. Rahman, Shreya Ghoshal)**; compare against a short-list (§10). Licensed songs OK |
| Personal "from the brother" section | No |
| Hosting | Free link |
| Quality vs time | Quality wins; share date moved to 22–23 Nov |
| Tech | §7 (reviewed with user: Three.js + GLSL added; Framer Motion, Locomotive, SCSS rejected; Remotion as a separate video deliverable; Lenis desktop-only) |
| Later changes | "If anything needs to be added or removed we will do it" — keep everything config-driven |

### 4.1 What the website keeps vs. drops from the printed card

| Keep | Drop |
|---|---|
| ॥ શ્રી ગણેશાય નમઃ ॥ | જય શ્રી કૃષ્ણ, ।। શ્રી અંબાજી માતા ।। (family-specific) |
| મંગલ પરિણય, couple names | મોસાળપક્ષ list |
| Both sets of parents (bride's and groom's) | સ્નેહાધિન list |
| Date + samvat | ટહુકો |
| હસ્ત મેળાપ ૬:૦૦, ભોજન સમારંભ ૬:૩૦ | ગણેશ સ્થાપના, મંડપ મુહૂર્ત, મોસાળુ, ગ્રહશાંતિ, વરધ |
| Venue | નિમંત્રક block, home address, phone |
| The card's poetic invitation line (reused in a neutral letter) | The letter's Mistry-family framing ("પ્રતિશ્રી ગામ પેટલાદથી લિ. …", "અમારા પુત્ર …") |

## 5. The experience, screen by screen

Single page, vertical scroll, this order. **All Gujarati below must be proofread by an elder from each family before launch.**

### 5.0 Cover / gate (first screen, before any tap)
- Full-screen **closed envelope**: deep green with sage handmade-paper texture, gold hairline border; **marigold toran** with small bells across the top.
- **Gold wax seal** with monogram **"પ ✤ પ"** (Princy & Parth).
- Above the seal: **॥ શ્રી ગણેશાય નમઃ ॥** (small). Below: **શુભ લગ્ન** and **રવિવાર, ૧૩ ડિસેમ્બર ૨૦૨૬**. Names are held back for the reveal.
- Call to action under the seal: **"આમંત્રણ ખોલો"** + small "Tap to open", gently pulsing. The **whole envelope is tappable**.
- This screen must render fast with no 3D (static art + CSS); the 3D scene loads in the background while the guest looks at it.

### 5.1 Opening sequence (the signature moment, ~4.5 s)
One tap, one GSAP master timeline:

| t (s) | What happens |
|---|---|
| 0.0 | Tap → haptic tick (Android). Seal presses and cracks with a gold light leak (GLSL). Music starts at 0 and fades to ~0.4 over 1.5 s. |
| 0.4–2.0 | Envelope flap opens (~1.6–1.9 s, `cubic-bezier(.65,0,.35,1)`); the card rises out. |
| 1.9 | **Celebration burst:** 3D marigold + rose petals (and a few sage leaves) fire from **both bottom corners**, tumbling with real light; **gold flakes** glint with bloom — the "crackers" moment. ~2.5 s, then settles. |
| 2.4 | Warm ivory **light-burst / glow wash** (GLSL) fills the screen; envelope dissolves. |
| 2.8–4.5 | **Couple reveal** (§5.2): photo settles from 1.08→1.0 inside the gold arch; hand-lettered names **write themselves** like a pen. |
| after | ~12 slow ambient petals drift over the hero only; they stop once the guest scrolls past. |

- **"છોડો ›" (skip)** appears at 0.5 s → jumps to the end state.
- `prefers-reduced-motion` → no burst/ambient petals; cross-fade envelope → hero.
- **Render tiers** (§7.2): every tier must look intentional. Never a black/frozen screen.
- **No cracker sound effect** (my call — the music starts on the same beat; a bang would clash and startle elders).

### 5.2 Hero — couple reveal
- Gold **arch/jharokha frame** holding `couple-facing` (cropped around both faces and upper bodies).
- **મંગલ પરિણય** (ornamental heading in the card's red).
- **ચિ. પ્રિન્સી** ❀ **ચિ. પાર્થકુમાર** — hand-lettered calligraphy.
- **રવિવાર, ૧૩ ડિસેમ્બર ૨૦૨૬** · **સંવત ૨૦૮૩, માગશર સુદ-૪**
- **અતિથી પાર્ટી પ્લોટ, પેટલાદ**
- "નીચે સ્ક્રોલ કરો" cue. The music pill (§5.10) appears.

### 5.3 Invitation — from both families
Paper card (sage handmade texture, watercolour leaves in two corners, echoing the printed card), opening with a small Ganesh medallion and **॥ શ્રી ગણેશાય નમઃ ॥**, then this **neutral invitation (my draft, adapted from the card's own wording — elders to approve):**

> સહર્ષ જણાવવાનું કે
>
> **શ્રી ભાવેશકુમાર જીતેન્દ્રકુમાર મિસ્ત્રી** તથા **અ.સૌ. અર્પિતાબેન ભાવેશકુમાર મિસ્ત્રી**ની સુપુત્રી
> **ચિ. પ્રિન્સી**
> ના શુભ લગ્ન
> ગામ પોરડા નિવાસી હાલ પેટલાદ **શ્રી ધર્મેશભાઇ મનુભાઇ સોની** તથા **અ.સૌ. સોનલબેન ધર્મેશભાઇ સોની**ના સુપુત્ર
> **ચિ. પાર્થકુમાર**
> સાથે સંવત ૨૦૮૩ના માગશર સુદ-૪ ને રવિવાર, તા. ૧૩/૧૨/૨૦૨૬ના રોજ નિર્ધારેલ છે.
>
> તો આપશ્રી સહપરિવાર પધારી આ નવદંપતિને આશીર્વાદ આપવા
> આ શુભ લગ્નનું હરખનું તેડું વધાવી હૈયાના ટોલડે
> આપની હાજરીના લીલા તોરણે અમારા આંગણાને શોભાવશો.
>
> — **મિસ્ત્રી પરિવાર** · **સોની પરિવાર**

- Bride's-side line has no village (the card says "ગામ પેટલાદથી" only in the Mistry-framed opening); add "ગામ પેટલાદ" if the family wants symmetry.
- The text unfolds/fades in as the guest reaches it.

### 5.4 Countdown
- Target **હસ્ત મેળાપ, 13 Dec 2026 18:00 IST** (`2026-12-13T18:00:00+05:30`).
- દિવસ / કલાક / મિનિટ / સેકન્ડ in Gujarati numerals; computed against IST regardless of the phone's timezone.
- On the day before 18:00: **"આજે શુભ દિવસ છે!"** + remaining time. After 18:00: **"શુભ લગ્ન સંપન્ન — આપના આશીર્વાદ બદલ આભાર"**.

### 5.5 શુભ મુહૂર્ત — the two moments
Two large, elegant cards (not a timeline — two items deserve presence):
1. **હસ્ત મેળાપ** — સાંજે ૬:૦૦ કલાકે — hands-joining motif (highlighted card).
2. **ભોજન સમારંભ** — સાંજે ૬:૩૦ કલાકે.
Date line above: **રવિવાર, તા. ૧૩/૧૨/૨૦૨૬**. One **"કેલેન્ડરમાં ઉમેરો"** action (Google Calendar link + `.ics`, IST, 18:00–21:00 — end time my guess) as a nice-to-have.

### 5.6 શુભ સ્થળ — venue
- **અતિથી પાર્ટી પ્લોટ, દાવલપુરા રોડ, મુ. પેટલાદ તા. પેટલાદ જી. આણંદ**, dhol + shehnai motif.
- Lazy-loaded Google Maps embed (no API key) + big **"દિશા જુઓ · Directions"** button → the user's Maps link. Until provided: Maps search URL for the address, marked TODO in config.

### 5.7 Photos (યાદગાર પળો)
- **Two-photo diptych** for now (both photos, gold frames, a short line — e.g. "સાથે, હંમેશાં" — family to approve). Becomes a swipeable carousel / polaroids-on-a-string automatically when ≥ 4 photos are configured. Tap to view larger (GSAP Flip).

### 5.8 Closing
- Full-bleed `couple-walking` (soft vignette, gentle grade) — "walking into their new life together".
- Blessing line (my draft, family to approve): **"આપની હાજરી અમારા આનંદને બમણો કરશે."**
- Monogram "પ ✤ પ", a final soft petal drift, marigold toran echo.

### 5.9 Share
- **"WhatsApp પર મોકલો"** (pre-filled Gujarati message + URL) and **"લિંક કોપી કરો"**. Shown in the closing section; a compact share icon may also sit next to the music pill.

### 5.10 Always-present UI
- **Music pill** bottom-left: icon, short track label, animated equaliser bars, tap to pause/play. Pauses on `visibilitychange` and resumes only if it had been playing. Volume ~0.4; loops the chosen 45–75 s segment with a fade at the loop point.
- No top navigation (single short story). Optional small "↑" after a long scroll.

## 6. Visual design system

> **Revision (12 Nov, mid-build — user feedback "5/100, wants red/orange wedding colours, masterpiece, reference-site quality"):**
> the palette below (sage "Kankotri Paper") is **superseded by "Shubh Lagna"**: maroon `#5e0b18` / deep `#3d0710`, kumkum `#b81f2c`,
> marigold `#f59e1b`, saffron `#e8681a`, haldi `#ffc83a`, gold foil gradient (`#a8751f → #fff4cf`), ivory `#fff7e8` / cream `#fbedd2`
> (tokens in `site/src/styles/tokens.css`). Rich maroon sections with Gujarati **bandhani** dot texture alternate with ivory/cream
> sections, joined by cusped **temple-arch edges**; gold-foil headings; a slowly rotating gold **mandala** behind the hero arch;
> marigold strings and twinkling sparks; red kumkum **envelope cover** with gold wax seal and embossed flap; the invitation on an
> **unrolling patra** between gold rods; gold **flip-tile countdown** with rising sky lanterns; maroon moment cards joined by a
> glowing diya; arched map under a marigold gate; **polaroids on a gold string** with pegs; closing **petal rain**; gold scroll thread;
> desktop stage with side mandalas. Names: custom calligraphy plates (Rasa 600 slanted + broad-nib flourishes), gold foil.
> Paper texture: the family card's fibres re-tinted warm (`paper-warm.webp`).


Direction: **"Sage Kankotri, made royal"** — the printed card's identity (sage handmade paper, watercolour leaves, red/purple Gujarati lettering) deepened with deep green + antique gold for the opening and ornaments. The couple photos (green grass and trees, charcoal/silver outfits) sit naturally in this palette. **Chosen 12 Nov from 4 mockups: option B "Kankotri Paper"** — light sage handmade paper with a clearly visible gold-foil damask, ivory envelope with faint gold damask, kumkum-red wax seal "પ ✤ પ", dense marigold torans with brass bells, side marigold garlands, a row of lit diyas, kumkum/purple lettering (`docs/superpowers/mockups/cover-b.png`). User note: "should not look basic — flower garlands and orange are welcome". Name-lettering font: chosen after REA research of reference sites (pending).

| Token | Starting value | Use |
|---|---|---|
| `--green-deep` | `#2F4A43` | envelope, dark bands |
| `--sage` | `#C9D5B5` / paper `#EEF1E4` | backgrounds, paper cards |
| `--ivory` | `#FBF7EE` | content cards, glow |
| `--gold` | `#B8934A` (light `#D9BF7F`) | lines, seal, dividers, icons |
| `--kumkum` | `#C0282D` | ornamental headings (card red) |
| `--purple` | `#3F2D8C` | key text (card's blue-purple) |
| `--marigold` | `#F2A93B` / `#E67E22` | petals, toran |
| `--rose` | `#F2BEB8` → `#CA7373` | petals |

**Type**
- Couple names (and possibly "મંગલ પરિણય"): **hand-lettered Gujarati calligraphy** as SVG (§7.2).
- Gujarati headings: serif Gujarati webfont — shortlist **Rasa**, **Noto Serif Gujarati**; decorative accents may use **Farsan**/**Kumar One** sparingly. Final pick after rendering tests of conjuncts (ગ્ન, ર્થ, ન્દ્ર, ન્સ) on Android + iOS.
- Gujarati body: **Hind Vadodara** (or Mukta Vaani), ≥ 16 px, line-height ≥ 1.7.
- Latin helper text: **Cormorant Garamond** small caps.
- **Never letter-space Gujarati** (breaks shaping); tracking only on Latin text.

**Texture & ornament:** 4–6% paper grain on sage areas; watercolour leaf sprigs; gold hairlines, diamond dividers, arch frames; marigold toran with bells on the cover and closing.

**Motion rules:** the signature motion lives in the opening. Afterwards: gentle fade-ups on scroll (once per section, 400–700 ms), no parallax overload. 60 fps target on mid-range Android; transform/opacity/canvas only.

### 6.1 Mobile-first scroll & reveal rules (user: ~90% of guests on phones)

The core of the site is scroll-and-reveal, designed for phones first:
- **Design canvas 390×844**; must also be checked at **360×740** and **430×932**. Every section is composed as a phone "page" — one idea per screen.
- **Native scroll only on touch devices** (no scroll-jacking; Lenis only on desktop).
- **Triggered, not scrubbed:** each section plays its own short reveal once when it enters (start ≈ top 85% of viewport), 400–700 ms, small moves (16–24 px rise, slight scale, fade). No animations tied to finger position.
- **At most one pinned moment** on mobile, kept only if it is perfectly smooth on a low-end Android in WhatsApp; otherwise unpinned.
- Use `svh`/`dvh` (never `100vh`); `ScrollTrigger.config({ ignoreMobileResize: true })`.
- **Content visible by default** — reveals are progressive enhancement; if JS/animation fails, the invitation still reads completely.
- Actions (Directions, Share, music) in the **thumb zone**; tap targets ≥ 48 px.
- No heavy `filter: blur` / `backdrop-filter` during scroll; 3D canvas **paused when off-screen**; images decoded before they enter.
- **Desktop = the phone composition centred**, with art (leaves, toran, soft petals) filling the sides — no separate desktop layout.
- From the first preview, test inside **WhatsApp's in-app browser** on Android and iPhone.

## 7. Technical approach

Versions checked on npm 12 Nov 2026.

### 7.1 Stack

| Layer | Package (version) | Role |
|---|---|---|
| Build | `vite` 8.3 (Rolldown) + `@vitejs/plugin-react` 6.3 | dev server, build |
| UI | `react` 19.3 | components |
| Styling | `tailwindcss` 4.3 + CSS custom properties | layout, tokens |
| Choreography | `gsap` 3.15 + `@gsap/react` 2.1; free plugins **ScrollTrigger**, **DrawSVG**, **CustomEase**, **Flip** | the only animation engine; one master timeline for the opening |
| 3D celebration scene | `three` 0.187, classic **WebGLRenderer** + hand-written **GLSL** `ShaderMaterial`s (not WebGPU/TSL — WebGL2 has the widest reach in WhatsApp in-app browsers; no visible gain from WebGPU here) | instanced 3D petals with lighting, gold flakes, seal light-leak, light-burst, glow |
| Post-processing | `postprocessing` 6.39 | bloom on gold, vignette, film grain; tier-gated |
| Device tiering | `detect-gpu` 5.0 + own runtime FPS watchdog | pick tier; cut particles live if FPS < ~40 |
| 2D fallback | own `<canvas>` petal physics + `canvas-confetti` 1.9 gold flakes | weak devices / no WebGL2 |
| Smooth scroll | `lenis` 1.3, desktop only (`syncTouch: false`) | weighted scroll on laptops |
| Fonts | `@fontsource/rasa`, `@fontsource/noto-serif-gujarati`, `@fontsource/hind-vadodara`, `@fontsource/cormorant-garamond` | self-hosted, Gujarati subsets |
| Audio | own **Web Audio API** wrapper (GainNode fades work on iOS where `audio.volume` is ignored) | tap-start, fade, loop segment, pause when hidden |
| Images | `sharp` 0.35 script → AVIF + WebP, 2 sizes | photos |
| Share assets | Playwright (render OG card HTML → PNG), `qrcode` 1.5 | link preview, QR |
| Hosting | Vercel free tier | `*.vercel.app`, preview per change |

**Dev-only:** `lil-gui` (live-tune timings/particles/colours on a real phone), `stats-gl` (FPS overlay), Playwright (screenshots at 360/390/430 px), Lighthouse.

**Second deliverable (after launch):** `remotion` 4.0 — a 15–20 s vertical video invite for WhatsApp Status/groups, same art/petals/song, works for both families.

**Rejected:** Framer Motion (duplicates GSAP), Locomotive Scroll (hijacks touch scroll), SCSS (modern CSS suffices), Theatre.js (unmaintained since May 2024), Howler (unmaintained since 2023), React Three Fiber (extra layer; vanilla three driven by GSAP is leaner), WebGPU/TSL (reach), Rive/dotLottie (only if a perfect licensed asset appears).

### 7.2 Signature details

1. **Hand-lettered Gujarati names** — "પ્રિન્સી" and "પાર્થ" as calligraphic SVG paths, revealed as if pen-written (DrawSVG on a centre-line mask over the filled letterforms). Avoids per-letter splitting, which breaks Gujarati conjuncts. Lettering drawn/AI-assisted, traced, hand-cleaned, checked by a Gujarati reader.
2. **Bespoke, consistent art:** watercolour leaves matching the card, marigold toran with bells, wax seal "પ ✤ પ", arch frame, Ganesh medallion, hands motif, dhol/shehnai motif, petal textures from real petal photos (alpha-masked) for the 3D petals.
3. **Render tiers:** **3D-high** (bloom, ~100+ petals), **3D-lite** (no post-processing, fewer petals), **2D fallback** (canvas). Chosen by detect-gpu at load, adjusted live by the FPS watchdog.
4. **Haptic tick** (`navigator.vibrate(15)`) on the seal tap (Android).

### 7.3 Notes

- **Petal physics (both tiers):** launch from both bottom corners at 72° ±22°, 780–1320 px/s, gravity ~900, asymmetric drag (up vs down), sine sway, spin; 3D tier uses real rotation + lighting; 2D fakes flip with `scaleX=|cos θ|`. Reimplemented — not copied from any reference.
- **Content:** single `src/content/wedding.js` — every Gujarati string, the two events, venue + map URL, photo list, music file + loop points, OG text. Optional sections (extra events, calendar button, gallery mode) controlled by flags. Nothing hard-coded in components.
- **Loading strategy:** cover (HTML/CSS/static art) is the only thing on the critical path; three.js + postprocessing + scene assets + music load in the background while the cover is shown. If the guest taps before the 3D scene is ready, play the 2D tier (no waiting spinner).
- **Performance budget:** cover interactive < 2.5 s on 4G; critical-path JS < 150 KB gz; total before tap < 1 MB excluding the lazily-loaded 3D chunk and music; music ≤ 1.5 MB.
- **Link preview:** `og:title` "પ્રિન્સી ❀ પાર્થ — શુભ લગ્ન", `og:description` "રવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ", `og:image` 1200×630 designed card with `couple-facing`, names, monogram. Absolute URLs. Test with the real deployed URL in WhatsApp before sharing.
- **QR code:** gold-on-green PNG + SVG of the final URL.
- **Accessibility:** real buttons with labels; body contrast ≥ 4.5:1; reduced-motion respected; no body text inside images.
- **No backend.** Static site on Vercel; undeploy after the wedding.

## 8. Extra functions (not decided)

The config supports adding events (e.g. pre-wedding functions) as entries with `enabled: false` (date, time, venue, map link). Enabled entries appear in §5.5. Default: only હસ્ત મેળાપ and ભોજન સમારંભ. Any later change must be a config edit.

## 9. Assets

| Asset | Plan |
|---|---|
| Ganesh art | Try extracting from the card PDF (the family's own card); if quality/transparency is poor, a respectful gold line-art medallion. |
| Watercolour leaves, paper texture | Made for the project or free-licensed (or extracted from the PDF background). |
| Toran, seal, arch, dividers, hands, dhol/shehnai, icons | SVG, made for the project or free-licensed. |
| Hand-lettered names | §7.2.1 |
| Petal textures | From real marigold/rose petal photos (licensed), alpha-masked. |
| Photos | §9.1 |
| Music | User supplies (§10). |

### 9.1 The two couple photos (supplied 12 Nov)

| Photo | Used in |
|---|---|
| **couple-facing** — facing each other, smiling (852×1280) | Hero reveal (§5.2) · OG preview image · photo diptych · Remotion opening |
| **couple-walking** — walking away hand in hand (1040×1280) | Closing (§5.8) · photo diptych · Remotion ending |

Treatment: gentle grade toward the palette (greens toward sage, warm highlights, natural skin), fine grain to hide WhatsApp compression, never upscale beyond ~2× display size. Ask for the photographer's originals for a sharper reveal (not blocking).

## 10. Music

- **Lead:** "Judi Jodi" (Ramayana: Part 1, 2026 — A.R. Rahman / Kumar Vishwas / Shreya Ghoshal, Hindi), a song about Ram–Sita's wedding.
- **Short-list to compare** (20–30 s previews prepared once files are supplied; user picks): Judi Jodi · Jashn-e-Bahara instrumental (A.R. Rahman) · Din Shagna Da (common on invite sites — less distinctive) · a shehnai/santoor "mangal dhun" instrumental · a Krishna bansuri instrumental.
- Segment 45–75 s that starts soft under the envelope and lifts around the burst/reveal; loop with fade.
- User sources the files (no downloading songs from unknown sites).

## 11. Schedule (link out Sun 22 – Mon 23 Nov)

| Day | Date | Work |
|---|---|---|
| 1 | Thu 12 – Fri 13 Nov | Opening-screen mockups (2–3 palettes) → user picks; scaffold, content file, fonts, Gujarati rendering check; device tiering |
| 2 | Sat 14 | Art pipeline: seal, toran, arch, leaves, Ganesh, petal textures; hand-lettered names (draft → Gujarati check) |
| 3 | Sun 15 | Cover + envelope + GSAP master timeline; 2D fallback burst; audio engine + music pill |
| 4 | Mon 16 | Three.js scene: 3D petals, gold flakes, GLSL seal light-leak, light-burst, glow, bloom; tiers + FPS watchdog |
| 5 | Tue 17 | Couple reveal (names writing, photo), hero, invitation, countdown |
| 6 | Wed 18 | Two-moment cards, venue + map, photo diptych, closing, share; OG image, QR |
| 7 | Thu 19 | Desktop polish (Lenis), reduced motion, accessibility; performance pass |
| 8 | Fri 20 | Real-device testing (incl. one low-end Android), WhatsApp in-app Android + iOS; live tuning with lil-gui; preview deploy |
| 9 | Sat 21 | Both families' elders proofread + try it on their phones; fixes; final music; map link |
| 10 | Sun 22 – Mon 23 | Production deploy, WhatsApp preview test with the real URL → **share link** |
| after | 24 Nov – 12 Dec | Remotion video invite; originals/more photos; any added events; undeploy after the wedding |

## 12. Inputs needed from the user / family

| # | Item | Needed by |
|---|---|---|
| 1 | Pick palette from mockups | Day 1 |
| 2 | Google Maps link for Atithi Party Plot | Day 6 |
| 3 | Music file(s) — at least Judi Jodi; optional alternatives | Day 3 (placeholder until then) |
| 4 | ✅ Two couple photos (received). Originals / more photos | When available |
| 5 | Elder proofreading from **both** families: the neutral invitation (§5.3), parents' names, closing line, photo caption | Day 9 |

## 13. Calls I made (please check)

1. Countdown targets **હસ્ત મેળાપ 6:00 pm**.
2. Palette: user chose mockup **B · Kankotri Paper** (12 Nov).
3. No cracker sound effect — visual burst only.
4. No top navigation menu.
5. Only **શ્રી ગણેશ** as the deity (Krishna and Ambaji dropped as family-specific).
6. No phone numbers or addresses on the site; one common link (no per-guest names).
7. Neutral invitation text in §5.3 (adapted from the card), signed "મિસ્ત્રી પરિવાર · સોની પરિવાર".
8. Closing line "આપની હાજરી અમારા આનંદને બમણો કરશે." and photo caption "સાથે, હંમેશાં".
9. Two-moment cards instead of a timeline; calendar event 18:00–21:00 (end time a guess).
10. Monogram "પ ✤ પ".
11. Stack per §7.1, hosted on Vercel.

## 14. Left to the builder

Exact easing/timings within the ranges above, component structure, shader details, petal sprite/model art, confetti implementation, icon set, photo-section widget, final font pick among the shortlist after rendering tests, OG image production, and Vercel vs Netlify.
