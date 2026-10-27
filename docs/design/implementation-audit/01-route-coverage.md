# Route coverage

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Every public route and nonvisual contract in the application, the artifact each route maps to, and what exists on each side. Per-route captures (artifact left, production right) are in [`captures/`](captures/); the measurement method and raw numbers are in [`captures/measurements.md`](captures/measurements.md).

## Visual routes

### 1. Visual route table

Legend: ○ = static, prerendered with no params. ● = SSG through `generateStaticParams`. ƒ = dynamic, per request. "Client" = feature root starts with `"use client"`. All 7 page feature roots are client components. Server components still SSR them, so the HTML is complete without JS.

| Route | Page file | Feature root (client?) | Main components/* deps | Metadata | Static params | Mode (evidence) | JSON-LD on page (+ layout `WebSite`) | Existing tests | Artifact |
|---|---|---|---|---|---|---|---|---|---|
| `/` | `app/page.tsx` | `features/home/HomePageContent.tsx` (client) | MainReveal, Hero(+HeroTitle/HeroBackground/GridOutlinePath), CinematicSections, SelectedWork, About, HiringFit, OpenSourceTools, Writing, Contact(+ContactForm) | `metadata` = canonical only (`app/page.tsx:10-12`), rest from layout | — | **ƒ**: `export const dynamic = "force-dynamic"` (`app/page.tsx:8`). Missing from prerender-manifest `routes` | HomeStructuredData → `Person` + `ProfilePage` | Component tests for every section (Hero, SelectedWork, About, HiringFit, OpenSourceTools, Writing, Contact, CinematicSections, MainReveal, HomeStructuredData). **None for `HomePageContent` or `app/page.tsx`** | `home.html` (hand-built `kit/static/home.html`) |
| `/portfolio` | `app/portfolio/page.tsx` | `features/portfolio/PortfolioPageContent.tsx` (client) + PortfolioIntroParagraph, PortfolioProfileLinks, PortfolioRoleFitStrip, PortfolioWhatToLookFor (client) | MainReveal, Breadcrumbs, Projects/ProjectIndex(+ProjectIndexItem) | `buildPortfolioMetadata()` | — | ○ | `CollectionPage` (`#case-studies`) + `BreadcrumbList` | `features/portfolio/__tests__/PortfolioPageContent.spec.tsx`, `components/Projects/__tests__/ProjectIndex.spec.tsx` | `portfolio.html` (hand-built) |
| `/portfolio/[slug]` ×7 (ledgerguard, tallyfolio, alwaysgeeky, emplifi, controltech, agent-tooling, mapbylaw) | `app/portfolio/[slug]/page.tsx` | `features/portfolio/ProjectCaseStudyPageContent.tsx` (client) | MainReveal, Breadcrumbs, Projects/ProjectCaseStudyArticle (+ProjectFigure, ProjectDecisionCard, ProjectHighlightCard, ProjectLinkAnchor), TableOfContents, diagrams/PostDiagram | `generateMetadata` → `buildPortfolioCaseStudyMetadata` | yes, `getDedicatedCaseStudySlugs()` | ● (7 in prerender-manifest). `dynamicParams` default `true`, so unknown slugs fall to `notFound()` | `Article` (ProjectCaseStudyJsonLd) + `BreadcrumbList` | `app/portfolio/__tests__/portfolioRoutes.spec.ts`, `ProjectCaseStudyArticle.spec.tsx`, `ProjectCaseStudyJsonLd.spec.tsx`. **None for `ProjectCaseStudyPageContent`** | `case-<slug>.html` |
| `/writing` | `app/writing/page.tsx` | `features/writing/WritingIndexPageContent.tsx` (client) + WritingIndexPostListItem | Breadcrumbs | `buildWritingIndexMetadata()` | — | **ƒ**: `force-dynamic` (`app/writing/page.tsx:14`) | `CollectionPage` (`#archive`, upcoming posts excluded at `:33-34`) + `BreadcrumbList` | `WritingIndexPostListItem.spec.tsx` only. **None for the index content or for the page's upcoming mapping** | `writing.html` |
| `/writing/[slug]` ×16 | `app/writing/[slug]/page.tsx` | `features/writing/WritingPostPageContent.tsx` (client) | Breadcrumbs, ReadingProgress, TableOfContents(+Disclosure), diagrams/PostDiagram (Flow/Layers/Compare/McpWorkflow) | `generateMetadata` → `buildArticleMetadata` | yes, `getAllPosts()`, **including scheduled** | ● (all 16 in prerender-manifest, including `preparing-integrations-…`) | `Article` + `BreadcrumbList` | `WritingPostPageContent.spec.tsx`, `ArticleJsonLd.spec.tsx`, `utils/__tests__/posts.spec.ts` | `writing-reader.html` (`#slug` hash) + `agent-readiness-doctor.html` (dedicated) |
| `/open-source` | `app/open-source/page.tsx` | `features/open-source/OpenSourcePageContent.tsx` (client) + `hooks/useOpenSourcePageContent` | MainReveal, Breadcrumbs, Projects/ProjectCardBadge | `buildOpenSourceMetadata()` | — | ○ | `CollectionPage` (items `SoftwareSourceCode`) + `BreadcrumbList` | `OpenSourcePageContent.spec.tsx`, `useOpenSourcePageContent.spec.ts` | `open-source.html` (hand-built) |
| `/engineering-principles` | `app/engineering-principles/page.tsx` | `features/engineering-principles/EngineeringPrinciplesPageContent.tsx` (client) + SectionBlock, Paragraph | MainReveal, Breadcrumbs | `buildEngineeringPrinciplesMetadata()` | — | ○ | `BreadcrumbList` only | `EngineeringPrinciplesPageContent.spec.tsx` | `engineering-principles.html` |
| `/now` | `app/now/page.tsx` | `features/now/NowPageContent.tsx` (client) + NowSectionBlock, NowBulletItem | MainReveal, Breadcrumbs | `buildNowMetadata()` | — | ○ | `BreadcrumbList` only | **None** | `now.html` |
| 404 | `app/not-found.tsx` | `features/not-found/NotFoundPageContent.tsx` (client) | Breadcrumbs, NotFoundMainFocus | static `metadata`, `robots: {index:false, follow:true}` | — | ○ (`/_not-found`) | layout `WebSite` only | `NotFoundMainFocus.spec.tsx` only | `not-found.html` |
| (redirect) `/blog`, `/blog/:slug` | `next.config.ts:4-9` | — | — | — | — | 308 permanent | — | **None** | — |

Root layout (`app/layout.tsx`) wraps every route with GatedGoogleAnalytics, GatedVercelAnalytics, GatedVercelSpeedInsights, SkipLink → `#main-content`, StructuredData (`WebSite`), SmoothScroll (Lenis), RouteChangeFocus, Nav and Footer (`getLatestPosts(4)`). It also sets `<html lang="en" class="dark">` and inline-adds the `js` class. Tests cover each of these components. **`layout.tsx` itself, including its `metadata`, has no tests.**

**Orphan:** `components/Testimonials/*`, which has 3 test files, is imported by nothing outside its own folder. It is not rendered on any route, although `docs/SITE_STRUCTURE.md:3` lists testimonials on `/`.

#### Content inventory: `content/posts/*.md` (16 files)

Frontmatter fields used: `title, date, excerpt, seoTitle, seoDescription, featured?, tags`. There is **no `draft`/`published` field**. Scheduling is purely date-based: `utils/date.ts:19-33` `isPostPublished` compares a `YYYY-MM-DD` date to today in `America/Toronto`.

| Slug | date | Status on 2026-10-27 |
|---|---|---|
| preparing-integrations-for-anthropic-and-cursor-directories | 2026-10-28 | **Scheduled (upcoming)** |
| agent-readiness-doctor | 2026-10-12 | published |
| how-i-would-design-a-document-review-workspace | 2026-10-08 | published |
| designing-a-small-library-for-logs-too-big-to-hold | 2026-09-18 | published |
| ci-tools-for-untrusted-pull-requests | 2026-08-28 | published |
| deterministic-review-triage-for-agent-prs | 2026-08-08 | published |
| agent-instructions-are-code | 2026-07-19 | published |
| how-i-structure-a-frontend-that-owns-almost-no-truth | 2026-06-29 | published, `featured: true` |
| how-i-would-build-a-real-time-backgammon-platform | 2026-06-09 | published |
| how-i-use-ai-in-my-frontend-engineering-workflow | 2026-05-20 | published |
| how-i-approach-senior-frontend-architecture | 2026-04-30 | published |
| ledgerguard-truth-between-extraction-and-finance | 2026-04-10 | published |
| mapbylaw-ai-recommendations | 2026-03-21 | published |
| building-tools-that-dont-fight-you | 2026-03-01 | published |
| why-i-automate-code-review-with-mcp | 2026-02-09 | published |
| design-systems-that-stick | 2026-01-20 | published |

Where the date filter is applied:
- **Filtered** (`getPublishedPosts`/`getLatestPosts`/`getPostsForWritingSection`): home Writing section (`app/page.tsx:15`), footer (`app/layout.tsx:101`), and the `/writing` CollectionPage JSON-LD (`app/writing/page.tsx:33-34`).
- **Shown but labelled "upcoming"** with a "preview" CTA: the `/writing` list (`features/writing/WritingIndexPostListItem.tsx:24-54`).
- **Not filtered** (`getAllPosts`/`getPostBySlug`): `/writing/[slug]` page, its params and metadata, its OG image, `sitemap.xml`, `feed.xml`, `llms.txt`, `llms-full.txt`. See A-01.

#### Why `/` and `/writing` are ƒ

Both pages declare `export const dynamic = "force-dynamic"` (`app/page.tsx:8`, `app/writing/page.tsx:14`). Commit `988004c` "Schedule homepage writing … (#206)" added it so that `new Date()` in `getPostsForWritingSection` and the `upcoming` mapping is evaluated per request. A scheduled post then appears or flips on its date without a redeploy. No cookies, headers or searchParams are involved. Side effect: the root layout's footer `getLatestPosts()` runs per request only on these two routes. On every ○/● route it is frozen at build time (A-05). The function traces include all 16 `content/posts/*.md` (`.next/server/app/page.js.nft.json`), so runtime fs reads work.

---

## Rendering mode

#### Why `/` and `/writing` are ƒ

Both pages declare `export const dynamic = "force-dynamic"` (`app/page.tsx:8`, `app/writing/page.tsx:14`). Commit `988004c` "Schedule homepage writing … (#206)" added it so that `new Date()` in `getPostsForWritingSection` and the `upcoming` mapping is evaluated per request. A scheduled post then appears or flips on its date without a redeploy. No cookies, headers or searchParams are involved. Side effect: the root layout's footer `getLatestPosts()` runs per request only on these two routes. On every ○/● route it is frozen at build time (A-05). The function traces include all 16 `content/posts/*.md` (`.next/server/app/page.js.nft.json`), so runtime fs reads work.

---

## Captured comparison (both sides measured)

| Route | Artifact | Width | Status | Script KB (prod) | Total KB art / prod | Height art / prod | LCP ms art / prod | LCP reduced art / prod | CLS art / prod | Canvas art / prod | Dialog art / prod | `<h1>` art / prod |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `home.html` | 1440 | 200 | 780 | 274 / 1147 | 5933 / 8250 | 144 / 328 | 128 / 64 | 0.012 / 0 | 1 / 0 | 0 / 0 | Ali Pajand / I build product systems from the interfa |
| `/portfolio` | `portfolio.html` | 1440 | 200 | 728 | 269 / 1057 | 6290 / 6346 | 60 / 44 | 44 / 44 | 0 / 0 | 2 / 0 | 0 / 0 | Selected Work / Portfolio |
| `/portfolio/ledgerguard` | `case-ledgerguard.html` | 1440 | 200 | 728 | 575 / 1171 | 7168 / 8100 | 68 / 696 | 56 / 48 | 0 / 0 | 0 / 0 | 1 / 0 | LedgerGuard / LedgerGuard |
| `/portfolio/alwaysgeeky` | `case-alwaysgeeky.html` | 1440 | 200 | 728 | 630 / 1265 | 6749 / 7444 | 56 / 2104 | 56 / 72 | 0.197 / 0 | 0 / 0 | 1 / 0 | AlwaysGeeky Games / AlwaysGeeky Games |
| `/portfolio/emplifi` | `case-emplifi.html` | 1440 | 200 | 728 | 173 / 988 | 5161 / 5351 | 60 / 72 | 56 / 80 | 0.084 / 0 | 0 / 0 | 1 / 0 | Emplifi / Emplifi |
| `/portfolio/agent-tooling` | `case-agent-tooling.html` | 1440 | 200 | 728 | 175 / 991 | 5391 / 5872 | 64 / 44 | 44 / 32 | 0.146 / 0 | 0 / 0 | 1 / 0 | Agent Engineering Tools / Agent Engineering Tools |
| `/portfolio/tallyfolio` | `case-tallyfolio.html` | 1440 | 200 | 728 | 432 / 1122 | 6453 / 7204 | 56 / 552 | 56 / 60 | 0.062 / 0 | 0 / 0 | 1 / 0 | TallyFolio / TallyFolio |
| `/portfolio/controltech` | `case-controltech.html` | 1440 | 200 | 728 | 173 / 982 | 4607 / 4645 | 48 / 36 | 48 / 32 | 0 / 0 | 0 / 0 | 1 / 0 | ControlTech / ControlTech |
| `/portfolio/mapbylaw` | `case-mapbylaw.html` | 1440 | 200 | 728 | 559 / 1287 | 5904 / 6690 | 56 / 1324 | 64 / 36 | 0.069 / 0 | 0 / 0 | 1 / 0 | MapBylaw / MapBylaw |
| `/open-source` | `open-source.html` | 1440 | 200 | 689 | 281 / 952 | 10425 / 7146 | 72 / 56 | 72 / 44 | 0.026 / 0 | 1 / 0 | 0 / 0 | Open Source & Tooling / Open Source & Tooling |
| `/writing` | `writing.html` | 1440 | 200 | 737 | 269 / 1066 | 5017 / 5077 | 56 / 76 | 60 / 40 | 0 / 0 | 1 / 0 | 0 / 0 | Writing 2026 / Writing |
| `/writing/agent-readiness-doctor` | `agent-readiness-doctor.html` | 1440 | 200 | 727 | 347 / 956 | 7350 / 3954 | 44 / 44 | 48 / 36 | 0 / 0.002 | 0 / 0 | 0 / 0 | Keeping repository instructions useful w / Keeping repository instructions useful w |
| `/writing/agent-instructions-are-code` | `writing-reader.html#agent-instructions-are-code` | 1440 | 200 | 727 | 781 / 991 | 9950 / 7127 | 80 / 56 | 60 / 56 | 0 / 0.002 | 0 / 0 | 0 / 0 | Agent instruction files are code. Lint t / Agent instruction files are code. Lint t |
| `/engineering-principles` | `engineering-principles.html` | 1440 | 200 | 766 | 265 / 1053 | 6387 / 4443 | 44 / 32 | 52 / 52 | 0 / 0 | 1 / 0 | 0 / 0 | Engineering Principles / Engineering Principles |
| `/now` | `now.html` | 1440 | 200 | 698 | 154 / 914 | 1704 / 1954 | 52 / 32 | 56 / 32 | 0 / 0 | 1 / 0 | 0 / 0 | Now / Now |
| `/this-route-does-not-exist` | `not-found.html` | 1440 | 404 | 727 | 149 / 978 | 907 / 1357 | 32 / 44 | 28 / 52 | 0 / 0.0 | 1 / 0 | 0 / 0 | Page not found / Page not found |
| `/` | `home.html` | 390 | 200 | 738 | 274 / 1078 | 10893 / 12064 | 124 / 152 | n/a | 0.014 / 0 | 1 / 0 | 0 / 0 | Ali Pajand / I build product systems from the interfa |
| `/portfolio` | `portfolio.html` | 390 | 200 | 686 | 269 / 986 | 8874 / 8933 | 48 / 52 | n/a | 0 / 0 | 2 / 0 | 0 / 0 | Selected Work / Portfolio |
| `/portfolio/ledgerguard` | `case-ledgerguard.html` | 390 | 200 | 686 | 575 / 1112 | 12148 / 9774 | 52 / 64 | n/a | 0 / 0 | 0 / 0 | 1 / 0 | LedgerGuard / LedgerGuard |
| `/portfolio/alwaysgeeky` | `case-alwaysgeeky.html` | 390 | 200 | 686 | 630 / 1205 | 11818 / 9509 | 64 / 52 | n/a | 0.072 / 0 | 0 / 0 | 1 / 0 | AlwaysGeeky Games / AlwaysGeeky Games |
| `/portfolio/emplifi` | `case-emplifi.html` | 390 | 200 | 686 | 173 / 928 | 9284 / 7550 | 52 / 60 | n/a | 0.033 / 0 | 0 / 0 | 1 / 0 | Emplifi / Emplifi |
| `/portfolio/agent-tooling` | `case-agent-tooling.html` | 390 | 200 | 686 | 175 / 931 | 10646 / 8492 | 48 / 56 | n/a | 0.051 / 0 | 0 / 0 | 1 / 0 | Agent Engineering Tools / Agent Engineering Tools |
| `/portfolio/tallyfolio` | `case-tallyfolio.html` | 390 | 200 | 686 | 432 / 1062 | 11056 / 8868 | 60 / 48 | n/a | 0.005 / 0 | 0 / 0 | 1 / 0 | TallyFolio / TallyFolio |
| `/portfolio/controltech` | `case-controltech.html` | 390 | 200 | 686 | 173 / 923 | 8298 / 6781 | 40 / 56 | n/a | 0 / 0 | 0 / 0 | 1 / 0 | ControlTech / ControlTech |
| `/portfolio/mapbylaw` | `case-mapbylaw.html` | 390 | 200 | 686 | 559 / 1227 | 10054 / 8375 | 48 / 56 | n/a | 0.008 / 0 | 0 / 0 | 1 / 0 | MapBylaw / MapBylaw |
| `/open-source` | `open-source.html` | 390 | 200 | 594 | 281 / 813 | 17617 / 12920 | 64 / 36 | n/a | 0.0 / 0 | 1 / 0 | 0 / 0 | Open Source & Tooling / Open Source & Tooling |
| `/writing` | `writing.html` | 390 | 200 | 617 | 269 / 886 | 8027 / 6931 | 44 / 44 | n/a | 0 / 0 | 1 / 0 | 0 / 0 | Writing 2026 / Writing |
| `/writing/agent-readiness-doctor` | `agent-readiness-doctor.html` | 390 | 200 | 608 | 347 / 797 | 9387 / 5805 | 36 / 52 | n/a | 0 / 0.005 | 0 / 0 | 0 / 0 | Keeping repository instructions useful w / Keeping repository instructions useful w |
| `/writing/agent-instructions-are-code` | `writing-reader.html#agent-instructions-are-code` | 390 | 200 | 608 | 781 / 827 | 16425 / 10531 | 60 / 56 | n/a | 0 / 0.004 | 0 / 0 | 0 / 0 | Agent instruction files are code. Lint t / Agent instruction files are code. Lint t |
| `/engineering-principles` | `engineering-principles.html` | 390 | 200 | 665 | 265 / 923 | 9937 / 6500 | 60 / 48 | n/a | 0 / 0 | 1 / 0 | 0 / 0 | Engineering Principles / Engineering Principles |
| `/now` | `now.html` | 390 | 200 | 579 | 154 / 751 | 2885 / 2378 | 44 / 44 | n/a | 0 / 0 | 1 / 0 | 0 / 0 | Now / Now |
| `/this-route-does-not-exist` | `not-found.html` | 390 | 404 | 666 | 149 / 858 | 888 / 1619 | 36 / 52 | n/a | 0.0 / 0.002 | 1 / 0 | 0 / 0 | Page not found / Page not found |

## Nonvisual contracts

### 2. Nonvisual contract table

| Path | Source | Inputs → outputs | Env vars | Tests | Affected by Hairline artifacts? |
|---|---|---|---|---|---|
| `POST /api/contact` | `app/api/contact/route.ts` | JSON `{name,email,message}` → 200 `{success:true}` / 400 `{error}` / 503 when unconfigured / 500. Sends a Resend email with `replyTo` = sender. The client folds `company` into `message` (`components/Contact/hooks/useContactForm.ts:85-89`) | `RESEND_API_KEY` (required), `RESEND_FROM` (optional, falls back to `onboarding@resend.dev`), `CONTACT_EMAIL` (optional, falls back to a hard-coded inbox in `utils/resend.ts:42`) | **None for the route.** Client hook/form tested (`useContactForm.spec.tsx`, `ContactForm.spec.tsx`) | Yes, indirectly. `home.html` has a new form (`#contact-form`, fields name/email/company/message, status reads "not connected"). Field names match today's client payload |
| `POST /api/webhooks/resend` | `app/api/webhooks/resend/route.ts` | Svix-signed Resend event → forwards `email.received` for `@alipajand.com` with idempotency key; 503/400/200/500 | `RESEND_WEBHOOK_SECRET`, `RESEND_API_KEY` (full access), `RESEND_FROM`, `CONTACT_EMAIL` | `app/api/webhooks/resend/__tests__/route.spec.ts` | No |
| `/feed.xml` | `app/feed.xml/route.ts` + `utils/feed.ts` | `force-static` RSS 2.0 of `getAllPosts()` | — | `utils/__tests__/feed.spec.ts` (builder only) | No; still linked from the layout `<head>` |
| `/llms.txt`, `/llms-full.txt` | `app/llms*.txt/route.ts` + `utils/llms.ts` | `force-static` text built from data/*, case studies, and **all** posts | — | `utils/__tests__/llms.spec.ts` (builder only) | Content only. If the redesign changes copy in `data/*`, these follow automatically |
| `/robots.txt` | `app/robots.ts` | `*` and 11 AI UAs allowed, `/api/` disallowed, sitemap link | — | `app/__tests__/robots.spec.ts` | No |
| `/sitemap.xml` | `app/sitemap.ts` | 6 static pages + all posts + 7 case studies | — | `app/__tests__/sitemap.spec.ts` (mocks `getAllPosts` → `[]`, so post entries are untested) | Only if routes are added or removed |
| `/opengraph-image` | `app/opengraph-image.tsx` (uses `utils/profileImage.tsx`) | 1200×630 PNG, Geist, black, accent `#ea2b2b` | — | **None** | Yes, visually. Hairline has "no accent hue" and Archivo/Geist Mono. Brand mismatch is a decision, not a bug |
| `/writing/[slug]/opengraph-image` | `app/writing/[slug]/opengraph-image.tsx` | 1200×630 PNG per post; `generateStaticParams` = all posts | — | **None** | Same as above |
| `/icon`, `/apple-icon`, `/favicon.ico` | `app/icon.tsx` (192), `app/apple-icon.tsx` (180), `app/favicon.ico` | Monogram PNGs (`utils/monogramIcon.tsx`) | — | **None** | Hairline has "no logo"; the icon is unchanged by the artifacts |
| `/images/profile-{1x1,4x3,16x9}.png` | `app/images/profile-*.png/route.ts` | `force-static` ImageResponse; referenced by `Person.image`/`ProfilePage` | — | **None** | Visual identity only |
| `/manifest.json` | `public/manifest.json` | Static web manifest | — | **None** | **Broken icon path** (A-03) |
| Analytics | `components/Analytics/Gated*.tsx`, `utils/analytics.ts` | GA4 loads only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. Vercel Analytics and Speed Insights load only when `NODE_ENV === "production"`. **No consent gate**; "Gated" means env-gated | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NODE_ENV` | 3 component specs + `analytics.spec.ts`, `analytics.node.spec.ts` | Must be kept in the redesign layout. Artifacts have no analytics |
| Structured data | `components/{StructuredData,HomeStructuredData,ArticleJsonLd,BreadcrumbJsonLd,CollectionPageJsonLd,ProjectCaseStudyJsonLd}` | See §4 | — | One spec each | Artifacts have **zero** JSON-LD. A port must keep these |
| Middleware/proxy | none (`middleware.ts`/`proxy.ts` absent) | — | — | — | — |
| `next.config.ts` | redirects `/blog → /writing`, `/blog/:slug → /writing/:slug` (permanent). `images` formats/sizes. `optimizePackageImports: gsap, lenis`. **No `headers()`, no CSP, no `remotePatterns`** | — | **None** | Artifacts load Google Fonts (`fonts.googleapis.com`). origin/main #222 adds an `<img>` to `algora.io`. Both matter if a CSP is ever added |
| Root metadata | `app/layout.tsx:30-98` | metadataBase, title template, OG/Twitter defaults, robots, manifest, appleWebApp, viewport (theme `#000000`, dark) | — | **None** | Hairline ink is `#0f0f0e`, so the theme-color will be off by a shade (Info) |

---

## Artifact vs production structure

### 3. Artifact vs production structure (per route)

The artifacts are standalone. None of them has `<html lang>`, `<main>` (except `not-found.html`), a skip link, a canonical, OG/meta description, or JSON-LD (checked across all 16 files). Page titles are artifact names such as "Ali Pajand Home" and "LedgerGuard Case Study", not production titles.

| Route | In artifact, not in prod | In prod, not in artifact | Anchor/id changes |
|---|---|---|---|
| `/` | name as `<h1>` ("Ali Pajand") above the hero; nav CTA "Open to roles" + "Book a call"; boxed nav with 4 links (Work, Writing, Open source, Contact); progress line | Hero `<h1>` is the positioning line (`HOMEPAGE_HERO_TITLE`); Hero social-links nav; "Principles" in primary nav; skip link; `<main id="main-content">` | `#case-studies` → `#work`; `#open-source-tools` → `#open-source`; `#hero`, `#about`, `#hiring-fit` have no artifact id. `#writing` and `#contact` unchanged |
| `/portfolio` | `#scene` "Design systems as product infrastructure"; a contact section "Let's talk"; band "Ordered by how much each one shows" (3 cards) | Visual breadcrumbs, profile links, role-fit strip, "What to look for", **"Additional experience"** (`components/Projects/ProjectIndex.tsx:89-100`) | Production `#case-studies` (also the JSON-LD `@id` fragment and the target of the case-study "back" link `ProjectCaseStudyArticle.tsx:183`) has **no matching id** in the artifact (`section.works` has no id) |
| `/portfolio/[slug]` | ChapterRail, FactsPanel, screenshot lightbox, tilt-on-scroll hero shot, pager nav. Sections are rendered **client-side from a JSON blob** (`id="${s.id}"` template in the static HTML). Lines with 80%/90% figures dropped (`kit/build.mjs:102`) | Server-rendered sections; `<main>`; capability chips; 80/90% outcome lines | Section ids: prod `${project.id}-${key}` with `ux-decisions`; artifact bare `context`, `problem`, `role`, `built`, `technical-decisions`, `ux`, `evidence`, `outcome`, `improve`, `related` (`kit/case.src.html:258-271`) |
| `/writing` | Separate "Featured" section; "Writing 2026" display word; "More" next-links nav | Visual breadcrumbs; "why it matters" header paragraph is in both (band) | — |
| `/writing/[slug]` | Reader: "More writing" section + "More from the site" nav (prod has **no related/next links** on posts). Dedicated ARD page: bespoke `#scene` illustration. Reader title, h1 and body are **empty in static HTML** and filled by JS from `#slug` | `<main>`, ReadingProgress, TOC disclosure; per-post OG image | Reader uses `#<post-slug>` in the hash. Production uses `#<heading-id>` for TOC anchors, so the two collide in the same namespace |
| `/open-source` | "Contribution activity" built from a dated **snapshot** (`kit/activity.json`) | — on this branch. **origin/main #222** adds a "Contribution activity" section that renders a live external `<img src="https://algora.io/og/user/alipajand">` (`git show origin/main:features/open-source/OpenSourcePageContent.tsx` lines 246-280). Same heading, different data source | — |
| `/engineering-principles` | `nav#principles` TOC; "In a design review" band; nav has **no current item** (`@@NAV:none@@`) because "Principles" is not in the Hairline nav | Visual breadcrumbs; "Principles" primary-nav entry | — |
| `/now` | Ticker for the stack; h1 and h2 filled by JS | Visual breadcrumbs present in both | `#current-stack` etc. become cell ids |
| 404 | "Ways back" nav; h1 filled by JS (`<h1 id="nf-title"></h1>`) | `noindex,follow`; NotFoundMainFocus focus management | — |

---

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [A-03](#a-03) | Medium | Verified failure | manifest.json` points at a non-existent `/icon.png` |
| [A-05](#a-05) | Low | Verified (existing build output) | Footer "latest writing" freezes at build time on static routes |
| [A-06](#a-06) | Medium | Risk / **Untested | getPostBySlug` builds a filesystem path from the raw URL segment |
| [A-12](#a-12) | Low | Risk | origin/main's Algora activity card diverges from the Hairline snapshot graph |
| [A-13](#a-13) | Medium | Untested | No tests for the contact API route |
| [A-14](#a-14) | Low | Untested | Test gaps on route assembly and nonvisual outputs |
| [B-30](#b-30) | Info | Verified** (command output) | pnpm test -- <args>` does not forward args under pnpm 12 |
| [M-05](#m-05) | Medium | Verified | The design branch is behind `main` |

<a id="a-03"></a>

### A-03: `manifest.json` points at a non-existent `/icon.png`
- **Severity:** Medium. **Status:** Verified failure. The file is absent and the build emits `/icon`, not `/icon.png`. The 404 itself was not exercised.
- **Path:** `public/manifest.json:12`.
- **Evidence:** `"src": "/icon.png",` with `ls public/icon.png app/icon.png` → "No such file or directory". The existing build HTML has `<link rel="icon" href="/icon?5ba47db24344af8f" … sizes="192x192"/>`. The manifest also declares `"sizes": "512x512"` while `app/icon.tsx:5` renders 192×192.
- **Remedy:** Convert to `app/manifest.ts` that references the generated icon route, or add a real 512×512 PNG at `public/icon.png`. Fix the declared sizes.
- **Acceptance:** `curl -I /icon.png` (or the new path) → 200 `image/png` with matching dimensions. Lighthouse/PWA manifest check passes. A unit test asserts every manifest icon `src` resolves to an existing file or route.

<a id="a-05"></a>

### A-05: Footer "latest writing" freezes at build time on static routes
- **Severity:** Low. **Status:** Verified (existing build output). **Risk** after 2026-10-28.
- **Path:** `app/layout.tsx:101`.
- **Evidence:** `const latestWritings = getLatestPosts(FOOTER_LATEST_WRITINGS_COUNT);`. Prerendered `now.html` lists the 4 posts current at build time. Only `/` and `/writing` re-evaluate per request.
- **Remedy:** Add `revalidate` (ISR) at the layout level, or schedule a daily redeploy. Alternatively drop `force-dynamic` on `/` and `/writing` in favour of `revalidate = 3600`, which also returns them to ISR static.
- **Acceptance:** After the scheduled date passes with no redeploy, the footer on `/now` includes the new post within the revalidate window.

<a id="a-06"></a>

### A-06: `getPostBySlug` builds a filesystem path from the raw URL segment
- **Severity:** Medium. **Status:** Risk / **Untested**. Runtime decoding of `%2F` in Next 16 params was not exercised.
- **Paths:** `utils/posts.ts:121-127`, `app/writing/[slug]/page.tsx` (no `dynamicParams = false`), `app/writing/[slug]/opengraph-image.tsx:25`.
- **Evidence:** `return readFileSync(join(POSTS_DIR, \`${slug}.md\`), "utf-8");`. A slug of `../../README` would resolve to the repo `README.md`. On Vercel only the traced `content/posts/*.md` ship, which limits the blast radius.
- **Remedy:** Add `export const dynamicParams = false` to `app/writing/[slug]/page.tsx` and to the OG image. In `getPostBySlug`, reject any slug not in `getPostSlugs()` or not matching `/^[a-z0-9-]+$/`.
- **Acceptance:** A unit test shows `getPostBySlug("../../README") === null`, and `GET /writing/..%2F..%2FREADME` → 404.

<a id="a-12"></a>

### A-12: origin/main's Algora activity card diverges from the Hairline snapshot graph
- **Severity:** Low. **Status:** Risk.
- **Paths:** `origin/main:features/open-source/OpenSourcePageContent.tsx` lines 246-280 and `origin/main:data/openSourcePage.ts` `OPEN_SOURCE_ACTIVITY_IMAGE_SRC = "https://algora.io/og/user/alipajand"` vs `docs/design/kit/activity.json` and `kit/static/open-source.html` (this branch, b8856fe).
- **Evidence:** origin/main has `{/* eslint-disable-next-line @next/next/no-img-element -- live external card, not worth proxying */}`. The artifact README says "Artifact pages can't request GitHub, so the snapshot is built in."
- **Remedy:** Rebase onto origin/main first, which also brings next 16.4.3 and resend 6.34.1. Then choose one data source for "Contribution activity". If live, keep Algora or fetch GitHub server-side; if a snapshot, move `activity.json` under `data/`.
- **Acceptance:** One implementation, an `OpenSourcePageContent.spec.tsx` assertion for the chosen source, and no duplicate section.

<a id="a-13"></a>

### A-13: No tests for the contact API route
- **Severity:** Medium. **Status:** Untested.
- **Path:** `app/api/contact/route.ts:13-59` (no `app/api/contact/__tests__`).
- **Evidence:** `pnpm exec jest --listTests` lists only `app/api/webhooks/resend/__tests__/route.spec.ts` under `app/api`. The route has no message length cap, no honeypot or rate limit in code. `docs/ARCHITECTURE.md:79` claims "Rate limiting … is handled at the Vercel edge level", which is unverified: there is no `vercel.json`, and Vercel firewall config was not checked.
- **Remedy:** Add a node-env spec mirroring the webhook spec covering 400s, 503, the Resend error mapping, and the escaping. Optionally add length limits.
- **Acceptance:** The spec covers each status branch, and coverage for `app/api/contact/route.ts` is at least 90% of lines.

<a id="a-14"></a>

### A-14: Test gaps on route assembly and nonvisual outputs
- **Severity:** Low. **Status:** Untested.
- **Untested:** `app/layout.tsx` metadata; `app/page.tsx`; `app/writing/page.tsx` (upcoming mapping and JSON-LD exclusion); `app/writing/[slug]/page.tsx` (`generateStaticParams`/`generateMetadata`); `app/feed.xml`, `app/llms*.txt` route handlers (only builders are tested); `app/sitemap.ts` post entries (mocked to `[]`); `opengraph-image`, `icon`, `apple-icon`, `images/profile-*`; `public/manifest.json`; `next.config.ts` redirects; and the `HomePageContent`, `NowPageContent`, `NotFoundPageContent`, `WritingIndexPageContent` and `ProjectCaseStudyPageContent` feature roots.
- **Remedy:** Before the redesign, add route-level tests that snapshot metadata objects (title, canonical, robots, OG URL) and JSON-LD types per route, plus a manifest-icon existence test. These become the regression net for the port.
- **Acceptance:** Each listed route or file has at least one spec. CI (`.github/workflows/ci.yml`: lint, typecheck, test, build) stays green.

<a id="b-30"></a>

### B-30 — `pnpm test -- <args>` does not forward args under pnpm 12
- Severity: **Info** · Status: **Verified** (command output)
- Evidence: `$ jest -- --listTests` → `Pattern: --listTests - 0 matches` / `No tests found, exiting with code 1`.
- Remedy: document `pnpm test <pattern>` / `pnpm exec jest …` in `CLAUDE.md`/`AGENTS.md` validation notes.

---

<a id="m-05"></a>

### M-05: The design branch is behind `main`
- **Severity:** Medium. **Status:** Verified.
- **Evidence:** `git merge-base HEAD origin/main` = `6f43749`. `git log 6f43749..origin/main` lists `30a761e` (#222, Algora contribution card on `/open-source`), `8df2ce6` (next 16.4.2 → 16.4.3), `7ecf924` (resend 6.34.1) and three other dependency bumps. This audit measured the frozen branch, so `/open-source` captures do not include #222.
- **Remedy:** Q-01: bring the branch up to date, rebuild, re-run the captures.
- **Acceptance:** `git merge-base --is-ancestor origin/main HEAD` exits 0, and the open-source captures show the activity decision from DEC-6.
