# Premium wedding / invitation site teardown

**Purpose:** visual and motion references for the Gujarati digital Kankotri (13 Dec 2026, Petlad).
**Method:** REA `capture_browser_scenario` with headless Chrome at 390x844, motion enabled, Asia/Kolkata. Each run waited, clicked, waited, and paged down several times. Screenshots and montages are in `research/screens/<slug>/`, and each `*_montage.jpg` is a numbered contact sheet. I also read the JS modules the pages loaded, to get exact parameters.
**Date:** 12 Nov 2026.

---

## 1. Together Vows (Framer template), the best reference

- **URL:** https://togetherwedding.framer.website/ (marketplace: framer.com/marketplace/templates/together-vows/)
- **Screens:** `screens/together-vows/tv2_montage.jpg`. Frames 6–8 show the petals. Single frames are `tv2_0.png` … `tv2_9.png`, and `tv_0.png` is the first static view.
- **Reveal technique:** a layered envelope overlay. The layer names come from the page module: `Envelope Overlay`, `Flap Top/Left/Right/Bottom`, `Seal`, `Seal Anchor`, `Vellum`, `Top Sheet`, `Lower Sheet`, `Grain`, `Drawn Flora`, `Swash Left/Right`, `Hit Area`. One tap anywhere (`pointerdown`, capture phase, once) starts the timeline.
  - The flap/sheet tween waits 0.55 s, then runs 1.9 s with `ease:[.65,0,.35,1]` (easeInOutCubic). The flaps rotate in X (`rotateX` keyframes).
  - Content then staggers in with delays of 1.15, 1.3, 1.45, 1.55, 1.7, 1.85, 2.0, 2.1, 2.2, 2.35, 2.45 and 2.6 s, roughly 0.1–0.15 s apart. Each element uses 0.7 s at `[.65,0,.35,1]`.
  - The **petal cannon fires at 2.3 s**, and the overlay is set to `display:none` at **2.6 s** (an `EnvelopeAutoHide` code component).
  - Hover and press springs use `{type:'spring', bounce:.2, duration:.4}`.
  - At the 390 px breakpoint the headless capture landed straight on the card. The overlay seems to sit only on the desktop variant, or it was already hidden. Two 1440 px attempts returned more data than REA can send back (over 10 MB), so I did not get desktop frames.
- **Effects and library:** Framer runtime (React and Framer Motion `motion.mjs`) plus a custom `PetalBurst.mjs` code component. It is about 6.7 KB and has no dependencies. I read the whole thing; it is the most reusable code found in this research.
  - **The cannon is a canvas 2D physics burst.** It fires from both bottom corners (inset 5%), aimed at 72° ±22°. Speed is 780–1320 px/s, gravity 900, drag differs on the way up (0.0011) and down (0.009), and terminal velocity is 150. While falling, each petal sways with a sine wave (freq 0.9–2.1, amplitude 26–74 px). It spins at ±5 rad/s, and a **3D flip is faked** with `scaleX = |cos(flip)|`. Petals fade near the floor. The count is 52 per side, scaled to 0.55 when the width is under 640 px. Each petal is a 96 px offscreen canvas, pre-rendered once. It is a bezier teardrop with a two-stop linear gradient (`#FDF2EC → #F2BEB8 → #CA7373`) and a translucent white midrib stroke. DPR is capped at 2. It pauses on `visibilitychange` and does nothing when `prefers-reduced-motion` is set.
  - **Ambient petals are a separate layer.** About 12 DOM divs each use an inline SVG petal as a background image. They are animated with the Web Animations API: translate3d from −10vh to 112vh with random drift (±110 px) and rotation (±310°). Each falls for 13–25 s, linear, looping forever, with a negative delay so the screen is already populated. 30% of them get `blur(1.6px)` for depth of field, and opacity is 0.5–1.
- **Typography:** Bodoni Moda (names in tracked caps) with Allura script ("With all our love"). The body text is a Fontshare grotesk in small tracked caps.
- **Palette and texture:** warm ivory card at about 90% opacity over a soft landscape photo (glass/vellum). Gold hairline swashes around an "&" ornament, a diamond divider, dusty-rose script, and a `Grain` overlay layer. Petals are blush to dusty rose.
- **Mobile layout:** one card holds everything. The date is a 3-column block (day | month-year | time) with hairline dividers, then venue, then a pill-shaped CTA flanked by hand-drawn flora.
- **Music:** none.
- **Verdict: premium.** It feels expensive because of the restraint: one tap, one choreographed 2.6 s sequence, a single short burst, and calm ambient petals afterwards. The physics are real (drag and sway, not linear falls) and the colours are muted.

## 2. Blossom Love (Framer)

- **URL:** https://elegantweddinginvitation.framer.website/
- **Screens:** `screens/blossom-love/bl2_montage.jpg`. Frames 8–12 show the envelope opening.
- **Reveal:** a photoreal, soft-shadow ivory envelope centred on a flat warm-grey field. It is **scroll-driven**: clicking did nothing, but PageDown opened it. The top flap rotates up, the liner shows in a darker taupe, and the card ("Your wedding invitation", italic EB Garamond with a small olive sprig) slides up out of the pocket. The progress is tied to scroll position, so it scrubs.
- **Library:** Framer Motion scroll transforms.
- **Typography:** EB Garamond italic with a Fontshare sans.
- **Palette:** monochrome ivory, greige (#F1EFEC) and taupe liner. The envelope has very subtle inner shadows.
- **Music:** none.
- **Verdict: premium, but quiet.** The envelope modelling (soft paper shadows, layered pocket) is the best part. A tap-to-open would suit a WhatsApp audience better than scroll-to-open.

## 3. The Knot (Framer)

- **URL:** https://theknot.framer.website/
- **Screens:** `screens/the-knot/tk_montage.jpg`, with `tk_0.png` for the paper intro and `tk_2.png` for the hero reveal.
- **Reveal:** the full screen is **textured handmade paper** with a debossed envelope-flap curve and "You're invited to" in spaced italic serif. One tap wipes to a full-bleed **black-and-white close-up couple photo**. Names in large Playfair Display ("Sarah & Samuel") sit over a "THE WEDDING OF" kicker, and the date is at the bottom. A sticky header appears after the reveal.
- **Library:** Framer Motion.
- **Typography:** Playfair Display, with a Fontshare sans in small tracked caps.
- **Palette and texture:** warm stone (#E9E6DD) paper texture, B&W photography, and cream cards.
- **Mobile layout:** "Our venue" (copy, photo, address with an outlined "Google Maps" button), then "Details" as stacked hairline-bordered cards with line icons (Ceremony, Reception, Attire, Travel, Accommodation, Contact).
- **Music:** none.
- **Verdict: premium.** It moves from a paper texture straight to a cinematic B&W portrait, which is exactly the "big couple reveal" beat. The detail cards are very clean.

## 4. Romeo & Juliet (Framer)

- **URL:** https://romeoandjuliet.framer.website/
- **Screens:** `screens/romeo-juliet/rj_montage.jpg`. `rj_0.png` shows text on a curve and `rj_1.png` shows it straightened.
- **Reveal:** a **text-on-path preloader**. "Romeo & Juliet's Special Day" starts on a wavy path and straightens into two lines. It then crossfades to the hero: script "You're Invited!", location and date, and an outlined "Rsvp Here" pill.
- **Effects:** SVG line art draws in (a heartbeat line with a heart, a dashed curved arrow), photos reveal on scroll, and the venue uses Google Maps embeds.
- **Typography:** Instrument Serif (condensed display), Herr Von Muellerhoff (signature script), and Instrument Sans for body.
- **Palette:** parchment (#F5F1E6), warm brown ink and film-tone photos.
- **Mobile layout:** a long story scroll with alternating photo and copy blocks, then a map embed per venue.
- **Music:** none.
- **Verdict: mid-premium.** The curved-text intro and the signature script are elegant. The rest is a standard story scroll.

## 5. Wedfully (Framer)

- **URL:** https://wedfully.framer.website/
- **Screens:** `screens/wedfully/wf_montage.jpg`. `wf_6.png` is the scratch card.
- **Reveal:** an autoplay muted hero video (`res.cloudinary.com/.../wedfully_banner_video.mp4`) with giant Playfair names, then a **"Save The Date: Scratch to Reveal" card in deep green (#2F4A43-ish)**. The guest scratches (canvas) to uncover the date.
- **Then:** count-up stat tiles ("2 Hearts Becoming One", "3 Beautiful Gatherings"), and a vertical timeline with year markers and dark-green story cards.
- **Typography:** Playfair Display with Manrope.
- **Palette:** deep bottle green, ivory and antique gold line icons. This is **very close to sage-green plus gold**.
- **Music:** none. The only media is the muted banner MP4.
- **Verdict: premium-ish.** The scratch-to-reveal is a memorable interaction that suits mobile.

## 6. Ulems "Undangan" (Indonesian open source, dewanakl/undangan)

- **URL:** https://ulems.my.id/?to=Teman%20teman%20semua (repo: github.com/dewanakl/undangan)
- **Screens:** `screens/ulems/ul_montage.jpg`. `ul_1.png` is the preloader, `ul_2.png` the cover, `ul_3.png` and `ul_4.png` the confetti burst, `ul_6.png`–`ul_8.png` the heart rain, and `ul_15.png` the countdown and events.
- **Reveal:** a preloader with a percentage bar ("Loading image complete (15/22)"), then a cover. The cover shows a personalised guest name from `?to=`, a circular photo, script names, and an "Open Invitation" button. Tapping it fires a custom `undangan.open` event, which plays the music, fires a confetti burst from the bottom, and starts the heart rain.
- **Effects and library:** **canvas-confetti 1.9.3** and **AOS 2.3.4** for scroll reveals. Bootstrap 5 and Font Awesome are also loaded. Exact code from `dist/guest.js`:
  - The burst is `confetti({origin:{y:1}, zIndex:1057})`.
  - The rain is a **custom shape via `confetti.shapeFromPath({path: <heart SVG path>, matrix})`**. A 15 s rAF loop emits `particleCount:1, startVelocity:0` per colour (`#FFC0CB #FF1493 #C71585`). `ticks` decays over the duration, origin is `x:random`, drift ±0.5, gravity 0.5–1 and scalar 0.5–1. The result is particles drifting down like petals.
  - Liking a wish fires two side cannons (angle 60/120, spread 55) from the button's edges.
- **Typography:** Sacramento script, Josefin Sans and Noto Naskh Arabic (for the Bismillah).
- **Mobile layout:** a fixed bottom tab bar (Home / Mempelai / Tanggal / Galeri / Ucapan), floating dark-mode and music toggles at bottom right, and a wave SVG section divider. The countdown is "1046 Hari 01 Jam 47 Menit 43 Detik" in a pill. Events are listed as Akad and Resepsi with times, plus a dress code, guestbook comments and a gift/donation section.
- **Music:** see the table. It uses `new Audio(url)` with `loop=true`, starts on the Open tap, and has a round toggle button (`fa-circle-pause` spinning while playing, `fa-circle-play` when paused). It pauses when the device goes offline.
- **Verdict: functional, not premium.** The animation is generic: stock picsum images, saturated pink hearts and Bootstrap chrome. The **architecture is a very good model**, though: tap gate, then music, then burst, then ambient rain, then bottom nav, plus the personalised `?to=` name. Indonesian invites standardise this pattern.

## 7. Rudra Shahdeo wedding (Indian, Hindi, open source)

- **URL:** https://rudrashahdeo.netlify.app/ (repo: github.com/vinitshahdeo/wedding-website)
- **Screens:** `screens/rudra-shahdeo/rs_montage.jpg`
- **Reveal:** none. It is a static Devanagari card with purple watercolour florals in the corners.
- **Effects:** **jQuery-Sakura** (`cdn.jsdelivr.net/gh/timoschaefer/jQuery-Sakura`), which gives falling cherry-blossom petals, and a `setInterval` countdown that writes `innerHTML`.
- **Typography:** Modak and Bakbak One (heavy Hindi display), Poppins and Dancing Script.
- **Music:** `assets/mp3/background.mp3`, which is "Din Shagna Da" (Phillauri, 2017), per a comment in `js/script.js`. It starts on **any click on the document**, with no visible control.
- **Verdict: cheap.** The display faces are heavy, the purple is flat, there is no choreography and no mute control. It is useful as the "Avoid" baseline for an Indic-script invite. Its lesson is that an emotive regional song makes the card land with Indian guests.

## 8. Michelle & Tonye (Awwwards Mobile of the Week; Honorable Mention, Feb 2021)

- **URL:** https://www.michelleandtonye.com/
- **Screens:** `screens/michelle-tonye/mt_montage.jpg`. `mt_0.png` is the illustrated loader and `mt_1.png` the hero.
- **Reveal:** an illustrated couple loader ("LOADING…"), then a full-bleed duotone photo darkened to a warm brown. "Michelle & Tonye" is set in Lily Script One, with a giant terracotta "&" behind it. A **rotating circular-text badge** ("We did it - We got married - Praise Jesus" around a smiley) sits over the photo.
- **Effects and library:** Gatsby (React). I found **Locomotive Scroll** in the bundle (`data-scroll-speed` appears 53 times, plus `lerp` and `smooth:!0`) and **Lottie**. Parallax layers, rotated (about −15°) date cards ("19 March"), an angled photo-tile grid, and a dotted vertical guide line all move at different scroll speeds.
- **Typography:** Lily Script One, Anton, Pragati Narrow and Pacifico.
- **Palette:** espresso (#2A1F15), cream and terracotta.
- **Music:** none.
- **Verdict: premium (editorial).** Its strengths are parallax depth, the rotating badge, and confident type scale. It is a good model for after the reveal, but too busy for a Kankotri as a whole.

## 9. Yuri & Tomoro (Japanese, built with STUDIO; listed on Awwwards)

- **URL:** https://wedding.s-tmro.com/
- **Screens:** `screens/s-tmro/st_montage.jpg`
- **Reveal:** an editorial asymmetric hero. Two offset portrait photos, a large "Wedding Invitation" in a grotesk, and a **curved-mask landscape photo** (concave top edge). The date is set in big numerals ("2026.11.29 (Sun)") with hairline rules.
- **Library:** **Lenis 1.3.26** for smooth scroll, plus STUDIO's own animations.
- **Typography:** Stack Sans Headline/Notch for Latin, **Zen Old Mincho** for Japanese body (vertical rhythm, generous leading) and Italianno for script ("for you", "Fuku"). This is a good model for **pairing a native-script serif with a Latin script accent**.
- **Palette:** light grey (#EFEFEF), black ink, and accents in green, orange and beige botanical prints (from a dress-code section). The section edges are skewed or diagonal.
- **Music:** none.
- **Verdict: premium.** The native-script typography is treated as the hero rather than translated. It has lots of white space and slow Lenis scroll.

## 10. Colors & Promises (Indian vendor storefront, Lovable)

- **URL:** https://colorsnpromises.lovable.app/
- **Screens:** `screens/colors-n-promises/cp_montage.jpg`
- This is a storefront selling **animated illustrated video invites** (from ₹999 / ₹3,500), not an invite site itself.
- **Art direction:** hand-illustrated couples in palace courtyards, sky lanterns and jharokha arches. Cormorant Garamond, Great Vibes and Plus Jakarta Sans are used on blush (#FFF4EF) with crimson and gold.
- **Music:** none on the site. Their videos have "music & elegant transitions".
- **Verdict:** illustration style relevant for Indian guests (arch frame, lantern sky); the site itself is ordinary.

## 11. Contra "Interactive cinematic wedding invitation" (Figma Make)

- **URL:** https://volume-coral-44812255.figma.site/
- **Screens:** `screens/figma-cinematic/fc_montage.jpg`
- It shows "This experience is designed for desktop" on mobile. The interactions are mouse-only: hold, drag, scratch and dwell. It is built with React, Motion and Tailwind (Playfair Display and DM Sans).
- **Verdict:** an anti-pattern for WhatsApp sharing. Nearly every guest opens on a phone.

## Not captured

- **Greenvelope Padma** (sage peacock and pink lotus, Castellar and Crimson) and **Lovephool** returned a Cloudflare block page (`screens/greenvelope-padma/`).
- **Lovable Evermore** has no public preview URL.
- The **Pareshbafna** Notion portfolio needs JS rendering, and I found no demo links.
- The **wedding20251012-ny.studio.site** capture exceeded REA's output limit.

---

## Patterns worth adopting

1. **One tap, one choreographed timeline.** This is the Together Vows model. The gate is a seal or envelope with one `pointerdown`. Then: about 0.5 s pause, a 1.5–1.9 s flap open with easeInOutCubic `[.65,0,.35,1]`, content staggered 0.1–0.15 s apart starting at about 1.1 s, a petal burst at about 2.3 s, and the overlay removed at about 2.6 s. Use the same tap to unlock audio (browser autoplay rule).
2. **A physics petal cannon from both bottom corners, not generic confetti.** Use the PetalBurst parameters above: drag differs going up and down, sine sway, `scaleX=|cos|` flip, pre-rendered gradient petal sprites. For Gujarat, recolour to **marigold (#F4A300 → #E07A00) and rose (#F2BEB8 → #B23A48)** plus a few sage leaves. Halve the count on mobile.
3. **Ambient petals afterwards, kept sparse.** Use 10–14 WAAPI or CSS petals with slow 13–25 s falls, a negative delay, and 30% blurred for depth. Alternatively use `canvas-confetti` `shapeFromPath` with a petal path and `startVelocity:0`, as ulems does. Turn it off for `prefers-reduced-motion`.
4. **Paper is the hero texture.** Use The Knot's handmade-paper full screen with a debossed flap, plus Together Vows' `Grain` and `Vellum` layers. For you, **scan or photograph the actual sage handmade card** and use it as the background. Add a subtle SVG `feTurbulence` grain or noise PNG at 4–6% on top.
5. **Big couple reveal as a cinematic wipe.** Go from paper to a full-bleed portrait (The Knot), with names in a large high-contrast serif over it. A slight scale from 1.08 to 1.0 on the photo while it fades in reads as cinematic.
6. **Personalised greeting via `?to=` guest name** (ulems). Render it in Gujarati on the cover; it is excellent for WhatsApp links.
7. **Hairline-card details, one per event**, each with a line icon and a Maps button (The Knot). For a single-day Kankotri, use a vertical timeline of rituals (Ganesh sthapana, mandap muhurat, hast melap, bhojan) styled like Wedfully's timeline.
8. **Native-script typography as the hero** (s-tmro with Zen Old Mincho). Do the same for Gujarati, with a Latin or script accent used sparingly.
9. **A floating round music toggle** with a slowly spinning icon while playing (ulems). Put it bottom-right, 44 px, with a translucent ivory fill.
10. **Smooth scroll** (Lenis) and SVG line-art draw-ins (Romeo & Juliet's heartbeat line). For you, a toran or bel motif can draw in under each heading.

## Avoid

- Desktop-only or mouse-only interactions (Figma cinematic).
- Saturated multicolour rectangular confetti and Bootstrap chrome (ulems burst). It reads as a birthday party.
- Heavy, flat display faces in a single flat colour (Rudra Shahdeo, Modak in purple).
- Music that starts on an arbitrary click with no mute control (Rudra Shahdeo).
- Scroll-to-open as the only gate (Blossom Love). WhatsApp users tap, and a scroll gate also fights pull-to-refresh.
- Preloaders that show technical progress text ("Loading image complete 15/22"). Use a short branded motif instead.
- Too many simultaneous effects (Michelle & Tonye's parallax plus badge plus tilted cards) on a devotional invitation.

## Music findings

| Site | Exact audio URL | Track / genre | Trigger | Control UI |
|---|---|---|---|---|
| Ulems (Indonesian) | https://ulems.my.id/assets/music/pure-love-304010.mp3 (audio/mpeg, 2,514,442 bytes) | "Pure Love". The filename `-304010` matches the Pixabay royalty-free naming pattern (id 304010). Not listened to; the name suggests soft romantic instrumental. | `undangan.open` event fired by the "Open Invitation" tap (a user gesture), `loop=true` | Floating round button at bottom right: `fa-circle-pause` with a spin animation while playing, `fa-circle-play` when paused. Pauses when offline. |
| Rudra Shahdeo (Indian) | https://rudrashahdeo.netlify.app/assets/mp3/background.mp3 | "Din Shagna Da" (Phillauri, 2017). Bollywood, Punjabi bridal entry song, named in a `js/script.js` comment. | `$(document).on('click')`, so any click plays it. Loops per the README. | None visible |
| Wedfully (Framer) | https://res.cloudinary.com/qqtvy6b6/video/upload/v1789580512/wedfully_banner_video.mp4 | Hero video, autoplay muted, no music | autoplay | none |
| Ulems | https://ulems.my.id/assets/video/265501_tiny.mp4 | Story video (Pixabay-style id) | IntersectionObserver play/pause, muted | native controls after load |
| Together Vows, Blossom Love, The Knot, Romeo & Juliet, Michelle & Tonye, s-tmro, Colors & Promises, Figma cinematic | none | none | none | none |

**Takeaways for the Kankotri:**

- The premium Western templates ship with **no music**. Indian and Indonesian invites treat music as standard. Use music, but gate it behind the open tap and always show a toggle.
- Use a **royalty-free shehnai or santoor instrumental**, or a soft instrumental of a Gujarati lagna geet (for example "Mangal Fera" or "Kesariya" style), at about 0.35 volume with a 1.5 s fade-in. Keep the file at 96–128 kbps mono, about 1.5–2.5 MB.
- Pause on `visibilitychange`, since WhatsApp's in-app browser stays open in the background.
