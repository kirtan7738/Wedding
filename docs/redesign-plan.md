# Kankotri redesign plan (13 Nov 2026)

Decided 13 Nov: the gate is a **Gujarati haveli door**. The envelope was then replaced (user, 13 Nov: "change the envelope design entirely") by a **carved Sankheda kankotri box**: slide the brass latch → the lid swings back in 3D → light glows → the kankotri rises out on silk → gatefold → zoom.

## Rules
- Theme comes from Indian, mainly Gujarati, weddings. Foreign sites are used only for typography and interaction.
- The camera moves only in the opening (envelope → gate → flight to the hero). After that, everything moves with the guest's scroll and taps.
- Every section has its own painted scene and one interaction of its own. No two look alike.
- White/daylight base, Gujarati text with small English helper labels, no couple photos, mobile first.
- Best references:
  - Invitima royal-gateway: invitima.com/template-frame/royal-gateway
  - digitalinvite noor-mahal and jaipur-gulabi: digitalinvite.in/demo/...

---

## Act 0: choose language (done, 13 Nov)
- **Screen:** ગુજરાતી or English, on ivory paper with a swaying toran, Ganesh, two arched doorways with diyas, and kalash.
- **Tap:** it lights the diya, starts the song's intro, and lifts away to the envelope.
- **After that:** the choice is remembered, and a switch pill appears at top right after the doors.
- **Placeholders:** the English wording and the family names until the families confirm them.
- **Code:** `src/components/LanguageGate.jsx`, `src/styles/lang.css`, and `setLang()` in `src/content/wedding.js`.

## Act 1: the envelope (redesign)
**Idea:** "the first kankotri goes to Ganpati". A Gujarati family places the first kankotri before Ganesh, then sends it out. The guest receives it from the family mandir.

1. **First frame:** a painted mandir niche (gokhlo).
   - In the niche: a small Ganesh, a lit diya, a brass thali with kumkum, akshat (rice) and marigold petals.
   - On the thali: the kankotri envelope, tied with a red-yellow nadachhadi (mauli) and closed with a gold Ganesh wax seal.
   - Motion: the diya flame flickers, incense smoke curls up, one or two petals fall. The Judi Jodi intro starts on the first tap anywhere.
2. **Untie:** the guest swipes or drags across the mauli knot and the thread slips off. Tapping still works as a fallback.
3. **Seal:** it cracks in two halves with a soft "tak" and a gold dust puff.
4. **Flap:** it lifts with paper sound; the kumkum-printed lining shows.
5. **Kankotri:** the card rises out. Its cover shows a painted Ganesh and a toran, and its title is "શુભ લગ્ન".
6. **Gatefold:** the left panel opens, then the right. Inside is a painting of the gate, the same gate the guest is about to see.
7. **Zoom:** the camera pushes into the painted gate. It crossfades exactly onto the live gate scene, as now via snapshot.

**New art:**
- mandir niche backdrop
- brass thali with kumkum, akshat and petals
- painted envelope (body, flap and lining)
- mauli thread
- seal halves
- new card cover
- card inside panels showing the new gate

**Keep:** the timing engine, the snapshot swap, and the sounds (bell, seal, paper, chime).

## Act 2: the gate (redesign)
**Idea:** a Gujarati pol-haveli entrance. Not a copy of the Jaipur peacock gate the vendors use.

1. **First frame:** a carved teak haveli doorway.
   - Brass studs and a brass kadi (knocker).
   - A marigold and mango-leaf toran across the top.
   - A kumkum sathiya (swastik) and shubh-labh on the doors.
   - A kalash on each side, a row of diyas on the steps, and rangoli at the threshold.
   - Painted wooden jharokhas above, with a peacock on the ledge and a bougainvillea spill.
   - Motion: the toran sways, the diyas flicker, and the peacock turns its head.
2. **Interaction:** "દ્વાર ખોલો". The guest taps the brass kadi, or swipes the doors apart.
   - The knocker clinks twice.
   - The doors swing inward in 3D with a creak and the shehnai.
   - Golden light floods out, and marigold petals blow toward the camera.
3. **Flight:** the existing 3D flight goes through the doorway into the courtyard. The gods descend and pour petals, and the Judi Jodi verse lands. This part stays as it is.
4. **Hero:** the couple at the havan, the gods, and the painted courtyard. Names are not here; they appear in Section 2.

**New art:**
- door leaf (one image, mirrored for the pair)
- haveli doorway surround with jharokhas
- door toran
- threshold rangoli and steps
- a pair of diyas
- brass kadi

**Keep:**
- the 3D world, the door-swing code, and the flight shots
- the gods, the hero layers and the music sync

---

## Act 3: the hero, redesigned (user, 13 Nov: "the entire hero section needs to change completely")
**Idea:** inside the haveli chowk. The doors open and the camera flies into the courtyard where the wedding is happening.
- **Walls:** painted haveli walls with jharokhas on three sides (back wall, plus side wings angled inward).
- **Chori:** the Gujarati chori in the centre, with towers of painted pots at the corners; the havan couple sits inside.
- **Around it:** a tulsi kyaro on the left, brass samai lamps, plantains beside the chori, peacocks on the parapet.
- **Above and below:** marigold garland swags across the courtyard, and a sandstone floor with a large rangoli.
- **Sky:** the gods shower petals from the clouds above, as before.
- **Art:** Round 10 prompts (#61–67). Stand-ins come from existing art until the paintings arrive.
- **Camera:** it still moves only during the opening.

## Sections after the hero
| # | Section | Scene | Interaction | Art |
|---|---|---|---|---|
| 2 | હરખનું તેડું | Painted jharokha window | Shutters open on scroll. Inside: shloka, invitation lines, and the names written in gold like handwriting | jharokha frame and shutter |
| 3 | વર-કન્યા + પરિવાર | Bride and groom miniature portraits, with family lines in arch frames: દર્શનાભિલાષી, સ્નેહાધીન, મામેરું | Cards rise one by one with a gold shimmer | 2 portraits, 1 frame |
| 4 | શુભ ઘડી | Three gold-foil tiles: દિવસ · માસ · વર્ષ, plus the samvat | Scratch to reveal; then the countdown appears with petals | gold foil drawn in code |
| 5 | શુભ મુહૂર્ત | A gold thread with silk scrolls for હસ્ત મેળાપ and ભોજન | Scrolls unroll; an elephant slides down the thread as the guest scrolls | silk scroll, elephant (reuse couple-havan and thali) |
| 6 | શુભ સ્થળ | Painted venue ticket | Ticket flips to the map, with Directions and Add-to-calendar | have it; need the real map link |
| 7 | સાત ફેરા | The pheras painting with 7 diyas | One diya lights per vow on scroll | have it |
| 8 | આશીર્વાદ (optional) | Wishes wall | Guest writes a blessing (Netlify Forms); petals burst on sending | none |
| 9 | Closing | Painted farewell scene, dhol-shehnai | A gold ring of Gujarati text turns slowly; WhatsApp share | farewell backdrop |

Throughout: mandala corners that turn slowly, an elephant-pair divider between sections, drifting petals, the music pill.

## New Flow images: round 9 in `docs/flow-art-prompts.md` (#41–60)
- **Gate (6), #41–46:** door leaf, doorway, toran, threshold, samai lamp, kadi
- **Envelope (5), #47–51:** mandir niche, puja thali, open envelope, mauli knot, card cover
- **Sections (8), #52–59:** jharokha frame, jharokha shutter, bride portrait, groom portrait, arch name-frame, silk scroll, mandala corner, elephant divider
- **Optional:** #60 farewell backdrop
- **Reused, no new art:** the elephant on the thread, couple-havan, thali, ganesh-art, venue-illustration, pheras, the seal (cracked in code)

## Order of work
1. **Code with placeholder art:**
   - drag-to-untie, the new envelope sequence, the kadi knock, and the swipe-open doors
   - jharokha shutters, scratch tiles, silk-scroll thread, the seven diyas, and the turning ring
   - the family layout
2. **Flow round 9 arrives:** cut it out and slot it in. Order: gate first, then envelope, then sections.
3. **Before sharing:**
   - stills, OG image, tests, budget
   - a real-phone pass
   - family proofreading
   - push

Share date: 22–23 Nov.

## Needed from the user
- Family names in Gujarati (દર્શનાભિલાષી, સ્નેહાધીન, મામેરું, and optionally ટહુકો)
- The real Google Maps link
- Whether to include the wishes wall
- The shehnai clip (optional)
