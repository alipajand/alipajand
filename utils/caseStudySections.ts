import type {
  CaseStudySectionKey,
  Project,
  ProjectDecision,
  ProjectFigure,
  ProjectLink,
} from "data/projects";
import {
  PROJECT_CASE_STUDY_SECTION_CONTEXT,
  PROJECT_CASE_STUDY_SECTION_EVIDENCE,
  PROJECT_CASE_STUDY_SECTION_IMPROVE,
  PROJECT_CASE_STUDY_SECTION_OUTCOME,
  PROJECT_CASE_STUDY_SECTION_PROBLEM,
  PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_UX_DECISIONS,
  PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT,
  PROJECT_MY_ROLE_HEADING,
  PROJECT_SECTION_RELATED_HEADING,
} from "data/projectsUi";
import type { CompareDiagramSpec, FlowDiagramSpec, LayersDiagramSpec } from "utils/diagramBlocks";

/** The body of one numbered section, in the order the design kit lays them out. */
export type CaseSectionBody =
  | { kind: "lead"; text: string }
  | { kind: "items"; items: string[]; layout: "rows" | "cells" }
  | { kind: "decisions"; decisions: ProjectDecision[] }
  | { kind: "evidence"; figures: ProjectFigure[] }
  | { kind: "outcome"; items: string[] }
  | { kind: "related"; links: ProjectLink[] };

export interface CaseSectionModel {
  /** In-page anchor, as in the design kit ("context", "role", "technical-decisions"…). */
  id: string;
  /** The anchor this chapter had before the kit's ids ("ledgerguard-context"), kept for old links. */
  legacyId: string;
  title: string;
  body: CaseSectionBody;
  /** Layers and compare diagrams set inside the section, after its body. */
  diagrams: Array<LayersDiagramSpec | CompareDiagramSpec>;
  /** A flow diagram drawn as a full-bleed band right after the section. */
  flow?: FlowDiagramSpec;
}

/** Data keys whose anchor differs from the key itself. */
const SECTION_ID: Partial<Record<CaseStudySectionKey, string>> = { "ux-decisions": "ux" };

const sectionIdFor = (key: CaseStudySectionKey) => SECTION_ID[key] ?? key;

/** Section ids whose earlier anchor used a different key. */
const LEGACY_SECTION_KEY: Readonly<Record<string, string>> = { ux: "ux-decisions" };

/**
 * The anchor a section had before the case studies took the kit's ids: project id, then section
 * key, as in `ledgerguard-context` or `ledgerguard-ux-decisions`.
 */
export const legacySectionId = (projectId: string, id: string): string =>
  `${projectId}-${LEGACY_SECTION_KEY[id] ?? id}`;

/** The id the case-study title carried before the kit's ids, now kept on the display name. */
export const legacyTitleId = (projectId: string): string => `${projectId}-heading`;

/**
 * Builds the numbered sections of a case study from its project data. Sections with nothing to
 * show are left out, so numbering and the chapter rail always match what is on the page. The first
 * screenshot is the intro's hero shot; the rest form "Interface evidence".
 */
export const buildCaseSections = (project: Project): CaseSectionModel[] => {
  const cs = project.caseStudy;
  const evidence = cs.interfaceEvidence ?? [];
  const related = [...project.relatedLinks, ...project.liveLinks];

  const candidates: Array<{ id: string; title: string; body: CaseSectionBody | null }> = [
    {
      id: "context",
      title: PROJECT_CASE_STUDY_SECTION_CONTEXT,
      body: cs.context ? { kind: "lead", text: cs.context } : null,
    },
    {
      id: "problem",
      title: PROJECT_CASE_STUDY_SECTION_PROBLEM,
      body: cs.problem ? { kind: "lead", text: cs.problem } : null,
    },
    {
      id: "role",
      title: PROJECT_MY_ROLE_HEADING,
      body: cs.myRole.length ? { kind: "items", items: cs.myRole, layout: "rows" } : null,
    },
    {
      id: "built",
      title: PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT,
      body: cs.whatIBuilt.length ? { kind: "items", items: cs.whatIBuilt, layout: "cells" } : null,
    },
    {
      id: "technical-decisions",
      title: PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS,
      body: cs.technicalDecisions.length
        ? { kind: "decisions", decisions: cs.technicalDecisions }
        : null,
    },
    {
      id: "ux",
      title: PROJECT_CASE_STUDY_SECTION_UX_DECISIONS,
      body: cs.uxDecisions.length ? { kind: "items", items: cs.uxDecisions, layout: "rows" } : null,
    },
    {
      id: "evidence",
      title: PROJECT_CASE_STUDY_SECTION_EVIDENCE,
      body: evidence.length > 1 ? { kind: "evidence", figures: evidence.slice(1) } : null,
    },
    {
      id: "outcome",
      title: PROJECT_CASE_STUDY_SECTION_OUTCOME,
      body: cs.outcome.length ? { kind: "outcome", items: cs.outcome } : null,
    },
    {
      id: "improve",
      title: PROJECT_CASE_STUDY_SECTION_IMPROVE,
      body: cs.nextImprovements.length
        ? { kind: "items", items: cs.nextImprovements, layout: "rows" }
        : null,
    },
    {
      id: "related",
      title: PROJECT_SECTION_RELATED_HEADING,
      body: related.length ? { kind: "related", links: related } : null,
    },
  ];

  const sections: CaseSectionModel[] = candidates.flatMap(({ id, title, body }) =>
    body ? [{ id, legacyId: legacySectionId(project.id, id), title, body, diagrams: [] }] : []
  );

  for (const { section, spec } of cs.diagrams ?? []) {
    const target = sections.find((s) => s.id === sectionIdFor(section));
    if (!target) continue;
    if (spec.type === "flow") target.flow = spec;
    else target.diagrams.push(spec);
  }
  return sections;
};

/** "https://ledgerguard.io/" → "ledgerguard.io". */
export const hostOf = (href: string): string => href.replace(/^https?:\/\/|\/$/g, "");

/** Host shown in a screenshot's frame: the figure's own host, else the first live link's. */
export const figureHost = (project: Project, figure: ProjectFigure): string =>
  figure.host ?? (project.liveLinks[0] ? hostOf(project.liveLinks[0].href) : project.name);
