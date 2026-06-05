import { render, screen } from "@testing-library/react";

import { TestimonialsQuote } from "components/Testimonials/TestimonialsQuote";
import type { Testimonial } from "data/testimonials";

const base: Testimonial = {
  id: "t1",
  quote: "A strong endorsement of the work.",
  role: "Engineering",
  company: "Acme Corp",
};

describe("TestimonialsQuote", () => {
  it("renders the quote text", () => {
    render(<TestimonialsQuote testimonial={base} />);
    expect(screen.getByText(base.quote)).toBeInTheDocument();
  });

  it("renders role and company without an author name", () => {
    render(<TestimonialsQuote testimonial={base} />);
    expect(screen.getByText(/Engineering/)).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
    expect(screen.queryByText(/^Jane Doe$/)).not.toBeInTheDocument();
  });

  it("renders the author name when provided", () => {
    render(
      <TestimonialsQuote
        testimonial={{
          ...base,
          author: "Jane Doe",
        }}
      />
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText(/Engineering · Acme Corp/)).toBeInTheDocument();
  });

  it("treats a whitespace-only author as absent", () => {
    render(
      <TestimonialsQuote
        testimonial={{
          ...base,
          author: "   ",
        }}
      />
    );

    expect(screen.queryByText(/^Jane Doe$/)).not.toBeInTheDocument();
    expect(screen.getByText(/Engineering/)).toBeInTheDocument();
  });
});
