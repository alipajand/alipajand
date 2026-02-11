"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { EXPERTISE_AREAS, EXPERTISE_CORE } from "data/expertise";
import { SkillIcon } from "components/Skills/SkillIcon";

export function Skills() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 24, stagger: 0.08 });

  return (
    <section
      id="expertises"
      ref={sectionRef}
      aria-labelledby="expertise-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto w-full">
        <h2
          id="expertise-heading"
          className="font-display font-bold text-3xl sm:text-4xl mb-4 gradient-text-animated"
          data-reveal
        >
          What I do
        </h2>
        <p className="text-muted text-lg mb-12 max-w-xl" data-reveal>
          How I use the stack in practice—trade-offs and scale, not just keywords.
        </p>
        <div className="space-y-10">
          {EXPERTISE_AREAS.map((area) => (
            <div key={area.title} data-reveal className="space-y-3">
              <h3 className="font-display font-semibold text-foreground text-lg">{area.title}</h3>
              <p className="text-muted text-[15px] sm:text-base leading-relaxed">{area.sentence}</p>
              <div className="flex flex-wrap gap-2">
                {area.tags.map((tag) => (
                  <span
                    key={tag}
                    className="hover-scale inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-card border border-border text-foreground/80 text-xs font-medium hover:border-foreground/50"
                  >
                    <SkillIcon skill={tag} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-16 text-muted text-base" data-reveal>
          <strong className="text-foreground">CORE:</strong> {EXPERTISE_CORE}
        </p>
      </div>
    </section>
  );
}
