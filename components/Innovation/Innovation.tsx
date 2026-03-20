"use client";

import { useInnovationReveal } from "components/Innovation/hooks/useInnovationReveal";
import {
  INNOVATION_ITEMS,
  INNOVATION_SECTION_HEADING,
  INNOVATION_SECTION_INTRO,
} from "data/innovation";
import {
  CARD_SURFACE_HOVER,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

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
        <h2
          id="innovation-heading"
          className={`${SECTION_TITLE} mb-4 sm:mb-5`}
          data-reveal
        >
          {INNOVATION_SECTION_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-12 sm:mb-16`} data-reveal>
          {INNOVATION_SECTION_INTRO}
        </p>

        <ul ref={listRef} className="space-y-6">
          {INNOVATION_ITEMS.map((item) => (
            <li key={item.id}>
              <article
                data-innovation-card
                className={`${CARD_SURFACE_HOVER} p-6 sm:p-8`}
              >
                <h3 className="font-display font-semibold text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-muted text-[15px] sm:text-base leading-relaxed">
                  {item.description}
                </p>
                {item.videoUrl && (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted transition-colors"
                  >
                    {item.videoLabel ?? "Watch demo"}
                    <span aria-hidden>→</span>
                  </a>
                )}
                {item.videoLabel && !item.videoUrl && (
                  <p className="mt-4 text-sm text-muted">{item.videoLabel}</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
