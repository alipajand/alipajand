# Capture measurements

> Audit of the Pajand Hairline design artifacts against the Next.js application.
> Frozen revision: `b8856fec6703f6213d5b6e4ac42a9c0f86b3f375` (PR #223 head, branch `ali/nostalgic-blackwell-0b3838`). The brief expected `6e0ffc8`; the head had advanced by three commits (`d6dc60a`, `89a649f`, `b8856fe`), all inside `docs/design/`.
> Application baseline: the same revision. Next.js 16.4.2, React 19.3.1 installed. `origin/main` is 6 commits ahead of the merge base `6f43749` (PR #222 and dependency bumps; see M-05).
> Every finding states a severity (Critical, High, Medium, Low, Info) and a status: **Verified failure** (reproduced from code, build output or capture), **Risk** (pattern confirmed, impact not reproduced) or **Untested** (could not be checked read-only).

## Method

- Production: `pnpm start -p 3456` serving the `.next` build of the frozen revision (built by the pre-push hook on the same commit).
- Artifacts: the generated `docs/design/pages/*.html`, served locally with a charset and viewport meta prepended (the published artifact wrapper adds those), from a static server.
- Browser: Playwright Core driving Chromium for Testing 1243, installed outside the repository (no dependency added). The script is [`../scripts/capture.mjs`](../scripts/capture.mjs); it expects `NODE_PATH` to contain `playwright-core`, `CHROME_PATH` to point at a Chromium binary, production on port 3456 and the generated pages (with `-pv.html` names, from `build.mjs --preview <dir>`) on port 4317. One fresh context per viewport and motion setting; each page loaded with `waitUntil: "load"`, then measured after 1.8 s.
- Viewports: 1440×900 and 390×844, motion on; 1440×900 with `reducedMotion: "reduce"`; production again at 1440×900 with JavaScript disabled.
- Script KB and Total KB: uncompressed response bodies. LCP and CLS: `PerformanceObserver` with `buffered: true`. Hidden text: elements in the first viewport with more than 20 characters of text and computed `opacity: 0`, outside `aria-hidden` subtrees. Horizontal overflow: `scrollWidth > clientWidth` on the root.
- Composites in this folder put the artifact on the left and production on the right, cropped to the first viewport.
- Artifact pages report no `lang` and no canonical here because the published wrapper supplies the document skeleton; production values are what the port must keep.

## Raw results

| Route | Side | Width | Reduced motion | HTTP | Script KB | Total KB | Requests | Height | Horizontal overflow | Hidden text | Canvases | Dialogs | DOM nodes | LCP ms | CLS | JSON-LD | Canonical |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| home | artifact | 1440 | no | 200 | 0 | 274 | 5 | 5933 | no | 0 | 1 | 0 | 471 | 144 | 0.012 | none | none |
| home | prod | 1440 | no | 200 | 780 | 1147 | 35 | 8250 | no | 2 | 0 | 0 | 747 | 328 | 0 | WebSite+Person+ProfilePage | https://alipajand.com/ |
| portfolio | artifact | 1440 | no | 200 | 0 | 269 | 5 | 6290 | no | 0 | 2 | 0 | 354 | 60 | 0 | none | none |
| portfolio | prod | 1440 | no | 200 | 728 | 1057 | 38 | 6346 | no | 0 | 0 | 0 | 414 | 44 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/portfolio |
| case-ledgerguard | artifact | 1440 | no | 200 | 0 | 575 | 4 | 7168 | no | 0 | 0 | 1 | 426 | 68 | 0 | none | none |
| case-ledgerguard | prod | 1440 | no | 200 | 728 | 1171 | 35 | 8100 | no | 0 | 0 | 0 | 515 | 696 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/ledgerguard |
| case-alwaysgeeky | artifact | 1440 | no | 200 | 0 | 630 | 4 | 6749 | no | 0 | 0 | 1 | 417 | 56 | 0.197 | none | none |
| case-alwaysgeeky | prod | 1440 | no | 200 | 728 | 1265 | 34 | 7444 | no | 0 | 0 | 0 | 508 | 2104 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/alwaysgeeky |
| case-emplifi | artifact | 1440 | no | 200 | 0 | 173 | 4 | 5161 | no | 0 | 0 | 1 | 346 | 60 | 0.084 | none | none |
| case-emplifi | prod | 1440 | no | 200 | 728 | 988 | 32 | 5351 | no | 1 | 0 | 0 | 455 | 72 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/emplifi |
| case-agent-tooling | artifact | 1440 | no | 200 | 0 | 175 | 4 | 5391 | no | 0 | 0 | 1 | 345 | 64 | 0.146 | none | none |
| case-agent-tooling | prod | 1440 | no | 200 | 728 | 991 | 32 | 5872 | no | 0 | 0 | 0 | 455 | 44 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/agent-tooling |
| case-tallyfolio | artifact | 1440 | no | 200 | 0 | 432 | 4 | 6453 | no | 0 | 0 | 1 | 400 | 56 | 0.062 | none | none |
| case-tallyfolio | prod | 1440 | no | 200 | 728 | 1122 | 34 | 7204 | no | 0 | 0 | 0 | 498 | 552 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/tallyfolio |
| case-controltech | artifact | 1440 | no | 200 | 0 | 173 | 4 | 4607 | no | 0 | 0 | 1 | 326 | 48 | 0 | none | none |
| case-controltech | prod | 1440 | no | 200 | 728 | 982 | 32 | 4645 | no | 1 | 0 | 0 | 424 | 36 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/controltech |
| case-mapbylaw | artifact | 1440 | no | 200 | 0 | 559 | 4 | 5904 | no | 0 | 0 | 1 | 365 | 56 | 0.069 | none | none |
| case-mapbylaw | prod | 1440 | no | 200 | 728 | 1287 | 34 | 6690 | no | 0 | 0 | 0 | 447 | 1324 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/mapbylaw |
| open-source | artifact | 1440 | no | 200 | 0 | 281 | 5 | 10425 | no | 0 | 1 | 0 | 1119 | 72 | 0.026 | none | none |
| open-source | prod | 1440 | no | 200 | 689 | 952 | 32 | 7146 | no | 2 | 0 | 0 | 489 | 56 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/open-source |
| writing | artifact | 1440 | no | 200 | 0 | 269 | 5 | 5017 | no | 0 | 1 | 0 | 401 | 56 | 0 | none | none |
| writing | prod | 1440 | no | 200 | 737 | 1066 | 40 | 5077 | no | 0 | 0 | 0 | 330 | 76 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/writing |
| post-ard | artifact | 1440 | no | 200 | 0 | 347 | 5 | 7350 | no | 0 | 0 | 0 | 257 | 44 | 0 | none | none |
| post-ard | prod | 1440 | no | 200 | 727 | 956 | 33 | 3954 | no | 1 | 0 | 0 | 280 | 44 | 0.002 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-readiness-doctor |
| post-reader | artifact | 1440 | no | 200 | 0 | 781 | 5 | 9950 | no | 0 | 0 | 0 | 484 | 80 | 0 | none | none |
| post-reader | prod | 1440 | no | 200 | 727 | 991 | 34 | 7127 | no | 2 | 0 | 0 | 474 | 56 | 0.002 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-instructions-are-code |
| principles | artifact | 1440 | no | 200 | 0 | 265 | 5 | 6387 | no | 0 | 1 | 0 | 480 | 44 | 0 | none | none |
| principles | prod | 1440 | no | 200 | 766 | 1053 | 39 | 4443 | no | 1 | 0 | 0 | 353 | 32 | 0 | WebSite+BreadcrumbList | https://alipajand.com/engineering-principles |
| now | artifact | 1440 | no | 200 | 0 | 154 | 4 | 1704 | no | 0 | 1 | 0 | 209 | 52 | 0 | none | none |
| now | prod | 1440 | no | 200 | 698 | 914 | 34 | 1954 | no | 1 | 0 | 0 | 196 | 32 | 0 | WebSite+BreadcrumbList | https://alipajand.com/now |
| not-found | artifact | 1440 | no | 200 | 0 | 149 | 4 | 907 | no | 0 | 1 | 0 | 64 | 32 | 0 | none | none |
| not-found | prod | 1440 | no | 404 | 727 | 978 | 37 | 1357 | no | 0 | 0 | 0 | 166 | 44 | 0.0 | WebSite | none |
| home | artifact | 1440 | yes | 200 | 0 | 274 | 5 | 5933 | no | 0 | 1 | 0 | 471 | 128 | 0.022 | none | none |
| home | prod | 1440 | yes | 200 | 780 | 1147 | 35 | 8235 | no | 0 | 0 | 0 | 719 | 64 | 0 | WebSite+Person+ProfilePage | https://alipajand.com/ |
| portfolio | artifact | 1440 | yes | 200 | 0 | 269 | 5 | 4591 | no | 0 | 2 | 0 | 354 | 44 | 0 | none | none |
| portfolio | prod | 1440 | yes | 200 | 728 | 1057 | 38 | 6343 | no | 0 | 0 | 0 | 412 | 44 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/portfolio |
| case-ledgerguard | artifact | 1440 | yes | 200 | 0 | 575 | 4 | 7168 | no | 0 | 0 | 1 | 426 | 56 | 0.057 | none | none |
| case-ledgerguard | prod | 1440 | yes | 200 | 728 | 1171 | 35 | 8100 | no | 0 | 0 | 0 | 515 | 48 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/ledgerguard |
| case-alwaysgeeky | artifact | 1440 | yes | 200 | 0 | 630 | 4 | 6749 | no | 0 | 0 | 1 | 417 | 56 | 0.062 | none | none |
| case-alwaysgeeky | prod | 1440 | yes | 200 | 728 | 1273 | 36 | 7444 | no | 0 | 0 | 0 | 508 | 72 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/alwaysgeeky |
| case-emplifi | artifact | 1440 | yes | 200 | 0 | 173 | 4 | 5161 | no | 0 | 0 | 1 | 346 | 56 | 0.029 | none | none |
| case-emplifi | prod | 1440 | yes | 200 | 728 | 992 | 33 | 5351 | no | 0 | 0 | 0 | 455 | 80 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/emplifi |
| case-agent-tooling | artifact | 1440 | yes | 200 | 0 | 175 | 4 | 5429 | no | 0 | 0 | 1 | 345 | 44 | 0.018 | none | none |
| case-agent-tooling | prod | 1440 | yes | 200 | 728 | 991 | 32 | 5872 | no | 0 | 0 | 0 | 455 | 32 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/agent-tooling |
| case-tallyfolio | artifact | 1440 | yes | 200 | 0 | 432 | 4 | 6453 | no | 0 | 0 | 1 | 400 | 56 | 0.03 | none | none |
| case-tallyfolio | prod | 1440 | yes | 200 | 728 | 1126 | 35 | 7204 | no | 0 | 0 | 0 | 498 | 60 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/tallyfolio |
| case-controltech | artifact | 1440 | yes | 200 | 0 | 173 | 4 | 4609 | no | 0 | 0 | 1 | 326 | 48 | 0.068 | none | none |
| case-controltech | prod | 1440 | yes | 200 | 728 | 987 | 33 | 4645 | no | 0 | 0 | 0 | 424 | 32 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/controltech |
| case-mapbylaw | artifact | 1440 | yes | 200 | 0 | 559 | 4 | 5904 | no | 0 | 0 | 1 | 365 | 64 | 0.029 | none | none |
| case-mapbylaw | prod | 1440 | yes | 200 | 728 | 1287 | 34 | 6690 | no | 0 | 0 | 0 | 447 | 36 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/mapbylaw |
| open-source | artifact | 1440 | yes | 200 | 0 | 281 | 5 | 10451 | no | 0 | 1 | 0 | 1119 | 72 | 0.015 | none | none |
| open-source | prod | 1440 | yes | 200 | 689 | 948 | 31 | 7143 | no | 0 | 0 | 0 | 481 | 44 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/open-source |
| writing | artifact | 1440 | yes | 200 | 0 | 269 | 5 | 5017 | no | 0 | 1 | 0 | 401 | 60 | 0 | none | none |
| writing | prod | 1440 | yes | 200 | 737 | 1066 | 40 | 5074 | no | 0 | 0 | 0 | 328 | 40 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/writing |
| post-ard | artifact | 1440 | yes | 200 | 0 | 347 | 5 | 5571 | no | 0 | 0 | 0 | 257 | 48 | 0 | none | none |
| post-ard | prod | 1440 | yes | 200 | 727 | 956 | 33 | 3948 | no | 0 | 0 | 0 | 264 | 36 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-readiness-doctor |
| post-reader | artifact | 1440 | yes | 200 | 0 | 781 | 5 | 9977 | no | 0 | 0 | 0 | 484 | 60 | 0.621 | none | none |
| post-reader | prod | 1440 | yes | 200 | 727 | 991 | 34 | 7121 | no | 0 | 0 | 0 | 456 | 56 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-instructions-are-code |
| principles | artifact | 1440 | yes | 200 | 0 | 265 | 5 | 6440 | no | 0 | 1 | 0 | 480 | 52 | 0 | none | none |
| principles | prod | 1440 | yes | 200 | 766 | 1101 | 42 | 4440 | no | 0 | 0 | 0 | 349 | 52 | 0 | WebSite+BreadcrumbList | https://alipajand.com/engineering-principles |
| now | artifact | 1440 | yes | 200 | 0 | 154 | 4 | 2175 | no | 0 | 1 | 0 | 209 | 56 | 0 | none | none |
| now | prod | 1440 | yes | 200 | 698 | 905 | 32 | 1951 | no | 0 | 0 | 0 | 194 | 32 | 0 | WebSite+BreadcrumbList | https://alipajand.com/now |
| not-found | artifact | 1440 | yes | 200 | 0 | 149 | 4 | 907 | no | 0 | 1 | 0 | 64 | 28 | 0 | none | none |
| not-found | prod | 1440 | yes | 404 | 727 | 978 | 37 | 1357 | no | 0 | 0 | 0 | 166 | 52 | 0.0 | WebSite | none |
| home | artifact | 390 | no | 200 | 0 | 274 | 5 | 10893 | no | 0 | 1 | 0 | 471 | 124 | 0.014 | none | none |
| home | prod | 390 | no | 200 | 738 | 1078 | 29 | 12064 | no | 2 | 0 | 0 | 745 | 152 | 0 | WebSite+Person+ProfilePage | https://alipajand.com/ |
| portfolio | artifact | 390 | no | 200 | 0 | 269 | 5 | 8874 | no | 0 | 2 | 0 | 354 | 48 | 0 | none | none |
| portfolio | prod | 390 | no | 200 | 686 | 986 | 30 | 8933 | no | 0 | 0 | 0 | 412 | 52 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/portfolio |
| case-ledgerguard | artifact | 390 | no | 200 | 0 | 575 | 4 | 12148 | no | 0 | 0 | 1 | 426 | 52 | 0 | none | none |
| case-ledgerguard | prod | 390 | no | 200 | 686 | 1112 | 29 | 9774 | no | 0 | 0 | 0 | 513 | 64 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/ledgerguard |
| case-alwaysgeeky | artifact | 390 | no | 200 | 0 | 630 | 4 | 11818 | no | 0 | 0 | 1 | 417 | 64 | 0.072 | none | none |
| case-alwaysgeeky | prod | 390 | no | 200 | 686 | 1205 | 28 | 9509 | no | 0 | 0 | 0 | 506 | 52 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/alwaysgeeky |
| case-emplifi | artifact | 390 | no | 200 | 0 | 173 | 4 | 9284 | no | 0 | 0 | 1 | 346 | 52 | 0.033 | none | none |
| case-emplifi | prod | 390 | no | 200 | 686 | 928 | 26 | 7550 | no | 1 | 0 | 0 | 453 | 60 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/emplifi |
| case-agent-tooling | artifact | 390 | no | 200 | 0 | 175 | 4 | 10646 | no | 0 | 0 | 1 | 345 | 48 | 0.051 | none | none |
| case-agent-tooling | prod | 390 | no | 200 | 686 | 931 | 26 | 8492 | no | 1 | 0 | 0 | 453 | 56 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/agent-tooling |
| case-tallyfolio | artifact | 390 | no | 200 | 0 | 432 | 4 | 11056 | no | 0 | 0 | 1 | 400 | 60 | 0.005 | none | none |
| case-tallyfolio | prod | 390 | no | 200 | 686 | 1062 | 28 | 8868 | no | 0 | 0 | 0 | 496 | 48 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/tallyfolio |
| case-controltech | artifact | 390 | no | 200 | 0 | 173 | 4 | 8298 | no | 0 | 0 | 1 | 326 | 40 | 0 | none | none |
| case-controltech | prod | 390 | no | 200 | 686 | 923 | 27 | 6781 | no | 1 | 0 | 0 | 422 | 56 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/controltech |
| case-mapbylaw | artifact | 390 | no | 200 | 0 | 559 | 4 | 10054 | no | 0 | 0 | 1 | 365 | 48 | 0.008 | none | none |
| case-mapbylaw | prod | 390 | no | 200 | 686 | 1227 | 28 | 8375 | no | 0 | 0 | 0 | 445 | 56 | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/mapbylaw |
| open-source | artifact | 390 | no | 200 | 0 | 281 | 5 | 17617 | no | 0 | 1 | 0 | 1119 | 64 | 0.0 | none | none |
| open-source | prod | 390 | no | 200 | 594 | 813 | 22 | 12920 | no | 0 | 0 | 0 | 486 | 36 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/open-source |
| writing | artifact | 390 | no | 200 | 0 | 269 | 5 | 8027 | no | 0 | 1 | 0 | 401 | 44 | 0 | none | none |
| writing | prod | 390 | no | 200 | 617 | 886 | 28 | 6931 | no | 0 | 0 | 0 | 326 | 44 | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/writing |
| post-ard | artifact | 390 | no | 200 | 0 | 347 | 5 | 9387 | no | 0 | 0 | 0 | 257 | 36 | 0 | none | none |
| post-ard | prod | 390 | no | 200 | 608 | 797 | 22 | 5805 | no | 1 | 0 | 0 | 276 | 52 | 0.005 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-readiness-doctor |
| post-reader | artifact | 390 | no | 200 | 0 | 781 | 5 | 16425 | no | 0 | 0 | 0 | 484 | 60 | 0 | none | none |
| post-reader | prod | 390 | no | 200 | 608 | 827 | 22 | 10531 | no | 1 | 0 | 0 | 470 | 56 | 0.004 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-instructions-are-code |
| principles | artifact | 390 | no | 200 | 0 | 265 | 5 | 9937 | no | 0 | 1 | 0 | 480 | 60 | 0 | none | none |
| principles | prod | 390 | no | 200 | 665 | 923 | 29 | 6500 | no | 0 | 0 | 0 | 350 | 48 | 0 | WebSite+BreadcrumbList | https://alipajand.com/engineering-principles |
| now | artifact | 390 | no | 200 | 0 | 154 | 4 | 2885 | no | 0 | 1 | 0 | 209 | 44 | 0 | none | none |
| now | prod | 390 | no | 200 | 579 | 751 | 23 | 2378 | no | 0 | 0 | 0 | 192 | 44 | 0 | WebSite+BreadcrumbList | https://alipajand.com/now |
| not-found | artifact | 390 | no | 200 | 0 | 149 | 4 | 888 | no | 0 | 1 | 0 | 64 | 36 | 0.0 | none | none |
| not-found | prod | 390 | no | 404 | 666 | 858 | 28 | 1619 | no | 0 | 0 | 0 | 163 | 52 | 0.002 | WebSite | none |
| home | prod-nojs | 1440 | no |  | 0 | 0 |  | 8235 | no | 0 | 0 | 0 | 711 |  | 0 | WebSite+Person+ProfilePage | https://alipajand.com/ |
| portfolio | prod-nojs | 1440 | no |  | 0 | 0 |  | 6343 | no | 0 | 0 | 0 | 408 |  | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/portfolio |
| case-ledgerguard | prod-nojs | 1440 | no |  | 0 | 0 |  | 8100 | no | 0 | 0 | 0 | 510 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/ledgerguard |
| case-alwaysgeeky | prod-nojs | 1440 | no |  | 0 | 0 |  | 7444 | no | 0 | 0 | 0 | 503 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/alwaysgeeky |
| case-emplifi | prod-nojs | 1440 | no |  | 0 | 0 |  | 5351 | no | 0 | 0 | 0 | 450 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/emplifi |
| case-agent-tooling | prod-nojs | 1440 | no |  | 0 | 0 |  | 5872 | no | 0 | 0 | 0 | 450 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/agent-tooling |
| case-tallyfolio | prod-nojs | 1440 | no |  | 0 | 0 |  | 7204 | no | 0 | 0 | 0 | 493 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/tallyfolio |
| case-controltech | prod-nojs | 1440 | no |  | 0 | 0 |  | 4645 | no | 0 | 0 | 0 | 419 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/controltech |
| case-mapbylaw | prod-nojs | 1440 | no |  | 0 | 0 |  | 6690 | no | 0 | 0 | 0 | 442 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/portfolio/mapbylaw |
| open-source | prod-nojs | 1440 | no |  | 0 | 0 |  | 7143 | no | 0 | 0 | 0 | 477 |  | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/open-source |
| writing | prod-nojs | 1440 | no |  | 0 | 0 |  | 5074 | no | 0 | 0 | 0 | 318 |  | 0 | WebSite+CollectionPage+BreadcrumbList | https://alipajand.com/writing |
| post-ard | prod-nojs | 1440 | no |  | 0 | 0 |  | 3948 | no | 0 | 0 | 0 | 259 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-readiness-doctor |
| post-reader | prod-nojs | 1440 | no |  | 0 | 0 |  | 7121 | no | 0 | 0 | 0 | 451 |  | 0 | WebSite+Article+BreadcrumbList | https://alipajand.com/writing/agent-instructions-are-code |
| principles | prod-nojs | 1440 | no |  | 0 | 0 |  | 4440 | no | 0 | 0 | 0 | 342 |  | 0 | WebSite+BreadcrumbList | https://alipajand.com/engineering-principles |
| now | prod-nojs | 1440 | no |  | 0 | 0 |  | 1951 | no | 0 | 0 | 0 | 189 |  | 0 | WebSite+BreadcrumbList | https://alipajand.com/now |
| not-found | prod-nojs | 1440 | no |  | 0 | 0 |  | 1357 | no | 0 | 0 | 0 | 158 |  | 0 | WebSite | none |
