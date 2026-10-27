# SEO and accessibility

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Metadata, structured data, landmarks and contrast. Production prerendered routes are sound on canonical, `og:url`, single `<h1>`, `<main>` and skip link; the gaps are scheduled-post exposure and what a literal artifact port would lose.

## Metadata summary (prerendered routes)

### 4. SEO / a11y metadata summary (from existing build output, prerendered routes)

Every ○/● page has `lang="en"`, exactly one `<h1>`, one `<main id="main-content">` and a skip link. Each has a self-referencing canonical equal to `og:url`, `robots: index, follow`, and OG/Twitter `summary_large_image`. JSON-LD parses on every page: layout `WebSite` + page types as listed in §1. Breadcrumb `item` URLs are absolute and correct. `/` and `/writing` are dynamic and were not in the build output, so they were checked from source only: one `<h1>` in `HeroTitle` or in the index header, and canonical set.

---

## Contrast table

### 4. Contrast table

Computed with WCAG 2.x relative luminance. Alpha colours pre-blended over the ground (blend result shown). AA thresholds: 4.5:1 normal text, 3:1 large text (≥24px, or ≥18.66px bold) and non-text UI/graphics.

| Foreground | Background | Ratio | AA normal | AA large / non-text | Where (examples) |
| --- | --- | --- | --- | --- | --- |
| line #ecece6 | ink #0f0f0e | 16.17:1 | Pass | Pass | body text (base.css:19) |
| mute #a3a39c | ink #0f0f0e | 7.56:1 | Pass | Pass | `.mute`, labels, footer (base.css:25,97) |
| rule #5b5b56 | ink #0f0f0e | 2.81:1 | Fail | Fail (non-text) | hairlines (decorative OK); input boundary home.html:208 (fails 1.4.11); activity l0 stroke open-source.html:186; separator glyph " ·" home.html:153 |
| mute-ink #4b4b46 | ink #0f0f0e | 2.19:1 | Fail | Fail | not used as text on ink (correctly) |
| placeholder #6f6f69 | ink #0f0f0e | 3.79:1 | Fail | Pass | form placeholders home.html:211 |
| line #ecece6 | ink-2 #1b1b19 | 14.55:1 | Pass | Pass | code text, rail hover |
| mute #a3a39c | ink-2 #1b1b19 | 6.80:1 | Pass | Pass | rail label on hover (case.src.html:53-54), `$` prompt (open-source.html:135), Now active cell (now.src.html:27,34), hljs comments |
| #cfcfc8 | ink-2 #1b1b19 | 11.02:1 | Pass | Pass | reader `pre code` (reader.src.html:60) |
| bone-2 #c9c9c3 | ink-2 #1b1b19 | 10.37:1 | Pass | Pass | hljs strings (reader.src.html:62) |
| bone #d8d8d3 | ink-2 #1b1b19 | 12.06:1 | Pass | Pass | hljs numbers (reader.src.html:63) |
| rule #5b5b56 | ink-2 #1b1b19 | 2.53:1 | Fail | Fail | code block border (decorative) |
| ink #0f0f0e | line #ecece6 | 16.17:1 | Pass | Pass | inverted rows, CTAs, `.tbl th` |
| mute-ink #4b4b46 | line #ecece6 | 7.40:1 | Pass | Pass | labels in inverted rows (base.css:94) |
| mute #a3a39c | line #ecece6 | 2.14:1 | Fail | Fail | focus-visible labels: `.related small` (case.src.html:117-120), `.pager .mono` (case.src.html:124-127), `.ev small` (principles.src.html:53-55) — D-12 |
| ink@75% (#464644) | line #ecece6 | 7.98:1 | Pass | Pass | `.links .v` on hover (home.html:233) |
| ink@85% (#30302e) | line #ecece6 | 11.15:1 | Pass | Pass | `.tags span` opacity .85 in hovered card (home.html:124) |
| ink #0f0f0e | bone #d8d8d3 | 13.41:1 | Pass | Pass | band text (base.css:79) |
| mute-ink #4b4b46 | bone #d8d8d3 | 6.13:1 | Pass | Pass | band labels (base.css:81; diagrams.css:30,51) |
| mute #a3a39c | bone #d8d8d3 | 1.77:1 | Fail | Fail | not used (correctly) |
| #5d5d58 | bone #d8d8d3 | 4.63:1 | Pass | Pass | stack words, decorative aria-hidden (portfolio.html:146) |
| rule #5b5b56 | bone #d8d8d3 | 4.77:1 | Pass | Pass | — |
| line #ecece6 (focus ring) | bone #d8d8d3 | 1.21:1 | — | Fail | global focus ring if any control sits on the band (D-15) |
| line #ecece6 (focus ring) | bone-2 #c9c9c3 | 1.40:1 | — | Fail | focus ring over a hovered light CTA edge |
| ink #0f0f0e | bone-2 #c9c9c3 | 11.53:1 | Pass | Pass | light CTA hover (home.html:79; case.src.html:31) |
| mute-ink #4b4b46 | bone-2 #c9c9c3 | 5.27:1 | Pass | Pass | — |
| ink@16% (#b8b8b3) | bone #d8d8d3 | 1.39:1 | — | Fail | dimmed chevrons, decorative (base.css:85) |
| line@85% (#cbcbc6) | ink | 11.78:1 | Pass | Pass | `.tags span` opacity .85 (home.html:124; portfolio.html:184) |
| line@75% (#b5b5b0) | ink | 9.32:1 | Pass | Pass | `.links .v` (home.html:233; portfolio.html:215; open-source.html:218) |
| line@38% (#636360) | ink | 3.18:1 | Fail | Pass | inactive scene step titles/labels (portfolio.html:198) — D-13 |
| mute@38% (#474744) | ink | 2.06:1 | Fail | Fail | inactive scene step body (portfolio.html:198,202) — D-13 |
| line@60% (#949490) | ink | 6.30:1 | Pass | Pass | canvas labels: strata unreached (home.html:727), route nodes (open-source.html:831), 404 "NO ROUTE" (not-found.src.html:94), Now Q labels (now.src.html:145) |
| line@62% (#989894) | ink | 6.62:1 | Pass | Pass | portfolio plate labels (portfolio.html:694) |
| mute@70% (#777771) | ink | 4.26:1 | Fail | Pass | portfolio inactive stack labels, canvas 12px, aria-hidden (portfolio.html:699) |
| mute@80% (#858580) | ink | 5.17:1 | Pass | Pass | open-source repo file list in canvas (open-source.html:840) |
| line@50% (#7e7e7a) | ink | 4.71:1 | Pass | Pass | inactive route packets (graphic) |
| #4b4b46 | #ecece6 (canvas chip) | 7.40:1 | Pass | Pass | strata active chip stack line (home.html:731) |
| activity l1 (line@20%, #3b3b39) | ink | 1.71:1 | — | Fail | contribution level 1 (open-source.html:187) — D-16 |
| activity l2 (line@42%, #6c6c69) | ink | 3.64:1 | — | Pass | level 2 (open-source.html:188) |
| activity l3 (line@70%, #aaaaa5) | ink | 8.22:1 | — | Pass | level 3 (open-source.html:189) |
| activity l4 (line) | ink | 16.17:1 | — | Pass | level 4 |
| adjacent levels l1/l2, l2/l3, l3/l4 | — | 2.13 / 2.26 / 1.97:1 | — | Fail (as distinguishing encoding) | — |
| rule #5b5b56 | line #ecece6 | 5.76:1 | Pass | Pass | `.cap.on` separator dots (home.html:153-155) |
| Production: #fafafa | #000000 | 20.12:1 | Pass | Pass | globals.css:5-6 |
| Production: #a3a3a3 | #000000 | 8.33:1 | Pass | Pass | globals.css:8 |
| Production: #262626 | #000000 | 1.39:1 | — | Fail | production border (globals.css:12) |

Summary: the base palette passes (line, mute on ink; ink, mute-ink on bone/line). Failures come from state combinations (mute left on an inverted focus row), opacity dimming of real text (portfolio steps), the placeholder literal, the input boundary in `rule`, and the activity graph's low levels.

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [A-01](#a-01) | High | Verified failure (existing build output) | Scheduled post leaks into sitemap, RSS, llms exports, and an indexable page before its date |
| [A-08](#a-08) | Medium | Risk (verified in artifact HTML) | Artifacts render key headings and content client-side; a literal port would regress SEO and no-JS rendering |
| [A-09](#a-09) | Medium | Risk (verified: 0 of 16 artifacts have a skip link or `lang`; only `not-found | Artifacts drop the skip link, `<main>`, `lang`, JSON-LD and metadata; AGENTS.md forbids changing landmarks without approval |
| [A-15](#a-15) | Low | Verified (source and build output) unless noted | Smaller JSON-LD and metadata correctness items |
| [D-12](#d-12) | Medium | Verified failure (computed) | Focus states fail contrast where only hover was restyled |
| [D-13](#d-13) | Medium | Verified failure (computed) | Inactive portfolio scene steps rendered at 38% opacity |
| [D-14](#d-14) | Medium | Verified failure | Contact form contrast and description issues |
| [D-15](#d-15) | Low | Risk | Focus ring visibility gaps |
| [D-16](#d-16) | Medium | Verified failure | Activity graph: pointer-only detail, weak level encoding, unfocusable scroller |

<a id="a-01"></a>

### A-01: Scheduled post leaks into sitemap, RSS, llms exports, and an indexable page before its date
- **Severity:** High. **Status:** Verified failure (existing build output).
- **Paths:** `app/sitemap.ts:8`, `app/feed.xml/route.ts:7`, `app/llms.txt/route.ts:9`, `app/llms-full.txt/route.ts:11`, `app/writing/[slug]/page.tsx:17-19,24,31`, `app/writing/[slug]/opengraph-image.tsx:9-11`, `utils/metadata.ts:54-95` (no robots override), `components/ArticleJsonLd/ArticleJsonLd.tsx:16`, `utils/feed.ts:43`.
- **Evidence:** `content/posts/preparing-integrations-for-anthropic-and-cursor-directories.md:3`: `date: "2026-10-28"`. The existing build's `feed.xml.body` contains the slug twice and has `<lastBuildDate>Wed, 28 Oct 2026 00:00:00 GMT</lastBuildDate>`. The slug also appears in `sitemap.xml.body`, `llms.txt.body` and `llms-full.txt.body`. `writing/preparing-…html` is prerendered with `robots=index, follow`. The code already intends to exclude upcoming posts from SEO: `app/writing/page.tsx:34` `.filter((post) => !post.upcoming)`.
- **Remedy:** Use `getPublishedPosts()` for sitemap, feed and llms. On `/writing/[slug]`, keep the preview reachable, since the index links to it, but return `robots: { index: false, follow: true }` from `generateMetadata` when `!isPostPublished(post.date)`, and omit `ArticleJsonLd` for it. The static exports (feed, sitemap, llms) need a revalidation plan, e.g. `export const revalidate = 3600`, or they won't pick the post up on its date without a redeploy. Feed `pubDate` should be computed in `America/Toronto`, not UTC midnight.
- **Acceptance:** With the clock fixed at 2026-10-27, the sitemap/feed/llms builders exclude the slug and the post page emits `noindex`. At 2026-10-28 Toronto, all of them include it. Unit tests in `app/__tests__/sitemap.spec.ts` (stop mocking to `[]`) plus new route tests for feed and llms cover both dates.

<a id="a-08"></a>

### A-08: Artifacts render key headings and content client-side; a literal port would regress SEO and no-JS rendering
- **Severity:** Medium. **Status:** Risk (verified in artifact HTML).
- **Paths:** `docs/design/pages/writing-reader.html:336` `<h1 id="a-title"></h1>`; `not-found.html:252` `<h1 id="nf-title"></h1>`; `now.html` `<h2 id="stack-t"></h2>`; case pages' sections are generated from `id="${s.id}"` templates.
- **Evidence:** Outline parse: `writing-reader` `h1: ` (empty), `now` `h1: `/`h2: ` (empty).
- **Remedy:** Implement Hairline sections as server-rendered markup from `data/*`. Keep JS for motion only.
- **Acceptance:** In `pnpm build` output, every prerendered HTML has non-empty `<h1>` text and all section headings without JS.

<a id="a-09"></a>

### A-09: Artifacts drop the skip link, `<main>`, `lang`, JSON-LD and metadata; AGENTS.md forbids changing landmarks without approval
- **Severity:** Medium. **Status:** Risk (verified: 0 of 16 artifacts have a skip link or `lang`; only `not-found.html` has `<main>`).
- **Paths:** `AGENTS.md:80` ("Accessibility landmarks, focus order, and `aria-*` wiring" need approval). Production: `app/layout.tsx:104,131`, `components/MainReveal/MainReveal.tsx:7`, `components/RouteChangeFocus/RouteChangeFocus.tsx`.
- **Evidence:** In the artifact the home `<h1>` sits between `</header>` and the first `<section>` with no `<main>` (`docs/design/pages/home.html:318-326`).
- **Remedy:** Keep the layout shell (SkipLink, `<main id="main-content" tabIndex={-1}>`, RouteChangeFocus, `lang`) and all JSON-LD and metadata builders. Restyle only.
- **Acceptance:** Existing SkipLink, RouteChangeFocus, MainReveal and *JsonLd specs still pass. A new layout-level test asserts one `main#main-content` per route.

<a id="a-15"></a>

### A-15: Smaller JSON-LD and metadata correctness items
- **Severity:** Low/Info. **Status:** Verified (source and build output) unless noted.
  - (a) The 404 inherits `og:url = https://alipajand.com` from `app/layout.tsx:52`. Build output: `_not-found.html og:url=['https://alipajand.com']`, plus two robots metas (`noindex` and `noindex, follow`). Remedy: give `app/not-found.tsx` its own `openGraph` without `url`. Acceptance: the 404 HTML has no `og:url` pointing at home.
  - (b) Case-study `Article` has no `datePublished` or `dateModified` (`components/ProjectCaseStudyJsonLd/ProjectCaseStudyJsonLd.tsx:11-48`). Google's Article guidance recommends them. Remedy: add them if `data/projects.ts` gains a date. Acceptance: Rich Results Test shows no Article warnings. Untested against the validator.
  - (c) `CollectionPageJsonLd` `ListItem` carries both `url` and an `item` object (`components/CollectionPageJsonLd/CollectionPageJsonLd.tsx:45-47`). Remedy: use one pattern. Acceptance: Rich Results Test is clean. Untested against the validator.
  - (d) The open-source items hard-code `programmingLanguage: "TypeScript"` and `runtimePlatform: "Node.js"` for every project (`app/open-source/page.tsx:34-35`). Remedy: move these into `OPEN_SOURCE_PROJECTS`. Untested for accuracy per repo.
  - (e) `ArticleJsonLd` sets `dateModified = datePublished` (`components/ArticleJsonLd/ArticleJsonLd.tsx:16-17`) and uses `excerpt`, not `seoDescription`. Info.
  - (f) All JSON-LD uses `JSON.stringify` inside `dangerouslySetInnerHTML` without escaping `<` (e.g. `components/ArticleJsonLd/ArticleJsonLd.tsx:47`). The content is author-controlled, so this is Info. Remedy: `.replace(/</g, "\\u003c")`.
  - (g) Heading nesting on `/portfolio`: the case items are `<h2>` (`components/Projects/ProjectIndexItem.tsx:26`) under an sr-only `<h2>` "case studies" (`ProjectIndex.tsx:61`). Build heading sequence: `12333322222222`. Remedy: make the items `<h3>`.
  - (h) Sitemap `lastModified: new Date()` for all non-post entries (`app/sitemap.ts:18,26-58`) reports build time as the last modification. Info.
  - (i) GA is env-gated only, with no consent mechanism (`components/Analytics/GatedGoogleAnalytics.tsx:7-29`), and SPA navigations rely on GA enhanced measurement to emit page views (Untested). Quebec Law 25 consent requirements are a policy question for Ali. Info/Risk.

---

<a id="d-12"></a>

### D-12 Focus states fail contrast where only hover was restyled
- Severity: Medium. Status: Verified failure (computed).
- Where: case.src.html:117 (`.related a:focus-visible` → line background) with `.related small` mute (:119) fixed only for `:hover` (:120); case.src.html:126 (`.pager a:focus-visible` → line) with `.mono` mute (:124) fixed only for `:hover` (:127); principles.src.html:53 (`.ev a:focus-visible` → line) with `small` mute (:54) fixed only for `:hover` (:55).
- Evidence: keyboard focus shows `#a3a39c` on `#ecece6` = 2.14:1 (fails 4.5:1) for 11–12px labels.
- Remedy: in the port, define inverted-state colours once (a `data-lit`/`.is-lit` variant or Tailwind `group-hover:` + `group-focus-visible:` pairs) so hover and focus-visible always share the label colour change to mute-ink.
- Acceptance: axe (with forced `:focus-visible`) reports 0 colour-contrast violations on case study and principles pages; manual Tab-through shows labels at ≥4.5:1 on every inverted row.

<a id="d-13"></a>

### D-13 Inactive portfolio scene steps rendered at 38% opacity
- Severity: Medium. Status: Verified failure (computed).
- Where: portfolio.html:198-202 (`.step { opacity: .38 }`, `.step.on { opacity: 1 }`), toggled at :755-756; content at :498-502 is real, not `aria-hidden`.
- Evidence: line at 38% on ink = 3.18:1 (18px/600 is below the large-text threshold, so fails 4.5:1); mute at 38% = 2.06:1; labels 12px at 38% = 3.18:1. Two of three steps are always in this state while the scene is in view.
- Remedy: indicate the active step with the inversion (line ground / ink text) or an underline/marker and keep inactive text at full mute contrast (≥4.5:1).
- Acceptance: every visible text node in `.scene__steps` measures ≥4.5:1 in all scroll positions.

<a id="d-14"></a>

### D-14 Contact form contrast and description issues
- Severity: Medium. Status: Verified failure.
- Where: home.html:211 (placeholder `#6f6f69`), :208 (input boundary `border-bottom: 1px solid var(--rule)`), :570-572 and :587-589 (`aria-describedby` references `small.err[hidden]` that already contain text "Enter your name" / "Add a short message").
- Evidence: placeholder 3.79:1 on ink (fails 4.5:1 for text). The input's only visual boundary is a `rule` hairline at 2.81:1 (WCAG 1.4.11 asks 3:1 for the boundary that identifies a control); tokens.json:66 itself says `rule` must never be "the only outline of a control". Hidden elements referenced by `aria-describedby` still contribute their text to the accessible description, so screen readers announce "Enter your name" / "Add a short message" before any error.
- Remedy: placeholder at `--mute` (7.56:1) or remove placeholders; input underline in `--mute` (7.56:1) or 2px; render the error text only when invalid (empty node otherwise) or add the error id to `aria-describedby` only when invalid. Keep production's existing ContactForm semantics where they already do this.
- Acceptance: axe 0 contrast violations on the form including placeholders; VoiceOver/NVDA read only the hint for untouched fields and hint + error for invalid ones.

<a id="d-15"></a>

### D-15 Focus ring visibility gaps
- Severity: Low. Status: Risk.
- Where: global `:focus-visible { outline: 2px solid var(--line); outline-offset: 3px }` (base.css:21). Rail links inside `ol { overflow-x: auto }` (case.src.html:50) clip the ring's top and bottom; stacked `.live` rows (case.src.html:96-97, 1px gap on `rule`) hide the ring's top/bottom edges behind the neighbouring `line` background; any future focusable element on the bone band gets a `line` ring at 1.21:1 against bone.
- Remedy: inset focus ring for items inside scrollers or adjacent filled rows (`outline-offset: -4px; outline-color: var(--ink)` when the item is lit, `var(--line)` otherwise); add `.band :focus-visible { outline-color: var(--ink) }`. Note production uses Tailwind `ring-2 ring-offset-2` with radius (utils/visual.ts:35-36; globals.css:176-183), which conflicts with the square system.
- Acceptance: Tab through a case study: every focused element shows a complete ring with ≥3:1 against adjacent colours (WCAG 2.4.11/1.4.11).

<a id="d-16"></a>

### D-16 Activity graph: pointer-only detail, weak level encoding, unfocusable scroller
- Severity: Medium. Status: Verified failure.
- Where: open-source.html:182-190 (`.act__graph { overflow-x: auto }`, svg `min-width: 720px`, levels `fill-opacity` .2/.42/.7/1, l0 stroke rule), :688-692 (readout updates on `pointerover` only), :683 (`role="img"` with total-only `aria-label`), :417 (legend `aria-hidden`).
- Evidence: level 1 vs ground 1.71:1 and l0 outline 2.81:1 (below 3:1 for meaningful graphics); adjacent levels 1.97–2.26:1. Day counts are reachable only by mouse hover; keyboard and touch users get the total only. On phones the graph scrolls horizontally inside a container that is not focusable (no `tabindex`), so keyboard users in Safari cannot scroll it. 9px labels.
- Remedy: server-render a visually hidden table or `<details>` with per-month totals; make the scroller `tabIndex={0}` with `role="region"` and `aria-label`; add `<title>` per rect or a roving-focus island; increase level separation (for example opacity .25/.5/.75/1 and l0 stroke in `--mute`); 11px minimum label size.
- Acceptance: keyboard user can scroll the graph and read any day's count; graphical levels meet 3:1 against the ground; screen reader reaches per-period data.
