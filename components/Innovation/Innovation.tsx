"use client";

import { useInnovationReveal } from "components/Innovation/hooks/useInnovationReveal";
import { INNOVATION_ITEMS } from "data/innovation";

export function Innovation() {
  const {
    selectors: { sectionRef, listRef },
  } = useInnovationReveal();

  return (
    <section
      id="innovation"
      ref={sectionRef}
      aria-labelledby="innovation-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="innovation-heading"
          className="font-display font-bold text-3xl sm:text-4xl gradient-text-animated mb-4"
          data-reveal
        >
          Side projects & tooling
        </h2>
        <p className="text-muted text-lg mb-16 max-w-xl" data-reveal>
          Things I build to ship faster—and can show you in action.
        </p>

        <ul ref={listRef} className="space-y-6">
          {INNOVATION_ITEMS.map((item) => (
            <li key={item.id}>
              <article
                data-innovation-card
                className="rounded-xl border border-border bg-card/50 p-6 sm:p-8 transition-all duration-300 hover:border-foreground/20 hover:bg-card"
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
