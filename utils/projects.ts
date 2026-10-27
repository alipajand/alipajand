import {
  type CaseStudyDiagram,
  PORTFOLIO_CASE_STUDY_ORDER,
  type Project,
  type ProjectCaseStudy,
  PROJECTS,
} from "data/projects";
import { PUBLIC_PROJECT_OVERRIDES, SUPPRESSED_CLAIMS } from "data/projectsPublication";

const projectOrder = new Map<string, number>(
  PORTFOLIO_CASE_STUDY_ORDER.map((id, index) => [id, index])
);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Matches a suppressed figure as a whole number ("80%", not "180%"). */
const figurePattern = (figure: string) => new RegExp(`(^|[^\\d.])${escapeRegExp(figure)}`);

/** The figures held back for one project. */
export const suppressedFiguresFor = (projectId: string): RegExp[] =>
  SUPPRESSED_CLAIMS.filter((claim) => claim.projectId === projectId).map((claim) =>
    figurePattern(claim.figure)
  );

const LIST_FIELDS = ["myRole", "whatIBuilt", "uxDecisions", "outcome", "nextImprovements"] as const;

const scrubDiagram = (diagram: CaseStudyDiagram, carries: (text: string) => boolean) => {
  const { spec } = diagram;
  if (spec.type === "flow") {
    return {
      ...diagram,
      spec: {
        ...spec,
        steps: spec.steps.map(({ detail, ...step }) =>
          detail && !carries(detail) ? { ...step, detail } : step
        ),
      },
    };
  }
  if (spec.type === "layers") {
    return {
      ...diagram,
      spec: {
        ...spec,
        layers: spec.layers.map(({ detail, ...layer }) =>
          detail && !carries(detail) ? { ...layer, detail } : layer
        ),
      },
    };
  }
  return {
    ...diagram,
    spec: {
      ...spec,
      columns: spec.columns.map((column) => ({
        ...column,
        items: column.items.filter((item) => !carries(item)),
      })),
    },
  };
};

/** Every string in a value with its path, for the final leak check. */
const walkStrings = (value: unknown, path: string, visit: (text: string, at: string) => void) => {
  if (typeof value === "string") visit(value, path);
  else if (Array.isArray(value))
    value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, visit));
  else if (value && typeof value === "object")
    Object.entries(value).forEach(([key, item]) => walkStrings(item, `${path}.${key}`, visit));
};

/**
 * The publishable version of a project: suppressed claims removed (see `data/projectsPublication`).
 * Throws when a figure survives in a field that has no override, so a new leak fails the build.
 */
export const toPublicProject = (project: Project): Project => {
  const patterns = suppressedFiguresFor(project.id);
  if (patterns.length === 0) return project;
  const carries = (text: string) => patterns.some((pattern) => pattern.test(text));

  const caseStudy: ProjectCaseStudy = { ...project.caseStudy };
  for (const key of LIST_FIELDS) caseStudy[key] = caseStudy[key].filter((line) => !carries(line));
  if (caseStudy.diagrams) {
    caseStudy.diagrams = caseStudy.diagrams.map((diagram) => scrubDiagram(diagram, carries));
  }

  const overrides = PUBLIC_PROJECT_OVERRIDES[project.id] ?? {};
  const publicProject: Project = {
    ...project,
    cardProblem:
      carries(project.cardProblem) && overrides.cardProblem
        ? overrides.cardProblem
        : project.cardProblem,
    caseStudyMetaDescription:
      carries(project.caseStudyMetaDescription) && overrides.caseStudyMetaDescription
        ? overrides.caseStudyMetaDescription
        : project.caseStudyMetaDescription,
    caseStudy,
  };

  walkStrings(publicProject, project.id, (text, at) => {
    if (carries(text)) {
      throw new Error(`Suppressed claim still published at ${at}; add an override.`);
    }
  });
  return publicProject;
};

const PUBLIC_PROJECTS: Project[] = PROJECTS.map(toPublicProject);

export const getOrderedProjects = (): Project[] =>
  [...PUBLIC_PROJECTS].sort(
    (a, b) =>
      (projectOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (projectOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
  );

export const getDedicatedCaseStudyProjects = (): Project[] =>
  getOrderedProjects().filter((project) => project.hasDedicatedCaseStudy);

export const getIndexOnlyProjects = (): Project[] =>
  getOrderedProjects().filter((project) => !project.hasDedicatedCaseStudy);

export const getProjectBySlug = (slug: string): Project | undefined =>
  PUBLIC_PROJECTS.find((project) => project.slug === slug);

export const getNextDedicatedCaseStudyProject = (slug: string): Project | undefined => {
  const dedicated = getDedicatedCaseStudyProjects();
  const index = dedicated.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return dedicated[index + 1];
};

export const getDedicatedCaseStudySlugs = (): string[] =>
  getDedicatedCaseStudyProjects().map((project) => project.slug);
