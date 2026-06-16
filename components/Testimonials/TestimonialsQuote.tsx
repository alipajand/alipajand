import type { Testimonial } from "data/testimonials";

interface TestimonialsQuoteProps {
  testimonial: Testimonial;
}

export function TestimonialsQuote({ testimonial: t }: TestimonialsQuoteProps) {
  return (
    <figure className="m-0" data-testimonial-card>
      <blockquote className="m-0 border-0 p-0">
        <p className="text-foreground/95 text-[17px] sm:text-lg leading-[1.65] font-normal">
          <span className="text-foreground/45 select-none" aria-hidden>
            &ldquo;
          </span>
          {t.quote}
          <span className="text-foreground/45 select-none" aria-hidden>
            &rdquo;
          </span>
        </p>
      </blockquote>
      <figcaption className="mt-2 pt-2 border-t border-border/80 text-[13px] leading-snug">
        <span className="text-foreground/85">{t.label}</span>
      </figcaption>
    </figure>
  );
}
