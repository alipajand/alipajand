import { render, screen } from "@testing-library/react";

import { Testimonials } from "components/Testimonials/Testimonials";

describe("Testimonials", () => {
  it("renders section with id testimonials", () => {
    render(<Testimonials />);
    expect(document.getElementById("testimonials")).toBeInTheDocument();
  });

  it("renders Peer feedback heading", () => {
    render(<Testimonials />);
    expect(screen.getByRole("heading", { name: /peer feedback/i })).toBeInTheDocument();
  });

  it("renders attribution intro", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(/Names withheld publicly; role and company are included with permission/i)
    ).toBeInTheDocument();
  });

  it("renders testimonial quotes", () => {
    render(<Testimonials />);
    expect(screen.getByText(/Ali built high-quality, accessible UIs/i)).toBeInTheDocument();
  });
});
