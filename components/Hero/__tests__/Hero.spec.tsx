import { render, screen } from "@testing-library/react";

import { Hero } from "components/Hero/Hero";
import { HERO_VALUE_LINE } from "data/site";

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
    it("should render the main heading with name and value line", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Ali Pajand");
      expect(heading).toHaveTextContent(HERO_VALUE_LINE);
    });

    it("should render contact link icons", () => {
      render(<Hero />);

      expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    });

    it("should render primary CTA to contact section", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /discuss a role/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#contact");
    });

    it("should render View case studies link to portfolio case studies", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /view case studies/i });
      expect(link).toHaveAttribute("href", "/portfolio#projects");
    });

    it("should render Read writing link to writing section", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /read writing/i });
      expect(link).toHaveAttribute("href", "#writing");
    });
  });
});
