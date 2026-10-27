import type { Testimonial } from "data/testimonials";

interface TestimonialsQuoteProps {
  testimonial: Testimonial;
}

export const TestimonialsQuote = ({ testimonial: t }: TestimonialsQuoteProps) => {
  return (
    <figure data-testimonial-card>
      <blockquote>
        <p>
          <span aria-hidden>&ldquo;</span>
          {t.quote}
          <span aria-hidden>&rdquo;</span>
        </p>
      </blockquote>
      <figcaption>
        <span>{t.label}</span>
      </figcaption>
    </figure>
  );
};
