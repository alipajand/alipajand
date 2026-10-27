import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import { portfolioCaseStudyBreadcrumbs } from "data/breadcrumbs";
import type { Project } from "data/projects";

type ProjectCaseStudyPageContentProps = {
  project: Project;
  nextProject?: Project;
};

export const ProjectCaseStudyPageContent = ({
  project,
  nextProject,
}: ProjectCaseStudyPageContentProps) => {
  return (
    <main id="main-content" tabIndex={-1}>
      <Breadcrumbs items={portfolioCaseStudyBreadcrumbs(project.name)} />
      <ProjectCaseStudyArticle project={project} nextProject={nextProject} isDedicatedPage />
    </main>
  );
};
