import { PORTFOLIO_CASE_STUDY_ORDER, type Project, PROJECTS } from "data/projects";

const projectOrder = new Map<string, number>(
  PORTFOLIO_CASE_STUDY_ORDER.map((id, index) => [id, index])
);

export const getOrderedProjects = (): Project[] =>
  [...PROJECTS].sort(
    (a, b) =>
      (projectOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (projectOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
  );

export const getDedicatedCaseStudyProjects = (): Project[] =>
  getOrderedProjects().filter((project) => project.hasDedicatedCaseStudy);

export const getIndexOnlyProjects = (): Project[] =>
  getOrderedProjects().filter((project) => !project.hasDedicatedCaseStudy);

export const getProjectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((project) => project.slug === slug);

export const getNextDedicatedCaseStudyProject = (slug: string): Project | undefined => {
  const dedicated = getDedicatedCaseStudyProjects();
  const index = dedicated.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return dedicated[index + 1];
};

export const getDedicatedCaseStudySlugs = (): string[] =>
  getDedicatedCaseStudyProjects().map((project) => project.slug);
