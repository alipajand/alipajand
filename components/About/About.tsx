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
          Senior Product Engineer with 9+ years turning complex requirements into fast, reliable
          products. I focus on frontend (React, TypeScript, Next.js) and backend (Node.js, Python,
          APIs), with deep experience in design systems, component libraries, and Developer
          Experience—tooling, docs, and workflows that help teams ship faster.
        </p>
        <p className="mt-6 text-muted text-lg leading-relaxed" data-reveal>
          I bridge design and engineering: accessible, performant UIs; interactive and 3D/animated
          experiences; and production-ready code. I’ve driven ~30% performance gains, led design-system
          adoption, and introduced AI-driven automation (e.g. MCP for Cursor) for code review and
          velocity. I work best in agile, cross-functional teams and care about product vision and
          execution.
        </p>
        <p className="mt-6 text-muted text-lg leading-relaxed" data-reveal>
          <strong className="text-foreground">What I bring:</strong> Leadership, cross-functional
          collaboration, mentorship, and a track record of stable releases (e.g. 99.9% deployment
          stability). Open to senior and staff-level roles where I can shape architecture, DX, and
          product quality.
        </p>
      </div>
    </section>
  );
}
