"use client";

import { useTestimonialsReveal } from "components/Testimonials/hooks/useTestimonialsReveal";
import {
  TESTIMONIALS,
  TESTIMONIALS_HEADING,
  TESTIMONIALS_INTRO,
} from "data/testimonials";
import { SECTION_LEDE, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export function Testimonials() {
  const {
    selectors: { sectionRef, listRef },
  } = useTestimonialsReveal();

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className={SECTION_SHELL}
    >
      <div className="max-w-3xl mx-auto w-full">
        <h2
          id="testimonials-heading"
          className={`${SECTION_TITLE} mb-5 sm:mb-6`}
          data-reveal
        >
          {TESTIMONIALS_HEADING}
        </h2>
        <p
          className={`${SECTION_LEDE} mb-14 sm:mb-16 border-l-2 border-border pl-4 sm:pl-5`}
          data-reveal
        >
          {TESTIMONIALS_INTRO}
        </p>

        <ul ref={listRef} className="flex flex-col gap-12 sm:gap-14 list-none p-0 m-0">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <figure className="m-0" data-testimonial-card>
                <blockquote className="m-0 border-0 p-0">
                  <p className="text-foreground/95 text-[17px] sm:text-lg leading-[1.65] font-normal text-balance">
                    <span className="text-foreground/45 select-none" aria-hidden>
                      &ldquo;
                    </span>
                    {t.quote}
                    <span className="text-foreground/45 select-none" aria-hidden>
                      &rdquo;
                    </span>
                  </p>
                </blockquote>
                <figcaption className="mt-7 pt-6 border-t border-border/80">
                  {t.author?.trim() ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{t.author}</p>
                      <p className="text-[13px] text-muted leading-snug">
                        <span className="text-foreground/85">{t.role}</span>
                        <span className="text-muted"> · </span>
                        <span>{t.company}</span>
                      </p>
                    </div>
                  ) : (
                    <dl className="m-0 space-y-1.5">
                      <dt className="sr-only">Attribution</dt>
                      <dd className="text-sm font-medium text-foreground leading-snug">{t.role}</dd>
                      <dd className="text-[13px] text-muted leading-snug">{t.company}</dd>
                    </dl>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
