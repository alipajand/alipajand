import { TestimonialsListItem } from "components/Testimonials/TestimonialsListItem";
import {
  TESTIMONIALS,
  TESTIMONIALS_FACTUAL_REVIEW_NOTE,
  TESTIMONIALS_HEADING,
  TESTIMONIALS_INTRO,
} from "data/testimonials";

export const Testimonials = () => {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading">
      <div>
        <h2 id="testimonials-heading">{TESTIMONIALS_HEADING}</h2>
        <p>{TESTIMONIALS_INTRO}</p>
        <p>Factual review note: {TESTIMONIALS_FACTUAL_REVIEW_NOTE}</p>

        <ul>
          {TESTIMONIALS.map((t) => (
            <TestimonialsListItem key={t.id} testimonial={t} />
          ))}
        </ul>
      </div>
    </section>
  );
};
