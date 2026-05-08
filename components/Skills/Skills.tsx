"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import {
  EXPERTISE_AREAS,
  EXPERTISE_CORE,
  EXPERTISE_CORE_LABEL,
  EXPERTISE_SECTION_HEADING,
  EXPERTISE_SECTION_LEDE,
} from "data/expertise";
import { SkillsExpertiseArea } from "components/Skills/SkillsExpertiseArea";
import { SECTION_INNER, SECTION_LEDE_LG, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export function Skills() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 24, stagger: 0.08 });

  return (
    <section
      id="expertises"
      ref={sectionRef}
      aria-labelledby="expertise-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2 id="expertise-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`} data-reveal>
          {EXPERTISE_SECTION_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-10 sm:mb-12`} data-reveal>
          {EXPERTISE_SECTION_LEDE}
        </p>
        <div className="space-y-10">
          {EXPERTISE_AREAS.map((area) => (
            <SkillsExpertiseArea key={area.title} area={area} />
          ))}
        </div>
        <p className="mt-16 text-muted text-base" data-reveal>
          <strong className="text-foreground">{EXPERTISE_CORE_LABEL}</strong> {EXPERTISE_CORE}
        </p>
      </div>
    </section>
  );
}
