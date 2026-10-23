# Architecture and motion audit

Audit date: 2026-10-23. Code at `6f43749`. Versions verified from `node_modules`: Next.js 16.4.2, React 19.3.1, Tailwind CSS 4.3.3, GSAP 3.15.0, Lenis 1.3.26, Geist 1.7.x.

Labels used in this file:

- **Code fact**: read directly from source.
- **Measured**: observed in the live Playwright run on 2026-10-23 (details in `baseline-audit.md`).
- **Inferred**: a reasoned risk that was not reproduced.

---

## 1. Route and render map

```
app/layout.tsx  (Server)
├─ GatedGoogleAnalytics, GatedVercelAnalytics, GatedVercelSpeedInsights
├─ SkipLink → #main-content
├─ StructuredData (WebSite JSON-LD)
└─ SmoothScroll ("use client", Lenis on gsap.ticker)
   ├─ RouteChangeFocus ("use client")
   ├─ Nav ("use client" via hooks)
   ├─ {children}
   └─ Footer (latest writings from utils/posts)

app/portfolio/page.tsx  (Server, static)
├─ CollectionPageJsonLd  (items = 7 dedicated case studies)
├─ BreadcrumbJsonLd
└─ PortfolioPageContent  ("use client")
   └─ MainReveal  (<main id="main-content" tabIndex=-1>)
      ├─ <header ref=usePageHeader>
      │  ├─ Breadcrumbs
      │  ├─ <h1 data-header-title>  "Portfolio"
      │  ├─ PortfolioIntroParagraph ×4  (inline links to 3 case studies)
      │  ├─ PORTFOLIO_PROFILE_DETAILS
      │  ├─ PortfolioProfileLinks  (GitHub, LinkedIn, Book a call)
      │  └─ PortfolioRoleFitStrip  (11 labels)
      ├─ PortfolioWhatToLookFor  ("use client"; useScrollReveal + useCinematicCards)
      └─ ProjectIndex  ("use client"; useScrollReveal ×2)
         ├─ section#case-studies
         │  ├─ h2.sr-only "Case studies"
         │  ├─ TableOfContentsDisclosure (mobile <details>)
         │  ├─ ProjectIndexItem ×7
         │  └─ aside > TableOfContents (desktop sticky)
         └─ section#additional-experience  (only if any project lacks a case study; currently never rendered)

app/portfolio/[slug]/page.tsx  (Server; generateStaticParams = 7 slugs; dynamicParams default)
├─ ProjectCaseStudyJsonLd (Article)
├─ BreadcrumbJsonLd
└─ ProjectCaseStudyPageContent ("use client"; useScrollReveal)
   └─ MainReveal
      ├─ Breadcrumbs
      └─ ProjectCaseStudyArticle ("use client")
         ├─ header: overline, h1, subtitle, overview, role · timeframe, 5 tags, live links, hero figure
         ├─ TableOfContentsDisclosure (mobile)
         ├─ 9–10 <section> (context, problem, role, built, technical-decisions, ux-decisions, evidence?, outcome, improve, related)
         │  └─ PostDiagram (Flow / Layers / Compare, "use client")
         └─ aside > TableOfContents (desktop)
```

**Code facts**

- Both portfolio routes are statically generated (`generateStaticParams`, no dynamic data). Unknown slugs call `notFound()`.
- The server/client boundary sits at the page-content level: `PortfolioPageContent`, `ProjectCaseStudyPageContent`, `ProjectIndex`, `ProjectCaseStudyArticle`, `ProjectFigure`, `ProjectDecisionCard`, and `ProjectHighlightCard` are all `"use client"`. Only `ProjectIndexItem`, `ProjectLinkAnchor`, `PortfolioIntroParagraph`, `PortfolioProfileLinks`, and `PortfolioRoleFitStrip` are server-compatible, and they still ship to the client because their parents are client components.
- The reason for the client boundary is motion: every one of those files is client only because it calls `useScrollReveal`, `usePageHeader`, or `useCinematicCards`, or is imported by one that does. `ProjectDecisionCard`, `ProjectHighlightCard`, and `ProjectFigure` have `"use client"` with no hooks or handlers at all.
- `ProjectHighlightCard` is not imported anywhere in the portfolio (`ProjectTechnicalHighlight` data is also unused by `Project`). Dead code.
- `CLAUDE.md` says "Prefer server components unless client interactivity is actually needed." The portfolio index has no interactivity except motion and the TOC.

**Measured:** `/portfolio` transfers ~260 KB of JavaScript (compressed) and ~123 KB of RSC prefetch fetches on load (Next.js prefetching the 7 case-study links in view or on hover). Case-study pages load from a warm client cache in the same session.

**Redesign implication:** a motion-heavy redesign would make this worse if motion stays coupled to content components. The recommended direction is to keep content in server components and attach motion through small client "behaviour" wrappers (or CSS `animation-timeline` where support allows), so a motion change never moves content to the client.

## 2. Content sources and data model

| Source                   | What it feeds                                                                     |
| ------------------------ | --------------------------------------------------------------------------------- |
| `data/projects.ts`       | `Project[]` (7), page intro, meta title/description, `PORTFOLIO_CASE_STUDY_ORDER` |
| `data/projectsUi.ts`     | Section headings, labels, aria-label builders                                     |
| `data/portfolioFit.ts`   | Role-fit labels, "What to look for" cards                                         |
| `data/breadcrumbs.ts`    | Breadcrumb trails                                                                 |
| `data/links.ts`          | GitHub / LinkedIn / Book a call                                                   |
| `utils/projects.ts`      | Ordering, dedicated vs index-only split, slug lookup, next project                |
| `utils/metadata.ts`      | `buildPortfolioMetadata`, `buildPortfolioCaseStudyMetadata`                       |
| `public/portfolio-media` | 9 case-study PNGs (+1 used by a writing post)                                     |

**Code facts**

- All copy is typed TypeScript; there is no CMS and no Markdown for case studies.
- `Project` mixes three concerns: index-card content (`cardProblem`, `capabilityTags`), case-study content (`caseStudy`), and SEO (`caseStudyMetaTitle`, `caseStudyMetaDescription`). This is workable, but there is no field for **tier/prominence**, **cover media for the index**, **status of outbound links** (live / archived), or **evidence provenance** (e.g. how a metric was measured).
- `capabilityTags` are sliced to 3 on the index and 5 on the case study (`ProjectIndexItem.tsx:14`, `ProjectCaseStudyArticle.tsx:229`), so data order silently decides which skills recruiters see.
- `hasDedicatedCaseStudy` is `true` for all 7, so the "Additional experience" section and its LinkedIn link are unreachable code paths in production.

**Redesign implication:** extend the model before redesigning the UI. Proposed fields (not applied): `tier: "featured" | "supporting" | "experiment"`, `cover?: ProjectFigure`, `indexTags?: string[]` (explicit, not sliced), `links[].status?: "live" | "archived"`, and `evidenceNotes?` for metric provenance.

## 3. Component boundaries

| Component                           | Responsibility                                 | Notes                                                                                                                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PortfolioPageContent`              | Page shell + header                            | Client only for `usePageHeader`.                                                                                                                                                                                                                                             |
| `PortfolioIntroParagraph`           | Auto-links first occurrence of named phrases   | Clever but brittle: links depend on exact substring matches in prose. "AlwaysGeeky" matches twice in paragraph 2 and 3; only first occurrence per paragraph is linked, so the same href appears twice in the header (**measured**: `/portfolio/alwaysgeeky` ×5 on the page). |
| `PortfolioProfileLinks`             | 3 profile cards with CSS-mask icons            | Good: accessible names include destination and "opens in new tab".                                                                                                                                                                                                           |
| `PortfolioRoleFitStrip`             | 11 pill labels                                 | Not interactive; visually similar to tag pills inside projects.                                                                                                                                                                                                              |
| `PortfolioWhatToLookFor`            | 4 explanatory cards                            | Uses parallax (`useCinematicCards`).                                                                                                                                                                                                                                         |
| `ProjectIndex` / `ProjectIndexItem` | Text-first case-study list + TOC               | Each item renders 3 links to the same case study (h2 link, subtitle link with `tabIndex=-1`, "Read the … case study" link).                                                                                                                                                  |
| `ProjectCaseStudyArticle`           | Full nine-section template                     | Used for dedicated pages; also supports an embedded list mode (`isDedicatedPage=false`) that is no longer used in production.                                                                                                                                                |
| `ProjectFigure`                     | `next/image` with caption                      | `loading="eager"`, no `sizes`, no `priority`/`fetchPriority`.                                                                                                                                                                                                                |
| `components/diagrams/*`             | Flow / Layers / Compare interactive diagrams   | Accessible buttons with `aria-expanded` / `aria-pressed`, `aria-live` panel. Strong reusable asset.                                                                                                                                                                          |
| `TableOfContents(+Disclosure)`      | Sticky outline (desktop), `<details>` (mobile) | Desktop TOC is rendered **after** content in DOM order.                                                                                                                                                                                                                      |

## 4. Motion system

### 4.1 Inventory

| Mechanism           | Where                                     | What it does                                                                                                                                      | Reduced-motion handling (code)                           |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Lenis smooth scroll | `components/SmoothScroll` (root layout)   | Replaces native wheel scrolling with eased scroll (duration 1.1), driven by `gsap.ticker`; `lagSmoothing(0)`                                      | Not created if `prefers-reduced-motion: reduce` at mount |
| Page header intro   | `usePageHeader`                           | Header `opacity 0, scale 1.03, blur(10px)` → settle over 1.4 s; H1 split into words, each masked and slid up; supporting copy staggered at 0.45 s | `gsap.set` to final state                                |
| Scroll reveal       | `useScrollReveal` → `cinematicReveal`     | Every `[data-reveal]` set to `opacity 0, y 36–44, scale 0.99` until IntersectionObserver fires, then animated 0.85 s with stagger                 | `gsap.set` to visible                                    |
| Title word reveal   | `cinematicTitleReveal`                    | `[data-cine-title]` words masked and slid in                                                                                                      | `gsap.set` to visible                                    |
| Card parallax       | `useCinematicCards`                       | Per-scroll-frame `translateY` ±13 px and scale on "What to look for" cards, alternating lanes                                                     | Skipped; CSS also forces `transform: none`               |
| CSS hover           | `globals.css` `.hover-lift`, `.cine-card` | translateY(-2px), glow                                                                                                                            | Transitions removed under `reduce`                       |
| CSS ambient         | `.cine-sweep`, `.cine-grain` (homepage)   | Infinite background animation                                                                                                                     | Animation removed under `reduce`                         |

Tokens: `utils/motion.ts` defines `EASE`, `DUR` (0.2–1.4 s), `STAGGER`, `CINE`. Good: there is one place for timing. Gap: no documented intent per token, and several defaults (`DUR.lg = 0.85`, `DUR.xl = 1.4`, `CINE.duration.mask = 1.05`) are long for content entrances.

### 4.2 Findings

1. **Content is hidden until scrolled into view (measured).** With motion enabled, 13/13 `[data-reveal]` elements on `/portfolio` and 10/11 on case studies had computed `opacity: 0` on load, at every viewport. A full-page capture taken without scrolling shows everything below the header as empty black (`screenshots/portfolio-1440-full-unscrolled.jpg`, `ledgerguard-1440-full-unscrolled.jpg`). After scrolling, all became visible. Consequences (inferred): any consumer that does not scroll (some link-preview renderers, full-page capture tools, print, accessibility tools that read the rendered tree, users with IntersectionObserver quirks in embedded webviews) sees blank sections; and if the GSAP chunk fails after the `html.js` class is set, content stays hidden. This is the single biggest motion risk for both goals.
2. **Hydration-time hiding causes a visible re-entrance.** Server HTML renders content visible; `gsap.set(..., {opacity: 0})` runs in `useEffect`, after hydration. For content in the first viewport, this is a visible → hidden → visible cycle. On `/portfolio`, the header is blurred and scaled after it was already readable. **Measured:** the motion-enabled first-viewport screenshot (2.5 s after `load`) still shows softer, slightly offset header text compared with the reduced-motion capture. Likely cause: `.cine-stage` keeps `will-change: transform, opacity` permanently, so the header stays a composited layer after the scale animation. Not confirmed with layer tooling.
3. **Word splitting rewrites React-owned DOM.** `splitElementWords` sets `el.textContent = ""` and appends spans to an element React rendered (`utils/cinematic.ts:37-38`). It works today because the H1 text never changes after mount. Inferred risk: any future re-render of that H1 (e.g. client-side text change, locale switch) will fight React's reconciliation. Screen readers also get each word in its own `inline-block` span; usually announced correctly, not tested here.
4. **Reduced-motion is read once.** `prefersReducedMotion()` is called at effect time; there is no `matchMedia` change listener. A user who enables Reduce Motion while the tab is open keeps Lenis and reveals until reload. Code fact; not reproduced.
5. **Reduced-motion path works (measured).** With `reducedMotion: "reduce"` emulated: 0 hidden reveal elements before scrolling, Lenis not attached (`html.lenis` absent), all content visible in the unscrolled state, LCP 72–160 ms in the lab.
6. **Lenis + native smooth scroll + scroll restoration.** `html { scroll-behavior: smooth }` is set globally, Lenis overrides wheel scrolling, and `RouteChangeFocus` sets `history.scrollRestoration = "manual"` and calls `scrollToTop()` on every pathname change. **Measured:** returning to `/portfolio` with the browser Back button from a case study reset scroll from 2400 px to 0, and the "Back to all case studies" link (`/portfolio#case-studies`) landed at `scrollY 0` instead of the section at ~1607 px. `RouteChangeFocus.tsx:27-35` explicitly ignores hashes on `/portfolio`, so this is deliberate code, but the result breaks the index → case study → back loop recruiters will use most.
7. **Parallax on explanatory text.** `useCinematicCards` moves text cards on every scroll frame. It runs on `requestAnimationFrame` with passive listeners (good), but moving body text while reading is the kind of motion WCAG 2.3.3 (AAA) and many users find uncomfortable. It is disabled under reduced motion.
8. **No motion tests beyond units.** `utils/hooks/__tests__` cover the hooks with GSAP mocked and an IntersectionObserver mock that fires immediately, so the "hidden until intersected" state is never exercised.

### 4.3 Motion principles for the redesign (proposal)

- Content must be visible without JavaScript and without scrolling. Use CSS-first entrance effects that start from a visible state, or animate only decorative layers.
- Motion budget per viewport: one choreographed moment (e.g. the page title), then quiet. Entrance ≤ 600 ms; stagger ≤ 60 ms; no blur filters on text.
- Expressive motion belongs in places that do not block reading: the index hover/focus state, diagram transitions, page transitions (the browser View Transitions API; Next.js/React support should be checked against the installed version before relying on it), and cover media.
- Respect `prefers-reduced-motion` live (listen for changes), and also offer an on-page toggle if the redesign adds significant motion.
- Keep native scrolling. If smooth scrolling stays, it must preserve keyboard scrolling, anchor offsets, and back/forward restoration.

## 5. Media pipeline

**Code facts**

- `next.config.ts` enables AVIF/WebP and default device sizes up to 3840.
- `ProjectFigure` passes the PNG's full intrinsic `width`/`height` (3456×2234) with no `sizes`. `next/image` therefore builds a 1x/2x srcset from the intrinsic width, and the browser picks the 3840 variant.
- Every figure uses `loading="eager"`, including evidence figures far below the fold. The hero figure is not marked `priority` / `fetchPriority="high"` even though it is the LCP element on desktop.

**Measured**

- At 390 px wide, LedgerGuard figures rendered at 342×221 CSS px but were requested as `w=3840` (`/_next/image?url=…ledgerguard-landing.png&w=3840&q=75`), served as AVIF.
- AVIF transfer sizes at `w=3840`: ledgerguard landing 65 KB, dashboard 85 KB, login 22 KB; alwaysgeeky marketplace 202 KB, login 68 KB; mapbylaw landing 238 KB, dashboard 70 KB. All `x-vercel-cache: HIT`.
- Source PNGs in the repo total 18 MB; `alwaysgeeky-marketplace.png` is 8.1 MB. These affect repository and build size and the image optimizer's cold-path cost, not the visitor's transfer (AVIF output is small).

**Redesign implication:** fix `sizes` and loading strategy before adding more media. An Awwwards-style index with cover images would multiply the current per-image waste by seven.

## 6. Navigation, focus, and landmarks

**Code facts**

- Skip link → `#main-content`; `main` has `tabIndex=-1` and a visible focus outline.
- Nav: `aria-current` on the active link; mobile menu with `aria-expanded`, `aria-controls`, `inert` on hidden panel and on background content when open, focus trap, Escape to close, focus return to the menu button.
- Breadcrumbs in `nav[aria-label="Breadcrumb"]`.
- Global `:focus-visible` outline (2 px, foreground colour) on links, buttons, summary, inputs.

**Measured** (details in `baseline-audit.md` §5)

- Skip link is the first tab stop and moves focus to `main#main-content`.
- Every tab stop in the 45-step walk on `/portfolio` and 35-step walk on LedgerGuard had a visible focus indicator.
- On the desktop index, the sticky "Case studies on this page" outline is reached only after tabbing through all 40 preceding links (it is after the list in DOM order). On case studies, the outline is reached after the article content.
- The mobile menu opened on tap, set `aria-expanded="true"`, moved focus to the first link, and locked body scroll.

## 7. SEO and structured data

**Code facts / measured**

- `/portfolio`: unique `<title>`, meta description, canonical `https://alipajand.com/portfolio`, Open Graph + Twitter using the default OG image. JSON-LD: `WebSite`, `CollectionPage` (7 `Article` items), `BreadcrumbList`.
- Case studies: unique titles and descriptions, canonical per slug, `og:type=article`, JSON-LD `Article` + `BreadcrumbList`. All use the **site-wide default OG image**; no per-case-study social image.
- Sitemap includes `/portfolio` and all 7 case studies (`lastModified: new Date()` on every build, so dates are always "now").
- `llms.txt` / `llms-full.txt` routes exist and include portfolio content (not audited in depth).

**Gaps:** per-project OG images (a natural place for the new visual identity), real `lastModified` dates, and `dateModified` in `Article` JSON-LD.

## 8. Tests

| Test file                                                                                 | Covers                                                                                       |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `features/portfolio/__tests__/PortfolioPageContent.spec.tsx`                              | H1, intro, intro links, profile links, index presence                                        |
| `components/Projects/__tests__/ProjectIndex.spec.tsx`                                     | Outline links, text-first entries, no figures on index, slug links, anchor ids               |
| `components/Projects/__tests__/ProjectCaseStudyArticle.spec.tsx`                          | Single H1, hero figure, sections, outline, diagrams placement, next-project link, live links |
| `app/portfolio/__tests__/portfolioRoutes.spec.ts`                                         | Static params, slug resolution, invalid slug, unique metadata, sitemap URLs                  |
| `utils/__tests__/portfolioInternalLinks.spec.ts`, `projects.spec.ts`, `metadata*.spec.ts` | Internal link validity, ordering, metadata                                                   |
| `utils/hooks/__tests__/*`                                                                 | Motion hooks with GSAP mocked                                                                |

**Gaps:** no browser-level tests (Playwright is not a project dependency), no automated accessibility checks (no axe), no visual regression, no Lighthouse CI, no test for back-navigation scroll behaviour, no test that content is visible without scrolling. `ProjectIndex.spec.tsx` asserts "should not render project figures", which will need to change if the redesign adds index media (and is an example of the current design constraint being encoded as a test).

## 9. Design tokens

**Code facts** (`app/globals.css`)

- Colour tokens: `--background #000`, `--foreground #fafafa`, `--muted #a3a3a3`, `--card #0a0a0a`, `--border #262626`, `--organic-orange #ea2b2b`.
- `--organic-orange` is a red (`#ea2b2b`), not orange. The name will confuse anyone extending the palette.
- An unlayered `.bg-card { background-color: #000; }` rule (line 446) overrides Tailwind's `bg-card` utility, so cards render at `#000`, the same as the page background, despite `--card: #0a0a0a`. Variants like `bg-card/60` are generated separately and are not overridden. Cards are distinguished only by borders.
- `ProjectIndex.tsx:112` uses `text-orange-200`, a raw Tailwind palette colour outside the token set (only visible in the currently unrendered "Additional experience" block).
- Typography: Geist Sans only, via `geist/font/sans`. Display and body share one family; hierarchy relies on size and weight. No mono or display face is used on the portfolio.
- Spacing/layout helpers are string constants in `utils/visual.ts`. `SECTION_INNER` and `SECTION_INNER_WIDE` are identical (`max-w-5xl`).
- Dark only: `colorScheme: "dark"`, `<html class="dark">`. No light theme.

**Redesign implication:** a new visual identity will need a real token layer (colour roles, type scale, spacing, radii, motion) before components change. The current tokens are few enough that this is a contained change.
