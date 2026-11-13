# Painted art for the invitation — Google Flow prompts

These are the painted pieces that replace the code-drawn art in the 3D scenes (gate, peacocks, elephant, trees, flowers, lamps, birds). Each piece is generated **on a flat pink background** so it can be cut out and stood up in the 3D world like a stage set.

Style target: the reference reel (`Video-90645.mp4`), a Mughal / Rajasthani miniature-painting wedding invitation.

---

## 1. Flow settings (Agent settings panel)

| Setting                             | Choose                                                                 | Why                                                                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Confirm before generating** | **Always**                                                       | You approve each generation, so no credits are spent by surprise.                                                                       |
| **Model**                     | **Nano Banana Pro**                                              | Best detail and painting quality, and it follows reference images closely. Use **Nano Banana 2.1** only if Pro is out of credits. |
| **Count**                     | **x2** for peacock, elephant and gate; **x1** for the rest | Two options where it matters most; one elsewhere to save credits.                                                                       |
| **Aspect ratio**              | As listed for each piece below                                         | Flow offers 16:9 · 4:3 · 1:1 · 3:4 · 9:16.                                                                                          |

---

## 2. How to work (keeps the whole set in one style)

1. **Generate the peacock first** (prompt 1). Pick the best one. This becomes the **style master**.
2. For **every other prompt**, add the chosen peacock image as a **reference / ingredient** before generating. Each prompt already says *"match the painting style of the reference image"*.
3. **Download** each image at the highest quality, as **PNG**.
4. **Save** it in this folder, with exactly this filename:
   `C:\Users\OMEN\Desktop\wed\site\art-src\`  →  `peacock.png`, `elephant.png`, …
5. When done (even with only some pieces), tell Claude **"done"**. Claude cuts out the pink, sizes each piece and places it in the scenes.

### Check before you download

- [ ] Background is **one flat, even pink**: no gradient, no floor, no shadow, no vignette.
- [ ] The **whole subject is inside the frame**: no tail, leaf or finial cut off at an edge.
- [ ] **No text, no border, no frame** around the picture.
- [ ] Same painted look as the peacock (if not, regenerate with the reference attached).
- [ ] **Gate only:** the arch opening is filled with the same flat pink.
- [ ] **Bougainvillea only:** if pink flowers blend into the pink background, use the green-background version given under that prompt.

---

## 3. The prompts

Copy each block exactly. The text is long on purpose: it tells the model what the piece is for, which way it faces, how it is lit and how the background must look.

### 1 · `peacock.png` — aspect **3:4** — count **x2**  *(style master — no reference needed)*

Perched on top of the ivory gate in the opening scene, tail hanging down over the gate's face.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, opaque gouache and watercolour texture, delicate gold-leaf outlines, soft warm even daylight from the upper left, rich jewel colours (peacock blue, deep emerald green, kumkum red, ivory, gold). Subject: one Indian peacock perched on a short carved ivory stone ledge, seen from the side at eye level, body facing left, head turned slightly toward the viewer, crest feathers upright; its long iridescent train hangs straight down below the ledge in a graceful cascade, every tail feather painted with a detailed eye-spot (gold, turquoise, deep blue centre). Composition: the whole bird and the full length of the tail inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) filling everything around the subject — no gradient, no ground, no cast shadow, no vignette, no frame or border, no text or signature. The image will be cut out along the magenta, so keep crisp clean edges against it.
```

### 2 · `elephant.png` — aspect **4:3** — count **x2**  *(attach peacock as reference)*

Walks beside the colonnade (wedding procession / baraat).

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache and watercolour texture, delicate gold-leaf outlines, soft warm daylight from the upper left, rich jewel colours (kumkum red, gold, ivory, emerald green, peacock blue). Subject: one royal decorated Indian elephant in a wedding procession, full body, side view at eye level, walking toward the left with one front leg lifted; embroidered red-and-gold caparison with tassels and mirror work, gold forehead ornament and tusk caps, painted floral patterns on the trunk and ears, gold anklets with bells, and an ornate small gold ceremonial umbrella (chhatra) with fringe raised on its back. Composition: the whole elephant and umbrella inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no gradient, no ground, no shadow, no vignette, no frame or border, no text. Crisp clean edges against the magenta for cutting out.
```

### 3 · `chhatri.png` — aspect **3:4** — count **x1**  *(attach peacock as reference)*

Domed pavilions on the walls and in the garden, plus the palace skyline across the lake.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — fine detail, gouache texture, delicate gold-leaf outlines, soft warm daylight from the upper left. Subject: one Rajasthani chhatri pavilion built of ivory-cream sandstone, seen straight on from the front at eye level and perfectly symmetrical: a ribbed onion dome topped by a gold kalash finial, a sloping chhajja eave on carved brackets, four slender pillars with cusped (multifoil) arches between them, a dark shaded interior, a stepped plinth at the bottom, and delicate red-and-green pietra dura inlay bands. Composition: the whole pavilion inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no ground, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

### 4 · `cypress.png` — aspect **9:16** — count **x1**  *(attach peacock as reference)*

Tall trees framing the gate and the mandap.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight from the upper left, rich greens. Subject: one tall slender cypress tree, flame-shaped, with dense layered dark-green foliage painted leaf-cluster by leaf-cluster (lighter on the left, deeper green on the right), a flowering vine with small white and soft-pink blossoms spiralling up around it, a thin trunk and a small tuft of grass at the very bottom. Composition: the whole tree from base to pointed tip inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no ground, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

### 5 · `plantain.png` — aspect **3:4** — count **x1**  *(attach peacock as reference)*

Banana plants beside the mandap and along the colonnade.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight from the upper left. Subject: one lush banana (plantain) plant clump, front view at eye level: five to seven broad arching green leaves with a pale midrib and fine parallel veins, a few natural tears in the leaf edges, a hanging deep-red banana flower bud on a curved stem, green pseudo-stems and a small tuft of grass at the base. Composition: the whole plant inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no ground, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

### 6 · `bougainvillea.png` — aspect **16:9** — count **x1**  *(attach peacock as reference)*

Low flowering bushes at the foot of the gate and around the stage.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight from the upper left. Subject: one low, wide, rounded flowering bush seen from the front at eye level: dense dark-green leaves covered in crimson roses and red bougainvillea blossoms, with a few small white jasmine flowers. Composition: the whole bush inside the frame, centred, flat bottom edge, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no ground, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

> If the red/pink flowers blend into the magenta, regenerate with the background line changed to: `Background: perfectly flat, solid, uniform pure bright green (#00FF00) …` and name the file `bougainvillea-green.png`.

### 7 · `grass.png` — aspect **16:9** — count **x1**  *(attach peacock as reference)*

The garden foreground strip along the bottom of the scenes (the reel's grass and flower beds).

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight from the upper left. Subject: a long, wide horizontal strip of lush ornamental garden foreground seen from the front at ground level: layered tufts of grass, ferns, broad leafy plants, small white flowers, red poppies and roses, varying in height so the top edge is irregular and natural; the bottom edge is a straight horizontal line. Composition: the strip spans the full width, sits in the lower part of the frame, nothing cropped at the top. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) above and around the plants — no sky, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

### 8 · `gate.png` — aspect **9:16** — count **x2**  *(attach peacock as reference)*

The grand entrance in the first scene. The 3D carved doors sit **behind** it and show through the opening.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft warm daylight from the upper left. Subject: a grand ivory-white marble jharokha gateway facade seen perfectly straight on and symmetrical: a tall cusped multifoil arch opening in the centre (the opening takes about half the width and its top is at about two-thirds of the height), wide carved side pillars and borders with pietra dura inlay of red flowers and green leaves, a curved bangaldar roof above with a ribbed vault and three gold finials, and small gold bells hanging under the eave. The arch opening itself must be filled with the same flat pure magenta (#FF00FF) — do NOT paint doors or anything inside the opening. Composition: the whole gateway inside the frame, centred, bottom of the pillars at the bottom edge, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) everywhere outside the gateway — no sky, no ground, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

### 9 · `door-leaf.png` — aspect **9:16** — count **x1**  *(attach peacock as reference)*

The painted surface of the two doors that swing open. **Full-bleed: no pink in this one.**

```
Create a flat painted texture for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft even light with no strong shadows. Subject: one tall ivory-painted wooden door leaf seen perfectly straight on, flat and front-facing, filling the ENTIRE image edge to edge with no background showing: a gold border around the edge, three arched niches stacked vertically (top, middle tall, bottom), each niche painted with a symmetrical flowering tree of life with red flowers and green leaves growing from a small gold urn, a row of small brass studs between the niches, and a brass ring knocker on one side. No perspective, no frame around the picture, no text.
```

### 10 · `lamp.png` — aspect **3:4** — count **x1**  *(attach peacock as reference)*

Brass lanterns hanging from the canopy of the mandap.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, delicate gold outlines, soft warm daylight. Subject: one ornate brass Indian hanging lantern (kandil), front view at eye level: a domed brass cap with a short hanging chain at the top, a pierced jaali-pattern brass body with a warm glowing flame visible inside, and a small pointed finial with a red tassel at the bottom. Composition: the whole lantern and chain inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no glow spilling onto the background, no frame or border, no text. Crisp clean edges against the magenta.
```

### 11 · `diya.png` — aspect **1:1** — count **x1**  *(attach peacock as reference)*

The oil lamps around the rangoli at the gate and floating on the lake.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight. Subject: one traditional clay diya oil lamp seen from a slight three-quarter angle above: a terracotta bowl with a pinched pouring spout, a painted red-and-yellow dotted band around the rim, a cotton wick in the spout with a bright teardrop-shaped flame (white-yellow core, orange edge). Composition: the whole diya and flame inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no table, no shadow, no glow spilling onto the background, no frame or border, no text. Crisp clean edges against the magenta.
```

### 12 · `boota.png` — aspect **3:4** — count **x1**  *(attach peacock as reference)*

The gold emblem above the couple's names on the arch in the mandap.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: fine gold-leaf line art in the Mughal miniature tradition, crisp and elegant. Subject: one ornamental tree-of-life boota emblem in a teardrop (paisley-drop) outline: a central stem rising from a small urn, perfectly symmetrical curling branches with leaves and small five-petal flowers, a lotus bud at the top, all drawn in shimmering gold with a few tiny red accents. Composition: the whole emblem inside the frame, centred, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no texture, no shadow, no frame or border, no text or letters. Crisp clean edges against the magenta.
```

### 13 · `birds.png` — aspect **16:9** — count **x1**  *(attach peacock as reference)*

Doves flying over the gate and the lake.

```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight. Subject: three white doves in graceful flight, well separated from each other (not overlapping), wings spread in different positions (one up, one level, one down), soft grey shading under the wings, small orange feet tucked in. Composition: all three birds fully inside the frame, spaced evenly across it, nothing cropped. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no clouds, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

---

## 4. Priority, if credits are limited

1. **peacock** · 2. **elephant** · 3. **gate** · 4. **door-leaf** · 5. **cypress** · 6. **chhatri** · 7. **grass** — these make the biggest visible difference.
   8–13 (plantain, bougainvillea, lamp, diya, boota, birds) are nice to have; the code-drawn versions stay in place for anything not generated.

---

# Round 2 — fixes and new pieces

Same settings as before (Nano Banana Pro · Confirm before generating: Always), and **attach the peacock as the reference image** for every prompt. Save into `C:\Users\OMEN\Desktop\wed\` and say "check".

## Fix

### 8b · `gate.png` again — aspect **9:16** — count **x2**
The first gate's right-hand border was cut off by the frame edge. Same prompt as #8, with this added at the end:
```
IMPORTANT: leave a clear margin of empty magenta on ALL four sides — the whole gateway, including both outer inlaid borders and the full dome with its finials, must be completely inside the picture with space around it.
```

## New pieces (in order of impact)

### 14 · `arch-frame.png` — aspect **3:4** — count **x2** — **most important**
The cusped ivory arch frame that will surround the text panels (invitation, moments, venue), exactly like the arched panels in the reel.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft warm daylight. Subject: an ornate ivory marble arch FRAME seen perfectly straight on and symmetrical — a tall cusped multifoil (scalloped) arch with a pointed crown, wide carved borders on both sides with pietra dura inlay of red flowers and green leaves, slender carved pillars on each side, a little flowering vine trailing over the top corners, a carved base at the bottom. The entire INSIDE of the arch (the window area, which takes most of the picture) must be filled with flat pure magenta (#FF00FF) — nothing painted inside it. Background outside the frame: also flat pure magenta (#FF00FF). Whole frame inside the picture with a small magenta margin on all sides, no text, no shadow.
```

### 15 · `marigold-strings.png` — aspect **9:16** — count **x1**
Hanging marigold-and-jasmine strings (ladis) to replace the 3D flower strings in the mandap.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight. Subject: seven vertical hanging flower strings (ladis) side by side with even gaps, hanging straight down from the top edge: dense orange and yellow marigolds alternating with white jasmine buds and a red rose every few flowers, each string ending in a small tassel of jasmine; strings of slightly different lengths. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) between and around the strings — no shadow, no frame or border, no text.
```

### 16 · `toran.png` — aspect **16:9** — count **x1**
The festive door garland that hangs across the top of the gate.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight. Subject: one traditional Indian toran (door garland) seen straight on, spanning the full width: a gently swagging rope of dense orange and yellow marigolds with mango leaves, with short strings of marigolds, small brass bells and green mango leaves hanging down from it at even intervals. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no wall, no shadow, no frame or border, no text. Whole garland inside the picture.
```

### 17 · `kalash.png` — aspect **3:4** — count **x1**
The auspicious kalash that stands on either side of the gate (very Gujarati).
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, delicate gold outlines, soft warm daylight. Subject: one auspicious Indian wedding kalash: a polished brass/copper pot with a painted red-and-gold floral band, five green mango leaves fanned around its mouth, a coconut wrapped in red cloth with gold thread on top, a marigold garland around its neck, standing on a small low brass plate with a few rice grains and flower petals. Front view at eye level, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no table, no shadow, no frame or border, no text.
```

### 18 · `paper-red.png`, `paper-emerald.png`, `paper-mustard.png` — aspect **9:16** — count **x1 each**
The textured painted-paper colour of the reel's panels (red, olive/emerald, mustard). Run the prompt three times, changing only the colour words.
```
A flat, full-frame texture for a luxury Indian wedding invitation: handmade painted paper in deep KUMKUM RED, with soft mottled gouache wash, subtle paper fibre texture, very faint gold speckles, gentle darker vignette at the edges. No objects, no pattern, no text, no border — just the coloured painted paper filling the whole image evenly.
```
(For the other two, replace `deep KUMKUM RED` with `deep EMERALD GREEN` and then `warm MUSTARD OCHRE`.)

### 19 · `rangoli.png` — aspect **1:1** — count **x1** — optional
A painted rangoli for the ground in front of the gate.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: Indian rangoli made of coloured powder and flower petals, seen from directly above, perfectly circular and symmetrical: concentric rings of marigold petals, red rose petals, white jasmine and green leaves around a central lotus, with small diyas on the outer ring. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) around the circle — no floor, no shadow, no text.
```

---

# Round 3 — the couple's scene (after the doors open)

This scene is now a straight-on painted tableau: the gate frames a crimson silk panel with the names, flanked by peacocks, banana plants, cypress, chhatris, brass lamps and a flower garden, with the lake behind. These pieces would lift it the most. Same settings, peacock as reference.

### 20 · `names-panel.png` — aspect **9:16** — count **x2** — **most important**
Replaces the code-drawn red panel behind the names. Full-bleed (no pink).
```
Create a flat, full-frame painted textile for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Subject: one tall hanging panel of rich crimson-red silk, seen perfectly straight on, filling the ENTIRE image edge to edge: soft natural vertical folds, a wide gold zari-embroidered border on all four sides with a delicate repeating flower-and-leaf pattern, a gold mango-leaf toran motif along the top edge, and a light scatter of tiny gold butis (small paisley and flower dots) over the field. The CENTRE of the panel (the middle half) must be plain smooth crimson silk with NO pattern, NO emblem, NO circle, NO medallion and NO text — the couple's names will be placed there. Soft even light, no strong shadows, no frame around the picture, no text.
```

### 21 · `hanging-lamp-bracket.png` — aspect **3:4** — count **x1**
A wall bracket and lamp painted as one piece, so the lamps visibly hang from the gate.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, delicate gold outlines, soft warm daylight. Subject: an ornate brass wall bracket with a curling scrolled arm projecting to the RIGHT from a small decorative wall plate on the LEFT edge, and an ornate brass hanging lantern (kandil) with a glowing flame and a red tassel hanging from the end of the arm on a short chain. Side view, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no wall, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

### 22 · `lotus-pond.png` — aspect **16:9** — count **x1**
A strip of lotus pond in front of the lake edge, to soften the hard line where the terrace meets the water.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight. Subject: a long horizontal strip of calm teal pond water seen from the front at a low angle, filled with pink and white lotus flowers in bloom, round green lotus leaves, a few lotus buds on stems, and two small white swans. The strip spans the full width; its bottom edge is straight. Background above and around: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no shadow, no frame or border, no text.
```

### 23 · `marble-steps.png` — aspect **16:9** — count **x1**
Three wide ivory marble steps leading up to the gate, so the gate sits on a plinth instead of on grass.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm daylight. Subject: a wide flight of three shallow ivory-white marble steps seen straight on from the front, each step edged with a thin band of red-and-green pietra dura inlay, small brass diyas with flames placed at both ends of each step, and a scatter of marigold and rose petals on the steps. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) above and around — no wall, no shadow, no frame or border, no text.
```

### 24 · `couple-silhouette.png` — aspect **3:4** — count **x1** — optional
A tasteful painted bride and groom in miniature style (faceless, traditional), standing hand in hand, for the arch, instead of a photo.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting, elegant and modest. Subject: a Gujarati bride and groom standing side by side in profile facing each other, holding hands, the bride in a red-and-white panetar saree with gold border and veil, the groom in an ivory sherwani with a red safa turban and a marigold garland; faces shown in classic miniature profile style without fine facial detail. Full figures, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no ground, no shadow, no frame or border, no text.
```

---

# Round 4 — the couple at the havan (for the arch in the couple's scene)

### 25 · `couple-havan.png` — aspect **4:3** — count **x2**
Replaces the standing bride and groom inside the gate's arch. **Attach the peacock AND the standing bride-and-groom image (#24) as references**, so the couple's faces and clothes stay the same. Save it in the `wed` folder and say "check"; it swaps in automatically.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference images exactly (same bride and groom, same outfits). Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft warm light from the fire. Subject: a Gujarati bride and groom seated cross-legged side by side on low ornate wooden patlas during the wedding ceremony, facing a small square brass-and-copper havan kund (sacred fire altar) in front of them with bright orange flames and a little curling smoke; the bride in a red-and-white panetar saree with gold border and veil on the left, the groom in an ivory sherwani with a red safa turban and a marigold garland on the right; their hands joined in the hast melap; a few brass bowls of rice, ghee and flowers and a small kalash beside the havan kund; scattered marigold and rose petals around them. Shown at a gentle three-quarter front angle, full figures and the whole havan kund inside the frame, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no mandap, no wall, no floor colour, no shadow, no frame or border, no text. Crisp clean edges against the magenta.
```

---

# Round 5 — the envelope and the kankotri (first frame)

The envelope, the card and their animation are built in code, so any of these can be dropped in to make them richer. All except the seal are **full-bleed** (no magenta), and the code adds the Gujarati text. Same settings, peacock as reference.

### 26 · `env-paper.png` — aspect **9:16** — count **x1**
The envelope's paper.
```
A flat, full-frame texture for a luxury Gujarati wedding invitation envelope, filling the entire image edge to edge: deep kumkum-red handmade paper with a fine traditional Gujarati bandhani (tie-dye) pattern of tiny gold and ivory dots arranged in small diamond clusters, a soft silk-like sheen and subtle paper fibres. No objects, no border, no text, even lighting.
```

### 27 · `env-seal.png` — aspect **1:1** — count **x2**
The wax seal that breaks on the tap.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Subject: one round gold-and-red wax seal seen straight from the front, slightly irregular melted edge, with a finely embossed Lord Ganesha in the centre surrounded by a ring of small lotus petals, glossy highlights on the wax. Centred, whole seal inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no frame, no text.
```

### 28 · `card-cover.png` — aspect **9:16** — count **x2**
The front of the kankotri, seen before the two panels open (it is split down the middle).
```
A flat, full-frame painted front cover for a traditional Gujarati wedding kankotri, filling the entire image edge to edge, in Mughal / Rajasthani miniature style: ivory handmade paper, a rich border of red and gold with small marigold, mango-leaf and paisley motifs, a painted Lord Ganesha at the top centre in a small gold arch, a pair of small kalash with mango leaves and coconuts at the bottom corners, and a fine gold mandala ring in the middle. The CENTRE of the card (middle third) must stay plain ivory paper with NO text and NO pattern — the Gujarati title is added later. Symmetrical left-to-right. No text anywhere.
```

### 29 · `card-panel-inside.png` — aspect **9:16** — count **x1**
The inner side of the two panels (seen while they swing open). Symmetric, so one image serves both.
```
A flat, full-frame painted texture for the inside of a traditional Gujarati wedding kankotri panel, filling the entire image edge to edge, in Mughal miniature style: ivory paper with a thin red-and-gold border, and running down the full height a slender painted vine of marigolds, red roses and green leaves with two small peacocks facing inward, delicate and airy. No text.
```
