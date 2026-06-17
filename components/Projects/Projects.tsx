"use client";

import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import { useProjectsReveal } from "components/Projects/hooks/useProjectsReveal";
import { SECTION_INNER_WIDE, SECTION_RULE, SECTION_X, SECTION_Y } from "utils/visual";

export const Projects = () => {
  const {
    selectors: { sectionRef, orderedProjects},
  } = useProjectsReveal();

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className={`${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`}
    >
      <div className={SECTION_INNER_WIDE}>
        <div className="space-y-0">
          {orderedProjects.map((project, index) => (
            <ProjectCaseStudyArticle
              key={project.id}
              project={project}
              nextProject={orderedProjects[index + 1]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
