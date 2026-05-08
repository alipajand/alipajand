"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { ExperienceJobCard } from "components/Experience/ExperienceJobCard";
import { EXPERIENCE_SECTION_HEADING, EXPERIENCE_SECTION_LEDE } from "data/experience";
import { JOBS } from "data/jobs";
import { useExperienceCards } from "components/Experience/hooks/useExperienceCards";
import { SECTION_INNER, SECTION_LEDE_LG, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export function Experience() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 40, stagger: 0.06 });
  const {
    selectors: { cardsRef },
  } = useExperienceCards();

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2 id="experience-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`} data-reveal>
          {EXPERIENCE_SECTION_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-12 sm:mb-16`} data-reveal>
          {EXPERIENCE_SECTION_LEDE}
        </p>

        <div className="relative">
          <div
            className="absolute left-2.75 sm:left-3.75 top-0 bottom-0 w-px bg-border"
            aria-hidden
          />
          <ul ref={cardsRef} className="space-y-0">
            {JOBS.map((job) => (
              <ExperienceJobCard key={job.company} job={job} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
