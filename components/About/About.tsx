"use client";

import { ABOUT_HEADING, ABOUT_PARAGRAPHS } from "data/about";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { SECTION_INNER, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export const About = () => {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  return (
    <section id="about" ref={sectionRef} aria-labelledby="about-heading" className={SECTION_SHELL}>
      <div className={SECTION_INNER}>
        <h2 id="about-heading" className={`${SECTION_TITLE} mb-5 sm:mb-6`} data-reveal>
          {ABOUT_HEADING}
        </h2>
        <div className="max-w-3xl space-y-4">
          {ABOUT_PARAGRAPHS.map((paragraph) => (
            <p
              key={paragraph}
              data-reveal
              className="text-muted text-[15px] sm:text-base leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
