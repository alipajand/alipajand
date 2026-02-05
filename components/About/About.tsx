"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";

export function About() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });

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
          Senior Frontend Developer, specializing in React, TypeScript, Nextjs and high-performance
          UI. Expert in building scalable design systems and interactive 3D/animated web experiences
          within large-scale monorepos to small ones.
        </p>
        <p className="mt-6 text-muted text-lg leading-relaxed" data-reveal>
          Proven track record of bridging the gap between complex design concepts and performant,
          accessible production code. AI enthusiastic and looking to contribute to fast-moving teams
          and shape product vision and execution using agile methodology.
        </p>
      </div>
    </section>
  );
}
