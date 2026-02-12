"use client";

import { useTestimonialsReveal } from "components/Testimonials/hooks/useTestimonialsReveal";
import { TESTIMONIALS } from "data/testimonials";

export function Testimonials() {
  const {
    selectors: { sectionRef, listRef },
  } = useTestimonialsReveal();

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="px-6 sm:px-10 lg:px-20 py-24 sm:py-32 border-t border-border"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="testimonials-heading"
          className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4"
          data-reveal
        >
          What people say
        </h2>
        <p className="text-muted text-lg mb-16 max-w-xl" data-reveal>
          Feedback from colleagues and teams I&apos;ve worked with.
        </p>

        <ul ref={listRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <blockquote
                data-testimonial-card
                className="h-full rounded-xl border border-border bg-card/50 p-6 flex flex-col"
              >
                <p className="text-muted text-[15px] sm:text-base leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 pt-4 border-t border-border">
                  <p className="text-foreground font-medium text-sm">{t.author}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {t.role} · {t.company}
                  </p>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
