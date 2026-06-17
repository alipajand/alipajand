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

  it("renders attribution intro and factual review note", () => {
    render(<Testimonials />);
    expect(
      screen.getByText(
        /Names are withheld for privacy\. Quotes are lightly edited for length and clarity without changing their meaning\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Quote wording has not been personally re-confirmed against the original messages/i
      )
    ).toBeInTheDocument();
  });

  it("renders testimonial quotes", () => {
    render(<Testimonials />);
    expect(screen.getByText(/Ali built high-quality, accessible UIs/i)).toBeInTheDocument();
  });

  it("renders at most two endorsements", () => {
    const { container } = render(<Testimonials />);
    expect(container.querySelectorAll("[data-testimonial-card]")).toHaveLength(2);
  });
});
