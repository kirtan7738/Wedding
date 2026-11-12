# શુભ લગ્ન — Princy ❀ Parth

A cinematic Gujarati wedding invitation (kankotri) website, built as a gift from the bride's brother.

**Wedding:** Sunday, 13 December 2026 · Atithi Party Plot, Petlad

## What it is

- **Opening:** the guest taps the cover, and a pair of painted ivory doors swings open. The camera flies through a burst of marigold petals into a painted courtyard where the couple's names appear.
- **Painted world:** a Three.js scene made of hand-painted Mughal-miniature cut-outs (generated with Google Flow): an ivory jharokha gate, peacocks, elephants, chhatris, cypress, banana plants, lamps, a toran, kalash and a rangoli, with a teal lake and a palace skyline behind.
- **Sections:** the invitation, countdown, ceremony timings, venue and map, and a closing blessing with sharing. Each sits in a painted arch frame on painted paper.
- **Mobile-first:** most guests open it from WhatsApp on a phone.
  - Phones without WebGL2 get pre-rendered stills of the same scenes.
  - Reduced-motion users get a gentle cross-fade.
  - The content is readable without JavaScript.
- **Gujarati first:** the copy is Gujarati, with small English helper labels.

## Stack

Vite · React 19 (prerendered) · Three.js with custom GLSL · GSAP · Tailwind 4 · Vitest · Playwright.

## Run it

```bash
cd site
npm install
npm run dev          # http://localhost:5180
npm test             # unit tests
npm run build        # production build (prerendered) → site/dist
npx playwright test  # device tests (phones, desktop, no-WebGL, reduced motion)
```

## Useful scripts (in `site/`)

| Script | What it does |
|---|---|
| `node scripts/art-cut.mjs art-src/<file>.jpg <name>` | Cuts a painted asset out of its flat background into `public/img/art/<name>.webp` |
| `node scripts/arch-panels.mjs` | Builds the painted arch-panel pieces (crown, sides, sill) |
| `node scripts/stills.mjs` | Renders the fallback stills (needs the dev server running) |
| `node --env-file=.env.local scripts/hf-art.mjs` | Optional Higgsfield art generator (spending-capped; key kept in the git-ignored `.env.local`) |

Prompts for every painted piece are in [`docs/flow-art-prompts.md`](docs/flow-art-prompts.md).

## Privacy

This public repository deliberately leaves out the following, which stay with the family:

- the original printed card;
- the images extracted from it;
- the couple's photos.

The WhatsApp preview image (`site/public/og.png`) and the raw generated art (`site/art-src/`) are not included either.
