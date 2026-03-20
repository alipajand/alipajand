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
      screen.getByText(/Informal endorsements from people I worked with on these teams/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Names aren.t published here without explicit permission/i)
    ).toBeInTheDocument();
  });

  it("renders testimonial quotes", () => {
    render(<Testimonials />);
    expect(screen.getByText(/Ali built high-quality, accessible UIs/i)).toBeInTheDocument();
  });
});
