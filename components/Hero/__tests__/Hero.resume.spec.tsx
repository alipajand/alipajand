import { render, screen } from "@testing-library/react";

import { Hero } from "components/Hero/Hero";

jest.mock("components/Hero/HeroBackground", () => ({
  HeroBackground: () => null,
}));

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn().mockReturnValue({}),
  fromTo: jest.fn().mockReturnValue({}),
  timeline: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
  })),
}));

describe("Hero", () => {
  it("should not render a résumé CTA in the homepage hero", () => {
    render(<Hero />);

    expect(screen.queryByRole("link", { name: /download résumé/i })).not.toBeInTheDocument();
  });
});
