import { splitContentAtDiagramSlots, type ContentSegment } from "utils/diagramBlocks";

const TABLE_OPEN_RE = /<table>/g;
const TABLE_CLOSE_RE = /<\/table>/g;
const PRE_OPEN_RE = /<pre>/g;
const H2_ID_RE = /<h2 id="([^"]+)"/g;

const escapeAttribute = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export const wrapTables = (html: string, label: string): string =>
  html
    .replace(
      TABLE_OPEN_RE,
      `<div data-table="" role="region" tabindex="0" aria-label="${escapeAttribute(label)}"><table>`
    )
    .replace(TABLE_CLOSE_RE, "</table></div>");

export const focusableCode = (html: string, label: string): string =>
  html.replace(
    PRE_OPEN_RE,
    `<pre role="region" tabindex="0" aria-label="${escapeAttribute(label)}">`
  );

export interface ProseLabels {
  table: string;
  code: string;
}

export type ProseSegment =
  | { kind: "html"; html: string }
  | {
      kind: "diagram";
      index: number;
      sectionId?: string;
    };

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
