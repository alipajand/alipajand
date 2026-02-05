"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { SKILL_GROUPS } from "data/skills";
import { SkillIcon } from "components/Skills/SkillIcon";

export function Skills() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 24, stagger: 0.05 });

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl">
        <h2
          id="skills-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-12"
          data-reveal
        >
          Skills
        </h2>
        <div className="grid sm:grid-cols-2 gap-10">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label} data-reveal>
              <h3 className="font-display font-semibold text-muted text-sm tracking-wider uppercase mb-4">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="hover-scale inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-foreground text-sm font-medium hover:border-foreground hover:text-foreground"
                  >
                    <SkillIcon skill={skill} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-muted text-base" data-reveal>
          <strong className="text-foreground">Core:</strong> Leadership, Cross-Functional
          Collaboration, Communication, Problem-Solving, Mentorship, Stakeholder Alignment.
        </p>
      </div>
    </section>
  );
}
