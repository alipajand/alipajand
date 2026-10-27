# Site redesign: Pajand Hairline

Design explorations for a full redesign of alipajand.com. Each page is a single self-contained HTML file built from the site's own data, so the text matches the live site word for word. The pages are not wired into the Next.js app. They are a reference for a later implementation.

## Pages

| Page | Site route | File | Published preview |
| --- | --- | --- | --- |
| Home | `/` | [pages/home.html](pages/home.html) | https://claude.ai/artifact/RhQogPSvmVxoxcpBKfwZE6 |
| Portfolio | `/portfolio` | [pages/portfolio.html](pages/portfolio.html) | https://claude.ai/artifact/9TUST53v4UnUs7Hj2BToJ5 |
| LedgerGuard | `/portfolio/ledgerguard` | [pages/case-ledgerguard.html](pages/case-ledgerguard.html) | https://claude.ai/artifact/4sdB8697b2qpfmQArEkZ6v |
| AlwaysGeeky Games | `/portfolio/alwaysgeeky` | [pages/case-alwaysgeeky.html](pages/case-alwaysgeeky.html) | https://claude.ai/artifact/5pYFq8zkJSZzkkYwxyBwhw |
| Emplifi | `/portfolio/emplifi` | [pages/case-emplifi.html](pages/case-emplifi.html) | https://claude.ai/artifact/A9nYf9R1Ltk32JYjQMNEaq |
| Agent Tooling | `/portfolio/agent-tooling` | [pages/case-agent-tooling.html](pages/case-agent-tooling.html) | https://claude.ai/artifact/UrP9eUpSXDJAoto7SM46Yn |
| TallyFolio | `/portfolio/tallyfolio` | [pages/case-tallyfolio.html](pages/case-tallyfolio.html) | https://claude.ai/artifact/PJzBMyJ9vQJ9u9Wpk4jiw9 |
| ControlTech | `/portfolio/controltech` | [pages/case-controltech.html](pages/case-controltech.html) | https://claude.ai/artifact/8sBpRgjrXNsK313wjNaBrj |
| MapBylaw | `/portfolio/mapbylaw` | [pages/case-mapbylaw.html](pages/case-mapbylaw.html) | https://claude.ai/artifact/Ez5bX39cieti12y95JwNP9 |
| Open source | `/open-source` | [pages/open-source.html](pages/open-source.html) | https://claude.ai/artifact/31CgkES3BDjxyGvxFQ2FNa |
| Writing | `/writing` | [pages/writing.html](pages/writing.html) | https://claude.ai/artifact/HP489SMrFwiakCoTwVUJvB |
| Agent Readiness Doctor | `/writing/agent-readiness-doctor` | [pages/agent-readiness-doctor.html](pages/agent-readiness-doctor.html) | https://claude.ai/artifact/3Sx5hgAkussh86nMQuy1e7 |
| Article reader (every other post) | `/writing/<slug>` | [pages/writing-reader.html](pages/writing-reader.html) | https://claude.ai/artifact/EwmjeKW4abUewm7znxnD6X |
| Engineering principles | `/engineering-principles` | [pages/engineering-principles.html](pages/engineering-principles.html) | https://claude.ai/artifact/UEJn3JNHs6gMWhVjaYPT9a |
| Now | `/now` | [pages/now.html](pages/now.html) | https://claude.ai/artifact/NWAFxKDy1pf5wT617NFaHZ |
| Not found | 404 | [pages/not-found.html](pages/not-found.html) | https://claude.ai/artifact/1rKSHAEmNatbGeEdAsQnNU |

The reader is one page for every post except Agent Readiness Doctor. A post opens by its slug in the hash, for example `…/EwmjeKW4abUewm7znxnD6X#design-systems-that-stick`.

The published previews are private until shared from each page's Share menu.

## Design system

The system is documented in [system/project/README.md](system/project/README.md). It covers tokens, type, layout, motion, iconography and 12 components, and it is published at https://claude.ai/artifact/SeGvNgZYjzVP5SLkJVhTbg.

- `system/project/tokens.json`: colours, type styles, spacing, radius and stroke.
- `system/project/components/<Name>/`: guidelines and a static preview for each component.
- `system/project/components/bundle.css`: component styles, generated from the kit.

## Building

The kit in `kit/` turns the site's data into the pages:

- `build.mjs` reads `data/*.ts` and `content/posts`.
- `base.css`, `base.js`, `chrome.html`, `diagrams.css` and `diagrams.js` are shared by every page.
- Each `<page>.src.html` file is one page template, and `static/` holds the hand-built home, portfolio and open-source pages.
- `img/` holds screenshots, resized and with the capture bar cropped off.

Build with Node 24 from the repository root:

```bash
node --no-warnings docs/design/kit/build.mjs
```

This writes `pages/*.html` and `system/project/components/bundle.css`.

### Links between pages

`kit/urls.json` maps site routes to the published preview of each page, so links between pages stay inside the previews. Any route it does not map points at alipajand.com. The `"/writing/*"` entry is the reader, and post links become `<reader>#<slug>`.

## Content rules

- Text comes from the site's data unchanged.
- Lines with 80% or 90% coverage figures are left out: the LedgerGuard testing outcome, and the Emplifi outcome item and flow-step detail.
- The LedgerGuard dashboard screenshot shows the account email, as it does on the live site.
