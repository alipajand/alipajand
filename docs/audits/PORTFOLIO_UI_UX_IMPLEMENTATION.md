# AliPajand Portfolio — UI/UX Implementation

Implementation of the highest-impact findings from `docs/audits/PORTFOLIO_UI_UX_AUDIT.md`, applying the mandatory positioning, availability, hero, homepage-structure, navigation, contact, and case-study decisions from the implementation brief.

Source of truth for the toolchain: `pnpm format`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.

---

## Problems addressed

| Audit finding                                                            | Priority | Resolution                                                                                                                                                                   |
| ------------------------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No clear primary role / positioning dilution (4–5 labels)                | P0/P1    | Single primary title **"Senior Frontend / Product Engineer"** applied to hero eyebrow, `<title>`, OG, `Person` schema `jobTitle`, footer, and the "What I bring" role strip. |
| Target role not stated in hero                                           | P0       | Added hero eyebrow `Senior Frontend / Product Engineer · Montreal, Canada` and the mandated H1/supporting paragraph.                                                         |
| Founder framing risks "independent builder" read                         | P1       | LedgerGuard role no longer leads with "Founder" (`Senior Product Engineer · LedgerGuard (independent product)`); ownership vs. collaboration is now explicit per case study. |
| Case-study evidence buried; homepage showed writing but no case studies  | P1       | New **Selected case studies** section on the homepage (4 cards), placed above writing; section order now matches the mandated structure.                                     |
| Writing outranked portfolio on homepage                                  | P1       | Reordered: Hero → Proof → Selected case studies → What I bring → Writing → Peer feedback → Contact → Footer.                                                                 |
| Anonymous testimonials + defensive disclaimer                            | P1       | Concise disclaimer + compact `Role · Company` attribution; removed the repetitive "Attribution" markup.                                                                      |
| No persistent footer / `/now` & `/engineering-principles` undiscoverable | P1/P2    | Added a sitewide `Footer` (`contentinfo`) with secondary nav (Work, Writing, About, Now, Engineering principles, Contact) + direct links.                                    |
| Navigation label drift (Portfolio / Full portfolio / Case studies)       | P2       | Public nav is now **Work · Writing · About · Contact**.                                                                                                                      |
| Skip link defined in CSS but not rendered                                | P2       | Rendered a working "Skip to content" link as the first focusable element in the layout.                                                                                      |
| Hero scroll-cue ignored reduced-motion                                   | P2       | Scroll-cue bounce loop now early-returns under `prefers-reduced-motion`.                                                                                                     |
| Contact form weak for recruiters                                         | P1       | Added optional **Company** field, **Work email** label, recruiter-oriented helper text, removed the response-time promise.                                                   |
| Case studies lacked role/ownership structure                             | P1       | Full case studies now lead with **My role** + **What I owned**, then the mandated section order.                                                                             |
| Homepage metadata not aligned to positioning                             | P1       | Home `<title>`/description/OG/Twitter aligned to the mandated copy.                                                                                                          |

**Deferred (documented, not faked):** the résumé asset. No résumé file exists in the repo, so per the brief the résumé UI is wired but gated on `RESUME_URL` (currently `null`) and renders nothing rather than linking to a nonexistent file. See "Deferred work."

---

## Files changed

**Data / copy (`data/`)**

- `data/site.ts` — `TAGLINE` (now the primary role), new `HOME_TITLE`, `KEYWORDS` reorder, `SITE_META_DESCRIPTION`, `HERO_EYEBROW` (new), `HERO_VALUE_LINE`, `HERO_SUB`, `CONTACT_INTRO`, `CONTACT_FORM_LEDE`, `HERO_PROOF_ROW` (4 items), `HERO_CTA_DOWNLOAD_RESUME` ("Download résumé"), `PERSON_SCHEMA_JOB_TITLE`; removed unused `HERO_CTA_READ_WRITING`.
- `data/nav.ts` — primary links → Work, Writing, About, Contact.
- `data/hiringFit.ts` — heading "What I bring to a team", new lede, 4-item role strip, 4 mandated capability cards.
- `data/testimonials.ts` — concise intro; removed `TESTIMONIAL_ATTRIBUTION_SR_ONLY`.
- `data/contactForm.ts` — Work email label, new Company field copy + `(optional)` marker, recruiter helper text, neutral success message.
- `data/projects.ts` — `CaseStudyBlock` extended (`owned`, `technicalImplementation`, `uxAccessibility`; removed `reliabilityPerformance`); LedgerGuard role reworded; all 5 case studies populated with `owned`/`uxAccessibility` and renamed `technicalImplementation`.
- `data/projectsUi.ts` — `PROJECT_CARD_OWNED_LABEL` (new); reordered/relabeled `PROJECT_CASE_STUDY_ROWS` to the mandated order; added `CaseStudyRowKey` type.
- `data/pageChrome.ts` — `SKIP_TO_CONTENT_LABEL` (new).
- `data/selectedWork.ts` — **new**: homepage case-study preview content + labels.
- `data/footer.ts` — **new**: footer copy + secondary nav.

**Components / features**

- `components/Hero/Hero.tsx` — eyebrow; CTA hierarchy (primary "View case studies", secondary "Discuss a role"); removed "Read writing".
- `components/Hero/hooks/useHero.ts` — reduced-motion guard on scroll-cue loop.
- `components/SelectedWork/SelectedWork.tsx`, `components/SelectedWork/SelectedWorkCard.tsx` — **new** homepage section.
- `components/Footer/Footer.tsx` — **new** sitewide footer.
- `components/HiringFit/HiringFit.tsx` — unchanged logic (data-driven), now renders "What I bring to a team".
- `components/Testimonials/TestimonialsQuote.tsx` — compact `Role · Company` attribution.
- `components/Nav/Nav.tsx` — gated Résumé action (desktop + mobile).
- `components/Contact/ContactForm.tsx` — Company field; Work email label.
- `components/Contact/hooks/useContactForm.ts` — `company` value folded into the message (API contract unchanged).
- `components/Projects/ProjectCard.tsx` — "What I owned" lead block.
- `features/home/HomePageContent.tsx` — new section order; HowIThink removed from homepage.

**App**

- `app/layout.tsx` — `HOME_TITLE` metadata/OG/Twitter; skip link; sitewide `Footer`.

**Tests updated** (kept green): `Hero.spec.tsx`, `Testimonials.spec.tsx`, `Nav.spec.tsx`, `ProjectCard.spec.tsx`, `Projects.spec.tsx`.

> `app/api/contact/route.ts` was intentionally **not** modified (approval-gated). The optional Company field is delivered by composing it into the message body client-side.
> `components/HowIThink/*` and `data/howIThink.ts` remain in the repo but are no longer used by the homepage.

---

## Exact copy changed (high-signal)

- **Title:** `Senior Product Engineer · Frontend Architecture · …` → `Ali Pajand — Senior Frontend / Product Engineer`
- **Meta description:** → `Senior Frontend and Product Engineer with 9+ years of experience building React and TypeScript products, design systems, accessible interfaces, frontend architecture, and developer tooling.`
- **Hero eyebrow (new):** `Senior Frontend / Product Engineer · Montreal, Canada`
- **Hero H1:** `I build complex product interfaces that stay usable, accessible, and reliable.`
- **Hero sub:** `9+ years building React and TypeScript products, design systems, workflow-heavy SaaS interfaces, and frontend platforms. I turn ambiguous product requirements into maintainable systems teams can ship with confidence.`
- **Hero CTAs:** Primary `View case studies` (`/portfolio#projects`) · Secondary `Discuss a role` (`#contact`) · gated tertiary `Download résumé`.
- **Contact intro:** `Hiring for a senior frontend or product engineer? Share the role, team, location, and the problem you need solved. I’m open to relevant opportunities in Canada and remote roles with compatible hiring arrangements.`
- **Message helper:** `Role, team, location, compensation range, and what you need help building.`
- **Success message:** `Message sent — thanks for reaching out.` (no response-time promise)
- **Peer feedback intro:** `Names withheld publicly; role and company are included with permission.`
- **Proof at a glance:** `9+ years / Product and frontend engineering` · `Design systems / Shared UI, accessibility, adoption, and documentation` · `Product architecture / Typed contracts, async states, data-heavy workflows` · `Developer experience / Tooling, CI quality gates, release reliability`
- **What I bring to a team:** Product-minded frontend ownership · Design systems · Frontend architecture · Developer experience (exact mandated bodies).
- **Nav:** Work · Writing · About · Contact.

---

## Routes changed / reviewed

- `/` — restructured (hero, proof, selected case studies, what I bring, writing, peer feedback, contact, footer).
- `/portfolio` — case-study structure (My role + What I owned + reordered sections); nav/footer.
- `/writing`, `/writing/[slug]` — nav/footer/skip link (no content change).
- `/engineering-principles`, `/now` — now reachable via footer; nav/footer/skip link.
- `not-found` — nav/footer/skip link inherited.

---

## Accessibility work

- **Skip link:** rendered as the first focusable element (verified first tab stop), targets `#main-content` (present on every page's `<main tabIndex={-1}>`).
- **Single H1 per page:** verified on `/` and `/portfolio` (`h1Count === 1`); heading order h1 → h2 (sections) → h3 (cards/jobs).
- **Landmarks:** added `contentinfo` (footer) sitewide; existing `banner`/`navigation`/`main`/`region` retained.
- **Reduced motion:** hero scroll-cue loop now respects `prefers-reduced-motion`; existing reveal hooks already guarded.
- **Forms:** new Company field has a programmatic label + `aria-describedby` hint; existing `aria-invalid`/`role="alert"` error wiring preserved; "Work email" relabeled.
- **Links:** external links keep `rel="noopener noreferrer"` + "opens in new tab" SR text; "Read case study" links include SR context (`— full write-up on the work page`).
- **Touch targets:** new CTAs/links use `min-h-11`/`min-h-9` and existing CTA tokens.

---

## Responsive work

Verified with device emulation at **375, 768, 1280, 1440 px**:

- No horizontal overflow at any width (`scrollWidth === innerWidth` at 375 and 1440; spot-checked 768/1280).
- 375 px: hero actions stack vertically and go full-width; selected-work and "what I bring" grids collapse to one column; footer stacks; nav collapses to keyboard-accessible menu button.
- Desktop: content constrained to `max-w-5xl`; two-column case-study and capability grids; readable line lengths.

---

## Metadata changes

- `app/layout.tsx`: `title.default` and OG/Twitter titles → `HOME_TITLE`; description → new positioning description.
- `components/StructuredData/StructuredData.tsx` (via data): `Person.jobTitle` → "Senior Frontend / Product Engineer"; `ProfilePage.name` and `knowsAbout` updated through `TAGLINE`/`KEYWORDS`.
- `app/opengraph-image.tsx` (via data): role line + proof metrics reflect the new copy.
- Per-route metadata (`/writing`, `/portfolio`, articles, `/now`, `/engineering-principles`) unchanged and still valid.

---

## Tests and command results

- `pnpm format` — clean (Prettier write).
- `pnpm typecheck` — pass (0 errors).
- `pnpm lint` — pass (0 warnings/errors).
- `pnpm test` — **42 suites, 327 tests, all passing.**
- `pnpm build` — success; all routes prerendered (`/`, `/portfolio`, `/writing`, 6 articles, `/now`, `/engineering-principles`, OG images, sitemap, robots).

---

## Screenshots verified

- Homepage hero @ 375 px — eyebrow, H1, stacked full-width CTAs, contact icons, location, no overflow.
- Homepage @ 1280 px (a11y tree) — full mandated section order + footer.
- Portfolio @ 375 px — case-study cards with "What I owned" + new section labels (×5), single H1, no overflow.

---

## Deferred work

1. **Résumé asset (P0 in audit).** No résumé file exists in the repo. The résumé action is implemented and gated on `RESUME_URL` (hero tertiary link, desktop nav, mobile menu, footer). To enable: add a current PDF to `public/` (e.g. `public/ali-pajand-resume.pdf`), set `RESUME_URL` in `data/site.ts`, and verify it opens/downloads. No résumé was fabricated from partial repo data.
2. **Case-study product visuals (P1).** Project `image`/`secondaryMedia` fields remain empty; add real screenshots when available (cards/figures already support them).
3. **Per-article author/CTA footer & post↔case-study cross-links (P2).** Not in this batch.
4. **RSC/hydration trim (P2).** Page shells remain client components; deferred to a performance batch.

---

## Remaining risks

- **Company delivery via message body:** because the contact API route is approval-gated, the optional Company value is prepended to the message text rather than sent as a structured field. If a structured field is preferred, `app/api/contact/route.ts` needs an approved change.
- **Animated count-up on proof values:** pre-existing `useCountUp` still animates numeric proof values (e.g. "9+ years"); not introduced here and reduced-motion is respected. Remove if undesired.
- **Unused HowIThink module:** left in place (not deleted) but no longer rendered; safe to remove in a follow-up.
- **Availability copy** states "open to relevant opportunities in Canada and remote roles with compatible hiring arrangements" — no citizenship/work-authorization/relocation claims were invented, per the brief.
