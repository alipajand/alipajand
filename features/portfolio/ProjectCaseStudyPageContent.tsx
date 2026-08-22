"use client";

import type React from "react";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { MainReveal } from "components/MainReveal/MainReveal";
import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import { portfolioCaseStudyBreadcrumbs } from "data/breadcrumbs";
import type { Project } from "data/projects";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { PAGE_ARTICLE_SHELL, SECTION_INNER } from "utils/visual";

type ProjectCaseStudyPageContentProps = {
  project: Project;
  nextProject?: Project;
};

export const ProjectCaseStudyPageContent = ({
  project,
  nextProject,
}: ProjectCaseStudyPageContentProps) => {
  const {
    selectors: { sectionRef: articleRef },
  } = useScrollReveal({ y: 40, stagger: 0.08 });

  return (
    <MainReveal>
      <div className={`${PAGE_ARTICLE_SHELL} pt-28 sm:pt-32`}>
        <div className={SECTION_INNER}>
          <Breadcrumbs items={portfolioCaseStudyBreadcrumbs(project.name)} />

          <div ref={articleRef as React.RefObject<HTMLDivElement>}>
            <ProjectCaseStudyArticle project={project} nextProject={nextProject} isDedicatedPage />
          </div>
        </div>
      </div>
    </MainReveal>
  );
};
