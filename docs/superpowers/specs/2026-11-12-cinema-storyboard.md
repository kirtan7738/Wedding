# Cinema redesign — storyboard (rev 4)

User feedback (12 Nov): "website still looks static… confetti blast very poor… initial appearance poor…
looks AI generated… behaviour 0/100… I have a cinematic vision: different camera angles show the visuals."

## Direction
One persistent Three.js world behind the page, rendered on a single fixed canvas. Scrolling moves a
**camera rig through a sequence of shots** (crane, dolly, orbit, drop, aerial). The DOM is kept for
all copy (Gujarati shaping, accessibility, SEO) but restyled as **film title cards** floating over the
world — no card stacks, no boxed web sections.

Everything is procedural (no downloaded models): lathe pillars, catenary marigold strings (sphere
impostors), diya flames, sky lanterns, bokeh, GPU petals, GPU fireworks, canvas-painted door texture.

## Shots
| # | DOM section | Camera | World |
|---|-------------|--------|-------|
| 0 | Cover (pre-tap) | locked on carved doors, slow breathing push | night, temple doors closed, toran, diyas at threshold, warm bokeh |
| T | Tap | doors swing open → light floods → camera dollies **through** the doorway, petal storm streaks past the lens, gold dust | |
| 1 | Hero | crane up / settle on the couple frame inside the mandap | marigold strings framing foreground, bokeh behind, petals drifting |
| 2 | Invitation | tilt up through hanging strings (foreground sweeps past lens) | canopy, strings |
| 3 | Countdown | drop low over dark water, horizon of floating diyas, lanterns rising | |
| 4 | Moments | lateral dolly along a colonnade of pillars | pillars, strings |
| 5 | Venue | aerial — camera rises and looks straight down at a mandala of lights | light mandala |
| 6 | Photos | orbit around photo frames hanging in space | photo planes in gold arches |
| 7 | Closing | tilt up to the sky, fireworks | GPU fireworks |

## Rules
- Mobile first: DPR ≤ 1.5 high / 1 lite, no shadows, no real lights in shaders (baked/fake), additive glow sprites instead of bloom.
- Camera follows scroll through a damped spring (never jerky on touch scroll).
- Reduced motion / no WebGL: pre-rendered stills of each shot as section backgrounds; content always readable.
- Copy unchanged (wedding.js); only presentation.
