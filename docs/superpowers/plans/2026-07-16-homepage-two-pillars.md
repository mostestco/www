# Homepage Two Peer Pillars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `public/index.html` so Advisory and Ventures read as equal peers under an umbrella-voiced hero, with no personal name and direct product links.

**Architecture:** Static HTML site served as Cloudflare Worker assets. All styling is inline or in the page's `<style>` block; there is no build step, no JS, no test framework. Verification is grep checks plus a visual pass.

**Tech Stack:** Plain HTML/CSS. Fonts: Bitter (serif headings), Source Sans 3 (body). Palette: bg `#150A26`, teal `#3BDCE0` (Advisory), magenta `#C935A8` (Ventures), body text `#C6BDD8`, muted `#8E84A6`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-16-homepage-two-pillars-design.md`
- Only `public/index.html` may change.
- No personal name ("Matthew", "Porter" outside the family-story strip) in the hero or panels.
- No "Saint Charles, Missouri" anywhere.
- No filled/ghost CTA buttons — both pillars use identical plain-link styling.
- External product links open in a new tab with `rel="noopener"`.

---

### Task 1: Rework the homepage

**Files:**
- Modify: `public/index.html` (styles at lines 16-19; hero at lines 37-45; stats bar at lines 46-53; two-column section at lines 54-69)

**Interfaces:**
- Consumes: nothing from other tasks (single-task plan).
- Produces: final `public/index.html`. Nav, footer, family-story strip, `<title>`, and all other pages untouched.

- [ ] **Step 1: Remove the now-unused button styles**

In the `<style>` block, delete these four rules (the hero buttons they style are removed in Step 2):

```css
.cta{background:#3BDCE0;color:#150A26;padding:13px 28px;font-size:16px;font-weight:600;border-radius:2px}
.cta:hover{background:#8FEDEF;color:#150A26}
.cta-ghost{border:1px solid rgba(255,255,255,0.4);color:#F4F1FA;padding:12px 27px;font-size:16px;font-weight:600;border-radius:2px}
.cta-ghost:hover{background:#F4F1FA;color:#150A26}
```

- [ ] **Step 2: Replace the hero section**

Replace the entire first `<section>` inside `<main>` (the one containing "Saint Charles, Missouri", the H1 "An advisory practice and a venture portfolio…", the subhead naming Matthew E. Porter, and the two CTA links) with:

```html
    <section style="padding:clamp(64px,12vh,140px) clamp(24px,6vw,72px) clamp(56px,10vh,110px);max-width:980px;background:radial-gradient(ellipse 80% 60% at 20% 0%, rgba(108,79,224,0.18), transparent 70%)">
      <h1 style="font-family:Bitter,serif;font-weight:500;font-size:clamp(34px,5vw,58px);line-height:1.15;margin:0;max-width:19ch;text-wrap:pretty;color:#FFFFFF">A family of practices and products, run under one roof.</h1>
      <p style="font-size:clamp(17px,1.6vw,20px);line-height:1.6;color:#C6BDD8;max-width:56ch;margin:28px 0 0;text-wrap:pretty">Mostest is two things operated as one: an advisory practice serving executive teams, boards, and investors, and a venture portfolio of products built and run in-house.</p>
    </section>
```

- [ ] **Step 3: Delete the stats bar section**

Delete the entire `<section>` with `background:#1B0F31` containing the four stat blocks (2004 / 350+ / $100M+ / 2024). Nothing replaces it — the About page prose already carries this track record.

- [ ] **Step 4: Replace the two-column section with the twin panels**

Replace the `<section>` containing the "Mostest Advisory" / "Mostest Ventures" two-column grid with (note the added `border-top` for separation from the hero, the 1fr 1fr split, and the Ventures link list):

```html
    <section style="border-top:1px solid rgba(255,255,255,0.12);padding:clamp(56px,9vh,96px) clamp(24px,6vw,72px)">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,64px);max-width:1080px">
        <div style="display:flex;flex-direction:column;gap:14px">
          <p style="margin:0;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#3BDCE0">Mostest Advisory</p>
          <h2 style="font-family:Bitter,serif;font-weight:500;font-size:clamp(24px,2.6vw,32px);line-height:1.25;margin:0;text-wrap:pretty;color:#FFFFFF">Senior technology judgment, without the full-time hire.</h2>
          <p style="margin:0;font-size:16px;line-height:1.65;color:#C6BDD8;max-width:48ch;text-wrap:pretty">Fractional CTO work, technology diligence, vendor negotiation, and infrastructure and compliance strategy for leadership teams that need someone who has run it before.</p>
          <a href="advisory.html" style="font-weight:600;font-size:16px">Explore Advisory &rarr;</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <p style="margin:0;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#C935A8">Mostest Ventures</p>
          <h2 style="font-family:Bitter,serif;font-weight:500;font-size:clamp(24px,2.6vw,32px);line-height:1.25;margin:0;text-wrap:pretty;color:#FFFFFF">Products we build, operate, and back.</h2>
          <p style="margin:0;font-size:16px;line-height:1.65;color:#C6BDD8;max-width:48ch;text-wrap:pretty">A working portfolio built and run in-house, alongside investments in startups where operating experience gives us an edge.</p>
          <div style="display:flex;flex-direction:column;gap:10px">
            <a href="https://ourmemorybook.com" target="_blank" rel="noopener" style="font-weight:600;font-size:16px">OurMemoryBook &rarr;</a>
            <a href="https://cask.ai" target="_blank" rel="noopener" style="font-weight:600;font-size:16px">cask.ai &rarr;</a>
            <a href="https://ms.med" target="_blank" rel="noopener" style="font-weight:600;font-size:16px">ms.med &rarr;</a>
            <a href="ventures.html" style="font-weight:600;font-size:16px">Investments &rarr;</a>
          </div>
        </div>
      </div>
    </section>
```

The family-story strip section ("The name comes from a Porter family idea…") and everything after it stays exactly as is.

- [ ] **Step 5: Verify with grep**

Run:

```bash
grep -cE "Saint Charles|Matthew|cta" public/index.html; grep -c "Porter family" public/index.html; grep -cE 'href="https://(ourmemorybook.com|cask.ai|ms.med)"' public/index.html
```

Expected output (three lines): `0`, `1`, `3`.
Also confirm structure: `grep -c "<section" public/index.html` → `3` (hero, panels, family strip).

- [ ] **Step 6: Visual pass**

Open the page in a browser (`open public/index.html` works — no server needed for this page's rendering). Check at desktop width and ~375px width: hero has no buttons, the two panels sit side by side at desktop and stack at mobile, both eyebrows/link styles look identical in weight, all four Ventures links and the Advisory link are present.

- [ ] **Step 7: Commit**

```bash
git add public/index.html
git commit -m "Homepage: Advisory and Ventures as equal peers"
```
