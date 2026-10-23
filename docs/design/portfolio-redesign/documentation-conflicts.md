# Documentation conflicts

Audit date: 2026-10-23. Repository state: `6f43749` on `main` (worktree branch `ali/portfolio-audit-brief-5f0cd2`).

This file records where the repository's guidance documents disagree with the code, with each other, or with the new redesign goal (senior recruitment **and** Awwwards-level design and interaction quality). Nothing here has been applied. Each item ends with a proposed change for review.

Files reviewed: `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `README.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/SITE_STRUCTURE.md`, `docs/ROUTES.md`, `package.json`, `next.config.ts`.

---

## Summary

| ID    | Topic                                           | Kind                         | Severity |
| ----- | ----------------------------------------------- | ---------------------------- | -------- |
| DC-1  | Next.js version                                 | Stale fact                   | P2       |
| DC-2  | `/portfolio` content description                | Stale fact                   | P1       |
| DC-3  | Route list incomplete                           | Stale fact                   | P2       |
| DC-4  | Portfolio design constraints vs Awwwards        | Goal conflict                | P0       |
| DC-5  | Motion guidance                                 | Goal conflict + missing rule | P0       |
| DC-6  | Performance budget                              | Missing rule                 | P1       |
| DC-7  | Case-study hierarchy                            | Partial conflict             | P1       |
| DC-8  | Production approval rules                       | Inconsistent across files    | P1       |
| DC-9  | Content source descriptions                     | Stale fact                   | P2       |
| DC-10 | `.cursorrules` points at removed rules          | Stale fact                   | P3       |
| DC-11 | Positioning: "staff-level" copy vs Senior title | Content conflict             | P1       |
| DC-12 | README case-study table                         | Stale fact                   | P3       |

---

## DC-1 · Next.js version

**Verified:** `package.json` declares `"next": "^16.4.2"`; installed `node_modules/next/package.json` is `16.4.2`. React is `19.3.1`, Tailwind `4.3.3`, GSAP `3.15.0`, Lenis `1.3.26`.

**Conflicting text:**

- `AGENTS.md:5` and `AGENTS.md:13`: "Next.js 15 App Router".
- `.cursorrules:3` and `.cursorrules:8`: "Next.js 15 App Router".
- `docs/ARCHITECTURE.md:5`: "This is a Next.js 15 App Router website."
- `docs/ROUTES.md:3`: "All routes use the Next.js 15 App Router."
- `CLAUDE.md` says "Next.js App Router" without a version, which is correct.

**Proposed change:** replace "Next.js 15" with "Next.js 16" in all four files, or drop the major version and point at `package.json` as the source of truth (the approach `CLAUDE.md` already takes). Recommended: drop the version, so the docs stop going stale on every Dependabot bump.

## DC-2 · What `/portfolio` contains

**Verified:** `/portfolio` renders `PortfolioPageContent` (`features/portfolio/PortfolioPageContent.tsx`): breadcrumbs, H1, four intro paragraphs, profile links, role-fit strip, "What to look for" cards, and the case-study index. There is no about, experience, innovation, skills, or education section.

**Conflicting text:**

- `docs/SITE_STRUCTURE.md:4`: "`/portfolio` · Full depth: about, experience, case studies, innovation, skills, education."
- `docs/ROUTES.md:10`: "Full portfolio — about, experience, case studies, skills, education".
- `docs/ARCHITECTURE.md` lists `data/experience.ts`, `data/education.ts`, `howIThink.ts`, `innovation.ts`, and `data/posts/`. None of these files exist (`ls data/` checked).

**Why it matters:** any agent or contributor planning the redesign from these docs will design for sections that were removed. `CLAUDE.md` is the only file that describes the index correctly ("a clean index of case studies").

**Proposed change:** rewrite `SITE_STRUCTURE.md`'s `/portfolio` line as "Case-study index: positioning intro, profile links, reading guide, and links to seven dedicated case studies at `/portfolio/[slug]`." Update `ROUTES.md` to match and remove the non-existent data files from `ARCHITECTURE.md`.

## DC-3 · Route list incomplete

**Verified routes** (from `app/`): `/`, `/portfolio`, `/portfolio/[slug]` (7 static params), `/writing`, `/writing/[slug]`, `/open-source`, `/engineering-principles`, `/now`, `/feed.xml`, `/llms.txt`, `/llms-full.txt`, `/api/contact`, `/api/webhooks/resend`, plus redirects `/blog → /writing` and `/blog/:slug → /writing/:slug` in `next.config.ts`.

**Conflicting text:** `docs/ROUTES.md` omits `/portfolio/[slug]`, `/open-source`, `/feed.xml`, `/llms.txt`, `/llms-full.txt`, and the `/blog` redirects. Its "Slug stability" section only covers blog posts, while case-study slugs (`ledgerguard`, `alwaysgeeky`, …) are equally public and are already listed in `sitemap.ts`.

**Proposed change:** add the missing routes. Extend "Slug stability" to case-study slugs defined in `data/projects.ts` (`slug` field), and note that the sitemap and `CollectionPage` JSON-LD read from the same source.

## DC-4 · Portfolio design constraints vs the Awwwards goal (decision needed)

**Current guidance (CLAUDE.md):**

- "The `/portfolio` page should be a clean index of case studies, not a heavy visual gallery."
- "Do not require large images on the index page unless they add real clarity."
- "Avoid visual complexity on recruiter-facing index pages."
- "Avoid … Excessive animation."
- "Make screenshots/images optional support, not required for understanding the portfolio."

**New goal:** Awwwards-caliber design and interaction quality.

**Conflict:** These rules were written for a recruiter-only reading of the site, and they are good rules for that reader. Awwwards juries score Design, Usability, Creativity, and Content, and sites that win typically lead with a strong visual identity, considered typography, and purposeful motion. Read literally, the current rules would block most of that on the one page where project work is presented.

The two goals are not actually opposed. What the rules protect is **scan speed and comprehension without media**. A redesign can keep that while raising craft: typography, layout rhythm, a distinct visual identity, and a small number of high-quality interactions. What the rules do rule out is a media-first gallery where understanding depends on images or motion.

**Proposed change (not applied):** replace the five bullets with an explicit two-layer rule:

> The `/portfolio` index must remain fully understandable as text: every project's name, role, timeframe, one-line problem, and case-study link must be readable without images, motion, or JavaScript. On top of that baseline, the page may use expressive typography, layout, imagery, and motion, provided each one passes the motion and performance budgets below and none of it delays the first readable content.

This needs Ali's sign-off because it changes the public design direction.

## DC-5 · Motion guidance

**Current guidance:**

- `CLAUDE.md`: "Avoid … Excessive animation"; "reduced-motion behavior where applicable".
- `AGENTS.md` / `.cursorrules`: list GSAP + Lenis as the animation stack; no rules on when to use them.
- `CHANGELOG.md` (Unreleased): "Cinematic motion layer … word-splitting text reveals, viewport-progress card parallax".

**Conflicts:**

1. The code already ships a "cinematic" layer (header blur and scale-in, word-split title reveal, scroll-triggered opacity reveals on every `[data-reveal]` element, parallax cards, Lenis smooth scroll). `CLAUDE.md` says to avoid excessive animation but gives no definition, so the shipped motion cannot be checked against it.
2. "Reduced-motion behavior where applicable" is weaker than what the code actually does, which is to skip motion fully when `prefers-reduced-motion: reduce` is set at mount time. The rule should match the implementation.
3. Nothing says content must be readable before motion runs. In the code, `cinematicReveal` sets `opacity: 0` on content and only reveals it on intersection (`utils/cinematic.ts:142`). See finding F-03 in `findings-and-issue-register.md` for the live result.

**Proposed change (not applied):** add a "Motion" section to `CLAUDE.md`:

> - Motion must never gate reading. Content is visible in server HTML and stays visible if JavaScript, IntersectionObserver, or GSAP fails.
> - Entrance motion is limited to transform and opacity, ≤ 600 ms per element, and no more than one staggered sequence in view at a time.
> - `prefers-reduced-motion: reduce` removes all non-essential motion, including smooth scrolling, parallax, and word splitting. Changes to the preference while the page is open must be respected.
> - Scroll-linked effects must not hijack native scrolling, keyboard scrolling, or in-page anchor navigation.
> - Every motion pattern gets a named owner in `utils/motion.ts` / `utils/cinematic.ts`, so no component invents its own timing.

## DC-6 · Performance budget

**Current guidance:** none in `CLAUDE.md`, `AGENTS.md`, or `docs/`. `AGENTS.md` only asks for approval for "new npm dependencies with significant bundle cost".

**Why it matters for the new goal:** Awwwards-style work raises media and script weight. Without a written budget, there is no gate. Live measurements are in `baseline-audit.md`.

**Proposed change (not applied):** add a budget section to `CLAUDE.md`, measured on mobile emulation against production:

> - LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (field, p75, from Vercel Speed Insights where available).
> - Lighthouse mobile Performance ≥ 90 and Accessibility = 100 on `/portfolio` and every case study.
> - Index page: no image above the fold may be larger than its rendered size × 2 DPR; total image transfer on first load ≤ 300 KB.
> - Source screenshots committed to `public/` must be ≤ 1 MB each (AVIF/WebP preferred, PNG only for exceptions).

The numbers are proposals; Ali should confirm them.

## DC-7 · Case-study hierarchy

**Current guidance:** `CLAUDE.md` "Priority case studies": LedgerGuard, AlwaysGeeky Games, Emplifi, Agent Tooling / Open Source, TallyFolio, ControlTech, MapBylaw ("if relevant and strong enough").

**Verified implementation:** `PORTFOLIO_CASE_STUDY_ORDER` in `data/projects.ts:104` uses exactly that order, and every project has `hasDedicatedCaseStudy: true`, so the "Additional experience" section in `ProjectIndex.tsx` never renders.

**Conflicts:**

1. The order matches, but the guidance treats all seven as equals. The index renders all seven at the same visual weight, so the order is the only signal of priority. For a redesign, the hierarchy needs tiers, not just a sequence (see `content-and-evidence-inventory.md`).
2. "MapBylaw, if relevant and strong enough" leaves the decision open, while the code ships it as a full case study.
3. `PORTFOLIO_PAGE_INTRO` says "The case studies below are ordered by how much they show" and names only the top three, which already implies tiers the page does not show.

**Proposed change (not applied):** replace the flat list with tiers, e.g. _Featured_ (LedgerGuard, AlwaysGeeky, Emplifi), _Supporting_ (Agent tooling, TallyFolio, ControlTech), _Experiments_ (MapBylaw). Ali needs to confirm the tier for MapBylaw and Agent tooling.

## DC-8 · Production approval rules

**Current guidance, per file:**

| Rule                                     | CLAUDE.md                                                                           | AGENTS.md                           | .cursorrules      |
| ---------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------- | ----------------- |
| Public slugs/URLs need approval          | Implied ("do not silently change … links")                                          | Yes                                 | Yes               |
| `app/api/contact` needs approval         | No                                                                                  | Yes                                 | Yes               |
| `app/api/webhooks/resend` needs approval | No                                                                                  | No (the route was added later)      | No                |
| Env vars / Vercel config need approval   | No                                                                                  | Yes                                 | Yes               |
| a11y landmarks / focus order / `aria-*`  | "Preserve accessibility"                                                            | Approval required                   | Approval required |
| Heavy dependencies                       | "No new packages without a clear reason"                                            | Approval if significant bundle cost | Same              |
| Merge / deploy                           | Not stated                                                                          | Not stated                          | Not stated        |
| Branching                                | "Work on `main` unless told otherwise. Branch off `main` for anything non-trivial." | Not stated                          | Not stated        |

**Conflicts:**

1. The three files disagree on what needs approval. An agent reading only `CLAUDE.md` would not know `app/api/contact` is protected.
2. The webhook route (`app/api/webhooks/resend`, added in #213) sends production mail but is not on any protected list.
3. No file says that merging or deploying requires approval. The redesign brief requires it.
4. `CLAUDE.md`'s branch rule is self-contradictory ("work on `main`" and "branch off `main` for anything non-trivial").
5. A redesign will need to change focus order and `aria-*` wiring by design. "Approval required" is right, but there is no description of what reviewers check.

**Proposed change (not applied):** make `AGENTS.md` the single source for approval rules and have `CLAUDE.md` and `.cursorrules` link to it. Add: the Resend webhook route; "no merge or production deploy without Ali's explicit approval"; and for redesign PRs, a checklist (keyboard walk, reduced-motion walk, Lighthouse run, screenshot diff at 390/768/1440). Change the branch rule to "Never commit directly to `main`; branch for every change."

## DC-9 · Content source descriptions

- `AGENTS.md` and `docs/ARCHITECTURE.md` say posts use "gray-matter frontmatter". `utils/posts.ts:5` parses frontmatter with `js-yaml`; `gray-matter` is not a dependency.
- `README.md`: "Markdown-driven writing and case studies". Case studies are TypeScript objects in `data/projects.ts`, not Markdown.
- `.cursorrules` rule 6: "design tokens from Tailwind config". There is no `tailwind.config.*`; tokens live in `app/globals.css` (`:root` and `@theme inline`).

**Proposed change:** correct each statement. These matter for the redesign because case-study content is the main thing a new design will consume.

## DC-10 · `.cursorrules` points at removed rules

`.cursorrules:4`: "Detailed rules live in `.cursor/rules/`." `CHANGELOG.md` (Unreleased → Removed) says `.cursor/rules` was removed, and the directory does not exist. **Proposed change:** remove the sentence or point to `AGENTS.md`.

## DC-11 · Positioning: "staff-level" copy vs Senior title

**Verified:**

- `CLAUDE.md` positioning: "Senior Software Engineer · Frontend architecture, design systems, and full-stack product work".
- Commit `ba8081b` (#212) updated the professional title to Senior Software Engineer.
- `data/projects.ts:84` (live `/portfolio` intro, second paragraph): "The staff-level part is leverage, not a title: my roles were Senior…". This line came from commits `961d424` / `402de90` ("Staff Frontend Engineer positioning", "staff-level framing").
- `data/portfolioFit.ts` role-fit strip includes "Technical direction", "Cross-team standards", and "Mentoring".

**Conflict:** the portfolio intro still argues a staff-level case that the rest of the site moved away from. This is a positioning decision, not a doc fix, so it is recorded here rather than resolved. **Ask Ali:** keep, soften, or remove the staff-level paragraph.

## DC-12 · README case-study table

`README.md` lists six case studies; MapBylaw has a live dedicated case study at `/portfolio/mapbylaw` but is missing from the table. **Proposed change:** add it, or leave it out deliberately if it moves to an "experiments" tier (DC-7).
