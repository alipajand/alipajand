"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { ABOUT_PARAGRAPHS } from "data/site";

export function About() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

  const [first, second, third] = ABOUT_PARAGRAPHS;
  const [thirdLabel, ...thirdRest] = third.split(": ");
  const thirdBody = thirdRest.join(": ");

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32"
    >
      <div className="max-w-3xl">
        <h2
          id="about-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8"
          data-reveal
        >
          About
        </h2>
        <p className="text-muted text-lg leading-relaxed" data-reveal>
          {first}
        </p>
        <p className="mt-6 text-muted text-lg leading-relaxed" data-reveal>
          {second}
        </p>
        <p className="mt-6 text-muted text-lg leading-relaxed" data-reveal>
          <strong className="text-foreground">{thirdLabel}:</strong> {thirdBody}
        </p>
      </div>
    </section>
  );
}
