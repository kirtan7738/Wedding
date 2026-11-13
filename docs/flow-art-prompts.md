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

---

# Round 6 — the three redesigned sections

The invitation is now an unrolling patra, the timings a gold-thread timeline, and the venue a flip-over ticket. These pieces would finish them. Same settings, peacock as reference.

### 30 · `thali.png` — aspect **1:1** — count **x1** — **needed** (the ભોજન medallion currently shows a kalash)
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — fine detail, gouache texture, soft warm daylight. Subject: a traditional Gujarati wedding feast thali seen from a gentle three-quarter angle: a round polished brass thali with small brass katoris of dal, kadhi, shaak and shrikhand, golden puris, a ladoo and a mohanthal piece, rice with a sprig of coriander, a banana leaf edge, and a few marigold petals on the rim. Whole thali inside the frame, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no table, no shadow, no frame or border, no text.
```

### 31 · `patra-paper.png` — aspect **9:16** — count **x1** — optional
Handmade paper for the unrolling patra (replaces the plain paper texture).
```
A flat, full-frame texture filling the entire image edge to edge: warm ivory handmade paper for a traditional Gujarati wedding kankotri, visible soft fibres and a deckled feel, a very faint pattern of tiny gold paisleys scattered sparsely, gentle warm vignette at the edges. No objects, no border, no text, even lighting.
```

### 32 · `venue-illustration.png` — aspect **4:3** — count **x2** — optional
A painted scene of the venue for the ticket (replaces the elephant on the ticket).
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — fine detail, gouache texture, warm evening light. Subject: an open-air Gujarati wedding party plot at dusk seen from the front: a decorated mandap with marigold and white flower drapes and small lights in the centre, festoons of string lights overhead, a few round banquet tables with white cloths to the sides, potted plants, and a decorated entrance gate with a toran — no people. Whole scene inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) above and around the scene — no sky colour, no frame or border, no text.
```

---

# Round 7 — finishing touches (most useful first)

Same settings (Nano Banana Pro, peacock as reference). Save in the `wed` folder and say "check".

### 33 · `og-scene.png` — aspect **16:9** — count **x2** — **must-have**
The picture guests see in the **WhatsApp link preview**. The live site has none yet. Leave the centre plain: the names and date are added on top in code (AI-written Gujarati letters come out wrong).
```
A wide, full-frame painted illustration for a luxury Gujarati wedding invitation, filling the entire image edge to edge, in authentic Mughal / Rajasthani miniature painting style with fine detail and gouache texture: a kumkum-red bandhani wedding envelope with a gold Ganesh wax seal lying slightly open on ivory handmade paper, an ivory kankotri card half drawn out of it, marigold and rose petals and a small brass diya scattered around, a marigold toran along the top edge. The CENTRE of the image (middle third, left to right) must stay calm and fairly plain — ivory paper — with NO text and NO letters anywhere. Soft warm daylight.
```

### 34 · `ganesh.png` — aspect **1:1** — count **x2** — recommended
The Ganesh on the patra and in the invitation is still a small image from the printed card. A painted one in the same style as everything else would match.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines. Subject: Lord Ganesha seated on a lotus, front view, four arms holding a modak, an axe, a noose and blessing with the fourth, a gold crown, a red dhoti with gold border, a small mouse at his feet, inside a round gold halo of lotus petals. Centred, whole figure inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no frame, no text.
```

### 35 · `pheras.png` — aspect **4:3** — count **x2** — recommended
For the quiet «સાત ફેરા · સાત વચન · સાત જન્મનો સાથ» section, which is only text right now.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference images exactly (the same bride and groom as the reference couple). Style: authentic Mughal / Rajasthani miniature painting — fine detail, gouache texture, warm firelight. Subject: the bride and groom taking the seven pheras around a small sacred fire in a brass havan kund, seen from the side: the groom leading, the bride following, their garments tied together with a red-and-gold knot (gathbandhan), marigold petals falling, a hint of smoke rising. Full figures, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no mandap, no floor colour, no shadow, no frame, no text.
```

### 36 · `mehndi-hands.png` — aspect **1:1** — count **x1** — nice to have
For the countdown («શુભ ઘડીની રાહ»), which has no art yet.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal miniature painting — fine detail, gouache texture, soft warm light. Subject: a bride's two hands with intricate red-brown bridal mehndi, red-and-gold bangles and a gold ring, gently cupped together and holding a small lit clay diya with a bright flame, a few marigold petals in the palms. Front view, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no frame, no text.
```

### 37 · `dhol-shehnai.png` — aspect **16:9** — count **x1** — nice to have
A small festive band (dhol and shehnai) for the closing, next to the share buttons.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — fine detail, gouache texture. Subject: a traditional wedding dhol drum decorated with red and gold cloth and marigolds, a brass shehnai and a pair of small brass manjira cymbals arranged together, with a few rose petals. No people. Whole group inside the frame, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no frame, no text.
```

### Videos — not recommended
The site is already animated live, and a video would add several megabytes for guests opening it on mobile data from WhatsApp. If you want one anyway, the only place it would earn its weight is a **5-second seamless loop of the havan fire** (Seedance image-to-video from `couple-havan.png`, prompt: "the flames in the havan kund flicker gently and a thin wisp of smoke curls up; the couple stays still; seamless loop, no camera movement").

---

# Round 8 — pushpa vrishti: the gods shower flowers on the couple (couple's scene)

The gods lean out of soft clouds on either side of the gate's dome and shower marigold and rose petals on the couple at the havan (the falling petals are live 3D; the paintings only need flowers in hand). Same settings, **attach the peacock and the havan couple as references** so the style matches. Painted, not photo-real. Save in the `wed` folder and say "check".

## Chosen: option A — Shiv-Parvati (left) and Lakshmi-Narayan (right)

### 38 · `devta-left.png` — aspect **3:4** — count **x2**
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference images exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft divine glow. Subject: Lord Shiva and Goddess Parvati together, seen from the waist up, seated side by side on a soft white cloud and leaning gently toward the RIGHT (toward the couple they are blessing), with serene smiling faces. Shiva: blue-grey skin, matted hair with the crescent moon and the Ganga, rudraksha malas, a tiger-skin over one shoulder. Parvati: red-and-gold saree, gold ornaments, a bindi. Each holds out a small gold basket of marigold and rose petals with one hand, and with the other scatters a stream of petals downward to the RIGHT. A soft golden halo behind each head. Whole figures and cloud inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no shadow, no frame, no text.
```

### 39 · `devta-right.png` — aspect **3:4** — count **x2**
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference images exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft divine glow. Subject: Lord Vishnu (Narayan) and Goddess Lakshmi together, seen from the waist up, seated side by side on a soft white cloud and leaning gently toward the LEFT (toward the couple they are blessing), with serene smiling faces. Vishnu: blue skin, a tall gold crown, a yellow pitambar, a Kaustubha jewel and a vaijayanti garland. Lakshmi: a pink-and-gold saree, a gold crown, a pink lotus in her hair. Each holds out a small gold basket of marigold and rose petals with one hand, and with the other scatters a stream of petals downward to the LEFT. A soft golden halo behind each head. Whole figures and cloud inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no shadow, no frame, no text.
```

### 40 · `clouds.png` — aspect **16:9** — count **x1**
Soft clouds the figures rest on, and that drift across the sky.
```
Create a single isolated illustration asset for a luxury Indian wedding invitation website, and match the painting style of the reference image exactly. Style: Mughal miniature painting clouds — soft rounded white and pale-gold cloud banks with delicate curling edges, lightly outlined in gold, a few tiny marigold petals drifting among them. A wide horizontal bank of clouds, centred, whole bank inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky colour, no shadow, no frame, no text.
```

## Fallback B — unnamed devtas and devis
Use the same two prompts, but replace the "Subject" figures with: *"a celestial devta (left: a youthful god with a gold crown and pearl ornaments; right: a graceful devi in a pink-and-gold saree with a gold crown), seated on a soft white cloud"* — no specific deity attributes.

## Fallback C — Brahma, Vishnu and Mahesh with their consorts
Three images instead of two: `devta-left` = Brahma and Saraswati, `devta-centre` = Vishnu and Lakshmi (facing the viewer, smaller, high in the sky), `devta-right` = Shiva and Parvati. Same prompt style, each scattering petals toward the centre. Crowded on phones; best on desktop.

---

# Round 9 — the redesign (haveli gate, mandir envelope, new sections)

Plan: `docs/redesign-plan.md`.

**Settings:** same as before.
- Model: **Nano Banana Pro**.
- Attach **`peacock`** (the style master) as a reference to **every** prompt.
- Download each image as PNG, drop it in `C:\Users\OMEN\Desktop\wed\` and say **"check"**. Claude cuts it out and slots it in.

**Order:** gate (41–46) → the kankotri box (47–51) → sections (52–60). Each group works as soon as its pieces arrive. Claude builds the code with placeholders in the meantime.

## Gate — a Gujarati pol-haveli doorway (replaces the white doors)

### 41 · `haveli-door-leaf.png` — aspect **9:16** — count **x2** — **most important**
One door leaf. It is mirrored for the other side, and the two swing open in 3D.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting with Gujarati haveli detail — exquisite fine detail, gouache texture, delicate gold-leaf outlines, soft warm even daylight from the upper left. Subject: ONE tall single leaf of a traditional Gujarati pol-haveli wooden door, seen perfectly straight-on and flat (no perspective, no angle), shaped as a tall rectangle: rich dark teak wood with deep hand-carved panels of lotus, parrots and creeper vines, rows of polished round brass studs, a brass corner plate at each corner, a large painted kumkum-red sathiya (swastik) with four dots in the upper panel, and a small brass ring knocker on the right edge at mid height. The leaf fills the frame from top to bottom and edge to edge with nothing around it. Background (only if any gap remains): perfectly flat, solid, uniform pure magenta (#FF00FF) — no frame, no wall, no shadow, no text.
```

### 42 · `haveli-doorway.png` — aspect **9:16** — count **x2** — **most important**
The house front the doors sit in. The door opening must be pure magenta so the 3D doors show through it. **Updated (13 Nov):** the door must look tall and grand. The opening is a TALL rectangle (about 46% of the width × 50% of the height, width : height ≈ 0.52), exactly the proportions of the painted teak door (#41), so the whole door shows and nothing is cut or stretched. The two stone elephants and the jharokhas stay as in the first version.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting — exquisite fine detail, gouache texture, gold-leaf outlines, soft warm daylight from the upper left, warm ivory, ochre, teak brown, kumkum red and gold. Subject: the front of a traditional two-storey Gujarati pol haveli seen perfectly straight-on and symmetrical: a carved wooden entrance frame with a cusped arch top and carved brackets, two carved stone elephants with raised trunks at the base of the frame, a carved Ganesha plaque on the lintel above the doorway, and above it an upper storey with three carved wooden jharokha balconies with lattice screens and small canopies, a sloping tiled eave on top. The DOORWAY OPENING must be TALL and GRAND, the main feature of the facade: a tall rectangle about 46% of the image width and 50% of the image height, centred left-to-right, its bottom touching the bottom edge of the image, with only a slim carved teak frame around it and the cusped arch and Ganesha plaque directly above its top edge (no plaster recess between the door and the arch) — a pair of tall teak doors fills it later must be filled completely with perfectly flat, solid, uniform pure magenta (#FF00FF), as must everything around the building — no sky, no street, no ground, no shadow, no doors, no frame, no text. Crisp clean edges against the magenta.
```

### 43 · `door-toran.png` — aspect **16:9** — count **x1**
Hangs across the top of the doorway and sways.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: a traditional Gujarati door toran seen straight-on: a horizontal band of red-and-gold embroidered cloth with tiny mirror work at the top, from which hang a dense row of fresh orange and yellow marigold strings alternating with glossy green mango leaves, with three small brass bells at the centre and both ends. Wide and symmetrical, the whole toran inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no wall, no shadow, no frame, no text.
```

### 44 · `haveli-threshold.png` — aspect **16:9** — count **x1**
The steps in front of the door, seen from slightly above.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: three wide, shallow, warm ivory stone steps leading up to a doorway, seen from the front and slightly above, symmetrical; a colourful round Gujarati rangoli of lotus and peacock motifs in red, yellow, green and white on the ground in front of the lowest step, a pair of small kumkum footprints (kanku pagla) on the top step, small brass diyas with lit flames along the edges of each step, and marigold petals scattered. The whole set of steps inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) everywhere above and around the steps — no wall, no door, no sky, no shadow, no frame, no text.
```

### 45 · `samai-pair.png` — aspect **3:4** — count **x1**
A tall brass lamp standing beside the door. One image, mirrored for the other side.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: ONE tall traditional brass standing oil lamp (samai / deepstambh), polished gold-brass with a peacock finial on top and three tiers of small lit oil-wick flames with a soft warm glow, a round stepped base with a small marigold garland around it. Seen straight from the front, whole lamp inside the frame, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no floor, no frame, no text.
```

### 46 · `door-kadi.png` — aspect **1:1** — count **x1**
The brass knocker the guest taps ("દ્વાર ખોલો").
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one ornate antique brass door knocker seen straight from the front: a round brass back plate shaped like a lotus, a lion face (simha) holding a heavy brass ring in its mouth, polished highlights and slight aged patina. Centred, the whole knocker inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no door, no wood, no shadow, no frame, no text.
```

## First screen — the Sankheda kankotri box (replaces the envelope, user 13 Nov)

The kankotri arrives in a carved, lacquered **Sankheda** box (the traditional lacquered teak woodwork of Sankheda, Gujarat): the guest slides the brass latch, the lid swings back on its hinge, light glows from inside, and the kankotri rises out on red silk. The box is a real 3D box built in code, so these are **flat, straight-on textures** for its faces. That makes them easy to keep consistent: attach the peacock style master, and for #48–50 also attach the image chosen for #48, so the lacquer, colours and pattern match.

### 47 · `pitara-backdrop.png` — aspect **9:16** — count **x2** — **most important**
The very first screen behind the box. **Full-bleed, no magenta.**
```
A full-frame painted scene filling the entire image edge to edge, for the first screen of a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly (Mughal / Rajasthani miniature, fine detail, gouache texture, gold-leaf outlines). Seen from above at a gentle angle: a deep kumkum-red bandhani silk cloth with tiny white and gold dots spread softly over a warm ivory marble floor; scattered orange and yellow marigold petals and a few red rose petals; a small lit brass diya at the lower left and a small brass kalash with mango leaves at the upper right, both near the edges; soft warm daylight from the upper left. The CENTRE of the image (the middle 60% of the width and 50% of the height) is plain red silk, EMPTY, with gentle folds only (a box is placed there later). No people, no text, no border.
```

### 48 · `pitara-front.png` — aspect **16:9** — count **x2** — **most important**
The front face of the box (also used, mirrored, for the back).
```
A flat, full-frame texture filling the entire image edge to edge, seen perfectly straight-on with no perspective: the front panel of a traditional Gujarati Sankheda lacquered teak box, in the painting style of the reference image. Glossy deep maroon-red lacquer, with hand-painted gold and green floral bands along the top and bottom edges, a row of small painted lotus and paisley motifs, thin gold pinstripes, polished brass corner plates at all four corners, and in the exact centre of the top edge an ornate brass latch plate (hasp) with a small loop. Symmetrical left-to-right. The panel fills the whole image; no background, no shadow, no text.
```

### 49 · `pitara-lid.png` — aspect **4:3** — count **x2** — **most important**
The top of the lid, seen straight down. **Attach #48 as a reference too.**
```
A flat, full-frame texture filling the entire image edge to edge, seen perfectly straight down with no perspective: the top of the lid of the same Gujarati Sankheda lacquered teak box as the reference, glossy deep maroon-red lacquer with a broad hand-painted gold and green floral border, polished brass corner plates, and in the centre a round painted medallion of Lord Ganesha seated on a lotus inside a ring of small marigolds and gold leaf. Symmetrical. The lid fills the whole image; no background, no shadow, no text.
```

### 50 · `pitara-side.png` — aspect **4:3** — count **x1**
The two short sides of the box. **Attach #48 as a reference too.**
```
A flat, full-frame texture filling the entire image edge to edge, seen perfectly straight-on with no perspective: the short side panel of the same Gujarati Sankheda lacquered teak box as the reference, glossy deep maroon-red lacquer with a painted gold and green floral band along the top and bottom edges, a single painted lotus in the centre, and a small brass ring handle above it. The panel fills the whole image; no background, no shadow, no text.
```

### 51 · `card-cover-haveli.png` — aspect **9:16** — count **x2**
The kankotri itself, the front cover seen when it rises out of the box. It is split down the middle when its two panels open.
```
A flat, full-frame painted front cover for a traditional Gujarati wedding kankotri, filling the entire image edge to edge, and match the painting style of the reference image exactly (Mughal / Rajasthani miniature, gold-leaf outlines): warm ivory handmade paper, a rich border of kumkum red and gold with marigold, mango-leaf and paisley motifs; at the top centre a small painted Lord Ganesha under a tiny marigold toran; at the bottom a small painted carved haveli doorway with closed teak doors, a kalash on each side and a row of tiny diyas. The MIDDLE THIRD of the card must stay plain ivory paper with NO text and NO pattern (the Gujarati title is added later). Symmetrical left-to-right. No text anywhere.
```

*(The earlier mandir-niche, puja-thali, painted envelope and mauli-knot prompts were replaced by the box. Skip them.)*

## Sections

### 52 · `jharokha-frame.png` — aspect **3:4** — count **x2**
Section 2 (હરખનું તેડું). A carved window. Its opening must be magenta, because the invitation text sits inside it.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one ornate Rajasthani-Gujarati jharokha window seen perfectly straight-on and symmetrical: carved warm ivory sandstone frame with a cusped arch top, a small domed canopy above with tiny finials, carved brackets below, delicate jaali borders, small painted marigold garland hanging across the arch. The window OPENING (a tall arched area in the middle, about 60% of the image width and 65% of its height) must be filled with perfectly flat, solid, uniform pure magenta (#FF00FF), as must everything around the window — no wall, no shutters, no shadow, no frame, no text.
```

### 53 · `jharokha-shutter.png` — aspect **9:16** — count **x1**
One wooden shutter of that window. It is mirrored for the pair, and they swing open on scroll.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: ONE tall narrow wooden window shutter seen perfectly straight-on and flat, with an arched top on the RIGHT side only (the left half of a cusped arch): teak wood painted with a red-and-gold floral pattern, a carved lattice (jaali) panel in the upper half, a small parrot painted in the lower panel, and a tiny brass handle at the right edge. The shutter fills the frame. Background (only where the arch leaves a gap): perfectly flat, solid, uniform pure magenta (#FF00FF) — no frame, no wall, no shadow, no text.
```

### 54 · `bride-portrait.png` — aspect **3:4** — count **x2**
Section 3. A traditional miniature portrait, not a likeness, in profile as in classic miniatures.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: a classic Rajasthani-Gujarati miniature portrait of a young Gujarati bride in elegant side profile facing RIGHT, waist-up: red-and-white panetar saree with a gold border, the veil over her head, a gold nath (nose ring), maang tikka, layered gold necklaces, bangles, holding a small lotus flower; serene, graceful, idealised (not a real person). Placed inside a painted oval medallion with a fine gold border and a ring of tiny flowers. The whole medallion inside the frame, centred. Background outside the medallion: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no text.
```

### 55 · `groom-portrait.png` — aspect **3:4** — count **x2**
The pair to #54. **Attach #54 as a second reference** so the medallion matches.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style and the medallion of the reference images exactly. Subject: a classic Rajasthani-Gujarati miniature portrait of a young Gujarati groom in elegant side profile facing LEFT, waist-up: ivory sherwani with gold embroidery, a red safa turban with a jewelled kalgi (plume) and a string of pearls, a marigold-and-rose garland, holding a small sword hilt; serene, idealised (not a real person). Inside the same painted oval medallion with a fine gold border and a ring of tiny flowers. The whole medallion inside the frame, centred. Background outside the medallion: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no text.
```

### 56 · `arch-name-frame.png` — aspect **3:4** — count **x1**
Section 3. The frame around each family list (દર્શનાભિલાષી, સ્નેહાધીન, મામેરું).
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: an empty decorative painted frame shaped like a cusped Mughal arch seen straight-on: a slim border of kumkum red and gold with tiny marigolds and green leaves, a small kalash motif at the top point and two tiny peacocks at the bottom corners. The INSIDE of the frame (most of the image) must be plain warm ivory paper, empty, for text added later. Everything OUTSIDE the arch: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no text.
```

### 57 · `silk-scroll.png` — aspect **9:16** — count **x2**
Section 5. Each event (હસ્ત મેળાપ, ભોજન) hangs as one of these and unrolls.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one hanging silk scroll banner seen straight-on: an ornate gold rod across the top with round finials at both ends and a red cord loop for hanging; rich deep kumkum-red silk with a woven gold border and small gold buti motifs; a matching gold rod at the bottom; two thick gold-and-red tassels hanging from the lower rod's ends. The CENTRE of the silk (about 70% of its area) must be plain red silk with a faint sheen and NO pattern (text and art are placed there later). Symmetrical, the whole scroll inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no wall, no shadow, no text.
```

### 58 · `mandala-corner.png` — aspect **1:1** — count **x1**
The slowly turning mandala that peeks in at the page corners. Pale, so text stays readable over it.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one large round traditional mandala seen straight-on, finely detailed in a soft pale palette — ivory, blush, pale gold and muted teal — with concentric rings of lotus petals, paisleys and tiny peacock-feather eyes, a small lotus at the centre; delicate and airy, low contrast. Perfectly round and centred, the whole mandala inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no shadow, no text.
```

### 59 · `elephant-divider.png` — aspect **16:9** — count **x1**
The ornament between sections.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: a small symmetrical ornament: two small decorated Indian elephants facing each other with raised trunks, red-and-gold caparisons, holding a marigold garland between their trunks, a small kalash with mango leaves standing in the middle. Wide and short, symmetrical, the whole ornament inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no ground, no shadow, no frame, no text.
```

### 60 · `farewell-scene.png` — aspect **9:16** — count **x2** — optional
The backdrop for Section 9. **Full-bleed, no magenta.**
```
A full-frame painted scene filling the entire image edge to edge, and match the painting style of the reference image exactly (Mughal / Rajasthani miniature, fine detail, gold-leaf outlines). Subject: a Gujarati haveli courtyard at golden dusk after a wedding: strings of marigolds and small lanterns across the courtyard, rows of lit diyas along the edges, a decorated swing (hindolo) with flowers in the background, rose petals on the floor, a soft warm glow and a pale evening sky with the first stars above. The UPPER HALF should be calm (sky and lanterns) for text placed over it. No people, no text, no border.
```

**Reused, no new image needed:**
- `elephant` slides down the event thread.
- `couple-havan` and `thali` go inside the silk scrolls.
- `ganesh-art` sits in the jharokha.
- `venue-illustration` stays on the ticket.
- `pheras` stays in સાત ફેરા.
- `env-seal` cracks in code.

---

# Round 10 — the hero: inside the haveli chowk (user, 13 Nov: "the entire hero section needs to change completely")

The guest opens the haveli doors and steps into the haveli courtyard (chowk), where the wedding is happening:
- painted haveli walls with jharokhas all round;
- the Gujarati wedding **chori** in the centre, with the couple at the havan under it;
- a tulsi kyaro, torans and garlands strung across the courtyard, and a rangoli floor;
- Shiv-Parvati and Lakshmi-Narayan showering petals from the sky above, as before.

Same settings: Nano Banana Pro, attach **peacock** (the style master) to every prompt, and download PNGs into the `wed` folder.

**Reused, no new image needed:** couple-havan, devta-left and devta-right, clouds, kalash, diya, plantain (beside the chori), peacock (on the parapet), and the samai lamp (#45).

### 61 · `chowk-backwall.png` — aspect **16:9** — count **x2** — **most important**
The far side of the courtyard, behind the chori.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Style: authentic Mughal / Rajasthani miniature painting with Gujarati haveli detail — exquisite fine detail, gouache texture, gold-leaf outlines, soft warm golden-hour light from the left. Subject: the inner back wall of a traditional two-storey Gujarati haveli courtyard, seen perfectly straight-on and symmetrical, filling the full width: on the ground floor three carved teak arched doorways with marigold-and-mango-leaf torans, and between them painted murals of an elephant and a peacock on warm ivory lime plaster with red and ochre painted borders; on the upper floor a wooden gallery with carved brackets and five jharokha balconies with lattice screens and small canopies; a parapet on top with two small domed chhatris at the corners. The bottom edge of the wall touches the bottom of the image. Everything ABOVE the parapet (the sky) must be perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no clouds, no shadow, no frame, no text. Crisp clean edges against the magenta.
```

### 62 · `chowk-sidewall.png` — aspect **3:4** — count **x1**
A side of the courtyard; used on both sides, angled inward.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one bay of the side wing of a traditional Gujarati haveli courtyard, seen perfectly straight-on: on the ground floor a covered verandah (osri) with two carved teak pillars on stone bases and carved brackets, a hanging brass lamp between them, a raised plinth with two steps; on the upper floor one jharokha balcony with a lattice screen and a small canopy; warm ivory lime-plaster walls with red and ochre painted borders and a small painted parrot motif. The bottom of the plinth touches the bottom edge. Everything above the roofline must be perfectly flat, solid, uniform pure magenta (#FF00FF) — no sky, no shadow, no frame, no text.
```

### 63 · `chori.png` — aspect **1:1** — count **x2** — **most important**
The Gujarati wedding chori. The couple at the havan is placed inside it.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: a traditional Gujarati wedding chori (mandap) seen straight-on from the front at eye level, symmetrical: four slender pillars wrapped in banana stems and marigold garlands, and at each of the four corners a tall tower of seven stacked round clay pots (matli) painted red, yellow and green with white dots, each tower topped with a coconut on mango leaves; a canopy above made of a red-and-gold bandhani cloth roof with marigold strings and mango leaves hanging along its front edge; a low square platform at the bottom with a small painted border. The OPEN SPACE between the pillars, under the canopy and above the platform, must be perfectly flat, solid, uniform pure magenta (#FF00FF) — empty, no people, no fire (they are placed there later) — and so must everything around the chori. No shadow, no frame, no text. Crisp clean edges against the magenta.
```

### 64 · `tulsi-kyaro.png` — aspect **3:4** — count **x1**
The sacred tulsi planter in the courtyard.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: a traditional Gujarati tulsi kyaro (sacred basil planter) seen from the front at eye level: a small square brick-and-lime altar about waist high, painted ochre and white with red borders, a kumkum sathiya and small painted lotuses on its front, a lush green tulsi plant growing from the top, a lit brass diya and a few marigolds on its ledge, a small marigold garland around it. The whole planter inside the frame, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no floor, no shadow, no frame, no text.
```

### 65 · `chowk-floor.png` — aspect **1:1** — count **x1**
The courtyard floor. **Full-bleed texture, no magenta.**
```
A flat, full-frame texture filling the entire image edge to edge, seen perfectly straight down from above with no perspective, and match the painting style of the reference image exactly: the floor of a Gujarati haveli courtyard paved with large warm sandstone tiles, and in the middle a large round traditional rangoli of lotus petals and peacock motifs in red, saffron, yellow, green and white with a ring of small lit diyas, and a few marigold and rose petals scattered on the stones. Even soft light, no objects, no people, no text, no border.
```

### 66 · `garland-swag.png` — aspect **16:9** — count **x1**
Garlands strung across the courtyard, above the guest.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one long swag of fresh orange and yellow marigold garland with glossy mango leaves and small brass bells, hanging in a gentle curve from the top-left corner to the top-right corner of the frame (lowest in the middle), with three short marigold strings dangling from it. Wide, the whole swag inside the frame. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no wall, no sky, no shadow, no frame, no text.
```

### 67 · `brass-jhoomar.png` — aspect **3:4** — count **x1** — optional
A big brass hanging lamp over the courtyard.
```
Create a single isolated illustration asset for a luxury Gujarati wedding invitation website, and match the painting style of the reference image exactly. Subject: one large ornate antique brass hanging lamp (deepmala jhoomar) seen from the front: three tiers of small brass oil lamps with lit flames and a soft warm glow, peacock finials, delicate brass chains rising to a single ring at the top, small bells hanging from the lowest tier. The whole lamp and its chains inside the frame, centred. Background: perfectly flat, solid, uniform pure magenta (#FF00FF) — no ceiling, no shadow, no frame, no text.
```
