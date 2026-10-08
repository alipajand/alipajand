import { load } from "js-yaml";

export interface DiagramNode {
  label: string;
  detail?: string;
}

export interface DiagramColumn {
  label: string;
  items: string[];
}

interface DiagramBase {
  title: string;
  caption?: string;
}

export interface FlowDiagramSpec extends DiagramBase {
  type: "flow";
  steps: DiagramNode[];
  loop?: string;
}

export interface LayersDiagramSpec extends DiagramBase {
  type: "layers";
  layers: DiagramNode[];
}

export interface CompareDiagramSpec extends DiagramBase {
  type: "compare";
  columns: DiagramColumn[];
}

export interface McpWorkflowDiagramSpec {
  type: "mcp-workflow";
  caption?: string;
}

export type DiagramSpec =
  FlowDiagramSpec | LayersDiagramSpec | CompareDiagramSpec | McpWorkflowDiagramSpec;

export const DIAGRAM_SLOT_ATTR = "data-diagram-slot";

const DIAGRAM_FENCE_RE = /^```diagram[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/gm;

export const DIAGRAM_SLOT_RE = new RegExp(`<div ${DIAGRAM_SLOT_ATTR}="(\\d+)"></div>`, "g");

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const optionalString = (value: unknown): string | undefined =>
  isString(value) ? value.trim() : undefined;

const toNodes = (value: unknown): DiagramNode[] | null => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const nodes: DiagramNode[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { label, detail } = item as Record<string, unknown>;
    if (!isString(label)) return null;
    const trimmedDetail = optionalString(detail);
    nodes.push(
      trimmedDetail ? { label: label.trim(), detail: trimmedDetail } : { label: label.trim() }
    );
  }
  return nodes;
};

const toColumns = (value: unknown): DiagramColumn[] | null => {
  if (!Array.isArray(value) || value.length < 2) return null;
  const columns: DiagramColumn[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { label, items } = item as Record<string, unknown>;
    if (!isString(label) || !Array.isArray(items) || items.length === 0) return null;
    if (!items.every(isString)) return null;
    columns.push({ label: label.trim(), items: (items as string[]).map((i) => i.trim()) });
  }
  return columns;
};

export const parseDiagramSpec = (source: string): DiagramSpec => {
  const data = load(source);
  if (!data || typeof data !== "object") {
    throw new Error("Diagram block must be a YAML object");
  }
  const raw = data as Record<string, unknown>;
  const caption = optionalString(raw.caption);
  const withCaption = caption ? { caption } : {};

  if (raw.type === "mcp-workflow") {
    return { type: "mcp-workflow", ...withCaption };
  }

  if (!isString(raw.title)) {
    throw new Error("Diagram block needs a title");
  }
  const title = raw.title.trim();

  switch (raw.type) {
    case "flow": {
      const steps = toNodes(raw.steps);
      if (!steps || steps.length < 2) throw new Error(`Flow diagram "${title}" needs 2+ steps`);
      const loop = optionalString(raw.loop);
      return { type: "flow", title, steps, ...withCaption, ...(loop ? { loop } : {}) };
    }
    case "layers": {
      const layers = toNodes(raw.layers);
      if (!layers || layers.length < 2)
        throw new Error(`Layers diagram "${title}" needs 2+ layers`);
      return { type: "layers", title, layers, ...withCaption };
    }
    case "compare": {
      const columns = toColumns(raw.columns);
      if (!columns) throw new Error(`Compare diagram "${title}" needs 2+ columns with items`);
      return { type: "compare", title, columns, ...withCaption };
    }
    default:
      throw new Error(`Unknown diagram type: ${String(raw.type)}`);
  }
};

/**
 * Pulls ```diagram fences out of markdown and leaves an HTML slot in their place,
 * so the page can render each spec as an interactive component.
 */
export const extractDiagramBlocks = (
  markdown: string
): { markdown: string; diagrams: DiagramSpec[] } => {
  const diagrams: DiagramSpec[] = [];
  const output = markdown.replace(DIAGRAM_FENCE_RE, (_, source: string) => {
    const index = diagrams.push(parseDiagramSpec(source)) - 1;
    return `\n<div ${DIAGRAM_SLOT_ATTR}="${index}"></div>\n`;
  });
  return { markdown: output, diagrams };
};

export type ContentSegment = { kind: "html"; html: string } | { kind: "diagram"; index: number };

export const splitContentAtDiagramSlots = (html: string): ContentSegment[] => {
  const segments: ContentSegment[] = [];
  const parts = html.split(DIAGRAM_SLOT_RE);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      segments.push({ kind: "diagram", index: Number(part) });
    } else if (part.trim().length > 0) {
      segments.push({ kind: "html", html: part });
    }
  });
  return segments;
};
