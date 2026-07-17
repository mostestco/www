# Review fixes — 2026-07-16

Source: `docs/reviews/2026-07-16-unified-review.md`. Verify gate: `npx wrangler deploy --dry-run` (+ local render + grep checks). User pre-approved fixing all verified findings.

## High — [approval: granted]

- [x] **H-1** contact.html: add `action="https://api.web3forms.com/submit" method="POST"` to the form; add a static "Prefer email? ping@mostest.com" line on the page.

## Medium — [auto]

- [x] **M-1** src/worker.js: wrap `env.ASSETS.fetch` response with security headers (CSP allowing self + inline styles/scripts + Google Fonts + Web3Forms, HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy) — and force `https:` on the www redirect (**L-1**).
- [x] **M-3/L-3** all pages: add meta description, canonical, minimal OG tags.
- [x] **M-4** new `public/favicon.svg` (mark on `#150A26` background) + `<link rel="icon">` on all pages.
- [x] **M-6** index.html + ventures.html: eyebrow magenta `#C935A8` → `#D95FC0`.
- [x] **M-7** about.html: "our Founder" → "the founder".

## Low — [auto]

- [x] **L-2** ventures.html: add `#investments` section; homepage link → `ventures.html#investments`; de-dup hero clause.
- [x] **L-5** new `public/_headers`: long-lived immutable caching for `/assets/*` and `/favicon.svg`.
- [x] **L-6** contact.html: placeholder color → `#8E84A6`.
- [x] **L-7** about.html: "founded in 2004" → "co-founded in 2004".
- [x] **L-8** all pages: footer logo `alt=""`.
- [x] **S-1** contact.html: error handler always shows the friendly message (drop `ex.message ||`).

## Manual / deferred

- [ ] **M-2** [manual — owner] Web3Forms dashboard: enable domain allowlist (mostest.com) and captcha for access key `9f5ae75e-…`.
- [ ] **M-5** [deferred — owner decision] self-host Bitter + Source Sans 3 (removes render-blocking third-party CSS and the Google Fonts GDPR exposure).
- [ ] **L-4** title ordering — accepted as-is.
