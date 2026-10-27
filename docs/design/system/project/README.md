# Pajand Hairline

The visual system behind the redesigned pages of alipajand.com. Everything sits on near-black ink inside a hairline frame. A single light bone band carries the diagrams. Display type is wide Archivo in uppercase. Motion follows the reader's scroll, never a timer. The system has one dark theme on purpose.

Source: the page kit in `docs/design/kit` (base.css, diagrams.css, case.src.html). The built pages live in `docs/design/pages`. Content always comes from the site's own data (`data/*.ts`, `content/posts`), so a page is a layout over real text, never a mock.

## Content fundamentals

- Write like a senior engineer explaining a decision to another engineer: specific nouns, short sentences, no adjectives doing the work of evidence.
- Keep the site's text word for word. A redesign changes layout, never claims, dates, links or numbers.
- No invented metrics, customers, team sizes or outcomes. Lines carrying 80% or 90% figures are left off these pages.
- Labels are bracketed mono indexes, `[ 05 ]`, and they only number things that really are a sequence: case sections, flow steps, article headings.
- Headlines are uppercase display type. Body copy stays sentence case.

## Visual foundations

### Colour

Eight tokens, one theme. `ink` is the ground and `line` is the text. `rule` draws every hairline. `bone` is the one light surface: the band behind a flow diagram or the stack ticker, always full-bleed. Text on bone is `ink`, with `mute-ink` for labels. `mute` is the only secondary text colour on ink.

The lit state is an inversion, not a colour. An active rail chip, a hovered link row or the layer the reader has reached turns `line` with `ink` text. There is no accent hue and no semantic colour.

### Type

- **Display** (`--font-display`, Archivo at font-stretch 118–125%, weight 800, uppercase): the page word, section heads, card titles. Tight leading, .82 to 1.
- **Text** (`--font-sans`, Archivo at normal width): lead paragraphs, article prose, list items, captions.
- **Labels** (`--font-mono`, Geist Mono, 12px, letter-spacing .08em, uppercase): indexes, breadcrumbs, terms, dates.

Display sizes are fluid, in container units (`cqi`) of the shell or `clamp()`. The token values are the 1440px desktop sizes.

### Layout

- `.frame` holds the 16px safe-area gutter, and `.shell` is the bordered column inside it (`container-type: inline-size`).
- Pages are stacks of full-width rows separated by 1px `rule` lines. Inside a row, cells split with vertical hairlines, typically 4/8 or 5/7 columns. Everything collapses to one column below 760px.
- A bone band breaks out of the shell to both screen edges, with negative margins equal to the gutter. It stays inside the sticky container so a chapter rail keeps working over it.
- No radius except chips, and no shadows. Separation always comes from hairlines.

### Imagery

Screenshots sit in a hairline window with a mono title bar (three ring dots, the product host, the caption lead). Each opens full size in a dialog. On case studies the hero screenshot starts tilted back and flattens as the page scrolls. Images are always optional support. Every page reads complete without them.

## Motion

All motion is tied to scroll position or velocity:

- Tickers speed up with scroll velocity and reverse when scrolling up.
- The display word's two halves start apart, close as the page scrolls, and the spark between them rotates.
- The nav carries a 2px progress line, and the chapter rail and article contents carry their own.
- Diagrams light one layer or one flow step at a time as they cross the screen. Passed steps keep a check.
- The chevron row under a band fills in as it scrolls into view.

With `prefers-reduced-motion: reduce`, every animation and transition stops, tickers become static wrapped lists, flow steps show as done, and nothing depends on scrolling to be read.

## Iconography

There are three line symbols, all drawn at the stroke tokens, plus the chevron used in bands (see the Icons asset group):

- `spark`: the four-point star between the halves of the display word and between ticker items.
- `ring`: an orbit mark used in tickers.
- `chev`: a triple chevron that slides 8px right on hover inside every link row and card.

No emoji and no pictorial icons.

## Components

| Component | Group | Use |
| --- | --- | --- |
| Nav | Chrome | Boxed site header with the open-to-roles status and the progress line |
| DisplayWord | Chrome | The one uppercase page word, split around a spark |
| Ticker | Chrome | Velocity-reactive marquee of short items |
| NextLinks | Chrome | Three boxed cards to other pages, plus the footer |
| FactsPanel | Case study | Role, timeframe and stack chips, with live links |
| ChapterRail | Case study | Sticky numbered section bar with progress |
| CaseSection | Case study | Sticky numbered title beside the section body |
| DecisionCard | Case study | Decision with Why, Trade-off and Result |
| ScreenshotFrame | Case study | Hairline window around a product screenshot |
| LayersDiagram | Diagrams | Stacked system layers, lit one at a time |
| CompareDiagram | Diagrams | A dim column of failure modes beside a lit column |
| FlowBand | Diagrams | Numbered steps on the bone band, lit in order |

The diagram specs match `utils/diagramBlocks.ts`, so the same YAML blocks that render in articles render here.

## Building a page

1. Write `<name>.src.html` in `docs/design/kit` with the placeholders `@@HEAD@@`, `@@BASE_CSS@@`, `@@CHROME@@`, `@@NAV:<current>@@`, `@@FOOT@@` and `@@BASE_JS@@`.
2. Read content from the site's data in `build.mjs` and pass it in as JSON.
3. Link with `@@L:/site/path@@` or `link("/site/path")`. `urls.json` maps site paths to published pages; anything unmapped points at alipajand.com.
4. Run `node docs/design/kit/build.mjs` and check the page at 1440px and 375px, with no horizontal scroll and no console errors.

## Accessibility

- Text pairs: `line` on `ink` (16:1), `mute` on `ink` (7.6:1), `ink` on `bone` (12:1), `mute-ink` on `bone` (about 6:1).
- `rule` is decorative. Links and buttons get their affordance from text, chevrons and the inverted hover, never from a border alone.
- Focus is a 2px `line` outline everywhere, inverted to `ink` on light cards.
- Diagrams are real lists and figures with captions. Display words carry an `aria-label` with the real name. Tickers are `aria-hidden`, and their content is also listed in the page.

## Not synced

- There is no `bundle.js`. The components are CSS (`components/bundle.css`, generated from the kit), and the previews are static renditions of the kit's markup.
- The fonts are Google-hosted (Archivo, Geist Mono), so no font files are copied here.
- There is no logo. The name is set in plain type.
