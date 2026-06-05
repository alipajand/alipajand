# AliPajand Portfolio UI/UX Audit

> Read-only audit. No code was changed. Evidence is cited from the repository (`data/*`, `components/*`, `features/*`, `app/*`) and from the site rendered locally at `localhost:3123` across 375 / 768 / 1280 / 1440 px.

---

## Executive verdict

**Overall portfolio effectiveness:** High craft, above-average for an engineering portfolio. The case-study writing, semantic structure, metadata, structured data, accessibility scaffolding, and test coverage (42 colocated spec files) are genuinely senior-grade. The site reads as a precise, restrained, credible engineering site — exactly the intended direction. It does **not** read as a decorative agency site, a SaaS marketing page, or an AI-generated template.

**Does it currently support the job search?** Partially. It proves _capability_ very well but undersells _employability_ and _role clarity_. A recruiter leaves with a strong sense that Ali is a strong engineer, but with friction on three of the highest-impact questions: "What exactly is he applying for?", "Where is his resume?", and "Is he looking for a job or running his own products?"

**Primary positioning problem:** The site has no single, prominent target role. The hero shows a name and a capability sentence but never states a role label in the visual hierarchy. The metadata/schema lead with **"Senior Product Engineer,"** while the stated campaign priority is **Senior Frontend Engineer**, and the tagline stacks four labels (`Senior Product Engineer · Frontend Architecture · Design Systems · AI Product Workflows`) plus a five-item role strip. The two lead case studies (LedgerGuard, MapBylaw) are self-owned products, one tagged **"Founder."** Net effect: a recruiter can plausibly read Ali as an independent builder rather than a senior IC available to hire.

**Strongest evidence:** The five case studies on `/portfolio`. Each follows a disciplined Problem → Constraints → Architecture decisions → Trade-offs → Reliability/Performance → Outcome structure with before/after rows. The LedgerGuard "separate probabilistic extraction from deterministic financial truth" narrative is a genuinely senior systems argument. The writing (6 posts) reinforces this and is on-topic for the target roles.

**Weakest evidence:** (1) No resume. (2) No visual proof of the products — case studies are text + two SVG diagrams, with every `image`/`secondaryMedia` field empty, so a recruiter never _sees_ the UIs Ali claims to have built. (3) Anonymous testimonials with a defensive disclaimer. (4) A few absolute, unverifiable claims (`100% WCAG compliance`, `99.9% deployment stability`).

**Is a full redesign justified?** No. The design language, tokens, typography, and architecture are strong and should be preserved. This is a **focused refinement** job — positioning, evidence surfacing, and conversion plumbing — not a rebuild.

### Top five changes by expected hiring impact

1. **Add a resume/CV.** A "Download resume" CTA is already coded in the hero but is dead because `RESUME_URL` is `null` and no file exists in `public/`. Ship a PDF/LinkedIn-export and enable the button. (P0)
2. **State one primary role in the hero, visibly.** Add a role eyebrow/label ("Senior Frontend Engineer — product-focused") above or beside the name so the target is unmistakable in 5 seconds; align metadata, schema `jobTitle`, and the role strip to one primary + one secondary. (P0)
3. **Surface case-study evidence on the homepage and de-risk the founder read.** Add 2–3 case-study preview cards on the homepage (currently only writing previews appear), and reframe the "Founder / Senior Product Engineer · LedgerGuard" line so independent products read as engineering depth, not a career pivot. (P0/P1)
4. **Add real product visuals to case studies.** At least one screenshot/figure per project; today they are abstract. (P1)
5. **Tighten credibility:** attribute or further qualify testimonials, and replace absolute claims with bounded, verifiable phrasing. (P1)

---

## Target positioning

Recommended single hierarchy (the site should resolve to this everywhere):

- **Primary title:** **Senior Frontend Engineer** (product-focused).
- **Secondary specialization:** Frontend architecture & design systems for complex, workflow-heavy SaaS — including AI-product UI and developer experience.
- **Supporting proof points:**
  - 9+ years shipping product frontend (React / TypeScript / Next.js).
  - Design systems in production (Storybook, tokens, CI a11y/visual gates).
  - Complex product UI: dashboards, multi-tenant B2B, AI trust boundaries.
  - DX/quality: typed contracts, CI gates, MCP tooling.
- **Primary audience:** Engineering managers and heads of engineering hiring senior frontend / product engineers at product companies.
- **Primary CTA:** **Discuss a role** (contact) — keep, but pair with resume.
- **Secondary CTA:** **View case studies** (→ `/portfolio#projects`) and **Download resume**.

> Keep "Senior Product Engineer" as the _secondary_ framing for product-eng roles, but lead with the campaign's stated target (Senior Frontend Engineer) in the hero, `<title>`, and schema so the message is consistent.

---

## Critical contradictions

| #   | Location                              | Evidence                                                                                                                                                                                                  | Issue                                                                                                                                | Recommended resolution                                                                                                                                                                 | Priority |
| --- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| C1  | Hero CTA vs resume                    | `data/site.ts` defines `HERO_CTA_DOWNLOAD_RESUME = "Download resume"`; `RESUME_URL: string \| null = null`; `components/Hero/Hero.tsx` renders the button only `if (RESUME_URL)`. No resume in `public/`. | The site _intends_ a resume CTA but ships none — recruiters cannot get a resume anywhere.                                            | Add a resume PDF (or hosted link) and set `RESUME_URL`.                                                                                                                                | P0       |
| C2  | Positioning labels                    | `TAGLINE` (4 labels), `PERSON_SCHEMA_JOB_TITLE = "Senior Product Engineer"`, `HIRING_FIT_ROLE_STRIP` (5 roles), `HIRING_FIT_HEADING` = "senior frontend **and** product engineering".                     | No single primary target; schema/tagline lead "Product Engineer" while the campaign target is "Frontend Engineer".                   | Pick one primary + one secondary; apply consistently.                                                                                                                                  | P1       |
| C3  | Founder vs employee                   | `data/projects.ts` LedgerGuard `role: "Founder / Senior Product Engineer · LedgerGuard"`; LedgerGuard + MapBylaw are the two lead case studies and are self-owned.                                        | Risks positioning Ali as an independent builder rather than an available senior IC.                                                  | Keep the projects (they show depth) but reframe role lines and add a clear "open to full-time roles" signal; lead the case-study list with employment work or label ownership context. | P1       |
| C4  | "Discuss a role" vs availability copy | Hero `Discuss a role` → `#contact`; `CONTACT_INTRO` = "I'm open to senior product engineering, frontend platform, design systems… conversations".                                                         | **No contradiction found** — the feared "not looking for employment" copy is _not_ present. Availability is positive and consistent. | None. Treat the known-risk item as already resolved.                                                                                                                                   | —        |
| C5  | Destination labels                    | `Portfolio` (nav/title) · `Full portfolio` (overline) · `Background & case studies` (`<h1>`) · `Case studies` (section) · `View case studies` (CTA).                                                      | Same destination described five ways; mild comprehension tax.                                                                        | Standardize on "Case studies" / "Portfolio".                                                                                                                                           | P2       |
| C6  | Discoverability                       | `/now` has **no** link anywhere in the UI; `/engineering-principles` is only linked from the HiringFit secondary CTA. No footer exists.                                                                   | Two real routes are effectively orphaned for human visitors (present only in sitemap).                                               | Add a footer with secondary nav, or link Now/Principles from nav.                                                                                                                      | P1       |

---

## Recruiter journey

1. **Lands on homepage** — Hero shows "Ali Pajand" (largest element) + a capability sentence + 9+ years sub. **Gap:** no explicit role label in the visual hierarchy; the role only lives in the `<title>`/schema and lower in HiringFit. A 5-second visitor sees _who_ but not _what role_. (P0)
2. **Understands role & seniority** — Seniority lands ("9+ years," proof strip). Role does not. (P1)
3. **Reviews proof** — Homepage proof is the abstract ProofStrip (Design systems / Architecture / AI workflows) + HiringFit cards + anonymous testimonials. **No company logos, no metrics, no case-study previews.** Employment history (titles, dates, companies) lives only on `/portfolio`, not the homepage. (P1)
4. **Opens a case study** — Requires leaving the homepage. The hero "View case studies" CTA correctly deep-links to `/portfolio#projects` (anchor verified, `Projects.tsx` has `id="projects"`), but the nav "Portfolio" link lands at the top, behind About + a four-job Experience timeline. (P2)
5. **Understands contribution & outcomes** — Strong once there: role, signals, problem/constraints/decisions/trade-offs/outcome, before/after. **Gap:** no product screenshots; some outcomes are qualitative ("snappier-feeling"). (P1)
6. **Checks resume / LinkedIn / GitHub** — LinkedIn + GitHub are in the hero and contact; **resume is absent.** (P0)
7. **Contacts Ali** — Low friction: direct email + on-page form on the homepage `#contact`, reply-time expectation set. The displayed email is anti-spam obfuscated (`alipajand[AT]gmail.com`) but the `mailto:` is correct. (Good; obfuscation is a minor P3.)

**Highest-friction points:** role ambiguity at step 1–2, missing resume at step 6, and evidence being one click away + visually abstract at steps 3 and 5.

---

## Route-by-route audit

Public routes identified from code (`app/`): `/` (home), `/portfolio`, `/writing`, `/writing/[slug]` (6 posts), `/engineering-principles`, `/now`, and the `not-found` (404) boundary. Non-page endpoints: `/api/contact`, `opengraph-image`, `sitemap.xml`, `robots.txt`, `manifest.json`.

### `/` — Homepage

- **Audience / goal:** All hiring personas; understand role + seniority and decide to contact.
- **Works:** Clean hero, strong value line, 9+ years sub, location, LinkedIn/GitHub, HiringFit role-fit section, on-page contact form, on-topic writing previews.
- **Unclear:** No explicit role title in hero; no employment history or company names visible without scrolling to testimonials; no case-study previews.
- **Credibility issues:** Anonymous testimonials with defensive disclaimer; ProofStrip is label-only (no numbers/logos).
- **Conversion issues:** No resume; role ambiguity; case studies off-page.
- **Visual:** Strong, restrained, consistent. Hero name dominates the role.
- **Responsive:** 375/768/1280/1440 all clean; CTAs stack full-width on mobile; no overflow observed.
- **Accessibility:** Good landmarks/headings; form well-labeled. Hero reveal depends on JS (see A11y A3); no skip link.
- **Recommendation:** Add role eyebrow; add 2–3 case-study preview cards; attribute/qualify testimonials; enable resume. **P0/P1. Change now.**

### `/portfolio` — Background & case studies

- **Audience / goal:** Engineers/EMs evaluating depth and ownership.
- **Works:** Excellent. About → Experience (4 roles with dates) → 5 case studies → DX tooling → Skills → Education. Sticky "On this page" jump nav. Disciplined case-study structure. Strong heading hierarchy (h1→h2→h3, sr-only h4 "Case study").
- **Unclear:** Page identity uses 3 different terms (overline "Full portfolio", h1 "Background & case studies", section "Case studies"). Very long single page; case studies sit below About + Experience.
- **Credibility issues:** No product visuals; `100% WCAG compliance` and `99.9% deployment stability` are absolute/unverifiable.
- **Conversion issues:** No resume CTA on this page either; no contact CTA at the end of the page.
- **Visual/Responsive:** Strong; sidebar collapses below `lg`; dense but readable.
- **Recommendation:** Add visuals; soften absolute claims; add an end-of-page CTA (resume + contact); unify naming. **P1. Change now (evidence batch).**

### `/writing` — Writing index

- **Audience / goal:** Recruiters/engineers assessing communication + depth.
- **Works:** Clear list, lede + "why it matters" rationale, dates, tags, good reading typography, back-home link.
- **Unclear:** No link from articles back to the related case study (e.g., the LedgerGuard/MapBylaw posts ↔ projects).
- **Conversion issues:** No CTA toward portfolio/contact from the index.
- **Recommendation:** Cross-link posts ↔ case studies; add a soft CTA. **P2.**

### `/writing/[slug]` — Articles (6)

- **Works:** Strong prose styling, reading-progress bar, JSON-LD per article, per-article OG image, date/`<time>`, back links, MCP diagram figure.
- **Unclear/Conversion:** No author bio block, no related-posts, no portfolio/contact CTA at the end.
- **Recommendation:** Add a small author/CTA footer per article. **P2.**

### `/engineering-principles`

- **Works:** Clear philosophy content, good structure/metadata.
- **Unclear:** Only reachable via HiringFit secondary CTA; not in nav/footer.
- **Recommendation:** Surface in footer; optionally link from About. **P2 (P1 for discoverability, see C6).**

### `/now`

- **Works:** Good "current focus" content and metadata; reinforces active engagement.
- **Unclear:** **No UI link anywhere** — orphaned except sitemap.
- **Recommendation:** Link from footer/nav or remove from sitemap. **P1 (discoverability).**

### `not-found` (404)

- **Works:** On-brand, focus moved into the region, keyboard tip, Home + Portfolio actions, reduced-motion handled.
- **Recommendation:** None material. **P3.**

---

## Content and evidence audit

| Claim                                      | Existing evidence                                                            | Sufficient? | Missing evidence                                      | Type of evidence needed                                |
| ------------------------------------------ | ---------------------------------------------------------------------------- | ----------- | ----------------------------------------------------- | ------------------------------------------------------ |
| "9+ years" senior frontend/product         | Hero sub, proof strip, 4-job timeline 2016–2026                              | Yes         | —                                                     | —                                                      |
| "Senior" enough for ambiguous product work | Case-study narratives (LedgerGuard truth model, MapBylaw policy-grounded AI) | Mostly      | Named scope/team-size, what was owned vs. contributed | One line per project on team size & ownership boundary |
| Deep React/Next/TS capability              | Skills, expertise, case studies, this site itself                            | Yes         | —                                                     | Optionally link the site's own repo                    |
| Design-system experience                   | AlwaysGeeky DS case study, Storybook/CI claims, skills                       | Strong      | Visual proof of components/Storybook                  | 1–2 screenshots or a Storybook link                    |
| Accessibility understanding                | Principles, HowIThink, WCAG claims, solid form a11y                          | Strong      | "100% WCAG compliance" is absolute                    | Replace with "WCAG 2.1 AA target; CI a11y gates"       |
| Improves DX/delivery                       | MCP tooling, CI checks, `99.9% deployment stability`                         | Mostly      | "99.9%" unverifiable                                  | Bound it ("near-zero release regressions via CI")      |
| Complex workflow-heavy SaaS                | LedgerGuard multi-tenant B2B, MapBylaw                                       | Strong      | Product visuals                                       | Screenshots/diagrams of real flows                     |
| Communicates technical decisions           | 6 on-topic posts, trade-off sections                                         | Strong      | Cross-links to case studies                           | Post ↔ project links                                   |
| Actively open to roles                     | `CONTACT_INTRO` positive; "Discuss a role"                                   | Mostly      | No explicit "open to full-time" + resume              | Availability line + resume                             |
| Quantified product outcomes                | Jobs: 60fps, +15%, zero critical incidents                                   | Mixed       | Case-study outcomes are qualitative                   | At least one metric per case study                     |
| Peer endorsement                           | 3 testimonials                                                               | Weak        | Names/titles or attribution                           | Named quotes (with permission) or LinkedIn recs link   |

---

## Case-study audit

### 1. LedgerGuard — AI contract intelligence

- **Current framing:** Founder / Senior Product Engineer; deterministic-truth-vs-probabilistic-extraction architecture.
- **Proves:** Senior systems thinking, multi-tenant B2B architecture, AI trust boundaries, product judgment.
- **Fails to prove:** What the product _looks like_; scale (tenants/users); that it shipped to real customers; team context.
- **Missing outcome:** Any adoption/usage/business metric.
- **Missing ownership detail:** Solo vs. team; what was built personally.
- **Missing technical decision:** None major — strongest narrative on the site.
- **Recommended structure:** Keep current rows + add 1 screenshot, 1 quantified or qualitative-with-scope outcome, and an explicit "solo founder build / N users" ownership line.
- **Recommendation:** **Keep & strengthen** (add visual + reframe Founder label).

### 2. MapBylaw — typed AI recommendations + shared UI

- **Current framing:** Senior Product Engineer; shared UI, typed contracts, React-PDF, policy-grounded AI.
- **Proves:** Design-system + contracts + AI-grounding depth; bilingual reporting.
- **Fails to prove:** Visual product; whether this was employment or independent; outcomes.
- **Missing:** Screenshot, role/employment context, a result.
- **Recommended structure:** Add visual + one outcome + ownership/employment clarity.
- **Recommendation:** **Keep & strengthen.**

### 3. AlwaysGeeky — design system, marketplace, login (Web3)

- **Current framing:** Lead Frontend Engineer · Design Systems (employment, 2024–2026).
- **Proves:** Production design-system leadership, accessibility, CI gates, real employment.
- **Fails to prove:** Visuals; the `100% WCAG` claim is absolute.
- **Missing:** Component/Storybook visual; bounded a11y claim.
- **Recommendation:** **Keep & strengthen.** This is the strongest _employment_ proof and should arguably lead the list for hiring purposes.

### 4. Emplifi — data-heavy dashboards + embedded performance

- **Current framing:** Senior Frontend Engineer (employment).
- **Proves:** Data-viz, performance discipline, embedded/webview constraints.
- **Fails to prove:** Specific metrics in the case study (jobs section has 60fps; case study is qualitative).
- **Missing:** A dashboard visual; the 60fps/retention numbers surfaced in the case study itself.
- **Recommendation:** **Keep & strengthen** (pull metrics up from `JOBS`).

### 5. ControlTech — PWA, performance, startup delivery

- **Current framing:** Frontend engineer (employment, 2018–2022).
- **Proves:** End-to-end delivery, CI/CD, PWA/offline.
- **Fails to prove:** Recency/seniority signal is weakest of the five.
- **Missing:** Visual; distinct outcome.
- **Recommendation:** **Keep but reduce** — shortest treatment; consider condensing to keep the senior, recent work prominent.

> Overall: the case studies are the site's biggest asset and are well-written. The single highest-leverage change is **adding visual evidence** and **one concrete outcome each**, plus clarifying which are employment vs. independent.

---

## Shared design audit

- **Typography:** Geist Sans, `font-display` for headings; consistent scale (`text-3xl/4xl` h2, etc.). Strong, restrained, senior. No issues. **Keep.**
- **Spacing:** Centralized in `utils/visual.ts` (`SECTION_X/Y`, `SECTION_SHELL`), `max-w-5xl` content width, consistent rhythm. Excellent token discipline. **Keep.**
- **Grid & layout:** Sensible responsive grids (proof strip 2→4 cols, HiringFit/HowIThink 1→2 cols, projects with sticky sidebar at `lg`). No overflow seen at 375–1440. **Keep.**
- **Buttons:** `CTA_PRIMARY/SECONDARY/TERTIARY` shared; `min-h-11` (44px) targets; consistent focus rings. **Keep.**
- **Links:** Consistent focus-visible rings; external links get `target=_blank` + `rel=noopener` + sr-only "opens in new tab". Good.
- **Cards:** `CARD_SURFACE`, accent-rail variants; consistent hover. Good. Project cards are dense but legible.
- **Tags/badges:** `ProjectCardBadge` reused for project themes and role strip — consistent.
- **Navigation:** Minimal (Writing / Portfolio / Contact); mobile menu uses `inert` + `aria-expanded` + `aria-controls` correctly. **Issue:** label drift for the portfolio destination (C5); no Now/Principles entry (C6).
- **Footer:** **None exists** — no `contentinfo` landmark, no persistent contact/social/resume/secondary nav. Notable gap. (P1, ties to C6.)
- **Form controls:** Best-in-class for this codebase — labels, hints via `aria-describedby`, `aria-required`, `aria-invalid`, `role="alert"`, success `role="status"`, `noValidate` with RHF. **Keep.**
- **Motion:** GSAP entrances + Lenis smooth scroll; `prefersReducedMotion()` respected in most hooks. **Issue:** hero scroll-cue bounce loop (`useHero.ts`, second `useEffect`) runs unconditionally, ignoring reduced-motion. (P2)
- **Empty/unavailable content:** Writing index has an empty-state message; project images guarded for empty strings; `Writing` returns null if no posts. Good defensive handling.
- **Responsive behavior:** Verified clean at 375/768/1280/1440. Long technical terms wrap acceptably; tap targets meet 44px.

---

## Accessibility audit

| ID  | Priority | Location                                                                               | Current behavior                                                                                                                                      | User impact                                                                           | Correction                                                                                                                      | Verification                                                              |
| --- | -------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| A1  | P2       | Global (`app/globals.css` has `.skip-link`; no JSX renders it)                         | Skip-link CSS exists but no skip link is in the DOM. Landmarks (`nav`/`main`/regions) + headings _do_ satisfy WCAG 2.4.1 via alternate technique.     | Keyboard users can't jump past nav directly (minor; landmarks mitigate).              | Render a `<a class="skip-link" href="#main-content">` as the first focusable element.                                           | Tab from page load; first stop is "Skip to content"; axe/Lighthouse a11y. |
| A2  | P2       | `useHero.ts` scroll-cue loop                                                           | Infinite bounce animation ignores `prefers-reduced-motion`.                                                                                           | Vestibular discomfort for reduced-motion users.                                       | Gate the loop behind `prefersReducedMotion()`.                                                                                  | Set OS reduce-motion; confirm no looping motion.                          |
| A3  | P2       | `Hero.tsx` (`opacity-0`, `translate-y-15` on value line/sub/CTAs/location; `hero-lcp`) | These elements are hidden via CSS and only revealed by GSAP on mount.                                                                                 | If JS fails/is slow, key hero content is invisible; LCP element starts at opacity 0.  | Ensure a no-JS/visible fallback (animate from a visible base, or reveal via class toggled after hydration with a CSS fallback). | Disable JS; confirm hero copy/CTAs visible; check LCP in Lighthouse.      |
| A4  | P2       | Color tokens (`--muted #a3a3a3` on `#000`) + opacity variants                          | Base muted ~8:1 (passes). But `text-muted/90`, `/80`, `placeholder:text-muted/90`, and tiny `text-[11px]/[13px]` overlines reduce effective contrast. | Borderline legibility for low-vision users on small secondary text.                   | Audit reduced-opacity + 11–13px muted text against 4.5:1 (or 3:1 for ≥18.66px bold).                                            | axe contrast scan on home/portfolio.                                      |
| A5  | P1       | No footer / discoverability (C6)                                                       | `/now` unlinked; `/engineering-principles` only via one CTA; no `contentinfo`.                                                                        | Screen-reader/keyboard users miss a conventional landmark; content is undiscoverable. | Add a footer landmark with secondary nav + contact/social/resume.                                                               | NVDA/VoiceOver landmark rotor shows banner/main/contentinfo.              |
| A6  | Pass     | Contact form                                                                           | Labels, hints, `aria-required`, `aria-invalid`, `role=alert`, live region.                                                                            | —                                                                                     | None.                                                                                                                           | Submit empty form; errors announced.                                      |
| A7  | Pass     | Viewport (`layout.tsx`)                                                                | `maximumScale: 5`, `userScalable: true`.                                                                                                              | Zoom allowed.                                                                         | None.                                                                                                                           | Pinch-zoom to 200%+.                                                      |
| A8  | Pass     | Mobile nav                                                                             | `inert` + `aria-expanded` + `aria-controls` + `aria-hidden`.                                                                                          | Correct hidden-state semantics.                                                       | None.                                                                                                                           | Keyboard-trap test on closed menu.                                        |

---

## Performance and metadata audit

- **Metadata consistency:** Strong and centralized. `app/layout.tsx` sets defaults from `data/site.ts`; per-route builders in `utils/metadata.ts` set title/description/canonical/OG/Twitter for portfolio, writing index, articles, principles, now. Titles use a `%s | Ali Pajand` template. **Consistent.** (Minor: home `<title>` is the 4-label tagline — long; consider a shorter role-led title.)
- **Social previews:** Default `opengraph-image.tsx` (name + tagline + metrics + avatar) and per-article OG images. `summary_large_image`. Twitter handle is `null` (gracefully omitted). **Good.** Note: OG metrics line uses `#666` on black (~3.6:1) — fine for an image, but low-key.
- **Structured data:** `Person` + `WebSite` + `ProfilePage` (`StructuredData.tsx`) and `Article` JSON-LD per post (`ArticleJsonLd`). `sameAs` wired to GitHub/LinkedIn. **Strong.** Gap: no explicit "seeking work" signal (e.g., `seeks`/availability) — optional.
- **Canonicals:** Per-route canonicals set; layout sets the site canonical. **Good.**
- **Sitemap/robots:** `sitemap.ts` includes home, writing, portfolio, principles, now + all posts; `robots.ts` allows all + sitemap + host. **Good.** (`/now` is in the sitemap but unlinked in UI — see C6.)
- **Performance risks:**
  - Whole-page client components: `HomePageContent` and `PortfolioPageContent` are `"use client"`, so entire pages hydrate. Most sections are static — they could be RSC with small client islands to cut hydration/JS. (P2)
  - GSAP + Lenis on every page adds JS and a smooth-scroll layer; acceptable but a CWV/INP consideration. (P2)
  - Hero LCP element (`hero-lcp`) starts at `opacity:0` (A3) — may delay/penalize LCP. (P2)
  - Images: only `icon.png` is shipped; no project imagery (the _cause_ of the abstract-evidence problem, but also means no image-weight risk). `next/image` is used with `sizes`/`fill` where images exist — correct.
- **Broken/confusing links:** None broken. Confusing: destination naming (C5); displayed email obfuscation `[AT]` (P3, `mailto` works).
- **Search discoverability:** Good (sitemap, canonicals, schema, semantic headings).
- **Resume discoverability:** **Absent** — no link, no file, no schema reference. (P0)

---

## Recommended implementation batches

### Batch 1 — Positioning & recruiter conversion (do first)

- **Objective:** Make target role unmistakable and unblock resume + availability.
- **Pages:** `/` (hero, contact), global metadata.
- **Components/data:** `data/site.ts` (`TAGLINE`, `RESUME_URL`, add role-eyebrow constant, availability line), `components/Hero/Hero.tsx`, `data/hiringFit.ts` (role strip), `StructuredData.tsx`/`utils/metadata.ts` (align `jobTitle`/title), `public/` (add resume).
- **Expected impact:** Highest — fixes both P0s and the primary positioning problem.
- **Risk:** Low; copy/asset + small JSX.
- **Dependencies:** Resume asset; decision on primary title.
- **Acceptance criteria:** Hero shows one primary role label; "Download resume" works; `<title>`, schema, and role strip lead with the same primary role; availability is explicit.
- **Screenshots required:** Home hero at 375/768/1280/1440.

### Batch 2 — Homepage information hierarchy

- **Objective:** Put evidence (case studies + companies) on the homepage; reduce founder/independent read.
- **Pages:** `/`.
- **Components/data:** `features/home/HomePageContent.tsx` (add case-study preview block; reconsider order so case studies precede or sit beside writing), `data/projects.ts` (reframe Founder label), `Testimonials`, `ProofStrip` (consider adding company names/metrics).
- **Expected impact:** High.
- **Risk:** Medium (ordering/visual balance).
- **Dependencies:** Batch 1 positioning.
- **Acceptance criteria:** A recruiter sees ≥2 case-study previews and ≥1 employment signal above the fold-to-mid; writing no longer outranks portfolio evidence.
- **Screenshots required:** Full homepage at 1280 + 375.

### Batch 3 — Portfolio & case-study evidence

- **Objective:** Make case studies visual and outcome-bearing.
- **Pages:** `/portfolio`, project cards.
- **Components/data:** `data/projects.ts` (`image`/`secondaryMedia`, surface one outcome each, ownership/employment context), `public/` (screenshots), `ProjectCard.tsx`.
- **Expected impact:** High.
- **Risk:** Low–medium (asset prep).
- **Dependencies:** Screenshots.
- **Acceptance criteria:** Each case study has ≥1 visual and ≥1 concrete outcome; ownership (solo vs. team, employment vs. independent) is explicit.
- **Screenshots required:** Each case-study card at 1280 + 375.

### Batch 4 — Navigation & contact flow

- **Objective:** Consistent naming + footer + discoverability.
- **Pages:** Global.
- **Components/data:** add a `Footer` component (contentinfo, contact/social/resume, Now/Principles links), `data/nav.ts`, `data/pageChrome.ts` (unify "Case studies"/"Portfolio"), end-of-page CTA on `/portfolio` and articles.
- **Expected impact:** Medium.
- **Risk:** Low.
- **Acceptance criteria:** One name per destination; footer landmark present sitewide; `/now` and `/engineering-principles` reachable from the footer.
- **Screenshots required:** Footer at 375/1280.

### Batch 5 — Responsive & accessibility corrections

- **Objective:** Close A1–A5.
- **Pages:** Global, hero.
- **Components/data:** add skip link in `app/layout.tsx`; gate hero bounce by reduced-motion (`useHero.ts`); provide hero no-JS fallback; contrast pass on muted/opacity text.
- **Expected impact:** Medium (quality/compliance).
- **Risk:** Low.
- **Acceptance criteria:** First tab focus = skip link; no looping motion under reduce-motion; hero visible with JS disabled; axe shows no contrast violations.
- **Screenshots required:** Focused skip link; reduce-motion hero.

### Batch 6 — Visual polish

- **Objective:** Minor refinement only.
- **Pages:** Home/portfolio.
- **Components/data:** proof strip emphasis, testimonial attribution styling, OG metrics contrast.
- **Expected impact:** Low.
- **Risk:** Low.
- **Acceptance criteria:** No regressions; subjective polish only.

### Batch 7 — Metadata & performance

- **Objective:** Trim hydration; tune LCP.
- **Pages:** `/`, `/portfolio`.
- **Components/data:** convert page shells to RSC with client islands where feasible; shorten home `<title>`; verify LCP after A3 fix.
- **Expected impact:** Medium (CWV/INP).
- **Risk:** Medium (refactor).
- **Acceptance criteria:** Lighthouse LCP/INP improve; no behavior change.
- **Screenshots required:** Lighthouse before/after.

---

## Changes NOT worth making

- Full visual redesign or theme change — the dark, restrained system is on-brand and credible.
- Adding heavy/experimental animation, 3D, scroll-jacking, or a hero showreel — contradicts the desired seniority/restraint and risks the "highly animated experimental" anti-pattern.
- Replacing GSAP/Lenis wholesale — not justified by current evidence.
- Building a CMS/blog engine — the Markdown + gray-matter setup is sufficient.
- Light-mode support — no hiring value for this audience now.
- Per-case-study dedicated routes — the single rich `/portfolio` page works; splitting adds nav complexity without clear benefit. (Re-evaluate only if visuals make the page too long.)
- Adding more role labels or keywords — the problem is _too many_, not too few.

---

## Final recommendation

**Implement immediately (P0 + primary positioning):** Batch 1 (role clarity, resume, availability) and the high-value parts of Batch 2 (case-study previews + de-risk founder framing). These directly move the needle on whether a hiring manager can, in one short visit, identify the target role, trust the seniority, find a resume, and see Ali as hireable rather than self-employed.

**Implement next:** Batch 3 (visual + outcome evidence), Batch 4 (footer, naming, discoverability), then Batch 5 (a11y/responsive corrections).

**Leave unchanged:** Design language, tokens, typography, spacing system, component architecture, metadata/schema infrastructure, form accessibility, and the case-study writing model. These are strengths.

**Verdict:** The site needs **focused refinement, not a redesign.** It is a strong engineering portfolio that currently argues "great engineer" more convincingly than "the senior frontend engineer you should hire right now." Closing the positioning, resume, and evidence-visibility gaps converts existing craft into hiring outcomes.
