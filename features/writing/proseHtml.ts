import { splitContentAtDiagramSlots, type ContentSegment } from "utils/diagramBlocks";

const TABLE_OPEN_RE = /<table>/g;
const TABLE_CLOSE_RE = /<\/table>/g;
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

export type ProseSegment =
  | { kind: "html"; html: string }
  | {
      kind: "diagram";
      index: number;
      /** The h2 the diagram follows, if any. */ sectionId?: string;
    };

/** The post body split at diagram slots, each diagram tagged with the section it belongs to. */
export const proseSegments = (html: string, tableLabel: string): ProseSegment[] => {
  let sectionId: string | undefined;
  return splitContentAtDiagramSlots(html).map((segment: ContentSegment): ProseSegment => {
    if (segment.kind === "diagram") return { ...segment, sectionId };
    for (const match of segment.html.matchAll(H2_ID_RE)) sectionId = match[1];
    return { kind: "html", html: wrapTables(segment.html, tableLabel) };
  });
};
