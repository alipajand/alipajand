import type { Testimonial } from "data/testimonials";
import { TESTIMONIAL_ATTRIBUTION_SR_ONLY } from "data/testimonials";

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
      <figcaption className="mt-2 pt-2 border-t border-border/80">
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
            <dt className="sr-only">{TESTIMONIAL_ATTRIBUTION_SR_ONLY}</dt>
            <dd className="text-sm font-medium text-foreground leading-snug">{t.role}</dd>
            <dd className="text-[13px] text-muted leading-snug">{t.company}</dd>
          </dl>
        )}
      </figcaption>
    </figure>
  );
}
