"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { HIRE_PROOF_HEADING, HIRE_PROOF_INTRO, HIRE_PROOF_ITEMS } from "data/hireProof";
import {
  CARD_ACCENT,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
  SURFACE_BAND,
} from "utils/visual";

export function HireProof() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 28, stagger: 0.07 });

  return (
    <section
      id="why-hire"
      ref={sectionRef}
      aria-labelledby="hire-proof-heading"
      className={`${SECTION_SHELL} ${SURFACE_BAND}`}
    >
      <div className={SECTION_INNER}>
        <h2
          id="hire-proof-heading"
          className={`${SECTION_TITLE} mb-4 sm:mb-5`}
          data-reveal
        >
          {HIRE_PROOF_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG}`} data-reveal>
          {HIRE_PROOF_INTRO}
        </p>

        <ul className="mt-10 sm:mt-12 grid sm:grid-cols-2 gap-4 sm:gap-5 list-none p-0">
          {HIRE_PROOF_ITEMS.map((item) => (
            <li key={item.id} data-reveal>
              <article className={`group h-full ${CARD_ACCENT} p-5 sm:p-6 pl-4 sm:pl-5 backdrop-blur-sm`}>
                <h3 className="font-display font-semibold text-base sm:text-lg text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-muted text-[13px] sm:text-[15px] leading-relaxed">
                  {item.summary}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
