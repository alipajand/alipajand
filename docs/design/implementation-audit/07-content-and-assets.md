# Content and assets

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Provenance of every factual claim and image used by the artifacts and the site. Classifications: **Real shipped product**, **Design prototype**, **Editorial illustration**, **Unverified asset**. The LedgerGuard landing and dashboard images in `docs/design/kit/img/` are captures of design prototypes, not of the shipped product.

## Method

### Method (what was actually run)

- Stripped every `data:` URI from `docs/design/pages/*.html` into a scratch copy outside the repository. Then mapped each embedded base64 payload byte-for-byte to its source file (exact base64 equality against `docs/design/kit/img/*`, `public/portfolio-media/*`, `public/writing/*`).
- Extracted visible text nodes, `alt`/`aria-label`/`placeholder`/`title`/`data-n` attributes and JS string literals from `docs/design/kit/static/{home,portfolio,open-source}.html` and `docs/design/kit/*.src.html`. Then checked each one (normalised, case-insensitive substring) against the concatenation of `data/*.ts` and `content/posts/*.md`. Each miss was fuzzy-matched to its nearest data string (difflib) to see whether it is a rewrite or new copy. Scripts: [`scripts/copycheck.py`](scripts/copycheck.py) and [`scripts/fuzzy.py`](scripts/fuzzy.py), run as `python3 scripts/copycheck.py <repo root>`.
- Separately checked every string literal in the hand-copied `PROJECTS` array of `static/open-source.html` (lines 473-592). All of them match data verbatim.
- Grepped the whole repo (excluding node_modules/.git/.next/lockfile) for `80%`, `90%`, `NN0 %`, "percent", "eighty", "ninety".
- Looked at every image with the Read tool: 10 kit JPGs, 10 `public/portfolio-media` PNGs, the poster PNG, the system screenshot (same hash as the kit dashboard JPG), and the pre-replacement `ledgerguard-dashboard.jpg` from commit `b64dded` (extracted to scratch).
- Grepped for emails, phone numbers and key patterns (`sk_live/test_`, `re_…`, `ghp_`, `github_pat_`, `AKIA…`, `xox[bp]-`, `-----BEGIN`, `AIza…`, JWT `eyJ…`, generic `api_key/secret/token = "…"`).
- Checked the installed Next.js version from `node_modules/next/package.json` and `origin/main:package.json` (after `git fetch origin main`).

---

## Asset provenance

### Asset provenance table

Key: **Real shipped product** = a capture of a live product UI. **Design prototype** = a capture of a design, not the shipped app. **Editorial illustration** = a diagram or poster. **Unverified** = origin not established from repo evidence.

| File | Used by | Classification | Evidence | Sensitive-data check |
|---|---|---|---|---|
| `docs/design/kit/img/ledgerguard-landing.jpg` (1728×1084) | `pages/case-ledgerguard.html` CASE_IMG `ledgerguard-landing` (hero shot) via `build.mjs:118-125` `caseImages()` | **Design prototype** | Commit `ad02ca8`: "now come from the current LedgerGuard homepage and dashboard designs, captured in dark mode". `docs/design/README.md:70`: "come from the current LedgerGuard design pages … not from `public/portfolio-media`". The content is completely different from the shipped landing capture `public/portfolio-media/ledgerguard-landing.png` (headline "Know what you've committed to…" vs "You don't lose money when you sign."). The images were captured from published design-prototype pages (PR #223 description); the repository itself only says "designs". | No PII. It does carry product claims: nav "Pricing", "Enterprise"; CTA "Start free"; "Free for 3 contracts. No card required."; a "Northwind Finance / Sample workspace / SAMPLE DATA" preview. See C-02. |
| `docs/design/kit/img/ledgerguard-dashboard.jpg` (1728×1084) | `pages/case-ledgerguard.html` CASE_IMG `ledgerguard-dashboard` (Interface evidence) | **Design prototype** | Same commit and README evidence as above. The UI differs from the shipped capture (`public/…/ledgerguard-dashboard.png` shows a Contracts list with CAD totals and a different nav). | Fictional sample data: org "Northwind Logistics", users "Sam Patel (Controller)", "Priya Raman", vendors "Pinewood Facilities", "Halcyon Freight Systems", "Tessellate Cloud", "Ostrander Print & Mail", USD figures. There is **no "sample data" label on the dashboard itself**. No email, no keys. |
| `docs/design/system/project/assets/Screenshots/ledgerguard-dashboard.jpg` | `system/project/design-system.json:53-66` (blob `c923e037…`), `components/ScreenshotFrame/preview.html:9-10` | **Design prototype** | Byte-identical to the kit dashboard JPG (sha1 prefix `2f04e9dfb2` for both). | Same as above. `Screenshots/README.md:3` calls it a "Product screenshot" (C-01). |
| `docs/design/kit/img/ledgerguard-login.jpg` (1728×1084) | `pages/case-ledgerguard.html` CASE_IMG `ledgerguard-login` | **Real shipped product** | Visually identical content to `public/portfolio-media/ledgerguard-login.png` (3456×2234, added in `1c33fd1`, v1.6.2, 2026-06-18): the top ~67px black browser strip is cropped and the image halved, giving 1728×1084. `docs/design/README.md:70`: "The sign-in screenshot is still the site's own." Unchanged by `ad02ca8` ("The sign-in screenshot is unchanged"). | Placeholder `you@company.com` only. Clean. |
| `public/portfolio-media/ledgerguard-login.png` | live `/portfolio/ledgerguard` (`data/projects.ts:204`) | **Real shipped product** | See above. | Clean. |
| `public/portfolio-media/ledgerguard-landing.png` | live `/portfolio/ledgerguard` (`data/projects.ts:194`) | **Real shipped product** (as of 2026-06) | Browser-chrome capture of the live marketing page. | Shows "Illustrative impact: +18–32% annual spend", labelled illustrative. No PII. |
| `public/portfolio-media/ledgerguard-dashboard.png` | live homepage (`data/homepage.ts:46-48`, caption "Product screenshot") and live `/portfolio/ledgerguard` (`data/projects.ts:214`) | **Real shipped product** | Logged-in app capture (Contracts list, breadcrumb "Dashboard > Contracts"). | **Personal email visible, truncated**: `a truncated copy of the same login` (bottom-left account row). A real workspace name (withheld here). Third-party company names (Salesforce, Inc.; Shopify Inc.; British Petroleum plc (BP)) with file names `02_salesforce_level3_multi_page_fail…`, `01_shopify_level2_layout_noise.pdf`, `BRITISH CONTRACT.pdf`. The "levelN_…_noise" naming suggests synthetic test fixtures, but that is **unverified**. See C-05. |
| `git show b64dded:docs/design/kit/img/ledgerguard-dashboard.jpg` (history only) | was in `case-ledgerguard.html` before `ad02ca8` | **Real shipped product** | A 1728px crop of the PNG above. | Same truncated email and vendors. The commit is on `origin/ali/nostalgic-blackwell-0b3838`, and `gh repo view` reports the repo as **PUBLIC**. |
| `docs/design/kit/img/alwaysgeeky-marketplace.jpg` / `public/portfolio-media/alwaysgeeky-marketplace.png` | `case-alwaysgeeky.html` (hero); live case page and homepage (`data/homepage.ts:62`) | **Real shipped product** (employer's public product, Voxies marketplace) | The JPG is a crop and downscale of the PNG (same content). `liveLinks` `https://market.voxies.io` (`data/projects.ts:749`). | Public marketplace listing ("Item #305779 cerulean dawn tunic 9999.00 (US$ 45.01)"). No PII. Third-party brand artwork; permission is **unverified** (C-14). |
| `docs/design/kit/img/alwaysgeeky-login.jpg` / `public/…/alwaysgeeky-login.png` | `case-alwaysgeeky.html` evidence; live case page | **Real shipped product** | Crop of the PNG. `liveLinks` `https://login.voxies.io/`. | Empty form. Clean. |
| `docs/design/kit/img/mapbylaw-landing.jpg` / `public/…/mapbylaw-landing.png` | `case-mapbylaw.html` hero; live case page | **Real shipped product** | Crop of the PNG. `liveLinks` `https://mapbylaw.ca/`. | Public map (Mapbox attribution visible). Clean. |
| `docs/design/kit/img/mapbylaw-dashboard.jpg` (1728×991) / `public/…/mapbylaw-dashboard.png` (3452×1980) | `case-mapbylaw.html` evidence; live case page | **Real shipped product** (owner's own logged-in account) | Same content. "Hello, Ali!". | **Full personal email visible: `the owner's dotted Gmail login (redacted here)`** with "Ali Pajand", the followed borough "Anjou", report cards for "Pont Île-des-Sœurs, Montréal, Québec H3C 5K4…" (a public bridge, not a residence), dated Feb 27/28 2026, amounts paid 0.00 CAD. See C-05. Caption mismatch: C-07. |
| `docs/design/kit/img/tallyfolio-landing.jpg` (1728×959) / `public/…/tallyfolio-landing.png` (3186×1768) | `case-tallyfolio.html` hero; live case page | **Real shipped product** | Same content. The preview card is labelled "Sample workspace". | Sample figures ($184,260 net worth etc.) labelled as sample. Clean. |
| `docs/design/kit/img/tallyfolio-dashboard.jpg` / `public/…/tallyfolio-dashboard.png` (3456×2234) | `case-tallyfolio.html` evidence; live case page | **Real shipped product**; whether the data is **real or demo is unverified** | Same content. Logged-in "Dashboard · June 2026", avatar "AL". | **Possibly real personal financial data, with no "sample" label**: income $3,580.66, spending $4,955.86, 12-month totals ($73,555.11 / $75,895.40 / $26,350.00), categories including "Childcare $465.85", "Housing $2,400.00", named credit cards "Neo World Elite Mastercard" (balance $1,569.40) and "Scotia Momentum Visa Infinite" (balance $525.73). See C-06. |
| `docs/design/kit/img/data-flow.jpg` / `public/portfolio-media/data-flow.png` (1948×1476) | `writing-reader.html` (via `build.mjs:159` `readerPost()` rewrite of `/portfolio-media/*.png`); live post `content/posts/how-i-would-design-a-document-review-workspace.md:66` | **Editorial illustration** (architecture diagram for a *proposed* design) | The post calls it "a proposed architecture" (`…document-review-workspace.md:24`). Alt text matches the diagram. | Clean. |
| `public/writing/agent-readiness-doctor-poster.png` (1080×1080) | `agent-readiness-doctor.html` (`build.mjs:229`); live post `content/posts/agent-readiness-doctor.md:106` | **Editorial illustration** (third-party GitBot launch poster) | Alt "Agent Readiness Doctor launch poster from GitBot". The poster reads "GitBot Library … Built by Ali Pajand @alipajand". | Public handle only. Clean. |
| `docs/design/system/project/assets/Icons/{chev,chevron-band,ring,spark}.svg` | design system | **Editorial illustration** (UI glyphs) | Plain path SVGs with no embedded raster, text or metadata (inspected). | Clean. |

The data URIs embedded in pages were mapped exactly (base64 equality). All other pages carry none:
`agent-readiness-doctor.html` → poster PNG. `case-alwaysgeeky.html` → alwaysgeeky-marketplace.jpg, alwaysgeeky-login.jpg. `case-ledgerguard.html` → ledgerguard-landing.jpg, ledgerguard-login.jpg, ledgerguard-dashboard.jpg. `case-mapbylaw.html` → mapbylaw-landing.jpg, mapbylaw-dashboard.jpg. `case-tallyfolio.html` → tallyfolio-landing.jpg, tallyfolio-dashboard.jpg. `writing-reader.html` → data-flow.jpg.

---

## 80% and 90% claims

### 80% / 90% claim inventory

| # | path:line | Exact text | Claim | Evidence in repo | In artifacts? | Rendered on live site by |
|---|---|---|---|---|---|---|
| 1 | `data/projects.ts:225` | "Reached 90% unit-test coverage on the web application." | 90% unit-test coverage, LedgerGuard web app | **None found.** There is no coverage report, link or repo for LedgerGuard in this repo, and no other mention of the figure. | **Omitted**: `build.mjs:105-106` filters `outcome`. No `90%` appears anywhere in the stripped pages, including the JSON. | `components/Projects/ProjectCaseStudyArticle.tsx` (outcome), `utils/llms.ts:154` (`bulletList(caseStudy.outcome)` → `/llms-full.txt`) |
| 2 | `data/projects.ts:762` | "…with an 80% reduction in unnecessary rendering and chart-update paint work…" (`caseStudyMetaDescription`) | 80% rendering and paint reduction, Emplifi | **None found**: no profile data, benchmark, link or post. `content/posts/*` contains no Emplifi profiling write-up. | **Not visible, but shipped in source**: present in the `const P = {…}` JSON at `docs/design/pages/case-emplifi.html:560` (C-03) | `utils/metadata.ts` (page meta description), `components/ProjectCaseStudyJsonLd` |
| 3 | `data/projects.ts:765` | "Profiling the webview path led to an 80% reduction in unnecessary re-renders and chart-update paint cost on lower-powered devices." (`cardProblem`) | same | none | **Not visible, but in JSON** at `case-emplifi.html:560`. The static `portfolio.html:444` uses a hand-rewritten summary without the number. | `components/Projects/ProjectIndexItem.tsx` (portfolio index card), `app/portfolio/page.tsx`, `utils/llms.ts:53` (`/llms.txt`) |
| 4 | `data/projects.ts:822` | "Cut unnecessary re-renders and chart-update paint cost on lower-powered devices by 80%." (`outcome`) | same | none | **Omitted**: filtered by `build.mjs:105-106` | case article, `/llms-full.txt` |
| 5 | `data/projects.ts:910` | Flow step "Reduce cost" detail: same sentence as #4 | same | none | **Omitted**: `build.mjs:108-110` deletes `detail`. The step renders as a bare label (`"label":"Reduce cost"}` in `case-emplifi.html`). | case-study diagram |
| 6 | `README.md:25` | "D3.js enterprise analytics, including an 80% cut in unnecessary re-renders and chart paint work in webviews" | same, worded "in webviews" rather than "on lower-powered devices" | none | n/a (not used by the kit) | GitHub README |
| 7 | `docs/design/README.md:69`, `docs/design/system/project/README.md:11`, `docs/design/kit/build.mjs:101` | meta-references describing the omission rule | n/a | n/a | n/a | n/a |

No occurrences were found in `content/posts`, `app/**` text, `components`, `features`, `CHANGELOG.md`, `app/llms*.txt/route.ts` (those routes generate from data), or `public/manifest.json`. No "80 percent", "eighty" or "ninety" anywhere.

---

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [C-01](#c-01) | High | Verified failure | LedgerGuard design-prototype captures are framed and captioned as the shipped product |
| [C-02](#c-02) | Medium | Risk (whether the live product now matches is Untested; there is no network check of ledgerguard | The prototype captures carry product claims not evidenced anywhere in the repo |
| [C-03](#c-03) | High | Verified failure (relative to the stated rule that "two claims were deliberately omitted") | The Emplifi 80% claim is still shipped inside `case-emplifi.html` |
| [C-04](#c-04) | Medium | Risk (no evidence found; this does not prove the claims are false) | The 80% and 90% claims have no supporting evidence in the repo and remain on the live site and README |
| [C-05](#c-05) | Medium | Verified failure (visible) | The personal email is visible in screenshots on the live site and in the artifacts |
| [C-06](#c-06) | High | Untested (cannot be determined from the repo) | The TallyFolio dashboard may show real personal finance data |
| [C-07](#c-07) | Low | Verified failure | Some alt text and captions do not describe what the image shows |
| [C-08](#c-08) | Low | Verified failure (data) | The declared TallyFolio dashboard dimensions do not match the file |
| [C-09](#c-09) | Medium | Verified failure (against `docs/design/README | The hand-built kit pages contain copy that is not in `data/` or `content/`, against the "verbatim" rule |
| [C-10](#c-10) | Low | Verified | The canonical positioning line does not appear verbatim in any artifact |
| [C-11](#c-11) | Low | Verified | The design docs mislabel the 80% figure as a "coverage" figure |
| [C-12](#c-12) | Info | Risk (no current drift) | The Agent Readiness Doctor article is a hand-maintained copy of the Markdown post |
| [C-13](#c-13) | Info | Verified | Secrets and contact-data grep found nothing |
| [C-14](#c-14) | Info | Untested | Use of employer and third-party brand imagery has no recorded permission |

<a id="c-01"></a>

### C-01: LedgerGuard design-prototype captures are framed and captioned as the shipped product
- **Severity:** High · **Status:** Verified failure
- **Where:**
  - `docs/design/kit/case.src.html:230`: the frame title bar prints `host(P.liveLinks?.[0]?.href)`. For LedgerGuard that is `ledgerguard.io` (`data/projects.ts:336` `{ label: "Live product", href: "https://ledgerguard.io/" }`), drawn above the prototype hero and dashboard images.
  - `data/projects.ts:197-200` (landing): the caption says "The public positioning frames the product…". The image is not the public page (the shipped landing differs; see the provenance table).
  - `data/projects.ts:217-220` (dashboard): the alt and caption describe the product's dashboard behaviour. The Outcome on the same page reads "Shipped a working end-to-end product … live at ledgerguard.io." (`data/projects.ts:224`).
  - `docs/design/system/project/assets/Screenshots/README.md:3`: "Product screenshots as the case studies show them". The design-system file is the prototype.
  - `docs/design/system/project/components/ScreenshotFrame/README.md:3` ("A hairline window around a product screenshot") and `ScreenshotFrame/preview.html:9-10` (bar text `ledgerguard.io`, prototype blob `c923e037…`).
  - `docs/design/system/project/README.md:5`: "a page is a layout over real text, never a mock". The images are mocks.
  - `docs/design/README.md:70` is the only place that says these are "design pages". It is not visible on any artifact.
- **Evidence:** commit `ad02ca8` body: "screenshots now come from the current LedgerGuard homepage and dashboard designs … Captions stay as the site has them." The visual diff against the `public/portfolio-media` captures is total (different headline, nav, data and currency).
- **Remedy:** choose one.
  - (a) Restore shipped captures: the PNG-derived JPGs from `b64dded`, re-cropped to remove the email (see C-05).
  - (b) Keep the prototypes but mark them in the artifact. Put a visible label in the frame bar or caption, for example "Design prototype, not the live product". Replace the `ledgerguard.io` host with something like "Design", and add a caption variant that `case.src.html` can render per figure (for example a `kind: "prototype"` field the kit reads).
  - Either way, fix the system README wording ("product screenshot", "never a mock").
- **Acceptance:** no LedgerGuard image whose pixels are not from the shipped product appears under a `ledgerguard.io` bar or a caption about the "public" page or a shipped dashboard. Each prototype image carries a visible "prototype/design" label in the rendered page. `Screenshots/README.md` and `ScreenshotFrame` docs state the provenance.

<a id="c-02"></a>

### C-02: The prototype captures carry product claims not evidenced anywhere in the repo
- **Severity:** Medium · **Status:** Risk (whether the live product now matches is Untested; there is no network check of ledgerguard.io)
- **Where:** `docs/design/kit/img/ledgerguard-landing.jpg` shows nav "Pricing", "Enterprise"; CTA "Start free"; "Free for 3 contracts. No card required." `docs/design/kit/img/ledgerguard-dashboard.jpg` uses a USD base currency and features ("Renewals I own", "Density", "Excluded from totals").
- **Evidence:** the shipped captures (`public/portfolio-media/ledgerguard-landing.png`, `…-dashboard.png`, 2026-06) show no pricing page or free tier, and use CAD totals. `data/projects.ts` LedgerGuard copy mentions "billing" but no free tier or contract limit. Fictional people and companies appear (Northwind Logistics, Sam Patel, Priya Raman), and the dashboard has no "sample data" marker.
- **Remedy:** if the prototypes stay, crop or blur the pricing line or confirm it matches ledgerguard.io today, and label the dashboard as sample data. Otherwise resolve via C-01(a).
- **Acceptance:** every visible pricing or plan statement in an artifact image is either verified against the live product, with a dated note in `docs/design/README.md`, or removed. Fictional data is marked as sample.

<a id="c-03"></a>

### C-03: The Emplifi 80% claim is still shipped inside `case-emplifi.html`
- **Severity:** High · **Status:** Verified failure (relative to the stated rule that "two claims were deliberately omitted")
- **Where:** `docs/design/pages/case-emplifi.html:560` (`const P = {…}`) contains `caseStudyMetaDescription` ("…with an 80% reduction in unnecessary rendering and chart-update paint work…", from `data/projects.ts:762`) and `cardProblem` ("…led to an 80% reduction…", from `data/projects.ts:765`). Root cause: `docs/design/kit/build.mjs:103-116` `scrubCase()` filters only `myRole, whatIBuilt, uxDecisions, outcome, nextImprovements` and diagram nodes, then `build.mjs:235` serialises the **whole project object** with `json(scrubCase(project))`.
- **Evidence:** a grep of the stripped page shows two matches. `case.src.html` never reads `cardProblem` or `caseStudyMetaDescription`, so the text is not visible. It is in view-source of the published artifact (README lists `https://claude.ai/artifact/A9nYf9R1Ltk32JYjQMNEaq`), where crawlers and LLM readers can see it. This contradicts `docs/design/README.md:69` and `docs/design/system/project/README.md:11` ("Lines carrying 80% or 90% figures are left off these pages").
- **Remedy:** in `scrubCase`, either (a) serialise only the fields `case.src.html` renders (an allow-list), or (b) apply `HIDDEN_FIGURE` to every string at the top level and in `caseStudy` recursively. Then rebuild.
- **Acceptance:** `grep -E '\b[89]0(%|\\u0025)' docs/design/pages/*.html` (after stripping data URIs) returns nothing. Add a build-time assertion that throws if the output contains `HIDDEN_FIGURE`.

<a id="c-04"></a>

### C-04: The 80% and 90% claims have no supporting evidence in the repo and remain on the live site and README
- **Severity:** Medium · **Status:** Risk (no evidence found; this does not prove the claims are false)
- **Where:** see the inventory, rows 1-6: `data/projects.ts:225,762,765,822,910` and `README.md:25`.
- **Evidence:** there is no linked source, benchmark, coverage report, post or case-study paragraph that substantiates either number. The live site renders them through `ProjectIndexItem.tsx`, `ProjectCaseStudyArticle.tsx`, `utils/metadata.ts`, `ProjectCaseStudyJsonLd`, and `utils/llms.ts:53,154`. CLAUDE.md:63-64: "Do not add fictional metrics… If evidence is weak, improve structure and wording instead of inventing proof." `README.md:25` words it differently from data ("in webviews" vs "on lower-powered devices").
- **Remedy:** this is an owner decision. Either keep the numbers and record their source privately (for example a note on how each was measured), or reword to the qualitative form the artifacts already use. If kept, make `README.md:25` match the data wording. This audit does not recommend removing unrelated content.
- **Acceptance:** each remaining figure has a recorded measurement basis that the owner confirms, and README and data use identical wording. Or the figures are removed consistently from data, README and the generated `llms` routes.

<a id="c-05"></a>

### C-05: The personal email is visible in screenshots on the live site and in the artifacts
- **Severity:** Medium · **Status:** Verified failure (visible). Whether it is unwanted is the owner's call.
- **Where:**
  - `public/portfolio-media/mapbylaw-dashboard.png`, its derivative `docs/design/kit/img/mapbylaw-dashboard.jpg`, and the data URI inside `docs/design/pages/case-mapbylaw.html`: `Ali Pajand / the owner's dotted Gmail login (redacted here)`, bottom-left.
  - `public/portfolio-media/ledgerguard-dashboard.png`: `a truncated copy of the same login`, truncated. Used on the live homepage (`data/homepage.ts:46-48`) and the live LedgerGuard case page (`data/projects.ts:214`).
  - `b64dded:docs/design/kit/img/ledgerguard-dashboard.jpg` (git history of a branch pushed to a PUBLIC GitHub repo): same truncated email.
- **Evidence:** the published contact email is `alipajand@gmail.com` (`data/links.ts:2`). The screenshots show the dotted login identity `the owner's dotted Gmail login (redacted here)`. Gmail ignores dots, so it reaches the same inbox, but it exposes the account login string. CLAUDE.md: "Do not publish private personal details beyond what already appears in the public site". The LedgerGuard PNG also shows a real workspace name (withheld here) and real company names on what look like test files (unverified).
- **Remedy:** re-capture or crop and blur the account row in both dashboard PNGs, and regenerate `docs/design/kit/img/mapbylaw-dashboard.jpg` and the pages. Decide whether the `b64dded` blob in history matters. Only a history rewrite removes it, which is out of scope here.
- **Acceptance:** no image under `public/` or `docs/design/` shows an email other than placeholders. Repeat the visual check on all 20 screenshots.
- **Follow-up:** the `public/portfolio-media` originals were replaced by redacted copies. `docs/design/kit/img/mapbylaw-dashboard.jpg` and its data URI in `pages/case-mapbylaw.html` are now regenerated from `public/portfolio-media/mapbylaw-dashboard-redacted.png` (same 1728×991 frame, Lanczos downscale, JPEG quality 80), and the account row is blurred in the two `implementation/case-studies/mapbylaw-*-reference.jpg` captures. `app/__tests__/designAssets.spec.ts` fails if any known unredacted image comes back under `docs/design/`. Deleting a file in a new commit does not remove it from git history; see `docs/audits/history-exposure.md`.

<a id="c-06"></a>

### C-06: The TallyFolio dashboard may show real personal finance data
- **Severity:** High if real, otherwise Info · **Status:** Untested (cannot be determined from the repo)
- **Where:** `public/portfolio-media/tallyfolio-dashboard.png`, `docs/design/kit/img/tallyfolio-dashboard.jpg`, and the data URI in `docs/design/pages/case-tallyfolio.html`.
- **Evidence:** the screenshot shows a logged-in user "AL" with income, spending, 12-month totals, category spend including Childcare and Housing, and two named Canadian credit-card products with balances and available credit (values listed in the provenance table). Unlike the landing page ("Sample workspace"), nothing marks it as demo data. No seed or fixture for these values exists in this repo.
- **Remedy:** the owner confirms whether this is a seeded demo account. If it is not, replace it with a capture from a seeded account and label it "Sample data".
- **Acceptance:** written confirmation from the owner that the data is synthetic, or a replaced image showing a sample label.

<a id="c-07"></a>

### C-07: Some alt text and captions do not describe what the image shows
- **Severity:** Low · **Status:** Verified failure
- **Where:**
  - `data/projects.ts:1313-1316` (MapBylaw dashboard): the alt is "dashboard showing map context, property details, and filtered zoning information" and the caption is "emphasizes map context, filtering…". The image shows a reports overview (Purchased reports, Zoning Alerts, report cards), with no map and no filters.
  - `data/projects.ts:430` (TallyFolio dashboard): the alt mentions "recent activity". No recent-activity panel is visible.
  - `data/homepage.ts:47` and `data/projects.ts:217`: the alt says "dashboard showing contract status, renewal risk…". The shipped PNG is the Contracts list (breadcrumb "Dashboard > Contracts").
  - `docs/design/kit/case.src.html:230`: the AlwaysGeeky login image gets the `market.voxies.io` bar (`liveLinks[0]`), although its own host is `login.voxies.io` (`data/projects.ts:750`).
- **Remedy:** rewrite these alt texts and captions in `data/projects.ts` and `data/homepage.ts` to describe what is visible. Let `case.src.html` take the host per figure (an optional `host` on `ProjectFigure`) instead of from `liveLinks[0]`.
- **Acceptance:** for every figure, the alt and caption nouns are visible in the image, and the frame host equals the image's real host.

<a id="c-08"></a>

### C-08: The declared TallyFolio dashboard dimensions do not match the file
- **Severity:** Low · **Status:** Verified failure (data). Rendering impact Untested.
- **Where:** `data/projects.ts:427-429` declares `width: 3454, height: 1982`. The actual `public/portfolio-media/tallyfolio-dashboard.png` is **3456×2234** (sips). The live site passes these to the image component (`components/Projects/ProjectFigure.tsx:19-20`).
- **Remedy:** set 3456×2234, or re-export the image at the declared size.
- **Acceptance:** the declared width and height equal the file's pixel size for every `interfaceEvidence` entry. A small script comparing `data/projects.ts` to `sips` output passes.

<a id="c-09"></a>

### C-09: The hand-built kit pages contain copy that is not in `data/` or `content/`, against the "verbatim" rule
- **Severity:** Medium · **Status:** Verified failure (against `docs/design/README.md:3` "the text matches the live site word for word" and `docs/design/system/project/README.md:10` "Keep the site's text word for word")
- **Material items** (facts, claims, roles):
  - `docs/design/kit/static/portfolio.html:510`: "Open to full-stack, senior frontend, and product engineering roles. Based in Montreal, open to remote work within Canada." This is not in data. It paraphrases CLAUDE.md:21 and contradicts `data/contact.ts:11` ("Open to lead frontend, senior frontend, and senior full-stack roles in Montreal or remote within Canada."), which `static/home.html:560` uses. The two artifact pages state different availability. See also C-17.
  - `static/portfolio.html:428`: "Probabilistic extraction never becomes confirmed contract data without a human reviewing the evidence." Data (`data/projects.ts:127`) says "The design problem was keeping probabilistic extraction from becoming confirmed contract data…". The rewrite turns a design goal into an absolute guarantee.
  - `static/portfolio.html:436,444,456,464,472,484`: all six other case summaries are condensed rewrites of `cardProblem` (`data/projects.ts:561,765,1072,356,937,1234`). The facts are preserved. Emplifi drops the 80% figure (intended), and Agent Tooling drops "Action v1.2.0 and integrations v0.1.2".
  - `static/portfolio.html:423,451,479`: the group labels "Lead [3] / Supporting [3] / Experiment [1]" exist nowhere in data. A reader could take "Lead" as a leadership claim (CLAUDE.md: no team-management claims unless sourced).
  - `static/portfolio.html:397-408`: the three pillar headings and texts ("Own the whole stack", "Build shared systems", "Check before merge") are new copy. They are consistent with, but not drawn from, data (nearest: `data/projects.ts:85,644`).
  - `static/home.html:513`: the agent-readiness-action description is reworded from `data/openSourceTools.ts:103` (it drops "v1.2.0" from the sentence; the date chip shows `Oct 2026 · v1.2.0`).
- **Minor and new chrome copy:**
  - "Open to roles": `docs/design/kit/build.mjs:70`; `static/home.html:314`, `static/portfolio.html:297`, `static/open-source.html:305`. Data has "Open to new work".
  - "Book an intro call": `home.html:601`, `portfolio.html:514`. Data `links.ts:4` has "Book a call".
  - `portfolio.html:306`: "2018 — 2026". `portfolio.html:420`: "7 projects · 2018 — present".
  - `portfolio.html:313`: Montreal city-centre coordinates "45.5017° N 73.5673° W".
  - Ticker phrases, `portfolio.html:320-346` and `home.html:463-464` (for example "Checks you run, not assume").
  - Scene steps, `portfolio.html:499-501`.
  - Strata layer stacks: `home.html:667-672` and `portfolio.html:560-566`.
  - `open-source.html:330`: "Surface 01 / 05", "No LLM scoring".
  - `open-source.html:411`: the activity-snapshot caption.
  - `post.src.html:150-179`: the scene illustration copy. It is labelled "The example from this post, not a report from a measured deployment."
  - Location strings vary: `portfolio.html:310,523` say "Montreal, Canada"; `build.mjs:78`, `home.html:328` and every generated page say "Montreal, Quebec, Canada" (`data/site.ts:60`).
- **Verified clean:**
  - The `open-source.html` `PROJECTS` array (lines 473-592): every string literal is verbatim from data.
  - "9+ years" (`portfolio.html:310`, `home.html` proof) and "Nine-plus years" (from `data/projects.ts:83`).
  - The principles count (10, matching `ENGINEERING_PRINCIPLES_SECTIONS`).
  - Tool counts "7 projects" / "4 of 7 tools" (7 entries in `data/openSourcePage.ts`).
  - Tool dates (`data/openSourceTools.ts:27-100`).
  - Post dates (front matter).
  - The `post.src.html` prose body (every sentence matches `content/posts/agent-readiness-doctor.md`; see C-12).
- **Remedy:**
  - Make `static/portfolio.html:510` use `data/contact.ts:11` (or decide the canonical availability line first; C-17).
  - Restore the `data/projects.ts:127` wording for LedgerGuard, or have the owner approve the stronger phrasing.
  - Either source the static summaries from `cardProblem`, or soften `docs/design/README.md:3` to say the static pages are editorial condensations.
  - Remove "Lead/Supporting/Experiment", or rename them to neutral labels the owner approves.
- **Acceptance:** re-running [`scripts/copycheck.py`](scripts/copycheck.py) on the static pages leaves only structural chrome (indexes, labels, counters) unmatched. Any remaining editorial sentence is listed in `docs/design/README.md` as owner-approved.

<a id="c-10"></a>

### C-10: The canonical positioning line does not appear verbatim in any artifact
- **Severity:** Low · **Status:** Verified
- **Where:** `CLAUDE.md:261` and `data/site.ts:4` define "Senior Software Engineer · Frontend architecture, design systems, and full-stack product work · React, TypeScript, Next.js, Node.js". A grep of all 16 stripped pages returns 0 matches. `static/portfolio.html:307-309` splits it ("Senior Software Engineer. Frontend architecture, design systems, and full-stack product work, from the first architecture call to production." plus "React · TypeScript · Next.js · Node.js"). `static/home.html:328` shows only "Senior Software Engineer". Page `<title>`s are "Ali Pajand Home" and similar, not `HOME_TITLE`.
- **Remedy:** owner decision. The live home also shows only the eyebrow (`data/homepage.ts:20`), so this may be intentional. If the line should appear, put it verbatim in the home hero or footer (`data/footer.ts:36` already has it).
- **Acceptance:** either the verbatim line appears on the home artifact, or the decision is noted in `docs/design/README.md`.

<a id="c-11"></a>

### C-11: The design docs mislabel the 80% figure as a "coverage" figure
- **Severity:** Low · **Status:** Verified
- **Where:** `docs/design/README.md:69` ("Lines with 80% or 90% coverage figures are left out…") and commit `b64dded` ("Lines with 80% or 90% coverage figures"). Only the 90% figure is coverage. The 80% figure is a re-render and paint reduction (`data/projects.ts:822`).
- **Remedy:** change the wording to "the 90% test-coverage figure and the 80% rendering-cost figure".
- **Acceptance:** README text matches what the filter removes.

<a id="c-12"></a>

### C-12: The Agent Readiness Doctor article is a hand-maintained copy of the Markdown post
- **Severity:** Info · **Status:** Risk (no current drift)
- **Where:** `docs/design/kit/post.src.html:146-235` hard-codes the body and front matter of `content/posts/agent-readiness-doctor.md`. `build.mjs:229` injects only the poster. Every prose sentence currently matches the post. The topics line "DX · Tooling · Open Source" equals the front-matter tags. The scene copy at lines 154-179 is new illustration text, carrying its own disclaimer.
- **Remedy:** render the body from the Markdown, as `readerPost()` does, and keep only the scene hand-built.
- **Acceptance:** editing the post and rebuilding changes the article page.

<a id="c-13"></a>

### C-13: Secrets and contact-data grep found nothing
- **Severity:** Info · **Status:** Verified
- **Evidence:**
  - The only key-like strings are placeholders in `.env.example:5` (`RESEND_API_KEY=re_xxxxxxxxxxxx`) and `.env.example:9` (`whsec_xxxxxxxxxxxx`). No real `.env*` file is present.
  - There are no phone numbers in `data/`, `content/`, the kit or the docs.
  - The only email in the stripped artifacts is the placeholder `you@company.com` (`home.html` form).
  - Emails in source: the public `alipajand@gmail.com` (`data/links.ts:2`, tests, `utils/resend.ts:42` fallback), plus `@alipajand.com` and `security@ledgerguard.io` in `app/api/webhooks/resend/__tests__/route.spec.ts`. These are test fixtures.
  - The only images with PII are covered by C-05.
- **Acceptance:** n/a.

<a id="c-14"></a>

### C-14: Use of employer and third-party brand imagery has no recorded permission
- **Severity:** Info · **Status:** Untested
- **Where:** the AlwaysGeeky/Voxies marketplace and login images (character artwork, Voxies logo) and the GitBot poster, as used in `case-alwaysgeeky.html`, `agent-readiness-doctor.html` and the live site.
- **Remedy:** the owner confirms these are permitted portfolio uses. No change is implied.

---
