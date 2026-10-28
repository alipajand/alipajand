# Code-quality audit, 2026-10-28

Scope: `main` as a whole after PRs #266–#288. I started at 97651be and re-checked each finding on
5be60e1 before writing it up. The audit covers:

- dead code
- redundant components
- client-component boundaries
- listener, frame and observer leaks
- SEO metadata
- professional claims
- screenshot labels
- stale documentation
- outdated tests
- security regressions

Earlier cleanup PRs (#255, #258, #263) were not redone.

Every removal below was checked against dynamic imports and string references in `app/`,
`components/`, `features/`, `utils/`, `data/`, `e2e/`, `scripts/`, `docs/`, the design kit
(`docs/design/kit/build.mjs`, which imports `data/*.ts` at run time) and the `.mjs`/`.cjs` files.
Every removal was also checked with a rendered-output diff between two production builds served on
:3526. The diff covered all 29 sitemap URLs plus the 404, `sitemap.xml`, `robots.txt`, `feed.xml`,
`llms.txt` and `llms-full.txt`. HTML was compared after stripping hashed `/_next/static` paths and
the RSC payload.

## Summary

| ID        | Area        | Sev   | Finding                                                                                              | Disposition                     |
| --------- | ----------- | ----- | ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| CQ-01     | Dead code   | P3    | `components/diagrams/` imported only by its own specs                                                | Fixed, #292 (merged)            |
| CQ-02     | Dead code   | P3    | Homepage case-study `image`/`illustrative*` data never rendered                                      | Fixed, #294 (merged)            |
| CQ-03     | Dead code   | P3    | `components/Breadcrumbs`, `components/TableOfContents` imported only by their specs                  | Fixed, #297 (merged)            |
| CQ-04     | Dead code   | P3    | `components/Testimonials` and `data/testimonials.ts` not rendered on any page                        | Proposal (content decision)     |
| CQ-05     | Dead code   | P3    | `SCROLL_TARGET_OFFSET`, `scrollToElement` in `utils/scrollToTop.ts` only used by its spec after #297 | Follow-up for the history track |
| CQ-06     | Dead code   | P3    | 17 value exports and 25 type exports used only inside their own module                               | Optional; no PR                 |
| CQ-07     | Dead code   | —     | knip false positives (CSS `composes`, design kit, e2e helpers, `geist` read by path)                 | Documented; keep                |
| CQ-CFG-01 | Config      | P3    | `package.json` `overrides` ignored by pnpm, duplicates `pnpm-workspace.yaml`                         | Fixed, #300 (draft)             |
| CQ-CFG-02 | Config      | P3    | Jest maps `^lib/` to a directory that does not exist                                                 | Fixed, #300 (draft)             |
| CQ-CFG-03 | Config      | P3    | `@asamuzakjp/css-color` is a direct devDependency nothing imports                                    | Question for the owner          |
| CQ-R1     | Redundancy  | P3    | Old and hairline diagram components side by side                                                     | Resolved by CQ-01               |
| CQ-R2     | Redundancy  | P3    | Three breadcrumb components with drifting styles                                                     | Proposal (design)               |
| CQ-R3     | Redundancy  | P3    | Two identical `escapeHtml` helpers in the API routes                                                 | Proposal                        |
| CQ-C1     | Client      | —     | No client root that should be a server component; data copy stays out of client chunks               | No action                       |
| CQ-L1     | Leaks       | —     | 20 client navigations: listener, observer, interval and rAF counts cycle per route; DOM plateaus     | No action                       |
| CQ-SEO-01 | SEO         | P3    | `/now` `<title>` used `\|`, its OG/Twitter/JSON-LD used `·`                                          | Fixed, #296 (merged)            |
| CQ-SEO-02 | SEO         | P2    | 404 `twitter:title`/`description` were the homepage's                                                | Fixed, #296 (merged)            |
| CQ-SEO-03 | SEO         | P3    | 12 sitemap `lastmod` values are the build clock                                                      | Proposal                        |
| CQ-SEO-04 | SEO / IA    | P3    | `/now` has no inbound link from any page                                                             | Proposal (IA)                   |
| CQ-SEO-05 | SEO         | P3    | Title separators mix `—`, `·` and `\|` across routes                                                 | Proposal (brand)                |
| CQ-SEO-06 | SEO         | P3    | 19 of 29 meta descriptions exceed 160 characters                                                     | Proposal (copy)                 |
| CQ-SEO-07 | SEO         | P3    | `/engineering-principles` has no page-level JSON-LD node                                             | Proposal                        |
| CL-1–CL-8 | Claims      | P1–P3 | See [Claims](#professional-claims)                                                                   | Proposals (owner decides)       |
| SS-1–SS-8 | Screenshots | P2–P3 | See [Screenshots](#screenshot-labels)                                                                | Proposals                       |
| CQ-DOC-01 | Docs        | P2    | `docs/*.md` describe the Next.js 15 site: missing routes, missing data files, wrong env var          | Fixed, #298 (draft)             |
| CQ-T1     | Tests       | P3    | Specs kept dead components alive (diagrams, TOC, Breadcrumbs)                                        | Fixed with CQ-01, CQ-03         |
| CQ-T2     | Tests       | P3    | Portfolio specs asserted on unrendered homepage image copy                                           | Fixed, #294                     |
| CQ-T3     | Tests       | P3    | Stale comment in `e2e/motion.e2e.ts` about 404 header links                                          | Fixed, #298 (draft)             |
| CQ-T4     | Tests       | —     | No `skip`/`only`/`fixme`/`todo`; `KNOWN_FINDINGS` is empty                                           | No action                       |
| CQ-SEC-01 | Security    | —     | Headers present on pages and API; CSP has no `script-src` (known, SEC-01 remaining risk)             | No regression                   |
| CQ-SEC-02 | Security    | P3    | Contact: malformed or `null` JSON answered 500                                                       | Fixed, #295 (merged)            |
| CQ-SEC-03 | Security    | P3    | Webhook reads the whole body before verifying it                                                     | Proposal                        |
| CQ-SEC-04 | Security    | P3    | Sanitiser allows `http:` image sources                                                               | Proposal                        |
| CQ-SEC-05 | Security    | —     | 9 `dangerouslySetInnerHTML` uses, all escaped JSON-LD or build-time sanitised HTML                   | No action                       |

## Dead code

**Method.** I ran `pnpm dlx knip@5 --reporter compact` on 97651be and again on 5be60e1. knip treats
specs as entry points, so it can't see a module that only its own spec imports. To catch those, I
counted non-test importers for every folder under `components/` and `components/hairline/`.

- **CQ-01 (fixed in #292).** `components/diagrams/` (PostDiagram, FlowDiagram, LayersDiagram,
  CompareDiagram, McpWorkflowDiagram, DiagramFigure) had zero non-test importers. It was orphaned
  in be200fd (#243), when articles moved to `features/writing/WritingPostDiagram` and the hairline
  diagrams. Six `data/writing.ts` strings only it read went with it. Rendered output was identical
  apart from the build-clock `lastmod`.
- **CQ-02 (fixed in #294).** `HomepageCaseStudy.image`, `illustrativeLabel` and `illustrativeBody`
  were read only by `ProjectCaseStudyPageContent.spec.tsx`. `HomeSelectedWork.tsx` renders the label,
  title, summary, supporting line and tags. The homepage HTML was byte-identical after removal.
- **CQ-03 (fixed in #297).** `components/Breadcrumbs` and `components/TableOfContents` (plus
  `useActiveHeading` and `WRITING_TOC_HEADING`) were replaced by the per-feature `*Crumbs` and
  `WritingPostToc` in the hairline rebuilds (973c3c7, 5883ec6, be200fd). Output was identical.
- **CQ-04 (proposal).** `components/Testimonials/*` and `data/testimonials.ts` have no importer
  outside their specs. `data/testimonials.ts:14` itself says the quotes have "not been personally
  re-confirmed".
  - Removing them is a content decision, so it is left to the owner.
  - Options: (a) delete the component, its specs and the data; (b) keep the data as a source for
    a future page and delete only the component.
  - CL-6 below depends on this source.
- **CQ-05 (follow-up for the history track).** After #297, `SCROLL_TARGET_OFFSET` and
  `scrollToElement` in `utils/scrollToTop.ts` are used only by `utils/__tests__/scrollToTop.spec.ts`.
  Scroll utilities belong to the history track, so they were not touched here.
- **CQ-06 (optional).** knip lists 17 value exports and 25 type exports that are used only inside
  their own module. Examples:
  - `SITE_MENU_QUERY`
  - the seven `BREADCRUMB_*_LABEL` constants
  - `CASE_STUDY_DISPLAY`
  - `REDUCED_MOTION_QUERY`, `prefersReducedMotion`, `subscribeReducedMotion`
  - `suppressedFiguresFor`
  - `CALENDAR_PITCH`, `CALENDAR_LEFT`, `CALENDAR_TOP`, `dayOfSnapshot`
  - `topicKey`, `rulerTickHeight`

  None of these is dead; only the `export` keyword is unneeded. Dropping it changes no output.
  It's worth doing only if the owner wants knip in CI. Otherwise it is churn.

- **CQ-07 (keep).** These knip "unused files and dependencies" are false positives:
  - `components/hairline/styles/type.module.css`: used through CSS `composes` in 52 CSS modules.
  - `e2e/fixed-clock.cjs`: loaded by `playwright.config.ts` via `--require`.
  - `e2e/responsive-sheet.mjs`: documented CLI in `docs/audits/evidence/responsive/README.md`.
  - `docs/design/kit/*` and `docs/design/implementation-audit/scripts/capture.mjs`: run by hand,
    documented in `docs/design/README.md`.
  - `geist`: `utils/profileImage.tsx:15` reads its font file by path.
  - `jest-config`: added in 627aa7a for the TypeScript Jest config.

  If knip is adopted, these belong in a `knip.json` `ignore`/`entry` list.

## Configuration

- **CQ-CFG-01 (fixed in #300).** pnpm 12.3.4 ignores the npm-style `overrides` block in
  `package.json`:
  - Conflicting values there still pass `pnpm install --frozen-lockfile`.
  - The same change in `pnpm-workspace.yaml` fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`.
  - `docs/design/implementation-audit/08-architecture-plan.md:218` raised this first.
- **CQ-CFG-02 (fixed in #300).** `jest.config.ts` had `"^lib/(.*)$": "<rootDir>/lib/$1"`. There is
  no `lib/` directory and nothing imports from it.
- **CQ-CFG-03 (question).** `@asamuzakjp/css-color` is a direct devDependency. Nothing imports it,
  and its history (fd8e254, "update packages") gives no reason.
  - If it pins a transitive version for jsdom, it belongs in `pnpm-workspace.yaml` `overrides`.
  - If it pins nothing, it can go.
  - Acceptance: one of the two, with `pnpm-lock.yaml` unchanged or the change explained.

## Redundant components

- **CQ-R2 (proposal, design).** Three breadcrumb implementations render the same `<nav
aria-label="Breadcrumb"><ol>` pattern with different CSS:
  - `features/portfolio/CaseStudyCrumbs`
  - `features/writing/WritingPostCrumbs`
  - `features/now/NowBreadcrumbs`

  The differences: wrap vs `nowrap`, the type composed from `type.module.css` vs inline font
  rules, and separator spacing. One `components/hairline/Crumbs` with a `variant` would remove
  about 100 lines. It changes pixels on three routes, so it needs a design decision and new visual
  baselines.

- **CQ-R3 (proposal).** `escapeHtml` is defined identically in `app/api/contact/route.ts:14` and
  `app/api/webhooks/resend/route.ts:48`. One helper in `utils/` keeps the two email bodies escaped
  the same way.
  - Acceptance: one definition, both route specs unchanged and passing.

## Client-component boundaries

**CQ-C1 (no action).** There are 43 `"use client"` modules on 97651be, 39 after the removals. Each
one is one of:

- a form: Contact
- a navigation or focus helper: SiteNavigation, RouteChangeFocus, SkipLink, NotFoundMainFocus
- a dialog: ScreenshotFrame
- a filter or contents list: WritingPostFilters, WritingPostToc
- a `useMotion` canvas or scroll island

Pages, sections and the shell are server components.

Client modules import 13 `data/` modules for labels. To rule out the copy riding along, I searched
the built `.next/static` for distinctive strings:

- the engineering-principles meta description
- the homepage hero body
- the portfolio intro
- the writing index description
- the 404 description
- the LedgerGuard card label

None appear in any client chunk, so tree-shaking keeps the data copy on the server. No island was
found whose interactivity could be pushed further down.

## Event-listener, rAF, observer and animation leaks

**CQ-L1 (no action).**

**Method.** [`evidence/cleanup/nav-leak-probe.mjs`](evidence/cleanup/nav-leak-probe.mjs) runs against
`next start -p 3526` on 97651be. It loads `/`, then makes 20 client-side route changes through header,
footer or in-page links:

`/portfolio → /writing → /open-source → /engineering-principles → /now → /` (repeated)

Nothing links to `/now` (see CQ-SEO-04), so the probe reaches it with `router.push`. After each
step it scrolls 1200px down and back, then records:

- `add`/`removeEventListener` on `window`, `document` and every `MediaQueryList`
- live `IntersectionObserver`, `ResizeObserver` and `MutationObserver` instances
- pending `setInterval` timers
- pending `requestAnimationFrame` callbacks
- in Chromium, DOM nodes and JS event listeners after two forced GCs (CDP `Memory.getDOMCounters`)

**Results** (raw rows in [`evidence/cleanup/nav-leak-probe.txt`](evidence/cleanup/nav-leak-probe.txt)):

| Route (each visit, Chromium and WebKit) | Global listeners | IO  | RO  | Intervals | Pending rAF |
| --------------------------------------- | ---------------- | --- | --- | --------- | ----------- |
| `/portfolio`                            | 183              | 8   | 5   | 0         | 1           |
| `/writing`                              | 174              | 5   | 3   | 0         | 1           |
| `/open-source`                          | 186              | 9   | 4   | 0         | 1           |
| `/engineering-principles`               | 177              | 6   | 4   | 0         | 1           |
| `/now`                                  | 174              | 5   | 3   | 0         | 1           |
| `/`                                     | 180              | 7   | 4   | 0         | 1           |

- The counts are identical on every visit to a route, in both engines.
- In Chromium after GC, DOM nodes and listeners settle from the second cycle on. For example,
  `/writing` was 729/416 on the first visit and 737/423 on every later visit.
- No step did a hard reload, and there were no page errors.
- A 12-step Chromium re-run of the committed script on 5be60e1 gave the same counts.
- The one pending rAF is the shared scheduler's next frame while an idle loop is on screen. It is
  freed when the island leaves (see `e2e/motion.e2e.ts` and the T4 probe from #291).

This complements, rather than repeats, the per-route listener checks in `e2e/motion.e2e.ts`. Those
cover two rounds per route for five event types. This probe covers 20 changes across all event
types, `MediaQueryList`s and `ResizeObserver`s.

## SEO metadata

**Method.** I fetched every sitemap URL and the 404 from a production build. For each route I
extracted:

- `<title>` and the meta description
- canonical
- robots
- `og:*` and `twitter:*`
- the JSON-LD nodes
- the first `<h1>`

**Findings:**

- **Sitemap and routes.** All 29 indexable routes are in the sitemap, and nothing else is. The 404
  is `noindex, follow`.
- **Canonicals.** Every canonical and `og:url` matches the route.
- **JSON-LD.** Article `headline` matches the visible `<h1>` on all 16 posts. Case studies use
  "`<Name>` Case Study" against an `<h1>` of `<Name>`, which is fine.
- **CQ-SEO-01, CQ-SEO-02 (fixed in #296).** `/now` now has one title everywhere. The 404 no longer
  borrows the homepage's Twitter title and description.
- **CQ-SEO-03 (proposal).** `app/sitemap.ts` sets `lastModified: new Date()` for five index pages
  and seven case studies, so their `lastmod` changes on every deploy whether or not the content
  did.
  - Two builds of identical content differ only in these 12 lines, as every removal diff above
    shows.
  - Crawlers learn to ignore a `lastmod` that always moves.
  - Proposal: a hand-set date per page, like `NOW_UPDATED` (#275), or omit `lastmod` for those
    entries.
  - Acceptance: two builds of the same commit produce a byte-identical `sitemap.xml`.
- **CQ-SEO-04 (proposal, IA).** No page links to `/now`. The header has Portfolio, Open Source,
  Writing, Principles and Contact, and the footer has contact channels. It is reachable only from
  the sitemap or by URL.
  - Proposal: add it to the footer, or link it from the homepage about section.
  - Acceptance: at least one crawlable `<a href="/now">` on a page linked from `/`.
- **CQ-SEO-05 (proposal, brand).** Title separators vary:
  - `—` on writing and principles
  - `·` on case studies and `/now`
  - `|` in the layout template, the 404 and `ProfilePage.name`

  Pick one, and the change is mechanical.

- **CQ-SEO-06 (proposal, copy).** 19 of 29 meta descriptions run past about 160 characters. The
  longest are:
  - `/writing/designing-a-small-library-for-logs-too-big-to-hold`: 255
  - `/portfolio/mapbylaw`: 254
  - `/writing/ci-tools-for-untrusted-pull-requests`: 233
  - `/engineering-principles`: 224
  - `/portfolio/alwaysgeeky`: 221
  - `/`: 213

  Search results truncate them. Rewriting is copy work for the owner.

- **CQ-SEO-07 (proposal).** `/engineering-principles` emits only `WebSite` and `BreadcrumbList`.
  `/writing`, `/portfolio` and `/open-source` add a `CollectionPage`, and `/now` adds a `WebPage`.
  A `WebPage` node using the existing description would make it consistent.
- **Intentional difference, no action.** The homepage `og:description`
  (`HOME_OPEN_GRAPH_DESCRIPTION`) is shorter than its meta description. That is a separate
  constant on purpose.

## Professional claims

Checked against CLAUDE.md "Public facts". These are flags only; the wording is the owner's call.
Name, location, site, title, `jobTitle` and `addressLocality` are consistent everywhere. There are
no team sizes, revenue, customers or management claims. `toPublicProject` covers every surface
derived from `Project`, including llms, JSON-LD and the feed.

| ID   | Sev | Where                                                                                      | Evidence                                                                   | Problem                                                                                                                   | Proposed wording                                                                                                                                                  |
| ---- | --- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CL-1 | P1  | `README.md:25`                                                                             | "including an 80% cut in unnecessary re-renders"                           | The figure `SUPPRESSED_CLAIMS` withholds is published in the public README; the suppression only covers `Project` objects | "D3.js enterprise analytics, with rendering work profiled on the embedded mobile webview path"; add a test scanning README and `data/*.ts` for suppressed figures |
| CL-2 | P2  | `docs/design/pages/case-emplifi.html:560`                                                  | `caseStudyMetaDescription` with "80% reduction"                            | `docs/design/kit/build.mjs` serialises raw `PROJECTS`, so the figure is in the published kit page source                  | Serialise `toPublicProject(project)` in `build.mjs` and rebuild                                                                                                   |
| CL-3 | P2  | `data/site.ts:34,45`, `data/homepage.ts:24`, `README.md:5`                                 | "9+ years in React, TypeScript, and Next.js"                               | The public fact is "9+ years" with no stack attached; Next.js narrows it                                                  | "9+ years of production web work, mostly in React, TypeScript, and Next.js" (matches `data/projects.ts:86`)                                                       |
| CL-4 | P2  | `data/site.ts:22`                                                                          | `"Lead Frontend Engineer"` in `KEYWORDS`                                   | Not a held title; `KEYWORDS` feeds `Person.knowsAbout` and the llms.txt "Focus areas"                                     | Remove job titles from `KEYWORDS`, or keep a separate SEO-only list                                                                                               |
| CL-5 | P2  | `data/projects.ts:87`                                                                      | "The staff-level part is leverage, not a title"                            | Claims a level above the public positioning                                                                               | "The leverage is specific, and my roles were Senior: …"                                                                                                           |
| CL-6 | P2  | `data/projects.ts:837`                                                                     | "documentation that colleagues credited with helping the team ship faster" | Only source is an unrendered testimonial marked not re-confirmed (CQ-04)                                                  | "Left behind reusable accessible components and usage documentation the dashboard modules were built from."                                                       |
| CL-7 | P3  | `data/homepage.ts:24`, `data/site.ts:52`, `data/portfolioFit.ts:8`, `data/projects.ts:586` | "adopted across teams", "cross-team standards"                             | No team count in the repo; the same case study says "a small frontend team" (`projects.ts:610`)                           | "adopted across the four product surfaces"; "shared standards"; "with the engineers building the four surfaces"                                                   |
| CL-8 | P3  | `data/portfolioFit.ts:34`                                                                  | "migration paths with deprecation instead of abrupt removal"               | No case study describes deprecation work                                                                                  | "…plus the part that makes them stick: design docs and working directly with the engineers adopting them."                                                        |

## Screenshot labels

I viewed every image and compared it with its alt text, caption and provenance tag.

| ID   | Sev | Image (`data/projects.ts`)                     | Problem                                                                                                                                                                                                                                         | Proposal                                                                                                                                                                                                                                                               |
| ---- | --- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SS-1 | P2  | `tallyfolio-dashboard.png` (439–440)           | Tagged "Sample data", but nothing in the image says so (the landing image has a "Sample workspace" badge), and no seed is in the repo. DEC-2/C-06 in `docs/design/implementation-audit/09-risk-register.md` are still pending                   | Owner confirms and closes DEC-2, or recaptures from a seeded account with a visible sample label                                                                                                                                                                       |
| SS-2 | P2  | `mapbylaw-landing.png` (1318–1321)             | Alt says "exploration product experiment". Caption says "not as an official or exhaustive database". The image shows "Montreal development intelligence for acquisition and feasibility decisions", "Official City data" and "Professional use" | Alt: "MapBylaw landing page: a Montreal map with an address search and the headline 'Montreal development intelligence for acquisition and feasibility decisions'." Caption: describe the map and address search; keep the "experiment" framing in the case-study body |
| SS-3 | P3  | `ledgerguard-dashboard-redacted.png` (225–228) | Rows name Salesforce, Shopify and BP with fixture-like file names; readers may take them for real customer contracts                                                                                                                            | If confirmed, add "contract rows are test documents" to the caption                                                                                                                                                                                                    |
| SS-4 | P3  | `ledgerguard-login.png` (213)                  | Alt says "tenant-aware contract workflows"; the image is a magic-link email form                                                                                                                                                                | "LedgerGuard sign-in card asking for a work email to receive a one-time sign-in link."                                                                                                                                                                                 |
| SS-5 | P3  | `ledgerguard-landing.png` (201)                | Alt says "AI-assisted contract intelligence"; the page never mentions AI                                                                                                                                                                        | "LedgerGuard landing page with the headline 'You don't lose money when you sign. You lose it when it renews.' and an example renewal-risk card."                                                                                                                       |
| SS-6 | P3  | `alwaysgeeky-marketplace.png` (638–641)        | Alt claims "shared design-system components", caption "catalog browsing"; the image is the hero with one listed item                                                                                                                            | "Voxies Marketplace home page: a voxel town illustration with Shop, Tavern, Rentals and Forge navigation and a 'Recently listed' item card."                                                                                                                           |
| SS-7 | P3  | `alwaysgeeky-login.png` (651–654)              | Alt and caption mention recovery states; only sign-in is shown                                                                                                                                                                                  | "AlwaysGeeky Games sign-in form with email and password fields, remember-me, and forgot-password and sign-up links."                                                                                                                                                   |
| SS-8 | P3  | `tallyfolio-landing.png` (428)                 | Alt "TallyFolio landing page" is too thin                                                                                                                                                                                                       | "TallyFolio landing page with the headline 'Your money, tracked privately.' beside an overview card marked Sample workspace."                                                                                                                                          |

These are clean:

- `mapbylaw-dashboard-redacted.png` and the LedgerGuard dashboard alt text
- `data-flow.png`
- the Agent Readiness Doctor poster

Declared image dimensions and `trimTop` values match the files. The unredacted originals are no
longer in `public/` (#250, #276).

## Stale documentation

**CQ-DOC-01 (fixed in #298).** `ROUTES.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `API.md`,
`MIGRATIONS.md` and `SITE_STRUCTURE.md` described the pre-hairline Next.js 15 site:

- nonexistent data files (`experience.ts`, `education.ts`, `howIThink.ts`, `innovation.ts`,
  `data/posts/`)
- `content/*.md` parsed with gray-matter
- `CONTACT_TO_EMAIL`, while the code reads `CONTACT_EMAIL` and `RESEND_FROM`
- a contact `200` body of `{ ok: true }`, and no 413/415/503
- no `/open-source`, `/portfolio/[slug]`, feed, llms or profile-image routes
- "all other pages are statically generated", while `/` and `/writing` are `force-dynamic`

#298 has the full table with code references.

Dated audits are records, not specs, so they were left as written. `docs/audits/security-privacy.md:43`
mentions a "GA snippet" (GA was removed in #258), and `docs/design/implementation-audit/`
references removed component paths.

## Tests

- **CQ-T1, CQ-T2 (fixed).** Specs that only exercised dead code, or asserted on unrendered copy,
  went with the code in #292, #294 and #297.
- **CQ-T3 (fixed in #298).** `e2e/motion.e2e.ts` said the 404's header links "do not navigate
  client-side". #254 fixed that. The probe above navigated client-side from the 404 header, and
  `remaining-pages.e2e.ts` covers it under "not-found header navigation".
- **CQ-T4 (no action).** There is no `.skip`, `.only`, `.fixme` or `.todo` in unit or e2e specs,
  and `e2e/a11y.e2e.ts` `KNOWN_FINDINGS` is `[]` (#290). Testimonials specs remain until CQ-04 is
  decided.

## Security

- **CQ-SEC-01 (no regression).**
  - `curl -I` on `/`, a page and `/api/contact` returns the five headers from
    `next.config.ts` and no `X-Powered-By`.
  - The CSP still sets only `frame-ancestors`, `base-uri`, `form-action` and `object-src`. The
    missing `script-src` is the known remaining risk in `docs/audits/security-privacy.md` (SEC-01),
    and needs a decision on nonces vs static rendering.
- **CQ-SEC-02 (fixed in #295).** The contact route answered `500 Failed to send message` to
  malformed JSON, an empty body or `null`. It now answers `400 Invalid request body`.
  - The 64 KB cap, the 415 content-type check and the field limits are unchanged and match the
    client (`route.parity.spec.ts`).
- **CQ-SEC-03 (proposal).** `app/api/webhooks/resend/route.ts:146` reads `request.text()` with no
  cap before verifying the signature. The platform's request-body limit bounds it, but an
  unauthenticated sender can still make the function buffer megabytes.
  - Resend events are small, because the email body is fetched separately with
    `emails.receiving.get`.
  - Proposal: `readLimitedText(request, 256 * 1024)` with a `413`, the same pattern as the
    contact route.
  - Acceptance: a 1 MB unsigned body gets 413 without calling `webhooks.verify`, and existing
    webhook specs pass.
- **CQ-SEC-04 (proposal).** The post sanitiser has had one commit since #256, so the allowlist
  hasn't drifted. It allows `http:` for `img src` (`IMAGE_SCHEMES`). All current posts use
  same-origin paths.
  - Proposal: `https` only.
  - Acceptance: a spec that an `http:` image `src` is dropped.
- **CQ-SEC-05 (no action).** There are nine `dangerouslySetInnerHTML` uses:
  - Eight are JSON-LD through `serializeJsonLd`, which escapes `<`, `>`, `&`, U+2028 and U+2029.
  - One is post HTML in `WritingPostProse`. It is sanitised at build time. The steps after
    sanitising (`addHeadingIds`, `wrapTables`, `focusableCode`) only insert escaped slug ids and
    constant labels.
- **Webhook verification (no change).** The webhook verifies the Svix signature before parsing,
  answers 400 to unsigned or malformed events (#248), and answers 503 when unconfigured.

## Not verified

- Real Safari or real devices. Leak and SEO probes ran in Playwright Chromium and Playwright WebKit
  on macOS only.
- Production headers and the Vercel Firewall rule. Only a local `next start` was checked.
- Whether CL-1–CL-8 and SS-1–SS-3 are true in the world. They are flagged against the repository's
  own sources only.
- Visual baselines. No change in this audit alters pixels, except the `/now` tab title, which
  isn't rendered on the page.
