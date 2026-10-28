import { splitContentAtDiagramSlots, type ContentSegment } from "utils/diagramBlocks";

const TABLE_OPEN_RE = /<table>/g;
const TABLE_CLOSE_RE = /<\/table>/g;
/** `renderHighlightedCode` writes `<pre>` with no attributes, and the sanitiser keeps none on it. */
const PRE_OPEN_RE = /<pre>/g;
const H2_ID_RE = /<h2 id="([^"]+)"/g;

const escapeAttribute = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Wraps each table in a focusable, labelled region so a wide table scrolls inside the column
 * (and from the keyboard) instead of pushing the page sideways.
 */
export const wrapTables = (html: string, label: string): string =>
  html
    .replace(
      TABLE_OPEN_RE,
      `<div data-table="" role="region" tabindex="0" aria-label="${escapeAttribute(label)}"><table>`
    )
    .replace(TABLE_CLOSE_RE, "</table></div>");

/**
 * Makes each code block a focusable, labelled region. Code scrolls sideways inside its block, and
 * WebKit (unlike Chromium) does not let the keyboard reach a scroller that has no focusable content.
 * Every block gets it, not just the ones that overflow at build time: overflow depends on the
 * viewport, the loaded font and the reader's zoom, and this HTML is fixed at build. This runs after
 * sanitising, like `wrapTables`, so the post allowlist stays free of focus and ARIA attributes.
 */
export const focusableCode = (html: string, label: string): string =>
  html.replace(
    PRE_OPEN_RE,
    `<pre role="region" tabindex="0" aria-label="${escapeAttribute(label)}">`
  );

export interface ProseLabels {
  /** Accessible name for each table's scroll region. */
  table: string;
  /** Accessible name for each code block's scroll region. */
  code: string;
}

export type ProseSegment =
  | { kind: "html"; html: string }
  | {
      kind: "diagram";
      index: number;
      /** The h2 the diagram follows, if any. */ sectionId?: string;
    };

/** The post body split at diagram slots, each diagram tagged with the section it belongs to. */
export const proseSegments = (html: string, labels: ProseLabels): ProseSegment[] => {
  let sectionId: string | undefined;
  return splitContentAtDiagramSlots(html).map((segment: ContentSegment): ProseSegment => {
    if (segment.kind === "diagram") return { ...segment, sectionId };
    for (const match of segment.html.matchAll(H2_ID_RE)) sectionId = match[1];
    return {
      kind: "html",
      html: focusableCode(wrapTables(segment.html, labels.table), labels.code),
    };
  });
};
