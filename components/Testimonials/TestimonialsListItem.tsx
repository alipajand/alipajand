import { TestimonialsQuote } from "components/Testimonials/TestimonialsQuote";
import type { Testimonial } from "data/testimonials";

interface TestimonialsListItemProps {
  testimonial: Testimonial;
}

export function TestimonialsListItem({ testimonial }: TestimonialsListItemProps) {
  return (
    <li>
      <TestimonialsQuote testimonial={testimonial} />
    </li>
  );
}
