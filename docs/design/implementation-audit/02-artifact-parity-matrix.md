# Artifact parity matrix

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

Exact design values from the artifact source, set against the production values. Numbers come from source files (cited `path:line`) and from computed styles in the capture run; nothing is estimated. Side-by-side captures for every route at 1440 and 390 px are in [`captures/`](captures/).

### Computed in the browser (capture run)

| Property | Artifact | Production |
| --- | --- | --- |
| Body background | `rgb(15, 15, 14)` (#0f0f0e, `--ink`) | `rgb(0, 0, 0)` |
| Body text | `rgb(236, 236, 230)` (#ecece6, `--line`) | `rgb(250, 250, 250)` |
| Body font | `Archivo, "Helvetica Neue", Arial, sans-serif`, 16px | `GeistSans, "GeistSans Fallback"`, 16px |
| Loaded faces | Archivo 100–900, width 62%–125% (variable); Geist Mono 400 and 500 | GeistSans 100–900 |
| Home `<h1>` | "Ali Pajand" (display word, accessible name) | "I build product systems from the interface down: …" |
| Case-study screenshot dialog | 1 `<dialog>` per case study | none |
| Canvases | home 1, portfolio 2, open-source 1, writing 1, principles 1, now 1, not-found 1 | none |
| Mobile nav at 390 px | Links stay visible in a second row (no menu button) | Menu button opens a panel |

Captures for the rows above: [`captures/home-1440.jpg`](captures/home-1440.jpg), [`captures/case-ledgerguard-390.jpg`](captures/case-ledgerguard-390.jpg).

## Token parity (from source)

### 1. Token parity table

Production styling sources: `app/globals.css` (Tailwind v4, `@import "tailwindcss"`, `@theme inline` at globals.css:20-28; there is no `tailwind.config.*` file; PostCSS uses `@tailwindcss/postcss`), `app/layout.tsx` (fonts, viewport), `utils/visual.ts` (focus ring, CTA classes), component classNames.

#### 1.1 Colour

| Token | Artifact value (source) | Where used in artifact | Production value (source) | Gap |
| --- | --- | --- | --- | --- |
| `--ink` | `#0f0f0e` (kit/base.css:2; static/home.html:9; portfolio.html:8; open-source.html:9) | html/body ground (base.css:18-19), text on bone/line, rail ground (case.src.html:49), canvas fills `#0f0f0e` (home.html:724; portfolio.html:665; open-source.html:825) | `--background: #000000` (globals.css:5); `themeColor: "#000000"` (layout.tsx:96); `.bg-card { background-color:#000 }` (globals.css:446-448); `--surface-section: #0e0e0e` (globals.css:17, closest) | Ground differs (#000 vs #0f0f0e). Add `--ink`; update themeColor. |
| `--ink-2` | `#1b1b19` (base.css:3; home.html:10; open-source.html:10; absent from portfolio.html:7-21) | code blocks (open-source.html:134; reader.src.html:58-59), screenshot window (case.src.html:37), rail hover (case.src.html:54), Now active cell (now.src.html:34), compare row dividers (diagrams.css:22), why-list dividers (open-source.html:140), canvas active plate `#1b1b19` (portfolio.html:671) | `--card: #0a0a0a` (globals.css:11); `--organic-gray: #171717` (globals.css:14, inline code bg globals.css:363) | No equivalent; closest are #0a0a0a / #171717. |
| `--line` | `#ecece6` (base.css:6); canvas `LINE = "236,236,230"` (base.js:5; home.html:620; portfolio.html:534; open-source.html:697) | body text (base.css:19), focus outline (base.css:21), lit/inverted states, progress line (base.css:46), chips pressed (writing.src.html:49) | `--foreground: #fafafa` (globals.css:6); `--accent: #ffffff` (globals.css:9); `--organic-alabaster: #fafafa` (globals.css:15) | Warm off-white vs neutral #fafafa. |
| `--bone` | `#d8d8d3` (base.css:4) | light band (base.css:79; diagrams.css:29), card/row hover fill (home.html:110; portfolio.html:174; writing.src.html:25), hljs numbers (reader.src.html:63) | none | Missing. |
| `--bone-2` | `#c9c9c3` (base.css:5) | shell borders on band (base.css:80; case.src.html:94; now.src.html:36), hover on light CTAs (home.html:79; case.src.html:31), hljs strings (reader.src.html:62) | `--accent-muted: #e5e5e5` (globals.css:10, used as primary CTA hover in utils/visual.ts:40) | Missing. |
| `--rule` | `#5b5b56` (base.css:7) | every hairline (frame/shell, cells, chips, inputs), activity l0 stroke (open-source.html:186), `.cap__list` separator glyph (home.html:153) | `--border: #262626` (globals.css:12) | Production border is much darker (1.39:1 on #000 vs 2.81:1 on ink). |
| `--mute` | `#a3a39c` (base.css:8); canvas `rgba(163,163,156,…)` (home.html:731; portfolio.html:699; open-source.html:787,840; writing.src.html:263,287) | secondary text on ink everywhere (`.mute`, labels, captions, footer) | `--muted: #a3a3a3` (globals.css:8) | Near-identical luminance; hue differs (warm vs neutral). |
| `--mute-ink` | `#4b4b46` (base.css:9); canvas `#4b4b46` (home.html:731) | secondary text on bone/line (base.css:81,94; diagrams.css:14,30,51) | none | Missing. |
| placeholder | `#6f6f69` literal (home.html:211) | contact form placeholders | Tailwind default placeholder in ContactForm (not traced) | Untracked literal; fails AA (see Contrast table). |
| pre code | `#cfcfc8` literal (reader.src.html:60) | code text in reader | `var(--accent-muted)` #e5e5e5 (globals.css:384) | Literal outside tokens. |
| stack words | `#5d5d58` literal (portfolio.html:146) | even rows of decorative stack words (aria-hidden) | none | Literal outside tokens. |
| backdrop | `rgba(15, 15, 14, .86)` (case.src.html:134) | lightbox `::backdrop` | none (no dialog in prod) | — |
| accent | none ("no accent hue", ds/README.md:21) | — | `--organic-orange: #ea2b2b` (globals.css:13; selection globals.css:34-42; list markers 275-277; blockquote border 287; link hover 220) plus a colourful hljs palette `#ff8d7b #9ecb80 #d9a8ff #7fb6ff #f2c879` (globals.css:398-424) | Production has an accent and syntax colours the system explicitly rejects; decide removal. |
| color-scheme | `color-scheme: dark` (base.css:15) | — | `colorScheme: "dark"` (layout.tsx:97); `className="dark"` on html (layout.tsx:104) | Match. |

#### 1.2 Fonts

| Item | Artifact (source) | Production (source) | Gap |
| --- | --- | --- | --- |
| Loader | Google Fonts CSS, render-blocking `<link rel=stylesheet>` + 2 preconnects (kit/build.mjs:55-58; static/home.html:3-5; portfolio.html:3-5; open-source.html:3-5; every ds preview e.g. ds/components/Nav/preview.html:2) | `next/font` via `geist` package: `GeistSans` only (layout.tsx:2, applied layout.tsx:125 as `${GeistSans.variable} ${GeistSans.className}`) | Different families and loader. |
| Exact URL | `https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Geist+Mono:wght@400;500&display=swap` (build.mjs:58) | — | Archivo variable: axes ital (0,1), wdth 62–125, wght 100–900. Geist Mono static 400 and 500. `display=swap`. |
| `--display` | `"Archivo", "Arial Black", "Helvetica Neue", Arial, sans-serif` (base.css:10) | `.font-display { font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif }` (globals.css:106-108) | Archivo absent in prod. |
| `--sans` | `"Archivo", "Helvetica Neue", Arial, sans-serif` (base.css:11) | Geist Sans (layout.tsx:125) | Body face differs. |
| `--mono` | `"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace` (base.css:12) | no mono font loaded; `.prose code/pre` stack `ui-monospace, SFMono-Regular, "SF Mono", "Geist Mono", Menlo, …` (globals.css:351-357) | Geist Mono never loaded in prod (it is listed fourth, so system mono wins). `geist/font/mono` is available in the same package. |
| ds bundle vars | bundle.css remaps `--display: var(--font-display)`, `--sans: var(--font-sans)`, `--mono: var(--font-mono)` (build.mjs:252-259; ds/components/bundle.css:2-6) | prod defines `--font-geist-sans` only | `--font-display/-sans/-mono` undefined in prod. tokens.json `type.fonts: []` (tokens.json:71) carries no font declarations. |
| font-stretch values used | 125% (28 uses, e.g. base.css:57,73), 118% (12, e.g. base.css:92; diagrams.css:37), 120% (4, e.g. diagrams.css:32; case.src.html:64), 112% (4, e.g. reader.src.html:24; home.html:89), 115% (2, principles.src.html:40; open-source.html:159), 100% (5, resets, e.g. home.html:119; post.src.html:78) | none | All need Archivo's wdth axis. With next/font/google this requires `axes: ["wdth"]` (and italic `style: ["normal","italic"]`, used at base.css:67, home.html:121,134, portfolio.html:149, open-source.html:143, post.src.html:82). |
| Weights used | 800 (45), 500 (26), 600 (10), 400 (5), 700 (3), 900 (2: portfolio.html:145, not-found.src.html:8) | Geist Sans variable | Mono only needs 400/500 (URL). |
| Canvas fonts | literal `"Geist Mono"` / `"Archivo"` strings in `ctx.font` (home.html:716-721; portfolio.html:586-587; open-source.html:741,785,830,841; writing.src.html:248,256,285; principles.src.html:216; now.src.html:138; not-found.src.html:94) | n/a | next/font generates hashed family names; these literals will not resolve (D-08). |

#### 1.3 Type scale (every font-size, with line-height / tracking / case where set)

Global: body 16px / 1.5 (base.css:19). `.mono` 12px, `letter-spacing:.08em`, uppercase (base.css:24).

| Role | Value(s) (source) | Line-height / tracking / case | Production analogue |
| --- | --- | --- | --- |
| Display word `.name` | 11.6cqi (base.css:58; home.html:64); 11.4cqi ≤760 (home.html:255); 10.4cqi / 10.2cqi ≤760 (open-source.html:65,243); 8.8cqi case (case.src.html:12); 9.4cqi / 9.2cqi ≤760 writing (writing.src.html:21,73); 12.6cqi now (now.src.html:11) | .82; -.015em; uppercase; wght 800; stretch 125%; nowrap (base.css:57-59). fit.js may shrink, and with `data-grow` grow ≤1.5× and ≤16% of width (fit.js:3-4,26-28) | Hero title (components/Hero/HeroTitle.tsx) |
| Portfolio `.display` | 7.7cqi; 7.9cqi ≤760 (portfolio.html:117,265) | .86; -.01em; upper; 800; 125% | — |
| Principles `.display` | 10.2cqi; 10cqi ≤760 (principles.src.html:6,68) | .86; -.015em; upper; 800; 125% | — |
| 404 code | 24cqi (not-found.src.html:8) | .8; -.02em; 900; 125%; tabular-nums | NotFoundPageContent |
| Section head `.head h2` | clamp(34px, 5.4vw, 88px) (base.css:73; also portfolio.html:159 works head, open-source.html:153 band head); ≤760: min(34px, 9cqi) (base.css:110; open-source.html:250) | .9; upper; 800; 125%; text-wrap: balance | — |
| Case intro h2 | clamp(30px, 3.2vw, 52px) (case.src.html:17) | .92; upper; 800; 118% | — |
| Case section h3 | clamp(28px, 3vw, 50px); 9cqi ≤760 (case.src.html:64,156) | .92; upper; 800; 120% | — |
| Next/pager card title | clamp(20px, 2vw, 30px) (base.css:92); pager clamp(22px, 2.6vw, 40px) (case.src.html:125) | 1 / .95; upper; 800; 118% | — |
| Flow title / step | clamp(24px, 5.2cqi, 68px) (diagrams.css:32); step clamp(19px, 2.4cqi, 30px) (diagrams.css:37), JS shrinks to ≥14px (diagrams.js:46) | .9 / 1; upper; 800; 120% / 118% | components/diagrams/FlowDiagram.tsx |
| Home hero lede | clamp(23px, 2.3vw, 34px) (home.html:74; writing.src.html:9) | 1.16; 500; balance; 26ch | Hero |
| Portfolio hero lede | clamp(22px, 2.3vw, 32px) (portfolio.html:89) | 1.18; 400 (b 700, 112%) | — |
| Open-source h1 / lede | clamp(30px, 3.4vw, 52px) / clamp(20px, 1.8vw, 26px) (open-source.html:75-76) | .92 / 1.25 | — |
| Principles lede | clamp(19px, 1.65vw, 24px) (principles.src.html:14) | 1.4; 500 | — |
| Lead paragraph | clamp(19px, 1.6vw, 23px) (case.src.html:68; open-source.html:131 summary; principles.src.html:46) | 1.5 / 1.35 / 1.45 | — |
| Intro overview | clamp(18px, 1.5vw, 21px) (case.src.html:18); demo clamp(18px, 1.5vw, 21px) italic (open-source.html:143) | 1.5 / 1.35 | — |
| Outcome items | clamp(20px, 1.9vw, 28px) (case.src.html:109) | 1.3; 500 | — |
| Article prose | 18px / 1.72 (post.src.html:75), 18px / 1.7 (reader.src.html:41); 17px ≤760 (post.src.html:129; reader.src.html:99) | — | `.article-prose` 15px → 16px ≥640 / 1.75 (globals.css:189-199) |
| Article h2 | clamp(24px, 2.4vw, 36px) (post.src.html:77); clamp(24px, 2.6vw, 38px) (reader.src.html:44) | .98; upper; 800; 118% | 1.375rem / 1.3, 600 (globals.css:232-239) |
| Body items | 17px / 1.55 (case.src.html:70), 16px / 1.55 cells (case.src.html:74), decision 18px / 1.45 500 (case.src.html:84) | — | — |
| Caption / small text | 15px / 1.5 (diagrams.css:4,22,38,48,51; case.src.html:45; diagrams.css:11 at 1.45) | — | text-sm (14px) |
| Labels | 12px mono .08em upper (base.css:24); 13px nav links .1em (base.css:38); 12px nav ≤760 .06em (base.css:104); nav name 15px .12em 500 (base.css:36), 13px ≤760 (base.css:107); CTA 12px .1em (base.css:42); 11px related small / ev small / toc index (case.src.html:119; principles.src.html:54; reader.src.html:34) | — | `LABEL_OVERLINE` 11px, .12em, 600 (utils/visual.ts:33) |
| Chips | 12px mono .04em, pill (case.src.html:29; writing.src.html:46) | — | — |
| Activity graph labels | 9px mono .08em upper (open-source.html:184) | — | — |
| Ticker | 15px italic (base.css:67); now band: clamp(28px, 4.4cqi, 64px) 800 118% upper (now.src.html:41) | — | — |
| Other clamp() sizes | home: proof clamp(18px,1.7vw,24px) (89), case h3 clamp(30px,3.6vw,56px) (118), about h2 clamp(34px,5vw,80px) (132), pull clamp(20px,1.8vw,26px) (134), cap h3 clamp(22px,2.4vw,36px) (150), tool h3 clamp(18px,1.7vw,22px) (163), post--feature clamp(28px,3.2vw,50px) (181), contact h2 clamp(44px,8.6cqi,150px) (189). portfolio: band h2 clamp(26px,3.4vw,50px) (129), stackwords clamp(44px,7.4vw,120px) (145), work name clamp(24px,2.7vw,42px) (179), scene title clamp(26px,3.6vw,56px) / 7.2cqi ≤760 (196,254), contact h2 clamp(44px,9cqi,150px) (208). open-source: proj__n clamp(64px,8cqi,132px) (117), proj h3 clamp(26px,2.6vw,40px) (119), principle h3 clamp(22px,2.2vw,32px) (159), act dd clamp(26px,3.2vw,52px) (180), cta h2 clamp(34px,5cqi,92px) / 8.4cqi (209,271). writing: feature h3 clamp(32px,4.4cqi,72px) / 8cqi (30,81), why blockquote clamp(24px,2.8cqi,44px) / 22px (41,83), post h3 clamp(21px,1.9vw,28px) (59). now: overline clamp(22px,2.4vw,34px) (16), lede clamp(20px,2vw,30px) (17), cell h2 clamp(30px,4cqi,60px) / 10cqi (28,53), stack h2 clamp(30px,5.6cqi,88px) (39). principles: pr__n clamp(72px,9cqi,150px) (38), pr h2 clamp(26px,2.8vw,46px) / 7cqi (40,77), close quote clamp(30px,4.6cqi,80px) / 8.4cqi (60,82). post: title clamp(34px,5.8cqi,104px) / 8.4cqi (10,111), scene row clamp(13px,1.25vw,18px) (31). reader: h1 clamp(32px,5.2cqi,76px) / 8.4cqi (24,97), ahead lede clamp(18px,1.5vw,22px) (25), more h2 clamp(30px,4.6vw,72px) (76). 404: h1 clamp(34px,5cqi,76px) (13), ways clamp(28px,3.6cqi,56px) (18) | | Production uses Tailwind steps text-xs…text-5xl (61× text-sm etc.) |

Line-heights in use: 1.5 (18), .9 (16), 1.6 (8), 1.55 (7), .92 (7), 1.35/1.45/1.3/1/.95 (5 each), .86/.82/.8/.98/1.25 (3-4), 1.72, 1.7, 1.65, 1.4, 1.2, 1.18, 1.16, 1.15, 1.14, 1.05, .94, .88. Letter-spacing: .08em (23), .1em (8), .02em (7), .04em (6), .06em (5), -.01em (5), .12em (4), -.015em (4), -.02em (3), .3em (portfolio.html:162), 0 (post.src.html:25).

#### 1.4 Layout grid

| Item | Artifact (source) | Production | Gap |
| --- | --- | --- | --- |
| Frame | `.frame { padding-left: var(--gutter-l); padding-right: var(--gutter-r) }` (base.css:22) | `px-6 sm:px-10 lg:px-20` in Nav (components/Nav/Nav.tsx:33) | Different gutter model. |
| Gutters | `--gutter-l: max(16px, env(safe-area-inset-left, 0px))`, `--gutter-r: max(16px, env(safe-area-inset-right, 0px))` (base.css:13-14) | none; viewport has no `viewportFit` (layout.tsx:91-98) | `env(safe-area-inset-*)` is 0 unless `viewport-fit=cover` (artifact preview meta build.mjs:190 sets it). Add `viewport.viewportFit = "cover"` if adopting. |
| Shell | `.shell { border-left/right: 1px solid var(--rule); container-type: inline-size }` (base.css:23). No max-width: full-bleed minus gutters | `max-w-5xl mx-auto` = 64rem / 1024px (Nav.tsx:34; Hero.tsx:50; Testimonials.tsx:24; NotFoundPageContent.tsx:114) | Artifact is fluid full-width; prod caps at 1024px. All cqi display sizes assume the full-width shell. |
| Band breakout | `margin-left: calc(-1 * var(--gutter-l) - 1px)` etc. (case.src.html:93; now.src.html:37); static pages put the band outside `.shell` (home.html:412-435) | none | — |
| Column templates | 5fr/7fr (home.html:71,130; case.src.html:14; writing.src.html:6; principles.src.html:11,35; portfolio.html:126), 7fr/5fr (home.html:172,187; writing.src.html:24), 4fr/8fr (case.src.html:60; open-source.html:114; reader.src.html:13,27; now.src.html:13), 3fr/9fr (post.src.html:62; writing.src.html:39; principles.src.html:58), 3fr/3fr/6fr (post.src.html:12), `minmax(0,500px) minmax(0,1fr)` (portfolio.html:71), repeat(2/3/4) (base.css:88; home.html:86; open-source.html:155,167,176; portfolio.html:151), work row `64px 4fr 5fr 2fr 72px` (portfolio.html:168), index `56px 4fr 5fr 120px` (open-source.html:102), post row `170px 1fr 170px` (writing.src.html:54), nav `minmax(0,1fr) auto auto` (base.css:33), layers `40px 5fr 7fr` (diagrams.css:7), decision `56px 1fr` + `repeat(3)` (case.src.html:82,85) | Tailwind grid utilities | — |
| Container queries | `.shell` container (base.css:23); `.dg--flow` container (diagrams.css:29); `@container (min-width: 1000px)` flow steps become columns (diagrams.css:42-47) | none | — |
| Sticky offsets | rail `top:0` (case.src.html:49); section side `top:50px` + `scroll-margin-top:50px` (case.src.html:60,62,93); toc `top:0` (post.src.html:64; reader.src.html:29); proj/pr `top:0` (open-source.html:116; principles.src.html:37) | Nav `fixed top-0 z-50` (Nav.tsx:28); `#main-content { scroll-margin-top: 5.5rem }` (globals.css:96-98); article h2 `scroll-margin-top: 6rem` (globals.css:225) | Fixed prod nav would cover every `top:0` sticky element (D-27). |

#### 1.5 Borders, strokes, radii

| Item | Artifact | Production | Gap |
| --- | --- | --- | --- |
| Hairline | `1px solid var(--rule)` everywhere (e.g. base.css:23,33,34); on bone `1px solid var(--ink)` (base.css:82; diagrams.css:31,34) and shell `--bone-2` (base.css:80); inner dividers `1px solid var(--ink-2)` (diagrams.css:22; open-source.html:140; post.src.html:31); dashed last layer (diagrams.css:9); `currentColor` on tags/case__go (home.html:124-125) | `border-border` #262626, often `/70` (utils/visual.ts:31) | Lighter, warmer, fully opaque in artifact. |
| 2px strokes | progress `height:2px` (base.css:46; case.src.html:57; reader.src.html:37); `aria-current` underline thickness 2px (base.css:40); focus outline 2px (base.css:21) | ReadingProgress `h-[2px]` (ReadingProgress.tsx:28); focus `ring-2` + `ring-offset-2` (utils/visual.ts:35-36); globals focus `outline: 2px` offset 2px (globals.css:166-174) | Offsets differ (3px vs 2px); prod adds `border-radius: .25rem` to focus (globals.css:176-183). |
| Radii | 0 everywhere; `99px` chips (case.src.html:29; writing.src.html:46,64; now.src.html:44; reader.src.html:21; home.html:124; portfolio.html:184); `50%` dots (base.css:47; case.src.html:39) | rounded-sm (15), rounded-full (13), rounded-lg (10), rounded-xl (7), rounded-md (6), rounded-2xl (2); skip-link `.5rem`, main focus `.75rem`, pre `.75rem` (globals.css:54,103,370) | System is square; prod is rounded. |
| tokens.json | stroke-hairline 1px, stroke-progress 2px (tokens.json:224-236); radius-none 0, radius-pill 99px (tokens.json:210-222) | — | — |

#### 1.6 Spacing

tokens.json defines only 6, 12, 16, 24, 34px (tokens.json:181-208). Source actually uses padding/gaps of 2, 4, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 40, 44px (e.g. `.head` 34/24/18 base.css:72; `.next a` 22/24 base.css:89; `.foot > *` 14/24 base.css:97; `.ticker` 9 block base.css:65; nav gaps 22 base.css:37; intro 28/24 case.src.html:15; sec main 26/24 case.src.html:66; phones 16 inline nearly everywhere). Production uses Tailwind 4px steps. Gap: the token list under-describes the rhythm; a port needs either the raw values or a mapped scale (Tailwind arbitrary values like `p-[26px]` would scatter). Recommend extending tokens with 10, 14, 18, 22, 26, 28.

#### 1.7 Breakpoints

| Artifact | Source | Tailwind v4 default (prod) | Gap |
| --- | --- | --- | --- |
| `max-width: 960px` | case.src.html:141; principles.src.html:62; post.src.html:95; writing.src.html:68; reader.src.html:86; home.html:239; portfolio.html:222; open-source.html:224 | `lg` = min-width 64rem (1024px) | 961px vs 1024px |
| `max-width: 760px` | base.css:100; diagrams.css:55; every template | `md` = min-width 48rem (768px) | 761px vs 768px |
| `max-width: 420px` | home.html:282 (proof row only) | `sm` = 40rem (640px) | — |
| `@container (min-width: 1000px)` | diagrams.css:42 | — | needs `@container` support in Tailwind (v4 has `@container` variants) |
| `prefers-reduced-motion: reduce` | base.css:118; case.src.html:168; principles.src.html:84; post.src.html:131; home.html:287; portfolio.html:267; open-source.html:277 | used in globals.css:65,85,147,344,538,585 | — |

Production uses `sm:` 156×, `lg:` 15×, `md:` 9×, `xl:` 1×. The artifact is desktop-first `max-width`; a port should define `--breakpoint-*` in `@theme` (for example 761px and 961px) or use `max-[760px]:` variants, not the defaults.

#### 1.8 Z-index

| Artifact | Source | Production |
| --- | --- | --- |
| rail `z-index: 5` (sticky) | case.src.html:49 | Nav `z-50` fixed (Nav.tsx:28) |
| hero copy / coords / scroll cue `z-index: 1` | portfolio.html:79,93,95 | Hero stage `z-10` (Hero.tsx:50); hero hint `z-10` (Hero.tsx:116) |
| hover fills `::before z-index:-1` inside `isolation:isolate` | home.html:108,110; portfolio.html:166,174; writing.src.html:24-25 | — |
| (none) | — | ReadingProgress `z-[60]` (ReadingProgress.tsx:28); skip link `z-index:100` (globals.css:48) |

#### 1.9 Motion tokens

Durations/easings in source: chevron slide `.45s cubic-bezier(.6,.05,.2,1)` (base.css:28); card fill `.5s` (home.html:110), `.45s` (portfolio.html:174), `.55s` (writing.src.html:25) same curve; colour fades `.2s/.25s/.3s/.35s/.4s/.5s`; blink `2.4s ease-in-out infinite` (base.css:47-48); scroll cue `1.8s ease-in-out infinite` (portfolio.html:99-100). Production: GSAP `EASE`/`DUR`/`CINE` (utils/motion.ts), Lenis `duration: 1.1` (components/SmoothScroll/SmoothScroll.tsx:17). No shared token.

---

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| [A-10](#a-10) | Low | Risk | The home `<h1>` changes from the positioning line to the name |
| [A-11](#a-11) | Medium | Risk | Redesign IA and content changes need sign-off (CLAUDE.md conflicts) |
| [D-09](#d-09) | High | Verified failure (parity gap) | Font stack parity: production lacks Archivo (with wdth and italics) and Geist Mono; artifact uses render-blocking Google CSS |
| [D-21](#d-21) | Low | Risk | Hard-coded data assumptions in layout and drawing |
| [D-24](#d-24) | Low | Verified failure | Design-system bundle is not self-contained; tokens.json display size inconsistent |
| [D-26](#d-26) | Medium | Risk | Production integration conflicts: fixed nav, Lenis, progress duplicates |
| [D-27](#d-27) | Low | Untested | Mobile nav row width at 320px |

<a id="a-10"></a>

### A-10: The home `<h1>` changes from the positioning line to the name
- **Severity:** Low (positioning decision). **Status:** Risk.
- **Paths:** `components/Hero/Hero.tsx:60-63` (`HOMEPAGE_HERO_TITLE` as `<h1>`) vs `docs/design/pages/home.html:320-324` (`<h1 class="name">` Ali / Pajand).
- **Evidence:** `HOMEPAGE_HERO_TITLE = "I build product systems from the interface down: …"` (`data/homepage.ts:21-22`).
- **Remedy:** Ali decides. If the name becomes the h1, keep the positioning line as the first paragraph with the same text, and keep `HOME_TITLE`.
- **Acceptance:** A documented decision. Exactly one h1 on `/`.

<a id="a-11"></a>

### A-11: Redesign IA and content changes need sign-off (CLAUDE.md conflicts)
- **Severity:** Medium. **Status:** Risk.
- **Items:**
  - Hairline nav (`build.mjs:60`) drops "Principles" (production `data/nav.ts:7-13`) and renames Portfolio to "Work".
  - `build.mjs:102` `HIDDEN_FIGURE = /\b[89]0%/` removes LedgerGuard and Emplifi outcome lines that production shows. CLAUDE.md says "Do not silently change … project claims".
  - Hairline motion (tickers, scroll-tied display word, tilting hero screenshot; `docs/design/system/project/README.md` "Motion") vs CLAUDE.md "Avoid … Excessive animation" and "Avoid visual complexity on recruiter-facing index pages". The artifacts do honour `prefers-reduced-motion`: 2–3 rules per page.
  - Fonts: Archivo + Geist Mono, Google-hosted, vs `geist/font/sans` (CLAUDE.md "Keep typography consistent" / "Prefer existing … tokens").
  - "Additional experience" (`ProjectIndex.tsx:89-100`) has no Hairline equivalent.
  - Posts lose nothing, but the reader adds "More writing" links that production lacks.
- **Remedy:** List these as explicit decisions in the implementation plan before porting. Load Archivo through `next/font/google` (no new dependency).
- **Acceptance:** Each item has a recorded yes or no, and CLAUDE.md/AGENTS.md are updated where the Hairline rule wins.

<a id="d-09"></a>

### D-09 Font stack parity: production lacks Archivo (with wdth and italics) and Geist Mono; artifact uses render-blocking Google CSS
- Severity: High. Status: Verified failure (parity gap).
- Where: build.mjs:55-58 vs app/layout.tsx:2,125 and globals.css:106-108,351-357.
- Evidence: the whole display system depends on Archivo's width axis (font-stretch 112–125%, 50+ uses) and weights 400–900, plus italics (ticker, pull quotes, demo, blockquote). Production loads only Geist Sans. The artifact's Google Fonts stylesheet is render-blocking and loads both italic and roman variable files covering wght 100–900 and wdth 62–125 (larger than needed).
- Remedy: `next/font/google` `Archivo({ subsets: ["latin"], axes: ["wdth"], style: ["normal", "italic"], variable: "--font-archivo", display: "swap" })` (variable font, weight omitted) and `GeistMono` from `geist/font/mono` (`variable: "--font-geist-mono"`); map `--display`, `--sans`, `--mono` (and ds `--font-display/--font-sans/--font-mono`) to those variables in `@theme`. Consider dropping the italic file if italics are reduced to the ticker only.
- Acceptance: computed `font-family` of `.name` resolves to Archivo and `getComputedStyle(el).fontStretch === "125%"` visibly widens glyphs; no request to fonts.googleapis.com in the production network log; total font transfer for first view documented and under an agreed budget (for example 150 KB).

<a id="d-21"></a>

### D-21 Hard-coded data assumptions in layout and drawing
- Severity: Low. Status: Risk.
- Where: writing timeline fixed to `2026-01-01`–`2026-11-01` and 10 month ticks (writing.src.html:239,258), so posts after October 2026 draw off the right edge; principles index assumes exactly 10 items in 5 rows (principles.src.html:25-28); badges borders assume a count divisible by 4/3/2 (open-source.html:169-170,229-230,268-269); Now week ruler hard-codes 52 weeks and builds the year start from Toronto year but local time (now.src.html:130-131); "7 projects", "2 of 7 case studies", "4 of 7 tools" literals (open-source.html:319; home.html:405,523).
- Remedy: derive ranges and counts from data on the server; use `:nth-child` patterns that do not assume totals or grid gap-lines instead of per-cell borders.
- Acceptance: adding an 11th principle, a 13th badge or a November 2026 post renders without broken borders or off-canvas marks.

<a id="d-24"></a>

### D-24 Design-system bundle is not self-contained; tokens.json display size inconsistent
- Severity: Low. Status: Verified failure.
- Where: build.mjs:249-260 writes ds/components/bundle.css with `--display: var(--font-display)` etc. and no colour tokens, "left to its tokens.css"; no `tokens.css` exists under docs/design. tokens.json:84-89 states display-word 122px at 1440px "sized … 11.6cqi by default".
- Evidence: bundle.css alone has undefined `--ink`, `--line`, `--rule`, `--font-display`, …. At 1440px the shell content box is 1406px (1440 − 2×16 gutter − 2×1 border), so 11.6cqi ≈ 163px; 122px matches the case-study 8.8cqi (≈124px), not the default.
- Remedy: generate a `tokens.css` (or emit `:root` colour vars into bundle.css) from tokens.json; correct the token sample size or note which page it describes.
- Acceptance: opening any ds preview with only bundle.css + tokens.css renders correct colours and fonts; tokens.json sizes match a measured 1440px render.

<a id="d-26"></a>

### D-26 Production integration conflicts: fixed nav, Lenis, progress duplicates
- Severity: Medium. Status: Risk.
- Where: production Nav `fixed top-0 … z-50` (components/Nav/Nav.tsx:28), ReadingProgress fixed `z-[60]` (ReadingProgress.tsx:28), Lenis smooth scroll wraps the app (layout.tsx:134-139; SmoothScroll.tsx:17-19); artifact sticky elements at `top:0` (case.src.html:49; post.src.html:64; reader.src.html:29; open-source.html:116; principles.src.html:37), `scroll-margin-top: 50px` (case.src.html:60,93), nav progress inside the in-flow header (base.css:46), velocity derived from `scrollY` deltas (base.js:25).
- Evidence: a fixed 64px nav would cover sticky rails/TOCs pinned at `top:0` and anchor targets offset only 50px; two progress lines would show; Lenis interpolates scroll so `scrollY` deltas (and therefore ticker velocity) differ from native, and `scrollIntoView`/`ol.scrollTo` interplay with Lenis needs checking.
- Remedy: decide on one header model: the artifact's in-flow boxed nav (not fixed) matches the design; if a fixed/sticky header is kept, expose its height as `--header-h` and use it for every sticky `top` and `scroll-margin-top`. Remove ReadingProgress or the nav progress. Read velocity from Lenis (`lenis.velocity`) when Lenis is active.
- Acceptance: on a case study, the chapter rail is never covered; anchor jumps land with the section title fully visible below any sticky element; only one progress line exists.

<a id="d-27"></a>

### D-27 Mobile nav row width at 320px
- Severity: Low. Status: Untested.
- Where: base.css:103-104 (four links, `justify-content: space-between`, 12px uppercase, `.06em`, `white-space: nowrap`, 16px padding each side).
- Evidence: at 320px the row has about 254px of content width for "WORK", "WRITING", "OPEN SOURCE", "CONTACT" plus three 8px gaps; this is close to the limit and could overflow (no wrapping is allowed).
- Remedy: allow wrap or reduce letter-spacing at ≤360px; verify.
- Acceptance: no horizontal overflow at 320px (document `scrollWidth === clientWidth`).
