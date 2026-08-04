import { render, screen } from "@testing-library/react";

import { Hero } from "components/Hero/Hero";
import {
  HOMEPAGE_HERO_LOCATION,
  HOMEPAGE_HERO_NAME,
  HOMEPAGE_HERO_PRIMARY_CTA_HREF,
  HOMEPAGE_HERO_PRIMARY_CTA_LABEL,
  HOMEPAGE_HERO_SECONDARY_CTA_HREF,
  HOMEPAGE_HERO_SECONDARY_CTA_LABEL,
  HOMEPAGE_HERO_TITLE,
} from "data/homepage";
import { LINKS } from "data/links";
import { HERO_PROOF_ROW, HERO_SOCIAL_LINKS_ARIA_LABEL } from "data/site";

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
    it("should render the accessible name, hero heading, and location copy", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(HOMEPAGE_HERO_TITLE);
      expect(screen.getByText(HOMEPAGE_HERO_NAME)).toBeInTheDocument();
      expect(screen.getByText(HOMEPAGE_HERO_LOCATION)).toBeInTheDocument();
    });

    it("should render primary CTA to portfolio case studies", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: HOMEPAGE_HERO_PRIMARY_CTA_LABEL });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", HOMEPAGE_HERO_PRIMARY_CTA_HREF);
    });

    it("should render secondary CTA to contact", () => {
      render(<Hero />);

      const link = screen.getByRole("link", { name: HOMEPAGE_HERO_SECONDARY_CTA_LABEL });
      expect(link).toHaveAttribute("href", HOMEPAGE_HERO_SECONDARY_CTA_HREF);
    });

    it("should render every direct channel from the shared links data", () => {
      render(<Hero />);

      expect(
        screen.getByRole("navigation", { name: HERO_SOCIAL_LINKS_ARIA_LABEL })
      ).toBeInTheDocument();
      for (const channel of LINKS) {
        expect(screen.getByRole("link", { name: new RegExp(`^${channel.label}`) })).toHaveAttribute(
          "href",
          channel.href
        );
      }
    });

    it("should render every proof-at-a-glance item", () => {
      render(<Hero />);

      for (const proof of HERO_PROOF_ROW) {
        expect(screen.getByText(proof.value)).toBeInTheDocument();
        expect(screen.getByText(proof.label)).toBeInTheDocument();
      }
    });
  });
});
