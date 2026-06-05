# Final Portfolio UI/UX Review

Read-only review of the implemented portfolio changes (see `PORTFOLIO_UI_UX_IMPLEMENTATION.md`). No code was modified in this pass. Evidence: current `git diff`, code inspection, and rendered review at 375×812, 768×1024, 1280×800, 1440×900.

> Note: the working tree contains pre-existing uncommitted changes beyond this implementation (docs, `features/now`, `features/writing`, `not-found`, `engineering-principles`, `ReadingProgress`, several hooks). Findings below focus on the positioning/homepage/case-study implementation under review.

## Verdict

**PASS WITH REQUIRED FIXES**

The implementation meets every mandatory regression check. One objective markup defect was introduced (invalid nested `<li>` in the new homepage case-study cards) and should be corrected before merge. Remaining items are pre-existing or explicitly-deferred (résumé asset, legacy metrics) and are not merge blockers.

---

## Recruiter comprehension

**Understood in five seconds (1280/1440):**

- Target role: **Senior Frontend / Product Engineer** (hero eyebrow, `<title>`, footer).
- Seniority: "9+ years," senior-level capability language, no "junior/learning" signals.
- Location: **Montreal, Canada** (eyebrow + "Based in Montreal, Quebec, Canada").
- Core specialization: React, TypeScript, design systems, frontend architecture, DX (hero sub + Proof at a glance).
- Open to opportunities: contact intro states "I’m open to relevant opportunities in Canada and remote roles…".
- Strongest work: **Selected case studies** sits directly under the hero/proof, above writing.
- How to contact: hero contact icons + a full Contact section (email, LinkedIn, GitHub, form).

**Remains unclear:**

- **Résumé download:** no résumé action renders anywhere because `RESUME_URL` is `null` (no asset in repo). A recruiter cannot download a CV. This is documented as a deferred asset but is a real recruiter gap.
- Page identity on `/portfolio` uses three terms ("Full portfolio" overline, "Background & case studies" H1, "Case studies" section) while nav says "Work" — mild comprehension tax.

**Interview conversion:** Yes — positioning, primary CTA ("View case studies"), secondary CTA ("Discuss a role"), and a low-friction recruiter contact form support conversion. The only conversion gap is the missing résumé.

---

## Hiring-manager evidence

**Strongest proof:**

- Per-case-study **My role** + **What I owned** blocks distinguish personal ownership from collaboration (e.g., LedgerGuard "independent product," AlwaysGeeky "collaborated with design," Emplifi "team delivery").
- Architecture judgment is concrete: deterministic-vs-probabilistic separation (LedgerGuard), shared `@mapbylaw/ui` + typed contracts (MapBylaw), CI a11y/visual gates (AlwaysGeeky).
- The architecture article demonstrates senior reasoning (boundaries, state modeling, API contracts, a11y, performance, review habits).

**Weakest proof:**

- No product screenshots on case studies — evidence is text-only; a hiring manager cannot see the actual interfaces.
- Homepage case-study "Evidence" lines are qualitative (appropriate given no metrics, but less persuasive than verified outcomes).

**Unsupported claims (pre-existing, still live on `/portfolio`):**

- "100% WCAG compliance," "99.9% deployment stability," "+15% user engagement," "60fps" appear in full case-study `outcomes`/`beforeAfter`. These were not introduced by this change but remain unverifiable. The homepage Selected case studies correctly avoid invented metrics.

**Missing evidence:** product visuals; links from articles to the related case study.

**Is Ali's contribution clear?** Yes — the "My role"/"What I owned" structure with explicit collaboration notes makes individual contribution legible without implying sole ownership of team work.

---

## Visual review

| #   | Route                       | Viewport | Severity | Current behavior                                                                                                       | Expected behavior                                         | Exact required correction                                                                                                                                                                          |
| --- | --------------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1  | `/` (Selected case studies) | all      | Minor    | Theme badges render as `<li><li><span>` (invalid nested list items); the a11y tree double-lists badges at some widths. | Each badge is a single direct `<li>` child of the `<ul>`. | In `components/SelectedWork/SelectedWorkCard.tsx`, render `<ProjectCardBadge>` directly inside the themes `<ul>` (remove the wrapping `<li>`), since `ProjectCardBadge` already returns an `<li>`. |
| V2  | `/portfolio`                | all      | Minor    | Page uses "Full portfolio" overline + "Background & case studies" H1 while nav/CTAs use "Work" / "View case studies".  | Consistent public terminology.                            | In `data/pageChrome.ts`, change `PORTFOLIO_PAGE_HEADER_OVERLINE` to "Work" (or "Case studies") to match the unified label.                                                                         |
| V3  | `/portfolio` (case studies) | all      | Optional | Case-study cards have no product imagery.                                                                              | Visual proof of the interfaces.                           | Populate `image`/`secondaryMedia` on `data/projects.ts` entries when assets exist (cards already support them).                                                                                    |
| V4  | `/writing/[slug]`           | all      | Optional | Articles do not link to the related case study.                                                                        | Cross-link article ↔ case study to reinforce evidence.    | Add a "Related case study" link in the article footer (deferred).                                                                                                                                  |

No horizontal overflow at 375/768/1280/1440 (`scrollWidth === innerWidth` verified at 375, 768, 1280, 1440). Hierarchy, grouping, spacing, and card clarity are strong; the design reads as a senior engineer's site, not a generic AI SaaS template.

---

## Accessibility review

| #   | Route     | Element                                                                            | Severity                      | Current behavior                                                                                                                                                                                         | User impact                                                        | Exact required correction                                                                                                                                         | Verification method                                                                                                            |
| --- | --------- | ---------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| A1  | `/` + all | Theme/role badges (`ul[aria-label="Project themes"]`, `ul[aria-label="Role fit"]`) | Minor                         | 12 invalid nested `<li>` (8 in Selected case studies — introduced; 4 in HiringFit role strip — pre-existing).                                                                                            | Screen readers may announce phantom/empty list items; invalid DOM. | Remove the outer `<li>` wrappers so `ProjectCardBadge` (`<li>`) is a direct child of each `<ul>`. Apply to `SelectedWorkCard.tsx` and `HiringFit.tsx` role strip. | Re-inspect DOM: `document.querySelectorAll('li > li').length === 0`.                                                           |
| A2  | all       | Skip link `a[href="#main-content"]`                                                | Minor (likely false negative) | First focusable element; `.skip-link` CSS reveals on `:focus` (`translateY(0)` + outline). Automated check could not paint `:focus` because the automation tab reported `document.hasFocus() === false`. | None expected; could not visually confirm reveal under automation. | None required if manual check passes.                                                                                                                             | Manual: load `/`, press Tab once, confirm "Skip to content" appears top-left and activating it moves focus to `#main-content`. |
| A3  | `/`       | Contact form                                                                       | — (pass)                      | Name/Work email/Company/Message have programmatic labels; Company is `(optional)` with `aria-describedby` hint; existing error wiring (`aria-invalid`, `role="alert"`, error id) unchanged.              | Accessible.                                                        | None.                                                                                                                                                             | a11y tree + code inspection of `ContactForm.tsx`.                                                                              |
| A4  | all       | Headings                                                                           | — (pass)                      | Exactly one H1 per page (`/` and `/portfolio` verified `h1Count === 1`); order h1 → h2 → h3.                                                                                                             | Accessible.                                                        | None.                                                                                                                                                             | a11y tree + DOM query.                                                                                                         |
| A5  | all       | Landmarks                                                                          | — (pass)                      | `banner`, `navigation` (Primary + Footer), `main`, `region`s, and new `contentinfo` footer present sitewide.                                                                                             | Accessible.                                                        | None.                                                                                                                                                             | a11y tree.                                                                                                                     |
| A6  | `/` hero  | Scroll cue                                                                         | — (pass)                      | Bounce loop now early-returns under `prefers-reduced-motion`.                                                                                                                                            | Reduced-motion respected.                                          | None.                                                                                                                                                             | Code inspection `useHero.ts`.                                                                                                  |
| A7  | all       | Muted text contrast                                                                | — (pass)                      | `--muted #a3a3a3` on `--background #000` ≈ 8.8:1.                                                                                                                                                        | AA pass.                                                           | None.                                                                                                                                                             | Computed-style contrast calc.                                                                                                  |

Keyboard navigation, focus order, link purpose ("Read case study — full write-up on the work page", "opens in new tab" SR text), and touch targets (min-h-11/min-h-9) are sound.

---

## Content consistency

| Aspect               | Status                  | Notes                                                                                                                |
| -------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Title                | Consistent              | `Ali Pajand — Senior Frontend / Product Engineer` across `<title>`, OG, Twitter.                                     |
| Availability         | Consistent              | "Open to relevant opportunities in Canada and remote…"; no "unavailable" copy anywhere.                              |
| Location             | Consistent              | "Montreal, Canada" / "Montreal, Quebec, Canada".                                                                     |
| Experience           | Consistent              | "9+ years" in hero, proof, schema.                                                                                   |
| Specialization       | Consistent              | React, TypeScript, design systems, frontend architecture, DX.                                                        |
| Project descriptions | Consistent              | Homepage previews ↔ full case studies aligned; ownership/collaboration explicit.                                     |
| Contact language     | Consistent              | No response-time promise; recruiter-oriented helper text.                                                            |
| Navigation labels    | **Minor inconsistency** | Nav unified to "Work", but `/portfolio` retains "Full portfolio" overline + "Background & case studies" H1 (see V2). |
| Metadata             | Consistent              | `Person.jobTitle`, OG image role line, description all align with positioning.                                       |

---

## Merge blockers

**Blocker (0):** none.

**Major (2):**

- M1 — **Résumé asset missing.** No résumé file exists, so no résumé action renders. The requirement ("visible OR missing asset explicitly documented") is satisfied via documentation, but recruiters cannot download a CV. Add `public/…resume.pdf` + set `RESUME_URL`; the gated UI (hero/nav/footer) will then appear.
- M2 — **Unverifiable metrics on `/portfolio`** ("100% WCAG", "99.9%", "+15%", "60fps") remain in full case-study data (pre-existing). Replace with qualitative evidence or cite a source.

**Minor (3):**

- m1 — Invalid nested `<li>` in Selected case study badges (introduced, 8) and HiringFit role strip (pre-existing, 4). Fix per A1/V1. _(This is the only objective defect introduced by this change set.)_
- m2 — `/portfolio` terminology ("Full portfolio" / "Background & case studies") vs unified "Work" (V2).
- m3 — No article ↔ case-study cross-links (V4).

**Optional:**

- o1 — Add product screenshots to case studies (V3).
- o2 — "How I think" content is no longer surfaced anywhere after HowIThink was removed from the homepage (component/data remain in repo); resurface or delete in a follow-up.
- o3 — Count-up animation still runs on numeric proof values (reduced-motion respected); remove if undesired.

---

## Final recommendation

- **Safe to merge?** Yes, after fixing **m1** (invalid nested `<li>`), which is a quick, low-risk markup correction. Everything else is documented/deferred and non-blocking.
- **Required fixes before merge:** m1 — remove the outer `<li>` wrappers around `ProjectCardBadge` in `SelectedWorkCard.tsx` (and, for consistency, the HiringFit role strip) so badges are valid direct `<ul>` children. Recommended same-PR cleanup: m2 (overline terminology).
- **Deferred improvements:** résumé asset (M1), replace/source legacy metrics (M2), product screenshots (o1), article↔case-study links (m3), resurface or remove "How I think" (o2).
- **Another design pass justified?** No. The visual direction is restrained, senior, and consistent. The remaining work is content/asset and a small markup fix, not redesign.

---

### Return summary

- **Verdict:** PASS WITH REQUIRED FIXES
- **Blocker count:** 0
- **Major issue count:** 2
- **Minor issue count:** 3
- **Exact fixes required before merge:** In `components/SelectedWork/SelectedWorkCard.tsx`, stop wrapping `<ProjectCardBadge>` in an extra `<li>` (it already renders an `<li>`); apply the same fix to the `HiringFit` role strip in `components/HiringFit/HiringFit.tsx`. Verify with `document.querySelectorAll('li > li').length === 0`.
- **Report path:** `docs/audits/PORTFOLIO_UI_UX_FINAL_REVIEW.md`
