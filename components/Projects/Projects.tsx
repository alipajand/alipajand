"use client";

import { useProjectsReveal } from "components/Projects/hooks/useProjectsReveal";
import { ProjectCard } from "components/Projects/ProjectCard";
import { PROJECTS } from "data/projects";
import { SECTION_INNER_WIDE, SECTION_RULE, SECTION_X, SECTION_Y } from "utils/visual";

export function Projects() {
  const {
    selectors: { sectionRef, listRef },
  } = useProjectsReveal();

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className={`${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`}
    >
      <div className={SECTION_INNER_WIDE}>
        <h2
          id="projects-heading"
          className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground mb-4 sm:mb-5"
          data-reveal
        >
          Case studies
        </h2>
        <p className="text-muted text-base sm:text-lg mb-10 sm:mb-12  leading-relaxed" data-reveal>
          Outcome first, then how the work was structured—technical signals up front, full stack on
          request. Serious write ups, not a gallery.
        </p>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_12.5rem] xl:grid-cols-[minmax(0,1fr)_13.5rem] lg:gap-10 xl:gap-12 lg:items-start">
          <ul ref={listRef} className="space-y-12 sm:space-y-14 min-w-0">
            {PROJECTS.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>

          <nav className="hidden lg:block sticky top-28 self-start" aria-label="Jump to case study">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted mb-3">
              On this page
            </p>
            <ul className="space-y-1.5 text-sm border-l border-border pl-3">
              {PROJECTS.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#project-${p.id}`}
                    className="block py-1 text-muted hover:text-foreground transition-colors leading-snug"
                  >
                    {p.navLabel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
