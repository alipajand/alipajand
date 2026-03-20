"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { ABOUT_PARAGRAPHS } from "data/site";
import { SECTION_INNER, SECTION_RULE, SECTION_TITLE, SECTION_X, SECTION_Y } from "utils/visual";

export function About() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  const [first, second, third] = ABOUT_PARAGRAPHS;

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className={`${SECTION_X} ${SECTION_Y} ${SECTION_RULE}`}
    >
      <div className={SECTION_INNER}>
        <h2 id="about-heading" className={`${SECTION_TITLE} mb-6 sm:mb-8`} data-reveal>
          About
        </h2>
        <p className="text-muted text-[15px] sm:text-lg leading-[1.65]" data-reveal>
          {first}
        </p>
        <p className="mt-6 text-muted text-[15px] sm:text-lg leading-[1.65]" data-reveal>
          {second}
        </p>
        <p
          className="mt-6 text-[15px] sm:text-lg leading-[1.65] text-foreground font-semibold"
          data-reveal
        >
          {third}
        </p>
      </div>
    </section>
  );
}
