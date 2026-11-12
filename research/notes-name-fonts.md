# Name & heading fonts: teardown of wedding-invite sites + Gujarati font catalogue

Researched 2026-11-12. Captures were made with REA `capture_browser_scenario` (headless Chrome, 390x844 @2x, Asia/Kolkata). Fonts were read from the `@font-face` rules in the captured CSS response bodies, from the CSS selector→font-family rules, and from React/JS inline `fontFamily` styles. Screenshots are in `C:/Users/OMEN/Desktop/wed/research/screens/fonts/`.

Note: `rea_extract.py` also saves PNG images from network traffic. Because of that, some `_N.png` files are site assets, not page screenshots. The paths listed below are the ones I checked visually.

## 1. Per-site teardown

### 1.1 riya-abhishek-wedding.vercel.app (GUJARATI, the most relevant reference)
- Screenshots: `riya-abhishek_2.png` (splash card) and `riya-abhishek-open_2.png` (hero after "TAP TO ENTER").
- Fonts loaded: Google Fonts `Luxurious Script` and `Playfair Display` (400 and 600), both via `@import` in `/assets/index-BjVyRT9e.css`.
  - CSS vars: `--font-cursive: "Luxurious Script", cursive` and `--font-serif: "Playfair Display", serif`.
  - woff2 files: `fonts.gstatic.com/s/luxuriousscript/v9/ahcCv9e7yydulT32KZ0rBIoD7DzMs03Ebg.woff2` and `fonts.gstatic.com/s/playfairdisplay/v40/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2`.
- Names "રીયા & અભિષેક": neither webfont has Gujarati glyphs, so the Gujarati names fall back to the OS Gujarati font (Nirmala UI on Windows, Noto Sans Gujarati on Android). The "&" between the names comes from Luxurious Script. The rest of the Gujarati text (invocations ॥ શ્રી ગણેશાય નમઃ ॥, date, quote) also uses the system fallback.
- Takeaway: the "premium" look comes from the gold monogram image and the Latin script ampersand. The Gujarati lettering is a plain system sans. **This is the gap our site should beat.**
- Animation: a splash card with a "TAP TO ENTER" button, then a fade into the hero. The names are static text.

### 1.2 vikash-weds-jyoti.vercel.app (Hindi + English, ivory and marigold garlands; closest to our palette)
- Screenshots: `vikash-jyoti_0.png` (envelope gate) and `vikash-open_0.png` (hero after "TAP TO UNLOCK").
- Google Fonts: `Cormorant Garamond` (300–700 plus italic), `DM Sans`, `Noto Serif Devanagari` (400+) and `Playfair Display`.
  - CSS vars: `--font-serif: "Cormorant Garamond","Playfair Display"`, `--font-display: "Playfair Display"`, `--font-hindi: "Noto Serif Devanagari", serif` and `--font-sans: "DM Sans"`.
  - Devanagari woff2: `fonts.gstatic.com/s/notoserifdevanagari/v34/x3dNcl3IZKmUqiMk48ZHXJ5jwU-DZGRSaQ4Hh2dGyFzPLcQPVbnRH-xEMqTN.woff2`.
- Names "VIKASH ♡ JYOTI" are Latin capitals in Cormorant Garamond, wine coloured with wide tracking. All Devanagari lines (॥ श्री गणेशाय नमः ॥, "दो दिल, दो परिवार…", section sub-heads) use `var(--font-hindi)`, i.e. Noto Serif Devanagari in gold. **Its Gujarati sibling is Noto Serif Gujarati.**
- Animation: a wax-seal envelope with a "TAP TO UNLOCK" button, falling petals and a marigold toran. The names are static serif text.

### 1.3 rudrashahdeo.netlify.app (HINDI names; open source, github.com/vinitshahdeo/wedding-website)
- Screenshot: `rudrashahdeo_1.png`.
- `.title h1` (names रुद्र शाहदेव / शांति सिंह) uses **`'Bakbak One'`**, a Google Font with a Devanagari subset (U+0900-097F), at 60px. `.title h2` ("संग") uses Poppins (which also has a Devanagari subset).
- `Modak` (Devanagari display) is also loaded through `@import` in `css/style.css`. `Raleway` 100 is used for the date and `Arvo` for body text.
- Look: heavy, chunky, playful, not premium. Animation: jQuery-Sakura falling petals and a countdown.

### 1.4 sonali.netlify.app (English version of the same template)
- Screenshot: `sonali_1.png`.
- `.title h1` names "Sonali & Gagan" use **Dancing Script** (Google) at 60px. Body text uses Arvo.

### 1.5 interactive-wedding-card.vercel.app (Fiverr "premium" demo)
- Screenshots: `interactive-wedding-card_0.png` (gate, "V&A" monogram) and `interactive-open_3.png` (hero).
- The page loads Tailwind with `fontFamily.script = ['"Great Vibes"','cursive']` and `serif = ['"Playfair Display"']`. Body text uses Montserrat.
- `<h1 class="font-script text-6xl text-gold-gradient fade-up">Virat & Anushka</h1>`: the names are **Great Vibes** with a gold gradient text fill, a fade-up entrance and staggered reveal. The gate is a "pull down to open" thread.

### 1.6 sample-invitation-premium-pink-envelope-shreyawedsjayesh.pages.dev (Indian vendor demo)
- Screenshot: `shreya-jayesh_0.png` (envelope gate). Clicking "Tap to Open" timed out on all 3 attempts because the seal keeps animating, so the inner page was not screenshotted.
- Fonts come from `assets/css/style.css`:
  - Self-hosted `@font-face 'Best Signature Font'` loaded from `../woff/Best Signature Font - Reguler.woff` (a dafont-type signature script). It is used for the names in `.signature-glow` (2.2rem, white, glow).
  - `.couple-name` uses `"Lucida Handwriting", cursive` (a system font).
  - `.names` uses `Copperplate, Papyrus, fantasy` (a system stack).
  - `.event-title` uses Georgia.
- No Google Fonts. The names have a signature-script glow effect.

### 1.7 shaadi-template.framer.website (Framer "Shaadi" Indian wedding template by Geniusflow)
- Screenshot: `shaadi-framer_1.png`.
- Fonts: Google **`Sail`** (`fonts.gstatic.com/s/sail/v17/DPEjYwiBxwYJFBHDADYAbvw.woff2`) for the "Ritesh & Jaya" names and the countdown numerals. **Jost** is used for body text, and Inter (self-hosted on framerusercontent.com) for UI. All are inlined as `@font-face` in `<style data-framer-font-css>`.
- Look: a swashy Didone-script hybrid in black on white with watercolour florals.

### 1.8 ulems.my.id (Indonesian open-source "undangan" template, for reference)
- Screenshots: `ulems_*.png`.
- `.font-esthetic` uses **`'Sacramento', cursive`** for the names. Josefin Sans is used for body text, and Noto Naskh Arabic for the Arabic verse. Google Fonts CSS is fetched dynamically by `dist/guest.js` and injected as blob stylesheets.

### 1.9 jalaram-cards.vercel.app/digital-wedding-cards-gujarat (Gujarati card vendor site, Next.js)
- Screenshot: `jalaram-cards_0.png`.
- Fonts are self-hosted through `next/font` from Google: Playfair Display, Inter, Dancing Script, Crimson Text and **`notoSansGujarati`** (unicode-range U+0A80-0AFF).
- The stacks append Gujarati as a fallback after the Latin font: `var(--font-playfair), var(--font-gujarati), Georgia, serif`. **This is the right technique**: the Latin face handles English and Noto handles Gujarati glyphs.

### 1.10 invites.samaro.ai (Indian animated e-invite vendor)
- It returned only a Framer shell (Inter Variable UI), with no invite content. Skipped.

### Summary: fonts used for names
| Site | Name font | Script | Source |
|---|---|---|---|
| riya-abhishek (Gujarati) | system fallback (Nirmala UI / Noto Sans Gujarati); "&" in Luxurious Script | Gujarati | OS + Google Fonts |
| vikash-weds-jyoti | Cormorant Garamond caps; Hindi lines in Noto Serif Devanagari | Latin + Devanagari | Google Fonts |
| rudrashahdeo | Bakbak One (h1), Poppins | Devanagari | Google Fonts |
| sonali | Dancing Script | Latin | Google Fonts |
| interactive-wedding-card | Great Vibes (gold gradient) | Latin | Google Fonts |
| shreya-jayesh | Best Signature Font; Lucida Handwriting; Copperplate | Latin | self-hosted woff + system |
| shaadi (Framer) | Sail | Latin | Google Fonts (inlined) |
| ulems | Sacramento | Latin | Google Fonts |
| jalaram-cards | Playfair / Dancing Script + Noto Sans Gujarati fallback | Latin + Gujarati | next/font, self-hosted |

Pattern: premium sites use a **formal Latin script** (Great Vibes, Luxurious Script, Sail, Sacramento, Dancing Script) or a **high-contrast serif** (Cormorant, Playfair). The Indic text is set in a **calm serif**. **None of the sites uses a real Gujarati display/calligraphic webfont.** Even the Gujarati site falls back to the system font, so a properly lettered Gujarati name would stand out.

## 2. Gujarati font catalogue

### 2a. Free / open licence (web use and outline conversion allowed)
Verified against `fonts.google.com/metadata/fonts`, where the `gujarati` subset contains 13 families, and against `google/fonts` `ofl/*/METADATA.pb` (all `license: "OFL"`). Under OFL 1.1, embedding as a webfont and converting to outlines/SVG are both fine. Only modified *font files* must be renamed.

| Font | Style | Weights | Designer | Licence | Official source |
|---|---|---|---|---|---|
| **Rasa** | Serif with **true italics** (calligraphic stress); Gujarati sibling of Yrsa | 300–700 + italics | Rosetta (Anna Giedryś, David Březina) | OFL | fonts.google.com/specimen/Rasa · github.com/rosettatype/yrsa-rasa |
| **Mogra** | Brush/calligraphic display, bold strokes | 400 | Lipi Raval | OFL | fonts.google.com/specimen/Mogra · github.com/lipiraval/Mogra |
| **Shrikhand** | Heavy, swashy display (Gujarati + Latin) | 400 | Jonny Pinhorn | OFL | fonts.google.com/specimen/Shrikhand · github.com/jonpinhorn/shrikhand |
| **Farsan** | Handwritten / monoline display | 400 | Pooja Saxena | OFL | fonts.google.com/specimen/Farsan · github.com/anexasajoop/farsan |
| **Noto Serif Gujarati** | Classic serif | 100–900 | Google | OFL | fonts.google.com/specimen/Noto+Serif+Gujarati · github.com/notofonts/gujarati |
| Kumar One / Kumar One Outline | Fat slab display / outline | 400 | Indian Type Foundry | OFL | fonts.google.com/specimen/Kumar+One · github.com/itfoundry/kumar |
| Baloo Bhai 2 | Rounded display | 400–800 | Ek Type | OFL | fonts.google.com/specimen/Baloo+Bhai+2 · github.com/yanone/Baloo2-Variable |
| Anek Gujarati | Sans, width + weight variable | 100–800, wdth 75–125 | Ek Type | OFL | fonts.google.com/specimen/Anek+Gujarati · github.com/EkType/Anek |
| Mukta Vaani | Sans | 200–800 | Ek Type | OFL | fonts.google.com/specimen/Mukta+Vaani · github.com/EkType/Mukta |
| Hind Vadodara | Sans | 300–700 | Indian Type Foundry | OFL | fonts.google.com/specimen/Hind+Vadodara · github.com/itfoundry/hind-vadodara |
| Noto Sans Gujarati | Sans | 100–900 | Google | OFL | fonts.google.com/specimen/Noto+Sans+Gujarati · github.com/notofonts/gujarati |
| Kalapi | Text sans | 400 | GujaratiLexicon | OFL 1.1 | github.com/gujaratilexicon/font-kalapi |
| (Google Sans also lists a Gujarati subset; it is a UI font and not relevant here.) | | | | | |

Devanagari display fonts **without** a Gujarati version include Tillana, Yatra One, Kalam, Rozha One, Amita, Bakbak One and Modak. A Hindi-style look can only be carried over through the families that have Gujarati siblings: Noto Serif Devanagari → Noto Serif Gujarati, Hind → Hind Vadodara, Mukta → Mukta Vaani, Baloo 2 → Baloo Bhai 2 and Anek → Anek Gujarati.

### 2b. Licensed / commercial options (the user says licensed fonts are acceptable)
"Non-commercial, 10–15 days" does **not** waive a font EULA. A paid font still needs either a **webfont licence** (to serve it with @font-face) or a **desktop licence whose EULA allows static artwork/logos**. With the second option we would set "પ્રિન્સી / પાર્થ / મંગલ પરિણય" once, convert to SVG outlines and ship only the SVG. Check each EULA for "logos/static images" before buying.

| Font | Style | Vendor (official) | Notes |
|---|---|---|---|
| Saguna Gujarati | Contemporary, rooted in classical Gujarati calligraphy | Indian Type Foundry (indiantypefoundry.com / myfonts.com) | From about $80/style on MyFonts |
| Marudhar Gujarati | Very narrow display, Gujarati + Latin, variable | Indian Type Foundry | Elegant tall headings |
| ITF Gujarati | Classic workhorse "rooted in Gujarati calligraphic tradition" | Indian Type Foundry | 5 weights |
| Kohinoor Gujarati | Sans | Indian Type Foundry | Text, not lettering |
| Adobe Gujarati | Serif based on traditional calligraphy | Adobe (Fontspring, from $55) | Good serif alternative to Noto Serif |
| Shree Gujarati 0773 / 0791 / 3392 | Decorative/calligraphic (0773 has italics) | Modular InfoTech (MyFonts) | Check Unicode/OpenType support |
| AMS Ashri / Tarak / Indu Gujarati | Hand calligraphy, used on print kankotris | IndiaFont / AMS (indiafont.com) | Exports PNG/SVG artwork, which suits outlined names. Not a webfont, and the licence covers the desktop app |

## 3. Specimen test
I rendered "પ્રિન્સી ❦ પાર્થ" and "મંગલ પરિણય" in 9 Gujarati Google fonts on an ivory background with gold/sage text. The result is `screens/fonts/specimen-gujarati-names_0.png` (the ❦ glyph fell back to another font, so ignore it). Observations:
- **Rasa Italic 500**: the most "lettered", elegant and calligraphic of the free fonts. Conjuncts (પ્રિ, ન્સી, ર્થ) are clean. Rasa 700 upright is strong and formal.
- **Mogra**: genuine brush energy and festive. It is quite dense, so it needs large sizes and generous tracking.
- **Shrikhand**: very bold and celebratory, good for a single heading line. Too heavy for both names on a light card.
- **Noto Serif Gujarati 300/600**: refined and quiet. It is the exact Gujarati equivalent of the Vikash site's Hindi treatment.
- **Farsan**: delicate handwritten look, but casual rather than premium.
- **Kumar One, Baloo Bhai 2, Anek**: poster/UI fonts, not wedding fonts.

## 4. Recommendation: top 3 for Gujarati name lettering (light sage/ivory card, marigold garlands)
1. **Rasa (Italic 500–600 for the names, upright 500 for "મંગલ પરિણય")**: the only free Gujarati face with true italic, calligraphic-feeling letterforms and a full weight range. It reads elegant and premium in gold foil or a gold gradient on ivory, and it pairs with its Latin sibling Yrsa or with Cormorant Garamond. OFL, so it can be used as a webfont and converted to SVG for stroke-draw animation.
2. **Mogra (accent/alternative for the names)**: hand-brushed calligraphy by a Gujarati designer (Lipi Raval). It gives the festive, kankotri-hand-lettered warmth that marigolds suggest. Use it large (48px+) in deep marigold/maroon, alone, with Rasa for everything else.
3. **Noto Serif Gujarati (300–600) for the heading and secondary lines**: the calm high-contrast serif that the Vikash site uses for Devanagari. It keeps the card premium and legible next to a showier name font. Shrikhand is the alternative if a bolder festive "મંગલ પરિણય" is wanted.

If budget allows a licensed font: **Saguna Gujarati** or **Marudhar Gujarati** (ITF), or an **AMS calligraphy** font exported as SVG outlines. These would give a more bespoke hand-lettered name than any free option. Buy the right licence (webfont, or desktop with static-artwork use) and ship the names as outlined SVG.

Implementation tip (from jalaram-cards): stack fonts as `font-family: "Rasa", "Noto Serif Gujarati", serif;`. Load only the `gujarati` subset (`&subset=gujarati` / `text=` parameter) to keep the woff2 small. For a name "draw" animation, convert the names to SVG paths and animate `stroke-dashoffset`, then fade in the fill.
