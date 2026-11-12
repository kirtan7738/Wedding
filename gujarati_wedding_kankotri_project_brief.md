# Digital Gujarati Wedding Kankotri Website

## Project Brief, Research Notes, Product Direction, and Development Plan

**Project type:** Personalized digital wedding invitation website\
**Purpose:** A memorable wedding gift from a developer to his sister\
**Primary audience:** Wedding guests, especially people opening the
invitation through WhatsApp on mobile phones\
**Primary cultural context:** Gujarati Hindu wedding / Gujarati
Kankotri\
**Status:** Concept and planning stage; wedding-specific details are not
yet supplied

------------------------------------------------------------------------

## 1. Project vision

Build a personalized, mobile-first digital Gujarati Kankotri that
preserves the warmth, structure, and cultural character of a traditional
printed wedding invitation while using the capabilities of a modern
website.

The website should not feel like a generic wedding landing page or a
template-builder product. It should feel like the family's own
invitation, thoughtfully recreated as a digital experience.

### Core experience

1.  A guest receives a website link through WhatsApp or scans a QR code.
2.  The guest opens a beautifully designed invitation cover.
3.  An envelope or invitation-opening interaction introduces the
    Kankotri.
4.  Ganesh Vandana and the traditional invitation message are presented.
5.  The couple and their families are introduced.
6.  Guests can explore each wedding function, its date, time, and venue.
7.  Guests can open directions, add events to their calendar, and
    optionally RSVP.
8.  The website closes with family blessings, photographs, or a personal
    message.

**Guiding principle:** Traditional Gujarati invitation identity,
presented through a polished and memorable digital experience.

------------------------------------------------------------------------

## 2. What the website is --- and what it is not

### It is

-   A bespoke digital Kankotri for one wedding.
-   A guest-facing website that can be shared on WhatsApp.
-   A mobile-first experience with Gujarati cultural details.
-   A place for the invitation, family information, wedding events,
    venues, and selected memories.
-   A personal gift, not necessarily a commercial product.

### It is not

-   A generic wedding invitation website builder.
-   A marketplace or SaaS platform.
-   A requirement to reproduce another company's template.
-   A complex application that needs a large backend from day one.

------------------------------------------------------------------------

## 3. Traditional Gujarati Kankotri content

The website should retain the elements that make a Gujarati Kankotri
recognizable. Exact wording and inclusion must be confirmed with the
family.

Potential elements:

-   **શ્રી ગણેશાય નમઃ** --- Ganesh Vandana / auspicious opening.
-   **કુળદેવીનું સ્મરણ** --- family deity reference, if the family wishes to
    include it.
-   **શુભ લગ્ન** --- wedding heading.
-   **પરિવાર પરિચય** --- bride, groom, parents, and family details.
-   **ભાવભર્યું આમંત્રણ** --- formal invitation wording.
-   **લગ્ન પ્રસંગો** --- wedding functions and ceremonies.
-   **શુભ મુહૂર્ત** --- auspicious wedding time, if applicable.
-   **નિમંત્રક** --- inviting family members.
-   **સ્નેહાધીન** --- younger family members or other family sign-off.
-   A short Gujarati verse or personal invitation message, if desired.

### Potential Gujarati wedding events

These are examples only. The actual event list should be configured to
match the family's plans and traditions.

  Gujarati name   English name
  --------------- ------------------
  ગણેશ સ્થાપના      Ganesh Sthapana
  મંડપ મુહૂર્ત        Mandap Muhurat
  મામેરું            Mameru
  પીઠી            Pithi
  મહેંદી            Mehendi
  રાસ-ગરબા        Raas Garba
  જાન આગમન        Jaan Aagman
  હસ્તમેળાપ         Hast Melap
  મંગળ ફેરા         Mangal Fera
  ભોજન સમારંભ      Bhojan Samarambh
  સ્વાગત સમારંભ     Reception
  કન્યા વિદાય      Kanya Viday

Do not assume that every family has every ceremony. Keep events
configurable and confirm Gujarati spellings and wording with a family
elder.

------------------------------------------------------------------------

## 4. Language strategy

Recommended default: **Gujarati + English**.

-   Gujarati should carry the traditional Kankotri content and cultural
    identity.
-   English can make practical details easier for guests who prefer it.
-   Provide a visible language switch.
-   Ensure Gujarati text uses a font with good support for conjunct
    characters, vowel signs, and matras.
-   Test text rendering on multiple Android and iPhone browsers.

Potential fonts: - Noto Serif Gujarati for traditional headings. - Noto
Sans Gujarati for readable body text. - An elegant English serif for
names and prominent headings. - A clean sans-serif for practical
details.

The exact font pairing should be selected during visual design.

------------------------------------------------------------------------

## 5. Visual directions explored

Three design directions were discussed.

### A. Royal Gujarati Heritage --- recommended starting point

-   Deep maroon, antique gold, warm ivory.
-   Traditional floral borders, paisley, and ornamental detailing.
-   Royal arches, jharokhas, and heritage-inspired motifs.
-   Traditional Gujarati typography.
-   Suitable for a classic and luxurious Kankotri.

### B. Elegant Floral

-   Ivory, blush pink, peach, and sage.
-   Watercolor flowers and delicate illustrations.
-   Minimal layouts and elegant typography.
-   Soft transitions and restrained animation.

### C. Vibrant Gujarati Celebration

-   Emerald, teal, saffron, and gold.
-   Bandhani, mirror-work, and Garba-inspired motifs.
-   Dandiya, peacock, and festive illustrations.
-   More colourful and energetic.

### Suggested initial design system

  Element               Starting recommendation
  --------------------- ------------------------------------------
  Background            Warm ivory
  Primary colour        Deep maroon
  Accent                Antique gold
  Secondary colour      Muted peach
  Heading typography    Elegant serif
  Gujarati typography   Noto Serif Gujarati / Noto Sans Gujarati
  Animation             Framer Motion
  Layout                Mobile-first, responsive
  Overall feeling       Premium, traditional, warm, personal

Avoid excessive animation. The website should feel elegant and
ceremonial, not like a gaming website.

------------------------------------------------------------------------

## 6. Proposed website structure

The website can be a single scrolling experience with clear sections,
rather than many separate pages.

### 6.1 Welcome / invitation cover

-   Traditional auspicious heading.
-   Ganesh illustration or motif.
-   Bride and groom names.
-   Wedding date.
-   Short invitation line.
-   An obvious "Open Invitation" interaction.

### 6.2 Invitation opening

-   Animated envelope, folded card, or scroll.
-   Optional wax seal interaction.
-   Invitation unfolds or transitions into the main page.
-   Respect reduced-motion settings and provide a way to skip the
    animation.

### 6.3 Ganesh Vandana

-   Ganesh Vandana text or shloka, confirmed by the family.
-   Respectful illustration.
-   Gujarati-first presentation.

### 6.4 Couple introduction

-   Bride and groom names.
-   Portraits or selected photographs.
-   Parents' names and family introductions, if desired.
-   Optional personal message or couple story.

### 6.5 Traditional Kankotri

-   Full formal Gujarati invitation wording.
-   English translation or alternate language view.
-   Inviting family members and sign-off.
-   Layout inspired by the printed family Kankotri.

### 6.6 Wedding celebrations

Each event can have: - Gujarati event title. - English title or
description. - Date and start time. - Venue and address. - Map
directions. - Dress code, if relevant. - Short description or
illustration.

### 6.7 Venue and directions

-   Venue name and full address.
-   Google Maps link or embedded map, if useful.
-   Parking or arrival instructions.
-   Separate venue details for events held at different places.

### 6.8 Countdown

-   Days, hours, minutes, and seconds until the wedding.
-   Use the correct local time zone.
-   Stop or change the display once the wedding date has passed.

### 6.9 Photo gallery / family memories

-   Couple photographs.
-   Family photographs approved for sharing.
-   Pre-wedding photographs, if available.
-   Optimized images and lazy loading.

### 6.10 Closing section

-   Family blessing or thank-you message.
-   Final invitation line.
-   WhatsApp sharing action.
-   Optional guestbook link.

------------------------------------------------------------------------

## 7. Feature scope and priorities

### Essential for the first release

-   Animated or interactive invitation opening.
-   Ganesh Vandana.
-   Traditional Gujarati Kankotri content.
-   Gujarati and English language support.
-   Couple and family introduction.
-   Wedding events with dates and timings.
-   Venue details and map navigation.
-   Countdown.
-   WhatsApp sharing.
-   Responsive mobile-first design.
-   QR code linking to the website.

### Recommended if time permits

-   Couple and family photo gallery.
-   Background music with an explicit play/pause control.
-   RSVP form.
-   Add-to-calendar links.
-   Individual event cards or event detail views.

### Optional enhancements

-   Digital guestbook with moderation.
-   Couple story timeline.
-   Admin dashboard.
-   Short animated invitation video.
-   Live-streaming link for remote guests.
-   Individual guest or family invitation links, if needed.

### Suggested release strategy

Build the essential guest experience first. Add RSVP, guestbook, admin
functionality, and video only when the basic invitation is complete and
tested.

------------------------------------------------------------------------

## 8. Special interactions

### 8.1 Animated Kankotri opening

A closed invitation envelope or folded card appears on the first screen.
When the guest opens it, the invitation is revealed.

Possible details: - Wax seal or decorative emblem. - Envelope flap
animation. - Card sliding out. - Subtle floral or ornamental motion. -
Transition into the main invitation.

### 8.2 Wedding countdown

A live countdown displays the remaining time until the wedding. The
wedding date and time must be supplied by the family.

### 8.3 Event-specific details

Each ceremony should have its own visual card or timeline entry. Guests
should quickly understand when and where to attend.

### 8.4 Guestbook

Guests can send blessings and wishes. Messages should be moderated
before public display. Do not expose guest contact information.

### 8.5 Background music

Use music only if the family wants it. Include a clear control and do
not force autoplay; browsers commonly restrict audio autoplay before
user interaction.

### 8.6 Invitation sharing

Provide: - WhatsApp share action. - Copy-link action. - QR code for a
printed invitation or other family materials. - Social preview image and
description.

------------------------------------------------------------------------

## 9. Reference research: important distinction

The research conversation initially surfaced several businesses that
sell digital invitation services. Those are not the primary references
wanted for this project.

The desired references are **actual live wedding websites, real couple
websites, working demos, and design galleries** that can be browsed to
study their layouts, navigation, content, and interactions.

### 9.1 Live website examples and portfolios

These are useful because they provide or link to guest-facing sample
websites. Some are portfolios from service providers, but the useful
reference is the live sample itself, not the service being sold.

  -----------------------------------------------------------------------
  Reference                           Why it is useful
  ----------------------------------- -----------------------------------
  WedSites --- real wedding website   Real couple websites, layouts,
  examples                            galleries, RSVP, and event details

  Riwaaz --- live Indian wedding      Indian wedding storytelling,
  demos                               events, and venue presentation

  Aarambh Invites --- live client     Indian ceremony details, RSVP,
  work                                maps, and galleries

  Wedding30s --- working examples     Interactive demos, countdown, RSVP,
                                      and language controls

  Vowz --- sample wedding websites    Complete guest-facing wedding
                                      website examples
  -----------------------------------------------------------------------

The corresponding links were shared in the chat. Reopen the links in the
conversation to access the exact pages. Verify that each sample is still
live before using it as a design reference.

### 9.2 Design inspiration galleries

  -----------------------------------------------------------------------
  Reference                           What to study
  ----------------------------------- -----------------------------------
  Wix wedding website gallery         Real-world layouts, colour,
                                      typography, and visual styles

  Webflow / Made in Webflow           Custom web design, scrolling,
                                      animations, and potentially
                                      cloneable community projects

  Aisle custom wedding website        Editorial invitations, illustrated
  gallery                             maps, unusual concepts, and
                                      interactions

  CreateToday wedding website         Custom sites built using different
  examples                            platforms

  The Knot wedding website examples   Page structure, navigation, and
                                      guest experience

  Site Builder Report wedding         Curated design examples and design
  examples                            analysis
  -----------------------------------------------------------------------

Again, the corresponding links were shared in the conversation. Use
those links as starting points and verify the live examples.

### 9.3 Gujarati digital Kankotri products

These are **not the main visual-reference category**, because they
primarily provide invitation-building services. They can still be useful
for researching cultural content, common features, and Gujarati
invitation conventions.

-   eKankotri
-   OpenInvite
-   Dil Se Invite
-   InviteCraze
-   Nimantran
-   Toran
-   Invity
-   InviteIndia
-   Weddi
-   WishWoven

Use them to understand what guests expect from a digital Kankotri, not
as the sole design direction.

### 9.4 Recommended references to inspect first

1.  **Riwaaz:** Indian wedding storytelling and live demos.
2.  **Aarambh Invites:** Ceremony details and mobile presentation.
3.  **WedSites:** Real couple-created websites.
4.  **Aisle:** Creative layouts and interactions.
5.  **Webflow:** Custom UI/UX, animations, and web implementation ideas.

### Reference-inspection checklist

When opening each live reference, record:

-   First-screen design and visual hierarchy.
-   How the invitation opens.
-   Whether the website is one page or multiple pages.
-   Navigation and scrolling behaviour.
-   Typography and font pairing.
-   Colour palette and background treatments.
-   Photo placement and gallery layout.
-   Event timeline or schedule.
-   Venue and map presentation.
-   RSVP flow.
-   Mobile responsiveness.
-   Loading speed and animation quality.
-   Which ideas are worth adapting and which should be avoided.

Do not copy another site's branding, text, illustrations, photographs,
or code without permission. Use references to understand patterns and
create an original design.

------------------------------------------------------------------------

## 10. Recommended technology stack

The project should use a familiar, relatively simple stack.

  Technology                Purpose
  ------------------------- ------------------------------------------------
  React + Vite              Frontend application
  Tailwind CSS              Styling and responsive layouts
  Framer Motion             UI and section animations
  GSAP                      Optional advanced envelope or scroll animation
  Lucide React              Icons
  Google Fonts              Gujarati and English typography
  Firebase Firestore        RSVP and guestbook data, if needed
  Firebase Authentication   Admin access, if an admin panel is built
  Firebase Hosting          Website hosting
  Google Maps links         Venue navigation

### Keep the first version simple

A backend is not required for a static invitation. If the website only
displays wedding details, photos, events, and directions, a React
application with a local configuration file is sufficient.

Use Firebase only for features that need persistent data, such as RSVP
submissions, guestbook messages, or admin-managed content.

------------------------------------------------------------------------

## 11. Suggested project structure

``` text
wedding-invitation/
│
├── public/
│   ├── images/
│   │   ├── couple/
│   │   ├── family/
│   │   ├── events/
│   │   └── decorations/
│   ├── audio/
│   └── fonts/
│
├── src/
│   ├── components/
│   │   ├── EnvelopeOpening/
│   │   ├── GaneshVandana/
│   │   ├── InvitationCard/
│   │   ├── CoupleSection/
│   │   ├── EventTimeline/
│   │   ├── Countdown/
│   │   ├── VenueSection/
│   │   ├── Gallery/
│   │   ├── RSVP/
│   │   └── Guestbook/
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Admin.jsx
│   │
│   ├── data/
│   │   └── weddingConfig.js
│   │
│   ├── hooks/
│   ├── services/
│   │   └── firebase.js
│   ├── utils/
│   ├── assets/
│   └── App.jsx
│
└── package.json
```

This is a suggested structure, not a requirement to create every
component immediately.

------------------------------------------------------------------------

## 12. Configuration-driven content

Keep wedding information separate from presentation components. This
makes it easy to update names, events, dates, venues, and photographs.

Illustrative example with placeholders:

``` javascript
export const weddingConfig = {
  bride: {
    name: "Bride Name",
    parents: "Bride's Parents"
  },

  groom: {
    name: "Groom Name",
    parents: "Groom's Parents"
  },

  weddingDate: "2027-02-14",

  language: "gu",

  events: [
    {
      id: "pithi",
      title: "પીઠી",
      subtitle: "Pithi Ceremony",
      date: "2027-02-13",
      time: "10:00 AM",
      venue: "Venue Name",
      mapsUrl: "GOOGLE_MAPS_LINK"
    }
  ]
};
```

All sample values must be replaced with verified wedding details. Store
dates and times consistently, and handle the India time zone correctly
for countdowns.

------------------------------------------------------------------------

## 13. Optional Firebase data model

If RSVP, guestbook, or admin editing is needed, a possible Firestore
structure is:

``` text
weddings/
  wedding-id/
    details/
    events/
    gallery/

rsvps/
  response-id/

guestbook/
  message-id/
```

Security requirements:

-   Keep public invitation content separate from private guest data.
-   Do not allow visitors to read all guest phone numbers or private
    RSVP information.
-   Validate and restrict writes.
-   Moderate guestbook messages before displaying them.
-   Protect admin functionality with authentication and appropriate
    authorization rules.
-   Never place Firebase Admin credentials or other secrets in frontend
    code.

For a single wedding, do not build a complex admin system unless the
family will genuinely use it.

------------------------------------------------------------------------

## 14. WhatsApp sharing, QR code, and social preview

The website should be easy to distribute.

### WhatsApp

Create a share action that opens WhatsApp with a short invitation
message and the website URL.

### QR code

Generate a QR code for the final deployed URL. It can be included on a
printed Kankotri, a small insert, or other wedding materials.

### Open Graph metadata

Configure: - `og:title` --- couple names and wedding invitation. -
`og:description` --- short invitation line and date. - `og:image` --- a
carefully designed invitation preview. - `og:url` --- canonical website
URL.

Test the preview using the actual deployed URL. Social platforms may
cache previews, and local development URLs will not provide a reliable
test.

------------------------------------------------------------------------

## 15. Performance, accessibility, privacy, and quality

-   Use optimized WebP or AVIF images where supported.
-   Lazy-load images below the initial viewport.
-   Avoid large background videos on initial page load.
-   Keep the initial page lightweight, especially for mobile data
    connections.
-   Provide a way to skip or reduce animations.
-   Respect reduced-motion preferences.
-   Ensure readable font sizes and sufficient contrast.
-   Test Gujarati rendering on multiple devices.
-   Use clear tap targets for mobile users.
-   Verify all dates, times, spellings, and venue addresses with the
    family.
-   Do not publish private photographs without family approval.
-   Do not expose guest contact details.
-   Test the website on Android, iPhone, and desktop browsers.

------------------------------------------------------------------------

## 16. Development roadmap

Estimated effort: approximately 9--16 working days, depending on the
complexity of the design, animations, assets, and backend requirements.

### Phase 1 --- Research and content collection (1--2 days)

-   Inspect the live reference websites.
-   Collect the family's printed Kankotri or approved wording.
-   Confirm bride and groom names and parents' names.
-   Collect the final wedding events, dates, times, and venues.
-   Collect approved photographs.
-   Choose the design direction.
-   Confirm Gujarati wording with a family elder.

### Phase 2 --- UI/UX design (2--3 days)

-   Design the mobile-first experience in Figma.
-   Design the invitation cover and opening.
-   Design Ganesh Vandana and Kankotri sections.
-   Design couple and family sections.
-   Design event cards and venue section.
-   Define typography, colours, spacing, and responsive behaviour.
-   Prepare desktop and mobile layouts.

### Phase 3 --- Frontend development (3--5 days)

-   Set up React and Vite.
-   Implement the page sections.
-   Build responsive layouts.
-   Implement opening and scroll animations.
-   Add countdown and event timeline.
-   Add language switching.
-   Add gallery and music controls.
-   Add sharing actions.

### Phase 4 --- Backend and integrations (1--3 days)

Only if required: - Configure Firebase. - Implement RSVP. - Implement
guestbook and moderation. - Add protected admin authentication. - Add
maps and calendar links. - Configure appropriate database security
rules.

### Phase 5 --- Testing and optimization (1--2 days)

-   Test Android and iPhone browsers.
-   Verify Gujarati typography.
-   Verify event dates, timings, and venue details.
-   Test WhatsApp preview.
-   Optimize images and animations.
-   Test slow internet connections.
-   Review privacy and Firebase security rules.

### Phase 6 --- Deployment and presentation (1 day)

-   Deploy using Firebase Hosting.
-   Configure a custom domain if desired.
-   Generate the QR code.
-   Prepare a WhatsApp invitation message.
-   Optionally create a short animated invitation video.
-   Present the finished website to the family.

------------------------------------------------------------------------

## 17. Deployment and budget approach

A free hosting option such as Firebase Hosting can be considered for the
initial release. Confirm current plan limits and billing requirements
before deployment.

A custom domain is optional. If a personalized domain is purchased, it
will have a separate cost.

The project can be built with a near-zero software budget if: - Free
hosting limits are sufficient. - No paid templates or assets are used. -
Fonts and illustrations are appropriately licensed for use. - No paid
APIs or services are required.

Do not assume that every third-party service will remain free
indefinitely; verify its current terms before relying on it.

------------------------------------------------------------------------

## 18. Decisions still required

The following details have not yet been finalized.

  Decision                            Current status
  ----------------------------------- -----------------------------------------
  Wedding date                        Not provided
  Bride and groom names               Not provided
  Wedding events                      Not finalized / not provided
  Event venues                        Not provided
  Final Gujarati invitation wording   Not provided
  Family details to display           Not provided
  Couple photographs                  Not provided
  Preferred visual theme              Not finalized
  Website language                    Gujarati + English recommended
  Feature scope                       To be confirmed
  RSVP requirement                    To be confirmed
  Guestbook requirement               To be confirmed
  Admin dashboard                     Optional
  Domain                              Free URL or custom domain to be decided

### Questions to settle before design

1.  Should the final theme be Royal Gujarati Heritage, Elegant Floral,
    or Vibrant Gujarati Celebration?
2.  Should the website be Gujarati only or Gujarati + English?
3.  Should it be a simple digital Kankotri, a complete interactive
    wedding website, or a premium cinematic experience?
4.  What is the confirmed wedding date?
5.  Are the wedding events finalized?
6.  Which features are wanted: RSVP, gallery, music, countdown, QR code,
    guestbook, couple story, invitation video, admin dashboard, and
    calendar integration?
7.  Is a free hosting URL sufficient, or is a personalized domain
    desired?

------------------------------------------------------------------------

## 19. Final product recommendation

Build a bespoke, mobile-first Gujarati wedding invitation with the
following signature experience:

**A traditional printed Kankotri comes to life digitally.**

The guest first sees an elegant invitation cover. They open it and are
welcomed by Ganesh Vandana. The website then reveals the couple, the
family's traditional invitation, and the wedding celebrations in a
beautiful, carefully paced experience.

The strongest combination of inspiration is:

-   Gujarati cultural identity and invitation structure.
-   Cinematic but restrained opening interactions.
-   Premium editorial typography and photography.
-   Clear, practical event information and navigation.
-   A personal family touch that makes the website unique to the couple.

Do not copy a single reference website. Study real websites for
patterns, then create an original design using the family's own wording,
photographs, traditions, and story.

**The goal is not merely to send guests a link. It is to give the family
a digital Kankotri they will remember.**
