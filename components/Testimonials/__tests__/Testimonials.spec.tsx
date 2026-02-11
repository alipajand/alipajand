import { render, screen } from "@testing-library/react";

import { Testimonials } from "components/Testimonials/Testimonials";

describe("Testimonials", () => {
  it("renders section with id testimonials", () => {
    render(<Testimonials />);
    expect(document.getElementById("testimonials")).toBeInTheDocument();
  });

  it("renders What people say heading", () => {
    render(<Testimonials />);
    expect(screen.getByRole("heading", { name: /what people say/i })).toBeInTheDocument();
  });

  it("renders feedback intro", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/Feedback from colleagues and teams I've worked with./i)
    ).toBeInTheDocument();
  });

  it("renders testimonial quotes", () => {
    render(<Testimonials />);
    expect(screen.getByText(/Ali built high-quality, accessible UIs/i)).toBeInTheDocument();
  });
});
