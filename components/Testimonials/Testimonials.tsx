"use client";

import { useTestimonialsReveal } from "components/Testimonials/hooks/useTestimonialsReveal";
import { TestimonialsListItem } from "components/Testimonials/TestimonialsListItem";
import { TESTIMONIALS, TESTIMONIALS_HEADING, TESTIMONIALS_INTRO } from "data/testimonials";
import { SECTION_LEDE, SECTION_SHELL, SECTION_TITLE } from "utils/visual";

export const Testimonials = () => {
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
      <div className="max-w-5xl mx-auto w-full">
        <h2 id="testimonials-heading" className={`${SECTION_TITLE} mb-5 sm:mb-6`} data-reveal>
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
            <TestimonialsListItem key={t.id} testimonial={t} />
          ))}
        </ul>
      </div>
    </section>
  );
};
