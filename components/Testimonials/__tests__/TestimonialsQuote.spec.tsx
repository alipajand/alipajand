import { render, screen } from "@testing-library/react";

import { TestimonialsQuote } from "components/Testimonials/TestimonialsQuote";
import type { Testimonial } from "data/testimonials";

const base: Testimonial = {
  id: "t1",
  quote: "A strong endorsement of the work.",
  label: "Former engineering colleague · Acme Corp",
};

describe("TestimonialsQuote", () => {
  it("should render the quote text", () => {
    render(<TestimonialsQuote testimonial={base} />);
    expect(screen.getByText(base.quote)).toBeInTheDocument();
  });

  it("should render the attribution label", () => {
    render(<TestimonialsQuote testimonial={base} />);
    expect(screen.getByText(base.label)).toBeInTheDocument();
  });
});
