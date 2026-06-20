import { render, screen } from "@testing-library/react";

import { Hero } from "components/Hero/Hero";
import {
  HOMEPAGE_HERO_NAME,
  HOMEPAGE_HERO_PRIMARY_CTA_HREF,
  HOMEPAGE_HERO_SECONDARY_CTA_HREF,
  HOMEPAGE_HERO_TITLE,
} from "data/homepage";

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
    it("should render the accessible name, hero heading, and availability copy", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(HOMEPAGE_HERO_TITLE);
      expect(screen.getByText(HOMEPAGE_HERO_NAME)).toBeInTheDocument();
    });

    it("should render primary CTA to portfolio case studies", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /view case studies/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", HOMEPAGE_HERO_PRIMARY_CTA_HREF);
    });

    it("should render secondary CTA to contact", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: /get in touch/i });
      expect(link).toHaveAttribute("href", HOMEPAGE_HERO_SECONDARY_CTA_HREF);
    });
  });
});
