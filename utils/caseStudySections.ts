import type {
  CaseStudySectionKey,
  Project,
  ProjectDecision,
  ProjectFigure,
  ProjectLink,
  ReviewSample,
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

export type CaseSectionBody =
  | { kind: "lead"; text: string }
  | { kind: "items"; items: string[]; layout: "rows" | "cells" }
  | { kind: "decisions"; decisions: ProjectDecision[] }
  | { kind: "evidence"; figures: ProjectFigure[]; sample?: ReviewSample }
  | { kind: "outcome"; items: string[] }
  | { kind: "related"; links: ProjectLink[] };

export interface CaseSectionModel {
  id: string;
  legacyId: string;
  title: string;
  body: CaseSectionBody;
  diagrams: Array<LayersDiagramSpec | CompareDiagramSpec>;
  flow?: FlowDiagramSpec;
}

const SECTION_ID: Partial<Record<CaseStudySectionKey, string>> = { "ux-decisions": "ux" };

const sectionIdFor = (key: CaseStudySectionKey) => SECTION_ID[key] ?? key;

const LEGACY_SECTION_KEY: Readonly<Record<string, string>> = { ux: "ux-decisions" };

export const legacySectionId = (projectId: string, id: string): string =>
  `${projectId}-${LEGACY_SECTION_KEY[id] ?? id}`;

export const legacyTitleId = (projectId: string): string => `${projectId}-heading`;

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
      body:
        evidence.length > 1 || cs.reviewSample
          ? { kind: "evidence", figures: evidence.slice(1), sample: cs.reviewSample }
          : null,
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

export const hostOf = (href: string): string => href.replace(/^https?:\/\/|\/$/g, "");

export const figureHost = (project: Project, figure: ProjectFigure): string =>
  figure.host ?? (project.liveLinks[0] ? hostOf(project.liveLinks[0].href) : project.name);
