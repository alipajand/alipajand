"use client";

import { useEffect, useRef } from "react";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { MainReveal } from "components/MainReveal/MainReveal";
import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import { portfolioCaseStudyBreadcrumbs } from "data/breadcrumbs";
import type { Project } from "data/projects";
import { gsap, prefersReducedMotion, registerGSAPPlugins } from "utils/gsap";
import { DUR, EASE } from "utils/motion";
import { PAGE_ARTICLE_SHELL, SECTION_INNER } from "utils/visual";

type ProjectCaseStudyPageContentProps = {
  project: Project;
  nextProject?: Project;
};

export const ProjectCaseStudyPageContent = ({
  project,
  nextProject,
}: ProjectCaseStudyPageContentProps) => {
  const breadcrumbRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    const els = [breadcrumbRef.current, articleRef.current].filter(Boolean);
    if (!els.length) return;

    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(els, { opacity: 0, y: 24 });
    const tl = gsap.timeline({ delay: 0.05, defaults: { ease: EASE.smooth } });
    tl.to(els, { opacity: 1, y: 0, duration: DUR.md, stagger: 0.08 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <MainReveal>
      <div className={`${PAGE_ARTICLE_SHELL} pt-28 sm:pt-32`}>
        <div className={SECTION_INNER}>
          <Breadcrumbs ref={breadcrumbRef} items={portfolioCaseStudyBreadcrumbs(project.name)} />

          <div ref={articleRef}>
            <ProjectCaseStudyArticle project={project} nextProject={nextProject} isDedicatedPage />
          </div>
        </div>
      </div>
    </MainReveal>
  );
};
