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
  describe("default rendering", () => {
    it("should render the main heading with name", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Ali Pajand");
    });

    it("should render contact link icons", () => {
      render(<Hero />);

      expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    });

    it("should render Get in touch link to contact section", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /get in touch/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#contact");
    });
  });
});
