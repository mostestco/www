# Unified adversarial review — mostest.com (2026-07-16)

## Detected stack

- **Stack:** Cloudflare Worker + static HTML assets (`run_worker_first: true`). **No profile matched** — universal checklist only.
- **Verify command:** `npx wrangler deploy --dry-run` (baseline: PASS)
- **Test command:** none (no test framework in repo)

> ⚠️ Codex unavailable — single-engine review, lower confidence.
> Its first run stalled (worker process died mid-analysis); a retry completed
> and reported counts (0 Critical / 1 High / 15 Medium / 7 Low) but a read-only
> sandbox blocked its report write, and the follow-up re-run never delivered.
> Findings below are Claude + controller sweeps, each validated against code.
> The retry's severity profile is consistent with the confirmed findings (same
> single High), suggesting no major class of issue was missed — but per-finding
> Codex detail was never recovered.

## Summary

Confirmed: 1 High, 7 Medium, 7 Low, 1 sweep. Rejected: 0. One finding accepted as-is (L-4).

## Confirmed findings

**[H-1] contact.html:48 — form is JS-only; no `action`/`method`; the only contact email on the entire site lives inside the JS `catch`.** *(found by: Claude; grep-confirmed by controller — `ping@mostest.com` appears exactly once, in the catch handler)*
Validation: form tag has no action/method; `e.preventDefault()` + fetch is the only path. JS off/broken = message silently lost and no email visible anywhere on the site.
Fix: `action="https://api.web3forms.com/submit" method="POST"` + static email line on the page.

**[M-1] Live responses carry no security headers (CSP, HSTS, nosniff, XFO, Referrer-Policy).** *(Claude; curl-confirmed)*
Fix: add headers in the worker around `env.ASSETS.fetch`.

**[M-2] contact.html:49 — Web3Forms access key is public and origin-unrestricted.** *(Claude)*
Validation: inherent to Web3Forms' client-side model — not a leaked secret, but anyone can use the key to spam the inbox. Honeypot `botcheck` present.
Fix: **manual, dashboard-side** — enable Web3Forms domain allowlist and captcha for the key. Not fixable in code.

**[M-3] All pages — no meta description, no OG/Twitter tags.** *(Claude; grep-confirmed: 0 across all 5 pages)*
Fix: per-page description + canonical + minimal OG.

**[M-4] No favicon — `/favicon.ico` 404s on every visit.** *(Claude; live-confirmed)*
Validation: no `<link rel="icon">` anywhere; the only mark asset is white-on-transparent (invisible on light tabs if reused bare).
Fix: dark-background `favicon.svg` + link tag on all pages.

**[M-5] All pages — render-blocking Google Fonts (also leaks visitor IPs to Google; GDPR-relevant).** *(Claude)*
Status: **deferred** — self-hosting is a real change (download woff2, @font-face); needs owner decision.

**[M-6] index.html / ventures.html — magenta `#C935A8` eyebrow on `#150A26` = 4.13:1, fails WCAG AA (4.5:1) at 13px.** *(Claude; Codex's retry was independently testing lighter magentas, corroborating)*
Fix: lighten eyebrow text to `#D95FC0` (~4.9:1). Decorative uses (gradient, nav border) exempt.

**[M-7] about.html:54 — voice drift: "our Founder" vs. the site's impersonal third person.** *(Claude; controller-confirmed)*
Fix: "the founder", lowercase.

**[L-1] src/worker.js:5 — www redirect preserves `http:`; no scheme upgrade.** *(Claude; code-confirmed — `url.protocol` untouched)*
Fix: force `https:` in the redirect.

**[L-2] index.html — "Investments →" links to ventures.html which has no investments section or anchor.** *(Claude; confirmed — investing is one clause in the hero paragraph)*
Fix: add an `#investments` section to ventures.html; point the link at it; de-duplicate the hero clause.

**[L-3] All pages — no `rel="canonical"`.** *(Claude)* Fix: add per page.

**[L-5] `/assets/*` served with `max-age=0, must-revalidate`.** *(Claude; live-confirmed)*
Fix: `public/_headers` with long-lived immutable caching for assets.

**[L-6] contact.html:15 — placeholder `#6B5F86` on field `#1E1136` = 3.03:1.** *(Claude)*
Fix: lighten to `#8E84A6`.

**[L-7] advisory.html:75 "Co-founded Contegix" vs about.html:40 "founded in 2004" — factual inconsistency.** *(Claude; confirmed)*
Fix: "co-founded" on both (the safer claim).

**[L-8] Footer logos `alt="Mostest"` duplicate adjacent text for screen readers.** *(Claude)*
Fix: `alt=""` (decorative) in footers.

**[S-1] contact.html:79 — `err.textContent = ex.message || '…'` shows raw technical errors ("Failed to fetch") to users; the friendly fallback containing the email only appears when `ex.message` is empty.** *(sweep — controller)*
Fix: always show the friendly message.

## Accepted as-is / no action

- **[L-4]** Homepage title "Mostest — Advisory & Ventures" vs inner "Page — Mostest" ordering — intentional brand pattern, noted.
- **new-tab indicators** on `target="_blank"` links (part of L-8 family) — `rel="noopener"` present; visual cue is a design choice, deferred.

## Rejected findings

None — every located finding checked out against the code.
