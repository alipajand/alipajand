"use client";

import { useProjectsReveal } from "components/Projects/hooks/useProjectsReveal";
import { ProjectCard } from "components/Projects/ProjectCard";
import { PROJECTS } from "data/projects";

export function Projects() {
  const {
    selectors: { sectionRef, listRef },
  } = useProjectsReveal();

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="projects-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4"
          data-reveal
        >
          Selected work
        </h2>
        <p className="text-muted text-lg mb-16" data-reveal>
          Real projects. For each: what was wrong, what we did, what we got.
        </p>

        <ul ref={listRef} className="space-y-6 sm:space-y-8">
          {PROJECTS.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
