"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";
import { JOBS } from "data/jobs";
import { useExperienceCards } from "components/Experience/hooks/useExperienceCards";

export function Experience() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 40, stagger: 0.06 });
  const {
    selectors: { cardsRef },
  } = useExperienceCards();

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="experience-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4"
          data-reveal
        >
          Experience
        </h2>
        <p className="text-muted text-lg mb-16 max-w-xl" data-reveal>
          Roles and impact across product teams and startups.
        </p>

        <div className="relative">
          <div
            className="absolute left-2.75 sm:left-3.75 top-0 bottom-0 w-px bg-border"
            aria-hidden
          />
          <ul ref={cardsRef} className="space-y-0">
            {JOBS.map((job) => (
              <li key={job.company} className="relative pl-10 sm:pl-12 pb-16 last:pb-0">
                <div
                  className="absolute left-0 top-1.5 w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full border-2 border-border bg-background flex items-center justify-center"
                  aria-hidden
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-foreground/60" />
                </div>
                <article
                  data-experience-card
                  className="experience-card group rounded-xl border border-border bg-card/50 p-6 sm:p-8 transition-all duration-300 hover:border-foreground/20 hover:bg-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
                        {job.role}
                      </h3>
                      <p className="font-medium mt-0.5 text-foreground/70">{job.company}</p>
                    </div>
                    <span className="inline-flex items-center shrink-0 text-muted text-sm font-medium tabular-nums">
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-1 list-none pl-0">
                    {job.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-muted text-[15px] sm:text-base leading-relaxed"
                      >
                        <span
                          className="w-5 shrink-0 text-right text-foreground/90 select-none"
                          aria-hidden
                        >
                          —
                        </span>
                        <span className="flex-1 min-w-0">{h}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
