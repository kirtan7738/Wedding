# પ્રિન્સી ❀ પાર્થ Wedding Invitation Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, Gujarati-only, family-neutral wedding invitation website with a cinematic tap-to-open → 3D petal/gold burst → couple reveal, deployed on a free Vercel URL by 22–23 Nov 2026.

**Architecture:** A Vite + React single page, prerendered to static HTML at build time (content readable even if JS fails) and hydrated on the client. All wedding content lives in one config module. The opening is one GSAP master timeline that drives either a lazily-loaded Three.js/GLSL celebration scene (high/lite tiers) or a 2D canvas fallback, chosen by a device-tier module. Sections reveal once when they enter the viewport (triggered, never scrubbed), using native scroll on touch devices.

**Tech Stack:** vite 8.3, react 19.3, tailwindcss 4.3 (`@tailwindcss/vite`), gsap 3.15 (+ScrollTrigger, DrawSVG, CustomEase, Flip) + `@gsap/react` 2.1, three 0.187, postprocessing 6.39, detect-gpu 5.0, canvas-confetti 1.9, lenis 1.3, @fontsource (rasa, noto-serif-gujarati, hind-vadodara, cormorant-garamond), sharp 0.35, qrcode 1.5, harfbuzzjs 1.6 (build-time lettering), vitest 5.1 + jsdom 31 + @testing-library/react 16.3, @playwright/test 1.65, lil-gui 0.21 + stats-gl 4.2 (dev only), Vercel CLI 65. Node 24, plain JavaScript (ESM, JSX).

**Spec:** `docs/superpowers/specs/2026-11-12-kankotri-website-design.md` (read it in full before any task; section numbers below refer to it). Gujarati source text and proofreading flags: `research/kankotri-content.md`.

## Global Constraints

- Repo root: `C:\Users\OMEN\Desktop\wed` (git repo created in Task 1). App lives in `site/`. All commands run from `site/` unless stated.
- **Gujarati only** on screen; English only as small helper labels next to an action ("Tap to open", "Directions"). No language toggle.
- **Never apply `letter-spacing`/tracking to Gujarati text** (breaks conjunct shaping). Tracking allowed only on Latin helper text.
- **Never split Gujarati text into characters** for animation (no SplitText on Gujarati). Names animate via SVG outline drawing (Task 5).
- Removed content must never appear: no મોસાળપક્ષ, સ્નેહાધિન, ટહુકો, નિમંત્રક, home address, phone numbers, morning rituals, જય શ્રી કૃષ્ણ, અંબાજી (spec §4.1). Only deity: ॥ શ્રી ગણેશાય નમઃ ॥.
- Events: exactly **હસ્ત મેળાપ — સાંજે ૬:૦૦ કલાકે (18:00)** and **ભોજન સમારંભ — સાંજે ૬:૩૦ કલાકે (18:30)** on **2026-12-13, IST (+05:30)**. Countdown target `2026-12-13T18:00:00+05:30`.
- Date strings: **રવિવાર, ૧૩ ડિસેમ્બર ૨૦૨૬**; **સંવત ૨૦૮૩, માગશર સુદ-૪**. Venue: **અતિથી પાર્ટી પ્લોટ, દાવલપુરા રોડ, મુ. પેટલાદ તા. પેટલાદ જી. આણંદ**.
- Mobile-first: design at **390×844**; must pass at **360×740** and **430×932**; desktop (≥1024 px) = the phone composition centred with decorative art on the sides. No separate desktop layout.
- Native scroll on touch devices; `lenis` only when `(pointer: fine)` and width ≥ 1024, with `syncTouch: false`.
- Section reveals are **triggered, not scrubbed**: start at `top 85%`, play once, 400–700 ms, translate ≤ 24 px. At most one pinned section on mobile.
- Use `svh`/`dvh`, never `100vh`. Call `ScrollTrigger.config({ ignoreMobileResize: true })` once.
- **Content visible by default:** prerendered HTML shows every section; the `js` class on `<html>` (set by an inline head script) is what hides reveal targets; a 4 s fail-safe removes `js` if the app never boots.
- Tap targets ≥ 48×48 px; actions in the bottom half of the screen where a choice exists.
- `prefers-reduced-motion: reduce` → no burst, no ambient petals, no reveal motion (opacity-only, ≤ 300 ms), cross-fade from cover to hero.
- Palette tokens (spec §6) live only in `site/src/styles/tokens.css` as CSS custom properties; components never hard-code hex values.
- Performance budget: cover interactive < 2.5 s on Fast 4G; critical-path JS < 150 KB gzip; everything before the tap < 1 MB excluding the lazy 3D chunk and music; music ≤ 1.5 MB.
- Reimplement effects; **do not copy code** from reference sites (research notes describe techniques only).
- Assets must be made for the project, extracted from the family's own card PDF, or OFL/free-licensed (record the source in `site/ASSETS.md`).
- Body Gujarati ≥ 16 px, line-height ≥ 1.7; body text contrast ≥ 4.5:1.
- No secrets in the repo. Vercel login is done by the user (`! vercel login`), never by the agent.

## Review Focus

1. **Guest taps the seal before the 3D chunk or the music has finished loading** → the opening still starts instantly using the 2D tier (no spinner, no dead tap); music joins when ready or is skipped silently. Test owned by Task 9.
2. **Guest's phone is not on IST** (relatives abroad) → countdown and "today"/"after" states are still computed against IST. Test owned by Task 2 (run with `TZ=America/New_York` and `TZ=Asia/Kolkata`).
3. **Guest switches to another WhatsApp chat / locks the phone mid-song** → music pauses; on return it resumes only if it was playing before. Test owned by Task 7.
4. **Small Android with large system text (text zoom ~130%)** → no horizontal overflow, names and cards not clipped at 360 px. Test owned by Task 15.
5. **WebGL unavailable, context lost, or FPS collapses mid-burst** → falls back to 2D (or static) — never a black or frozen screen; double-tapping the seal does not start the opening twice. Tests owned by Tasks 8, 9 and 10.

---

## File Structure

```
wed/
├─ .gitignore                      research/raw, research/screens, .playwright-mcp, node_modules, dist*, *.jpeg in root
├─ assets/photos/                  couple-facing.jpeg, couple-walking.jpeg (source, untouched)
├─ docs/superpowers/{specs,plans}/
└─ site/
   ├─ index.html                   head meta, OG tags, inline `js`-class script + fail-safe, <!--app--> slot
   ├─ vite.config.js  vitest.config.js  playwright.config.js  package.json  vercel.json
   ├─ ASSETS.md                    source + licence of every asset
   ├─ scripts/
   │  ├─ prerender.mjs             SSR bundle → dist/index.html
   │  ├─ images.mjs                sharp: grade + grain → AVIF/WebP (2 sizes) into public/img/
   │  ├─ lettering.mjs             harfbuzzjs: shape Gujarati with a TTF → SVG outline paths
   │  ├─ extract-pdf.py            pymupdf: export images from the card PDF to assets/extracted/
   │  ├─ og.mjs                    Playwright: render /og.html → public/og.png (1200×630)
   │  ├─ qr.mjs                    qrcode: gold-on-green QR PNG + SVG
   │  └─ budget.mjs                fails if bundle budgets exceeded
   ├─ fonts-src/                   OFL TTFs used only by lettering.mjs (+ OFL.txt each)
   ├─ public/                      img/, audio/, og.png, qr.png/svg, favicon.svg
   ├─ e2e/                         Playwright specs
   └─ src/
      ├─ main.jsx                  hydrateRoot + boot (marks app booted)
      ├─ entry-server.jsx          prerender entry
      ├─ App.jsx                   section order (spec §5)
      ├─ content/wedding.js        ALL content (single source of truth)
      ├─ styles/tokens.css  styles/base.css  styles/fonts.css
      ├─ lib/gujarati.js  lib/time.js  lib/share.js  lib/audio.js  lib/tier.js  lib/reveal.js  lib/scroll.js
      ├─ fx/petalPhysics.js  fx/Petals2D.js  fx/goldBurst2D.js
      ├─ fx/three/CelebrationScene.js  fx/three/shaders/*.glsl.js  fx/three/petalGeometry.js
      ├─ opening/timeline.js  opening/useOpening.js
      ├─ dev/tune.js               lil-gui + stats-gl, only when `?tune` and import.meta.env.DEV or `?tune=1` on preview
      ├─ assets/lettering/*.svg  assets/ornaments/*.svg
      └─ components/
         Cover.jsx  OpeningLayer.jsx  Hero.jsx  NameLettering.jsx  Invitation.jsx  Countdown.jsx
         Moments.jsx  Venue.jsx  Photos.jsx  Closing.jsx  ShareBar.jsx  MusicPill.jsx
         SkipButton.jsx  Reveal.jsx  DesktopFrame.jsx  Ornament.jsx
```

---

### Task 1: Scaffold, tooling, tokens, fonts, test harness

**Files:**
- Create: `.gitignore`, `site/package.json`, `site/vite.config.js`, `site/vitest.config.js`, `site/playwright.config.js`, `site/index.html`, `site/src/main.jsx`, `site/src/App.jsx`, `site/src/styles/tokens.css`, `site/src/styles/base.css`, `site/src/styles/fonts.css`, `site/e2e/smoke.spec.js`

**Interfaces:**
- Produces: npm scripts `dev` (`vite --host`), `build`, `preview`, `test` (vitest run), `e2e` (playwright test); Playwright projects `m390` (390×844, isMobile, hasTouch, DPR 3), `m360` (360×740), `m430` (430×932), `desktop` (1440×900), `nowebgl` (m390 + launch args `--disable-webgl --disable-3d-apis`), `reduced` (m390 + `reducedMotion: 'reduce'`); CSS custom properties from spec §6 table (`--green-deep`, `--sage`, `--paper`, `--ivory`, `--gold`, `--gold-light`, `--kumkum`, `--purple`, `--marigold`, `--marigold-deep`, `--rose-light`, `--rose-deep`); font families `--font-gu-display` (Rasa), `--font-gu-serif` (Noto Serif Gujarati), `--font-gu-body` (Hind Vadodara), `--font-latin` (Cormorant Garamond).

- [ ] **Step 1:** `git init` at repo root on branch `main`, write `.gitignore` (node_modules, `site/dist*`, `research/raw/`, `research/screens/`, `.playwright-mcp/`, root `WhatsApp Image*.jpeg`).
- [ ] **Step 2:** In `site/`, `npm create vite@latest . -- --template react`, then install exact deps from Tech Stack (runtime: react, react-dom, gsap, @gsap/react, three, postprocessing, detect-gpu, canvas-confetti, lenis, @fontsource/*; dev: tailwindcss, @tailwindcss/vite, vitest, jsdom, @testing-library/react, @playwright/test, sharp, qrcode, harfbuzzjs, lil-gui, stats-gl). `npx playwright install chromium webkit`.
- [ ] **Step 3: Write the failing smoke test** `e2e/smoke.spec.js`:
  ```js
  test('page renders Gujarati title and has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/પ્રિન્સી/);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const fam = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(fam).toContain('Hind Vadodara');
  });
  ```
- [ ] **Step 4:** Run `npm run e2e -- --project=m390 e2e/smoke.spec.js` → FAIL (title).
- [ ] **Step 5:** Implement: `index.html` with `<html lang="gu">`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `<title>પ્રિન્સી ❀ પાર્થ — શુભ લગ્ન</title>`, theme-color `#2F4A43`; tokens.css with spec §6 values; fonts.css importing only the Gujarati + latin subsets/weights needed (Rasa 500/700, Noto Serif Gujarati 600, Hind Vadodara 400/600, Cormorant Garamond 500 italic+regular) with `font-display: swap`; base.css (Tailwind import, body uses `--font-gu-body`, `--paper` background, `min-height: 100svh`, `-webkit-text-size-adjust: 100%`, a `.gu` utility that forces `letter-spacing: 0`). Playwright `webServer` runs `npm run build && npm run preview -- --port 4173`.
- [ ] **Step 6:** Run smoke on all projects → PASS. Run `npm run dev` and open `http://<PC-LAN-IP>:5173` on the user's phone once (record result in commit message).
- [ ] **Step 7: Commit** `chore: scaffold vite+react site with tokens, fonts, test harness`.

---

### Task 2: Content module and pure helpers (Gujarati digits, IST time, share links)

**Files:**
- Create: `site/src/content/wedding.js`, `site/src/lib/gujarati.js`, `site/src/lib/time.js`, `site/src/lib/share.js`
- Test: `site/src/content/wedding.test.js`, `site/src/lib/gujarati.test.js`, `site/src/lib/time.test.js`, `site/src/lib/share.test.js`

**Interfaces:**
- Produces:
  - `wedding` (default export) with keys: `couple { bride: 'પ્રિન્સી', groom: 'પાર્થકુમાર', monogram: 'પ ✤ પ' }`, `invocation: '॥ શ્રી ગણેશાય નમઃ ॥'`, `dateText`, `samvatText`, `dateISO: '2026-12-13'`, `countdownTarget: '2026-12-13T18:00:00+05:30'`, `invitation { lines: string[] }` (spec §5.3 text, verbatim, one entry per displayed line, bold spans marked with `**…**`), `signoff: 'મિસ્ત્રી પરિવાર · સોની પરિવાર'`, `events: [{ id, name, timeText, start, end, highlight, enabled }]` (hast-melap `2026-12-13T18:00:00+05:30`, end `…21:00…`, highlight true; bhojan `…18:30…`), `venue { name, address, mapsUrl, embedUrl, mapsUrlIsPlaceholder: true }`, `photos: [{ id, alt, srcBase, focus }]` (`couple-facing`, `couple-walking`), `music { src: null, label, loopStart, loopEnd, volume: 0.4 }`, `copy { openCta: 'આમંત્રણ ખોલો', openHelper: 'Tap to open', skip: 'છોડો ›', scrollCue: 'નીચે સ્ક્રોલ કરો', directions: 'દિશા જુઓ', directionsHelper: 'Directions', share: 'WhatsApp પર મોકલો', copyLink: 'લિંક કોપી કરો', closing: 'આપની હાજરી અમારા આનંદને બમણો કરશે.', photoCaption: 'સાથે, હંમેશાં', todayText: 'આજે શુભ દિવસ છે!', afterText: 'શુભ લગ્ન સંપન્ન — આપના આશીર્વાદ બદલ આભાર', calendar: 'કેલેન્ડરમાં ઉમેરો' }`, `share { message, url }`, `og { title, description }`.
  - `toGujaratiDigits(value: string | number): string`
  - `countdownParts(nowMs: number, targetIso: string): { days, hours, minutes, seconds, totalMs }` (never negative; zeros after target)
  - `countdownState(nowMs: number, targetIso: string): 'before' | 'today' | 'after'` — `'today'` when the IST calendar date of `nowMs` equals the target's IST date and `nowMs < target`
  - `whatsappShareUrl(message: string, url: string): string` → `https://wa.me/?text=<encodeURIComponent(message + '\n' + url)>`
  - `googleCalendarUrl(ev: { title, start, end, location, details }): string` (dates in UTC `YYYYMMDDTHHMMSSZ`)
  - `buildIcs(ev): string` (CRLF lines, `BEGIN:VCALENDAR` … `DTSTART:20261213T123000Z` for 18:00 IST, UTF-8 Gujarati SUMMARY)

- [ ] **Step 1: Write failing tests.** Key assertions:
  ```js
  expect(toGujaratiDigits('13/12/2026')).toBe('૧૩/૧૨/૨૦૨૬');
  expect(toGujaratiDigits(7)).toBe('૭');
  const T = '2026-12-13T18:00:00+05:30';
  expect(countdownParts(Date.parse('2026-12-12T18:00:00+05:30'), T)).toMatchObject({ days: 1, hours: 0, minutes: 0, seconds: 0 });
  expect(countdownParts(Date.parse('2026-12-14T00:00:00+05:30'), T).totalMs).toBe(0);
  expect(countdownState(Date.parse('2026-12-13T00:30:00+05:30'), T)).toBe('today');   // 19:00 UTC on 12th
  expect(countdownState(Date.parse('2026-12-12T23:59:00+05:30'), T)).toBe('before');
  expect(countdownState(Date.parse('2026-12-13T18:00:00+05:30'), T)).toBe('after');
  expect(buildIcs(ev)).toContain('DTSTART:20261213T123000Z');
  expect(whatsappShareUrl('શુભ લગ્ન', 'https://x.vercel.app')).toBe('https://wa.me/?text=' + encodeURIComponent('શુભ લગ્ન\nhttps://x.vercel.app'));
  // content guards (spec §4.1 / Global Constraints)
  const all = JSON.stringify(wedding);
  for (const banned of ['મોસાળ', 'સ્નેહાધિન', 'ટહુકો', 'નિમંત્રક', 'અંબાજી', 'કૃષ્ણ', '99240', '૯૯૨૪૦', 'રાધે કોમ્પ્લેક્ષ']) expect(all).not.toContain(banned);
  expect(wedding.events.filter(e => e.enabled).map(e => e.id)).toEqual(['hast-melap', 'bhojan']);
  expect(wedding.invitation.lines.join(' ')).toContain('નિર્ધારેલ છે');
  ```
- [ ] **Step 2:** `npx vitest run src/lib src/content` → FAIL (modules missing).
- [ ] **Step 3:** Implement the four modules. Time math must use fixed `+05:30` offset arithmetic (no reliance on the host timezone). Add a `test:tz` script: `cross-env TZ=America/New_York vitest run src/lib/time.test.js && cross-env TZ=Asia/Kolkata vitest run src/lib/time.test.js` (add `cross-env` dev dep).
- [ ] **Step 4:** `npm test && npm run test:tz` → PASS.
- [ ] **Step 5: Commit** `feat: content module and IST/Gujarati/share helpers`.

---

### Task 3: App shell — prerender, reveal system, scroll, desktop frame

**Files:**
- Create: `site/src/entry-server.jsx`, `site/scripts/prerender.mjs`, `site/src/lib/reveal.js`, `site/src/lib/scroll.js`, `site/src/components/Reveal.jsx`, `site/src/components/DesktopFrame.jsx`
- Modify: `site/index.html` (inline head script + `<!--app-->`), `site/src/main.jsx` (hydrateRoot), `site/src/App.jsx` (placeholder sections in spec §5 order with `id`s: `hero`, `invitation`, `countdown`, `moments`, `venue`, `photos`, `closing`), `site/package.json` (`build` = client build + `vite build --ssr src/entry-server.jsx --outDir dist-ssr` + `node scripts/prerender.mjs`)
- Test: `site/e2e/shell.spec.js`, `site/src/lib/reveal.test.js`

**Interfaces:**
- Produces:
  - `<Reveal as="section" id delay={0}>` — renders children visible in HTML; on the client registers a ScrollTrigger (`start: 'top 85%'`, `once: true`) that animates `[data-reveal]` children from `{opacity:0, y:20}` (reduced motion: opacity only, 300 ms).
  - `initScroll(): () => void` — sets `ScrollTrigger.config({ ignoreMobileResize: true })`; enables Lenis only if `matchMedia('(pointer: fine) and (min-width: 1024px)')`; returns cleanup.
  - `markBooted()` in `main.jsx` → sets `window.__booted = true`; the inline head script adds `js` to `<html>` and after 4000 ms removes it if `!window.__booted`.
  - `<DesktopFrame>` — on ≥1024 px centres a 430 px column, side art slots (filled in Task 6).

- [ ] **Step 1: Write failing e2e tests** in `shell.spec.js`:
  - `content readable with JavaScript disabled` (context `javaScriptEnabled: false`): `#invitation` and `#moments` visible, text `હસ્ત મેળાપ` visible.
  - `fail-safe shows content if app never boots`: route-abort `**/assets/*.js`, wait 4500 ms, assert `#moments` opacity is `1`.
  - `sections reveal once on scroll` (m390): scroll `#moments` into view, wait 800 ms, opacity `1`; scroll up/down again, no re-hide.
  - `desktop centres the column` (desktop): main column width ≤ 430 and horizontally centred (±2 px).
- [ ] **Step 2:** `npm run e2e -- e2e/shell.spec.js` → FAIL.
- [ ] **Step 3:** Implement prerender (React 19 `prerender` from `react-dom/static`, inject into `dist/index.html` at `<!--app-->`), hydration, reveal, scroll, frame. GSAP/three/Lenis imports only inside effects (SSR-safe).
- [ ] **Step 4:** Run e2e on m390, m360, desktop → PASS.
- [ ] **Step 5: Commit** `feat: prerendered shell with fail-safe reveal system and scroll setup`.

---

### Task 4: Lettering pipeline + palette/cover mockups → USER CHECKPOINT

**Files:**
- Create: `site/scripts/lettering.mjs`, `site/fonts-src/` (TTFs + OFL.txt for **Mogra**, **Farsan**, **Rasa Bold**, **Kumar One**, **Shrikhand**, fetched from the official `github.com/google/fonts` `ofl/` tree), `site/src/assets/lettering/` (generated), `site/mockups/index.html` (+ `site/mockups/*.css`), `site/ASSETS.md`
- Test: `site/scripts/lettering.test.js`

**Interfaces:**
- Produces: `node scripts/lettering.mjs --font <ttf> --text <gu> --out <svg>` and exported `shapeToSvg({ fontPath, text, fontSize = 200 }): Promise<{ svg: string, glyphIds: number[], width: number, height: number }>`. SVG: one `<path class="glyph">` per glyph, `viewBox` tight to the ink bounds + 4% padding, no `fill` attribute (styled via CSS).
- Generated files (after the user picks): `src/assets/lettering/princy.svg` (text `પ્રિન્સી`), `parth.svg` (`પાર્થ`), `mangal-parinay.svg` (`મંગલ પરિણય`).

- [ ] **Step 1: Write failing test** `lettering.test.js`:
  ```js
  const r = await shapeToSvg({ fontPath: 'fonts-src/Rasa-Bold.ttf', text: 'પ્રિન્સી' });
  expect(r.glyphIds.length).toBeGreaterThan(0);
  expect(r.glyphIds).not.toContain(0);            // no .notdef → font supports every conjunct
  expect(r.svg).toMatch(/viewBox="0 0 [\d.]+ [\d.]+"/);
  expect((r.svg.match(/<path/g) || []).length).toBe(r.glyphIds.filter(g => g !== 3 /* space */).length);
  ```
- [ ] **Step 2:** `npx vitest run scripts/lettering.test.js` → FAIL.
- [ ] **Step 3:** Implement with harfbuzzjs (`hb.createBlob` → face → font → `hb.shape` with `script: 'gujr'`, `language: 'gu'`; `font.glyphToPath(gid)` for outlines; accumulate x/y advances and offsets). Generate the three texts in all five fonts into `mockups/lettering/`.
- [ ] **Step 4:** `npx vitest run scripts/lettering.test.js` → PASS.
- [ ] **Step 5: Build `mockups/index.html`** — three static cover screens at 390×844 side by side (scrollable on phone), each the spec §5.0 cover: (A) "Sage Kankotri, made royal" (deep green envelope, gold seal "પ ✤ પ", marigold toran, sage paper), (B) the same palette with lighter sage envelope, (C) maroon + gold "royal heritage". Below: a lettering board showing `પ્રિન્સી ❀ પાર્થ` and `મંગલ પરિણય` in all five fonts over `couple-facing` inside a gold arch, and the body text sample (spec §5.3 first 4 lines) in Hind Vadodara vs Noto Serif Gujarati. Static HTML/CSS only, uses tokens.css.
- [ ] **Step 6:** Serve with `npx vite mockups --host`, screenshot each board with Playwright at 390×844 into `docs/superpowers/mockups/`, and send the user the LAN URL to view on their phone.
- [ ] **Step 7: CHECKPOINT — stop and ask the user** to pick (1) palette A/B/C, (2) lettering font for names, (3) font for "મંગલ પરિણય", (4) body font. Record the answers in the spec §6 and §13 (edit "pending mockup confirmation" → the choice). Generate the final three lettering SVGs into `src/assets/lettering/`; update tokens.css if B or C was chosen.
- [ ] **Step 8: Commit** `feat: Gujarati lettering pipeline, mockups, chosen palette and type`.

---

### Task 5: Art assets — PDF extraction, SVG ornaments, photo pipeline

**Files:**
- Create: `site/scripts/extract-pdf.py`, `site/scripts/images.mjs`, `site/src/assets/ornaments/{seal.svg, toran.svg, arch.svg, divider.svg, leaves-corner.svg, ganesh-medallion.svg, hands.svg, dhol-shehnai.svg}`, `site/src/components/Ornament.jsx`, `site/public/img/` (generated), `site/public/favicon.svg`
- Modify: `site/ASSETS.md`
- Test: `site/scripts/images.test.js`, `site/e2e/ornaments.spec.js`

**Interfaces:**
- Produces:
  - `<Ornament name="seal|toran|arch|divider|leaves-corner|ganesh|hands|dhol-shehnai" className />` — inline SVG, colours via `currentColor`/CSS vars only.
  - `seal.svg` exposes groups `#seal-body`, `#seal-crack` (hidden until opening), `#seal-monogram` (text "પ ✤ પ" converted to paths with lettering.mjs using the chosen font).
  - `toran.svg` exposes `.bell` groups (swing animated later).
  - `processImage({ input, outDir, name, widths = [480, 960] }): Promise<string[]>` → writes `${name}-${w}.avif` and `.webp`, applies grade (`modulate({ saturation: 0.95, brightness: 1.02 })`, a slight warm `tint`, `recomb` nudging greens toward sage) and 3% monochrome grain; never upscales beyond the source width.

- [ ] **Step 1:** `pip install pymupdf`; implement `extract-pdf.py <pdf> <outdir>` exporting every embedded image with page/xref in the filename. Run it on `PRINCY-PARTH-wt.pdf` → `assets/extracted/`. Inspect results; if the Ganesh image is clean enough (≥ 300 px, separable background), trace/clean into `ganesh-medallion.svg` (gold line style); otherwise draw a respectful gold line-art Ganesh medallion. Record the decision in ASSETS.md. Reuse leaf/paper textures from extraction only if they look good at 2× DPR; otherwise author SVG watercolour-style leaves.
- [ ] **Step 2: Write failing test** `images.test.js`: run `processImage` on `../assets/photos/couple-facing.jpeg`; expect 4 files; every output width ≤ 852; AVIF of the 960 request is 852 wide (no upscale); each file < 220 KB.
- [ ] **Step 3:** `npx vitest run scripts/images.test.js` → FAIL. Implement `images.mjs` (CLI processes both photos). → PASS.
- [ ] **Step 4:** Author the SVG ornaments in the chosen palette (gold hairline style, consistent stroke 1.25 px at 390 width; toran: marigold strands + green leaves + small brass bells). `e2e/ornaments.spec.js` renders a dev-only route `/?ornaments` gallery and asserts every ornament has a non-zero bounding box and no hard-coded hex fill (regex on `outerHTML` for `fill="#`).
- [ ] **Step 5:** Visual check: Playwright screenshot of the ornament gallery at 390×844 saved to `docs/superpowers/mockups/ornaments.png`; review by eye against the cover mockup.
- [ ] **Step 6: Commit** `feat: ornaments, Ganesh medallion, photo pipeline`.

---

### Task 6: Static sections — Hero, Invitation, Countdown, Moments, Venue, Photos, Closing, Share

**Files:**
- Create: `site/src/components/{Hero.jsx, NameLettering.jsx, Invitation.jsx, Countdown.jsx, Moments.jsx, Venue.jsx, Photos.jsx, Closing.jsx, ShareBar.jsx}`
- Modify: `site/src/App.jsx`, `site/src/components/DesktopFrame.jsx` (side art: leaves + toran fragments)
- Test: `site/src/components/Countdown.test.jsx`, `site/e2e/sections.spec.js`

**Interfaces:**
- Consumes: `wedding` (Task 2), `toGujaratiDigits`, `countdownParts`, `countdownState`, `whatsappShareUrl`, `googleCalendarUrl`, `buildIcs` (Task 2), `<Reveal>` (Task 3), `<Ornament>` + lettering SVGs (Tasks 4–5), `public/img/*` (Task 5).
- Produces:
  - `<NameLettering name="princy|parth|mangal" drawn={boolean} />` — inlines the SVG; when `drawn` is false, paths have `stroke-dasharray`/`dashoffset` = full length and fill-opacity 0 (only when `html.js`); exposes `ref` to the root `<svg>` for Task 11's DrawSVG animation.
  - `<Countdown now={() => number} />` — renders the 4 units with Gujarati digits and labels દિવસ/કલાક/મિનિટ/સેકન્ડ; `today` state shows `copy.todayText` + remaining time; `after` state shows `copy.afterText` only. Ticks with `setInterval(1000)`, cleared on unmount, paused when `document.hidden`.
  - `<Hero>` renders arch + `<picture>` (AVIF/WebP, `fetchpriority="high"`, `object-position` from `photo.focus`) + lettering + date/samvat/venue + scroll cue. Hero has `id="hero"` and data attributes `data-hero-photo`, `data-hero-names` for Task 11.
  - `<Photos>`: if enabled photos < 4 → diptych (`data-mode="diptych"`), else carousel (`data-mode="carousel"`); tap → enlarged view using GSAP Flip, close on tap/back.
  - `<Moments>`: two cards from enabled `wedding.events`, plus a `કેલેન્ડરમાં ઉમેરો` button offering Google Calendar (`googleCalendarUrl`) and an `.ics` download (`buildIcs` → Blob URL, filename `princy-parth.ics`) for the highlighted event (18:00–21:00 IST).
  - `<Venue>`: map `<iframe loading="lazy" title="નકશો">` mounted only when the section is within 1 viewport (IntersectionObserver); Directions button → `venue.mapsUrl`, `target="_blank" rel="noopener"`.
  - `<ShareBar>`: WhatsApp button (`whatsappShareUrl(share.message, share.url)`), copy-link button (Clipboard API; on failure select a visible input); shows "કોપી થઈ ગઈ ✓" for 2 s.
- [ ] **Step 1: Write failing tests:**
  - `Countdown.test.jsx` (fake timers): before → shows `૧` and `દિવસ` for 1 day out; `today` text at 13 Dec 00:30 IST; `after` text at 13 Dec 18:00 IST and units hidden.
  - `sections.spec.js` (m360, m390, m430, desktop): every section id present in order `hero, invitation, countdown, moments, venue, photos, closing`; `#moments` contains exactly two cards with texts `હસ્ત મેળાપ`/`સાંજે ૬:૦૦ કલાકે` and `ભોજન સમારંભ`/`સાંજે ૬:૩૦ કલાકે`; `#invitation` contains `ચિ. પ્રિન્સી`, `ચિ. પાર્થકુમાર`, `મિસ્ત્રી પરિવાર · સોની પરિવાર`; `#photos[data-mode="diptych"]`; Directions link `href` equals `wedding.venue.mapsUrl`; WhatsApp link starts with `https://wa.me/?text=`; no element wider than the viewport (`[...document.querySelectorAll('body *')].every(e => e.getBoundingClientRect().right <= innerWidth + 1)`); every `a, button` ≥ 48×48; computed `letter-spacing` of every element whose text matches `/[\u0A80-\u0AFF]/` is `normal` or `0px`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement components. Layout per spec §5.2–5.9 and §6.1: each section composed as one phone "page" (min-height `100svh` only where the design is a full-screen moment: hero, closing). Paper-card styling for invitation (sage paper texture via CSS gradient + SVG noise, corner leaves). Two moment cards stacked, hast-melap highlighted (gold border, hands ornament). Closing: full-bleed `couple-walking` with vignette, blessing, monogram, ShareBar.
- [ ] **Step 4:** Run unit + e2e → PASS. Save Playwright full-scroll screenshots (viewport-by-viewport, like research) at 390 to `docs/superpowers/mockups/sections-390/` and review by eye.
- [ ] **Step 5: Commit** `feat: invitation sections (hero, invitation, countdown, moments, venue, photos, closing, share)`.

---

### Task 7: Audio engine + MusicPill

**Files:**
- Create: `site/src/lib/audio.js`, `site/src/components/MusicPill.jsx`
- Test: `site/src/lib/audio.test.js`, `site/src/components/MusicPill.test.jsx`

**Interfaces:**
- Produces:
  - `createMusicPlayer({ src, loopStart = 0, loopEnd = null, volume = 0.4, fadeMs = 1500, AudioContextImpl = globalThis.AudioContext ?? globalThis.webkitAudioContext, fetchImpl = fetch }) → { preload(): Promise<void>, start(): Promise<void>, pause(): void, resume(): void, toggle(): void, isPlaying(): boolean, onChange(cb: (playing:boolean) => void): () => void, destroy(): void }`
    - `start()` must be called synchronously inside the tap handler: creates/resumes the context immediately (iOS unlock), then plays when the buffer is ready; if not ready within 6 s, gives up silently (no error UI).
    - Fades via `GainNode.gain.setTargetAtTime`/`linearRampToValueAtTime` (0 → volume over `fadeMs`; pause = 300 ms fade then `ctx.suspend()`).
    - Loop: `AudioBufferSourceNode.loop = true` with `loopStart/loopEnd`.
  - `attachVisibilityPause(player, doc = document): () => void` — on `hidden` pauses and remembers `wasPlaying`; on `visible` resumes only if `wasPlaying`.
  - `<MusicPill player label />` — hidden when `wedding.music.src` is null; shows icon, label, animated equaliser bars while playing; `aria-pressed`; ≥ 48 px; fixed bottom-left with `env(safe-area-inset-bottom)`.
- [ ] **Step 1: Write failing tests** (fake `AudioContext` class recording calls; fake timers):
  - `start()` resumes the context synchronously and ramps gain to `0.4` over 1500 ms.
  - `pause()` then `resume()` toggles `isPlaying()` and notifies `onChange`.
  - visibility: playing → hidden → visible ⇒ playing; paused → hidden → visible ⇒ still paused (Review Focus #3).
  - `start()` when fetch never resolves → after 6 s `isPlaying()` is false and no throw.
  - MusicPill not rendered when `src` is null; renders `aria-pressed="true"` after `onChange(true)`.
- [ ] **Step 2:** `npx vitest run src/lib/audio.test.js src/components/MusicPill.test.jsx` → FAIL.
- [ ] **Step 3:** Implement. Preload is triggered from Task 9 via `requestIdleCallback` after first paint.
- [ ] **Step 4:** → PASS.
- [ ] **Step 5: Commit** `feat: web-audio music player with fades, loop and visibility pause`.

---

### Task 8: Device tiering + FPS watchdog + 2D celebration fallback

**Files:**
- Create: `site/src/lib/tier.js`, `site/src/fx/petalPhysics.js`, `site/src/fx/Petals2D.js`, `site/src/fx/goldBurst2D.js`
- Test: `site/src/lib/tier.test.js`, `site/src/fx/petalPhysics.test.js`

**Interfaces:**
- Produces:
  - `chooseTier({ gpuTier /* 0-3 from detect-gpu */, isMobile, reducedMotion, webgl2, cores, width }): 'high' | 'lite' | '2d' | 'static'` — rules: `reducedMotion → 'static'`; `!webgl2 → '2d'`; `gpuTier <= 1 → '2d'`; `gpuTier === 2 || (isMobile && cores <= 4) → 'lite'`; else `'high'`.
  - `detectTier(): Promise<Tier>` (wraps detect-gpu + matchMedia + WebGL2 probe; resolves `'2d'` if detection takes > 1500 ms).
  - `createFpsWatchdog({ threshold = 40, windowMs = 500, onDrop }): { tick(now:number): void, stop(): void }` — calls `onDrop()` once when average FPS over the window < threshold.
  - `PHYSICS = { angleDeg: 72, spreadDeg: 22, speedMin: 780, speedMax: 1320, gravity: 900, dragUp: 0.0011, dragDown: 0.009, terminal: 150, swayFreq: [0.9, 2.1], swayAmp: [26, 74], spin: 5, mobileScale: 0.55, perSide: 52 }`
  - `spawnBurst({ width, height, rand = Math.random, palette }): Particle[]` (both bottom corners inset 5%; count `perSide*2`, scaled by `mobileScale` when `width < 640`); `stepParticle(p, dt): Particle` (pure).
  - `createPetals2D(canvas, { palette }) → { burst(): void, ambient(on: boolean): void, setPaused(b): void, destroy(): void }` (DPR capped at 2, sprites pre-rendered once, pauses when `document.hidden`).
  - `goldBurst2D(canvas, { origin })` — canvas-confetti instance bound to the same canvas, gold-only flakes (`colors` from `--gold`, `--gold-light`), custom flake shapes, ~2.5 s.
- [ ] **Step 1: Write failing tests:**
  - `chooseTier` table test covering each rule (incl. reducedMotion beats everything; `webgl2:false` with gpuTier 3 → `'2d'`).
  - watchdog: ticks at 16.7 ms → no drop; ticks at 40 ms → `onDrop` called exactly once.
  - `spawnBurst({width:390,…})` length `Math.round(52*2*0.55)`; every initial velocity angle within 72±22° (mirrored for right side); after stepping 5 s every particle `y` ≥ start y or out of bounds (falls back down); falling speed never exceeds terminal + sway.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Dev page `/?fx=2d` with a button firing `burst()` + gold flakes; verify by eye on the user's phone over LAN at 60 fps (stats-gl overlay via `?tune`).
- [ ] **Step 6: Commit** `feat: device tiering, fps watchdog, 2D petal and gold burst`.

---

### Task 9: Cover + opening master timeline (2D tier end-to-end)

**Files:**
- Create: `site/src/components/Cover.jsx`, `site/src/components/OpeningLayer.jsx`, `site/src/components/SkipButton.jsx`, `site/src/opening/timeline.js`, `site/src/opening/useOpening.js`, `site/src/dev/tune.js`
- Modify: `site/src/App.jsx`
- Test: `site/src/opening/timeline.test.js`, `site/e2e/opening.spec.js`

**Interfaces:**
- Consumes: `createMusicPlayer`, `attachVisibilityPause` (Task 7), `detectTier`, `createPetals2D`, `goldBurst2D`, `createFpsWatchdog` (Task 8), `<Ornament name="seal|toran">`, hero data attributes (Task 6).
- Produces:
  - `buildOpeningTimeline({ el: { cover, flap, card, seal, sealCrack, glow, hero, heroPhoto, heroNames }, fx: { sealLeak(), burst(), glow(progress), ambient(on) }, onDone }): gsap.core.Timeline` with labels and times from spec §5.1: `seal` 0, `flap` 0.4 (duration 1.7, `CustomEase` equivalent of `cubic-bezier(.65,0,.35,1)`), `burst` 1.9, `glow` 2.4, `reveal` 2.8, end ≈ 4.5. `fx` is an interface implemented by both the 2D fallback and the 3D scene (Task 10).
  - `create2DFx({ canvas, sealEl, glowEl }): fx` in `site/src/opening/fx2d.js` — implements the same `fx` contract with the 2D tier: `sealLeak()` = CSS radial gold glow on `sealEl`, `burst()` = `createPetals2D(...).burst()` + `goldBurst2D`, `glow(p)` = opacity of the ivory `glowEl` overlay, `ambient(on)` = `createPetals2D(...).ambient(on)`.
  - `useOpening(): { state: 'cover'|'opening'|'open', open(): void, skip(): void, tier }` — `open()` is idempotent (second call no-op), calls `player.start()` and `navigator.vibrate?.(15)` synchronously, picks fx: 3D if the scene module has loaded and tier is `high|lite`, else 2D; `static` tier → 600 ms cross-fade, no fx. Body scroll locked (`overflow:hidden` on html) only while `state !== 'open'`. On `open`, `#hero` receives focus for screen readers.
  - Cover hidden entirely when `html` lacks `js` (prerender/no-JS guests go straight to content).
  - `?tune` → `tune.js` loads lil-gui with timeline label times, particle counts, colours, and stats-gl; never included in the production chunk unless `?tune` present (dynamic import).
- [ ] **Step 1: Write failing tests:**
  - `timeline.test.js`: labels exist at `0, 0.4, 1.9, 2.4, 2.8`; total duration between 4.3 and 4.8 s; `fx.burst` called once when the timeline is progressed past 1.9; `onDone` called at end.
  - `opening.spec.js`:
    - m390: cover visible with `આમંત્રણ ખોલો`; page not scrollable; tap seal → within 5 s `#hero [data-hero-names]` visible and page scrollable.
    - **double tap** the seal quickly → `window.__openCount === 1` (Review Focus #5).
    - **tap before heavy assets load** (route-delay `**/CelebrationScene*.js` and `**/audio/**` by 10 s) → hero visible within 5 s (2D path), no console errors (Review Focus #1).
    - skip: tap seal, tap `છોડો ›` at 0.6 s → hero visible within 800 ms.
    - `reduced` project: no canvas element created; hero visible within 1 s.
    - `nowebgl` project: opening completes, hero visible.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (2D fx adapter now; 3D adapter in Task 10). Cover layout per spec §5.0 using the chosen mockup. **Step 4:** Run → PASS on m390, m360, desktop, reduced, nowebgl.
- [ ] **Step 5:** Record a Playwright video of the opening at 390×844 to `docs/superpowers/mockups/opening-2d.webm`; tune timings on the user's phone via `?tune`; write final values back into `timeline.js` defaults.
- [ ] **Step 6: Commit** `feat: cover and opening master timeline with 2D tier`.

---

### Task 10: Three.js celebration scene (high + lite tiers, GLSL, bloom)

**Files:**
- Create: `site/src/fx/three/CelebrationScene.js`, `site/src/fx/three/petalGeometry.js`, `site/src/fx/three/shaders/{petal.glsl.js, flake.glsl.js, lightBurst.glsl.js, sealLeak.glsl.js}`
- Modify: `site/src/opening/useOpening.js` (lazy `import()` after first paint when tier is high/lite)
- Test: `site/src/fx/three/CelebrationScene.test.js`, `site/e2e/scene.spec.js`

**Interfaces:**
- Consumes: `PHYSICS`, `spawnBurst` launch logic (Task 8) — the 3D scene reuses the same launch parameters in screen space mapped to an orthographic-ish camera; `createFpsWatchdog`.
- Produces: `createCelebrationScene(canvas, { tier: 'high'|'lite', palette }): Promise<{ sealLeak(): void, burst(): void, glow(progress: number): void, ambient(on: boolean): void, setPaused(b: boolean): void, onContextLost(cb): void, destroy(): void }>` — the same `fx` contract as Task 9.
  - Petals: `InstancedMesh` of a curved petal geometry (`petalGeometry(segments)`, cupped bezier teardrop), per-instance colour (marigold, deep marigold, rose light, rose deep, ~8% sage leaves), procedural petal shading in `petal.glsl.js` (vein, edge darkening, soft translucency, no textures). Real 3D tumble (rotation axis per instance). Counts: high 160, lite 80 (× 0.55 under 640 px wide is already in lite).
  - Gold flakes: instanced quads with `flake.glsl.js` view-angle glint (sparkle when facing the light).
  - `lightBurst.glsl.js`: full-screen radial warm ivory wash driven by `glow(progress)`.
  - `sealLeak.glsl.js`: gold light leaking through the seal crack (screen-space at the seal's DOM rect).
  - Post (high tier only): `postprocessing` `EffectComposer` with `BloomEffect` (luminanceThreshold ~0.8 so only gold blooms), `VignetteEffect`, `NoiseEffect` (opacity ≤ 0.04).
  - Renderer: `WebGLRenderer({ antialias: tier==='high', alpha: true, powerPreference: 'high-performance' })`, `setPixelRatio(Math.min(devicePixelRatio, tier==='high' ? 2 : 1.5))`.
  - Pauses render loop when `setPaused(true)`, `document.hidden`, or the canvas leaves the viewport (IntersectionObserver). On `webglcontextlost` → call `onContextLost` listeners (useOpening switches to 2D and continues). FPS watchdog `onDrop` → high downgrades to lite settings live (drop composer, halve instances).
- [ ] **Step 1: Write failing tests:**
  - `CelebrationScene.test.js` (mock `three` renderer via `vi.mock`): returned object has exactly the fx contract keys; `destroy()` disposes geometries/materials (spy counts) and removes listeners.
  - `scene.spec.js` (m390, chromium with SwiftShader): with `?tier=high` override the opening creates one `<canvas data-scene="3d">`, completes, hero visible, zero console errors; with `?forceContextLoss` (dev hook calling `WEBGL_lose_context.loseContext()` at burst) the opening still completes and a `<canvas data-scene="2d">` takes over (Review Focus #5); bundle check: the main entry chunk does not contain the string `WebGLRenderer` (lazy-loaded).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** On the user's phone and one low-end Android (LAN, `?tune`): verify ≥ 55 fps during the burst on high/lite; record a video to `docs/superpowers/mockups/opening-3d.webm`; adjust counts/bloom; write back defaults.
- [ ] **Step 6: Commit** `feat: three.js celebration scene with GLSL petals, gold glints, light burst and bloom`.

---

### Task 11: Couple reveal — names writing, photo settle, ambient petals

**Files:**
- Modify: `site/src/opening/timeline.js` (reveal segment), `site/src/components/Hero.jsx`, `site/src/components/NameLettering.jsx`
- Test: `site/e2e/reveal.spec.js`

**Interfaces:**
- Consumes: `NameLettering` ref (Task 6), `fx.ambient` (Tasks 8/10), DrawSVG plugin.
- Produces: reveal segment from label `reveal` (2.8 s): photo `scale 1.08 → 1`, `opacity 0 → 1` (1.2 s, `power2.out`); `મંગલ પરિણય` outline draw 0.9 s then fill; `પ્રિન્સી` outline draw (DrawSVG `0% → 100%`, stagger 0.08 s per glyph path, 1.1 s) then fill-opacity 0 → 1 (0.4 s); `❀` pops; `પાર્થ` same as bride, starting 0.35 s after; date lines fade up; at end `fx.ambient(true)`; ambient stops when `#hero` leaves the viewport (ScrollTrigger `onLeave`/`onEnterBack`).
- [ ] **Step 1: Write failing test** `reveal.spec.js` (m390): after opening, every `[data-hero-names] path` has computed `fill-opacity` `1` and `stroke-dashoffset` `0` (within 6 s); after scrolling to `#countdown`, `window.__ambientOn === false`; scrolling back → `true`. `reduced`: names fully visible immediately with no dash animation.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Gujarati reader check: screenshot the finished hero to `docs/superpowers/mockups/hero-final.png` and show the user — conjuncts in પ્રિન્સી / પાર્થ must look right.
- [ ] **Step 6: Commit** `feat: couple reveal with hand-lettered names drawing in`.

---

### Task 12: Section reveal choreography + desktop polish

**Files:**
- Modify: `site/src/components/{Invitation.jsx, Countdown.jsx, Moments.jsx, Venue.jsx, Photos.jsx, Closing.jsx, DesktopFrame.jsx}`, `site/src/styles/base.css`, `site/src/components/Ornament.jsx` (bell swing)
- Test: `site/e2e/motion.spec.js`

**Interfaces:**
- Consumes: `<Reveal>`, `initScroll` (Task 3).
- Produces: per-section reveal recipes (all triggered, once): Invitation — paper card rises 20 px + fades, then lines fade up with 60 ms stagger; Countdown — digits fade in, then tick; Moments — two cards rise with 120 ms stagger, hands ornament draws in (DrawSVG); Venue — card then map fade; Photos — frames settle from 1.04 scale; Closing — photo slow 1.06 → 1 scale over 1.6 s, blessing fades, final ambient drift (`fx.ambient` reused, 8 s, then off); toran bells swing gently on cover/closing (CSS keyframes, paused under reduced motion). Desktop: Lenis active, side art parallax ≤ 30 px (desktop only).
- [ ] **Step 1: Write failing test** `motion.spec.js`: on m390 no element on the page has an active GSAP tween bound to scroll position (`ScrollTrigger.getAll().every(t => !t.vars.scrub)`); at most one trigger with `pin` on mobile; `reduced`: all `[data-reveal]` visible on load and no transforms applied; desktop: `window.__lenis` defined, on m390 undefined.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Record a full-scroll video at 390×844 to `docs/superpowers/mockups/full-scroll.webm` and review.
- [ ] **Step 6: Commit** `feat: mobile-first section reveal choreography and desktop polish`.

---

### Task 13: Share assets — OG image, QR, meta, favicon

**Files:**
- Create: `site/og.html` (dev-only page, 1200×630 composition), `site/scripts/og.mjs`, `site/scripts/qr.mjs`, `site/public/og.png`, `site/public/qr.png`, `site/public/qr.svg`
- Modify: `site/index.html` (OG/Twitter meta from `wedding.og`, absolute URLs from `VITE_SITE_URL`), `site/package.json` (`assets:og`, `assets:qr`)
- Test: `site/e2e/meta.spec.js`

**Interfaces:**
- Consumes: `wedding.og`, `wedding.share.url`, lettering SVGs, `couple-facing` images, ornaments.
- Produces: `og.png` 1200×630 (< 300 KB): deep green + gold frame, `couple-facing` in an arch on one side, hand-lettered `પ્રિન્સી ❀ પાર્થ`, `મંગલ પરિણય`, `રવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ`; `qr` gold modules on `--green-deep`, error correction `H`, monogram in the centre ≤ 20% area.
- [ ] **Step 1: Write failing test** `meta.spec.js`: `og:title` = `પ્રિન્સી ❀ પાર્થ — શુભ લગ્ન`; `og:description` = `રવિવાર, ૧૩/૧૨/૨૦૨૬ · અતિથી પાર્ટી પ્લોટ, પેટલાદ`; `og:image` absolute `https://…/og.png` and the file is 1200×630 (read with sharp metadata); `og:url` absolute; favicon present.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement scripts and meta. Decode the QR back with a decoder dev dep (`jsqr`) in the test to assert it resolves to `VITE_SITE_URL`. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `feat: OG preview image, QR code and share meta`.

---

### Task 14: Music integration (user's file) + placeholder handling

**Files:**
- Create: `site/scripts/audio.mjs` (ffmpeg-static: trim to segment, loudness-normalise, encode AAC 112 kbps `.m4a` + MP3 fallback), `site/public/audio/` (generated)
- Modify: `site/src/content/wedding.js` (`music.src`, `label`, `loopStart`, `loopEnd`), `site/package.json` (`assets:audio`)
- Test: `site/scripts/audio.test.js`

**Interfaces:**
- Consumes: `createMusicPlayer` (Task 7).
- Produces: `node scripts/audio.mjs --in <file> --start <s> --end <s> --out public/audio/theme` → `theme.m4a` (≤ 1.5 MB) + `theme.mp3`; player picks m4a when `canPlayType('audio/mp4')`.
- [ ] **Step 1:** Ask the user for the song file(s) (at least "Judi Jodi"). Until received, keep `music.src = null` (pill hidden, opening silent) — this is the shipped behaviour if the file never arrives.
- [ ] **Step 2: Write failing test:** on a 90 s generated sine fixture, output ≤ 1.5 MB, duration = end − start (±0.1 s).
- [ ] **Step 3:** Implement → PASS.
- [ ] **Step 4:** Prepare 25 s previews of each short-listed track the user supplied (spec §10) at `docs/superpowers/mockups/music/`; the user picks; choose the segment that starts soft and lifts at the burst (~2–4 s in); set loop points.
- [ ] **Step 5: Commit** `feat: music pipeline and chosen track`.

---

### Task 15: Quality gate — budgets, accessibility, text zoom, cross-device

**Files:**
- Create: `site/scripts/budget.mjs`, `site/e2e/quality.spec.js`, `docs/superpowers/qa-checklist.md`
- Modify: `site/package.json` (`check` = `npm test && npm run test:tz && npm run build && node scripts/budget.mjs && npm run e2e`)

**Interfaces:**
- Produces: `budget.mjs` fails (exit 1) if critical-path JS gzip > 150 KB, pre-tap transfer (HTML + CSS + entry JS + fonts + hero image + cover art) > 1 MB, or `public/audio/*.m4a` > 1.5 MB; prints a table.
- [ ] **Step 1: Write failing tests** `quality.spec.js`:
  - **text zoom 130%** (m360): set `document.documentElement.style.fontSize = '130%'` before load (init script) → no element extends past the viewport, hero names fully inside the viewport width (Review Focus #4).
  - Fast-4G throttle via CDP (`Network.emulateNetworkConditions` 9 Mbps/150 ms) → cover `આમંત્રણ ખોલો` visible < 2500 ms after navigation start.
  - Accessibility: every button/link has an accessible name; `axe-core` (`@axe-core/playwright` dev dep) reports no serious/critical violations on the open page.
  - Body text contrast ≥ 4.5:1 (from axe).
- [ ] **Step 2:** Run `npm run check` → FAIL where not yet met. **Step 3:** Fix until PASS.
- [ ] **Step 4:** Write `qa-checklist.md` and run it manually with the user on real devices: user's Android in **WhatsApp in-app browser**, an iPhone in WhatsApp + Safari, **one low-end/older Android**, a laptop. Items: opening smooth, music starts on tap and pauses on leaving WhatsApp, names render correctly, Directions opens Maps app, WhatsApp share opens with Gujarati text, no clipped text, back button doesn't replay the opening.
- [ ] **Step 5: Commit** `test: quality gate, budgets, accessibility and device checklist`.

---

### Task 16: Deploy preview, family review, launch

**Files:**
- Create: `site/vercel.json` (cache headers: immutable for `/assets/*`, `/img/*`, `/audio/*`; `no-cache` for `index.html`)
- Modify: `site/src/content/wedding.js` (map link, any proofreading fixes), `docs/superpowers/specs/...` (record final decisions)

- [ ] **Step 1:** User runs `! vercel login` (agent never handles credentials). Agent runs `vercel link` → project `princy-parth` (ask the user to confirm the name), set env `VITE_SITE_URL`, `vercel deploy` (preview). Rebuild OG/QR against the real URL (Task 13 scripts).
- [ ] **Step 2:** Run `npm run e2e` against the preview URL (`BASE_URL` env in playwright config) → PASS.
- [ ] **Step 3:** Family review: the user shares the **preview** URL privately with an elder from each family; collect proofreading fixes for §5.3 invitation, parents' names, closing line, photo caption; apply; re-run `npm run check`.
- [ ] **Step 4:** User provides the Google Maps link → set `venue.mapsUrl`, `embedUrl`, `mapsUrlIsPlaceholder: false`; add a unit test asserting `mapsUrlIsPlaceholder === false` before production (`launch.test.js`, skipped unless `LAUNCH=1`).
- [ ] **Step 5:** `LAUNCH=1 npm run check` → PASS, then `vercel deploy --prod`. Send the production URL to the user **only to themselves first** in WhatsApp to confirm the preview card (title, description, image). If the card is wrong, fix and redeploy before anyone else receives it.
- [ ] **Step 6:** Hand over: production URL, `qr.png`, and the pre-filled WhatsApp message. Commit `chore: launch configuration` and tag `v1.0-launch`.

---

## Follow-up plans (not in this plan)

- **Remotion video invite** (spec §7.1, after launch): separate plan reusing lettering, ornaments, photos and music.
- **Post-launch content swaps** (original photos, added events): config edits + `npm run check` + redeploy.
- **Undeploy** after the wedding (`vercel remove princy-parth`), on the user's go-ahead.
