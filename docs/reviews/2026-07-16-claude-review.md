# Adversarial review — mostest.com (2026-07-16)

Static site: Cloudflare Worker (assets-only, `run_worker_first`) + 5 HTML pages. Probes: `node` (worker logic), `curl` (live GET/HEAD only, no POSTs). Live checks confirmed favicon 404, absent security headers, `cache-control: max-age=0`, and www→apex 301.

Count: 0 Critical, 1 High, 8 Medium, 8 Low.

---

## Security

**[H-1] contact.html:48-69 — form is JS-only, no `action`/`method`, no non-JS fallback.**
Issue: `<form>` has no `action`/`method`; submit handler calls `e.preventDefault()` and `fetch`s Web3Forms. The only visible contact address (`ping@mostest.com`) lives inside the JS `catch` (line 79).
Impact: JS disabled or the script erroring = clicking Send does a GET reload to the same URL, message lost, and the user never sees an email address. Total contact failure for a non-trivial slice of visitors.
Repro: disable JS, submit form → page reloads with `?name=…` query, nothing sent, no email shown.
Fix: add `action="https://api.web3forms.com/submit" method="POST"` to the form (Web3Forms works without JS), and print `ping@mostest.com` as static text on the page, not only in the catch.

**[M-1] Live response — no security headers.**
Issue: `curl -D-` on apex shows no CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy. Worker (src/worker.js:8) passes assets through untouched.
Impact: no clickjacking/MIME-sniff protection; no HSTS to pin HTTPS.
Fix: in the worker, wrap the apex `env.ASSETS.fetch` response and add `Content-Security-Policy` (allow self + fonts.googleapis/gstatic + api.web3forms.com), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.

**[M-2] contact.html:49 — Web3Forms access key is public and origin-unrestricted.**
Issue: `access_key` `9f5ae75e-…` is in page source (inherent to Web3Forms client model, not a leaked server secret — but reusable by anyone).
Impact: an attacker can POST the key from any origin/script to flood the owner's inbox with spam; the honeypot (`botcheck`, line 51 — good) blocks only naive bots.
Fix: enable Web3Forms domain allowlist + hCaptcha on the key; add server-side rate limiting isn't possible here, so lean on Web3Forms' own spam controls.

**[L-1] src/worker.js:5-6 — www redirect does not upgrade scheme.**
Issue: `http://www.mostest.com/x` → 301 to `http://mostest.com/x` (confirmed via node probe), relying on a separate edge rule to reach HTTPS.
Impact: extra hop / possible http exposure if "Always Use HTTPS" isn't on.
Fix: set `url.protocol = "https:"` before redirecting; add HSTS (see M-1).

## Correctness & data integrity

Worker routing verified (node): path, query, and fragment preserved on www→apex; `..` normalized by `URL` (no traversal); apex passes through to ASSETS. No routing bugs found.

**[M-3] All pages `<head>` — no meta description, no Open Graph / Twitter tags.**
Issue: only `<title>` present.
Impact: bare/ugly link unfurls on social + search; no `og:image` despite having a brand mark.
Fix: add `<meta name="description">` per page + `og:title/description/image/url` and `twitter:card`.

**[L-2] index.html:53 — "Investments →" links to ventures.html, which has no investments section.**
Issue: link text promises an investments destination; ventures.html only mentions investing in one sentence (line 37), no anchor/section.
Impact: link-says-X-goes-to-Y mismatch.
Fix: point to an `#investments` section (add one) or relabel the link "Ventures".

**[L-3] All pages — no `rel="canonical"`.**
Issue: www→apex 301 is correct, but pages lack canonical tags.
Fix: add `<link rel="canonical" href="https://mostest.com/<page>">`.

**[L-4] index.html:6 — title uses em dash + `&amp;`; other pages use "Page — Mostest" pattern.**
Issue: homepage title is "Mostest — Advisory & Ventures", inner pages "Advisory — Mostest". Minor branding order inconsistency (not a bug; flag for consistency).
Fix: acceptable as-is; note only.

## Performance & reliability

**[M-4] favicon 404 on every page (confirmed live: `/favicon.ico` → 404).**
Issue: no `<link rel="icon">` in any page.
Impact: a failed request + blank tab icon on every first visit.
Fix: add an SVG/ICO favicon and `<link rel="icon">`.

**[M-5] All pages:7-8 — render-blocking third-party Google Fonts.**
Issue: `<link rel="stylesheet">` to fonts.googleapis in `<head>` blocks first paint; `display=swap` avoids FOIT but not the round-trip.
Impact: added latency + hard dependency on Google's CDN.
Fix: self-host Bitter/Source Sans 3 (woff2) with `font-display:swap`, drop the two external domains.

**[L-5] Live — static assets served `cache-control: public, max-age=0, must-revalidate`.**
Issue: SVG/fonts revalidate on every visit (Cloudflare assets default for the HTML applies broadly here).
Impact: needless conditional requests for immutable assets.
Fix: set long `max-age`/`immutable` for `/assets/*` via asset headers config.

Reliability note: if Web3Forms is down, the form's `catch` surfaces an error + the email fallback (good) — but see H-1 (no-JS path still broken).

## Privacy, accessibility & UX/content

Contrast (computed, WCAG): body `#C6BDD8`/bg = 10.58, cyan `#3BDCE0` = 11.33, muted `#8E84A6` = 5.44 (5.05 on cards) — all pass. Failures below.

**[M-6] index.html:46 & ventures.html:35 — magenta label `#C935A8` on `#150A26` = 4.13:1, fails AA (needs 4.5).**
Issue: "Mostest Ventures" eyebrow label, ~13px.
Impact: sub-AA contrast on a brand label.
Fix: lighten to ~`#D95FC0` (≈4.9:1) or enlarge/bold to qualify as large text.

**[M-7] about.html:54 — voice drift: "our Founder".**
Issue: the site otherwise speaks in impersonal third person ("the company", "the work", "it takes two shapes"); this one line switches to plural-first-person + capitalized "Founder".
Impact: tone incoherence on the two-pillar rewrite.
Fix: "Occasional writing by the founder lives at…" (lowercase, no "our").

**[L-6] contact.html:15,62 — placeholder `#6B5F86` on field `#1E1136` = 3.03:1.**
Fix: lighten placeholder to ≥4.5:1 (e.g. `#8E84A6`).

**[L-7] advisory.html:75 "Co-founded Contegix" vs about.html:40 "Contegix… founded in 2004".**
Issue: co-founded vs founded — factual inconsistency across pages.
Fix: pick one (co-founded is the safer claim) and use it on both.

**[L-8] External links (index/advisory/ventures/about) `target="_blank"` give no new-tab cue.**
Issue: `rel="noopener"` present (good, safe) but no visual/AT indication the link opens a new tab.
Fix: add an icon or `aria`/visually-hidden "(opens in new tab)".

Privacy note: Google Fonts leaks every visitor's IP to Google (GDPR-relevant) — resolved by self-hosting per M-5.
Redundant `alt="Mostest"` on footer logos duplicates the adjacent "© 2026 Mostest LLC" for screen readers; `alt=""` (decorative) is better. (Low, folded here.)
