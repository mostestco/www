# Homepage: Two Peer Pillars — Design

**Date:** 2026-07-16
**Scope:** `public/index.html` only. No other pages change.

## Problem

The homepage defaults to Advisory: the H1 is advisory-voiced, Advisory gets the
solid CTA while Ventures gets a ghost one, the subhead names Matthew E. Porter
personally, and the three venture products exist only as a sentence inside the
Ventures blurb. Visitors conclude Advisory is the point of Mostest. Advisory
and Ventures are peers.

## Design

### Hero (umbrella-voiced, no personal name)

- The "Saint Charles, Missouri" eyebrow is removed.
- H1: "A family of practices and products, run under one roof."
- Subhead: "Mostest is two things operated as one: an advisory practice serving
  executive teams, boards, and investors, and a venture portfolio of products
  built and run in-house."
- The two hero CTA buttons are removed. The twin panels below are the paths;
  hero buttons would re-rank the pillars.

### Stats bar

Deleted. The About page prose already carries the Contegix track record
(2004, 350+ employees, $100M+, 2024 exit). Nothing is added to About.

### Twin panels (the core of the page)

The existing two-column section moves up to sit directly under the hero and
becomes the page's main act. Strict 50/50 grid, identical typography, no
filled buttons — both panels use the same link style so neither reads as the
winner.

- **Advisory (left, teal `#3BDCE0` eyebrow):** keeps current headline
  ("Senior technology judgment, without the full-time hire.") and blurb.
  Single link: "Explore Advisory →" to `advisory.html`.
- **Ventures (right, magenta `#C935A8` eyebrow):** headline "Products we
  build, operate, and back." Short blurb, then a four-item link list replacing
  the prose product mention:
  - OurMemoryBook → https://ourmemorybook.com (new tab)
  - cask.ai → https://cask.ai (new tab)
  - ms.med → https://ms.med (new tab)
  - Investments → `ventures.html`

### Family-story strip

Stays as the page closer, unchanged ("a Porter family idea" — no personal
name).

### Unchanged

Nav, footer, `<title>`, advisory.html, ventures.html, about.html, contact.html.

## Verification

Visual pass in the browser at desktop and mobile widths: pillars render as
equal peers side by side, stack cleanly on mobile, all six links resolve
(advisory.html, ventures.html, three external product sites, about.html via
the story strip).
