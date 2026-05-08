"use client";

import { InnovationListItem } from "components/Innovation/InnovationListItem";
import { useInnovationReveal } from "components/Innovation/hooks/useInnovationReveal";
import {
  INNOVATION_ITEMS,
  INNOVATION_SECTION_HEADING,
  INNOVATION_SECTION_INTRO,
} from "data/innovation";
import { SECTION_INNER, SECTION_LEDE_LG, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export function Innovation() {
  const {
    selectors: { sectionRef, listRef },
  } = useInnovationReveal();

  return (
    <section
      id="innovation"
      ref={sectionRef}
      aria-labelledby="innovation-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <h2 id="innovation-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`} data-reveal>
          {INNOVATION_SECTION_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-12 sm:mb-16`} data-reveal>
          {INNOVATION_SECTION_INTRO}
        </p>

        <ul ref={listRef} className="space-y-6">
          {INNOVATION_ITEMS.map((item) => (
            <InnovationListItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
