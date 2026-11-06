import { render, screen, within } from "@testing-library/react";

import { HomeCapabilities } from "features/home/HomeCapabilities";
import { HomeHero } from "features/home/HomeHero";
import { HomeSelectedWork } from "features/home/HomeSelectedWork";
import { HIRING_FIT_CARDS } from "data/hiringFit";
import {
  HOMEPAGE_CASE_STUDIES_HEADING,
  HOMEPAGE_HERO_BODY,
  HOMEPAGE_HERO_EYEBROW,
  HOMEPAGE_HERO_TITLE,
  HOMEPAGE_PROOF_ARIA_LABEL,
} from "data/homepage";
import { HERO_PROFILE_LINKS_ARIA_LABEL } from "data/links";

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("features/home/StrataCanvas", () => ({ StrataCanvas: () => null }));

describe("HomeHero", () => {
  it("states the role, the heading, and the description", () => {
    render(<HomeHero />);

    expect(screen.getByText(HOMEPAGE_HERO_EYEBROW)).toHaveTextContent("Senior Software Engineer");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(HOMEPAGE_HERO_TITLE);
    expect(screen.getByText(HOMEPAGE_HERO_BODY)).toBeInTheDocument();
  });

  it("points the calls to action at the portfolio and the contact section", () => {
    render(<HomeHero />);

    expect(screen.getByRole("link", { name: "View engineering work" })).toHaveAttribute(
      "href",
      "/portfolio"
    );
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "/#contact");
  });

  it("shows GitHub, LinkedIn, and email links in the first screen", () => {
    render(<HomeHero />);

    const profileLinks = screen.getByRole("list", { name: HERO_PROFILE_LINKS_ARIA_LABEL });
    const links = within(profileLinks).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://github.com/alipajand",
      "https://linkedin.com/in/alipajand",
      "mailto:alipajand@gmail.com",
    ]);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
    expect(links[2]).not.toHaveAttribute("target");
  });

  it("shows the four proof points, with the 80% figure scoped to Emplifi rendering", () => {
    render(<HomeHero />);

    const proof = screen.getByLabelText(HOMEPAGE_PROOF_ARIA_LABEL);
    const terms = within(proof)
      .getAllByRole("term")
      .map((term) => term.textContent);
    expect(terms).toEqual([
      "9+ years",
      "Four product surfaces",
      "Approximately 80%",
      "End-to-end ownership",
    ]);
    expect(within(proof).getByText(/Emplifi rendering/)).toHaveTextContent(
      /re-renders.*chart-update paint.*lower-powered/
    );
  });
});

describe("HomeSelectedWork", () => {
  it("shows LedgerGuard, AlwaysGeeky Games, and Emplifi in order", () => {
    render(<HomeSelectedWork />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      HOMEPAGE_CASE_STUDIES_HEADING
    );
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)
    ).toEqual([
      "LedgerGuardIndependent Full-Stack Product",
      "AlwaysGeeky GamesShared Frontend Architecture",
      "EmplifiEnterprise Analytics & Performance",
    ]);
    expect(screen.getByRole("link", { name: /^LedgerGuard/ })).toHaveAttribute(
      "href",
      "/portfolio/ledgerguard"
    );
  });
});

describe("HomeCapabilities", () => {
  it("shows four capability areas, each with its depth", () => {
    render(<HomeCapabilities />);

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)
    ).toEqual([
      "Frontend Engineering",
      "Full-Stack Product Development",
      "Engineering Quality",
      "Technical Leadership",
    ]);
    for (const card of HIRING_FIT_CARDS) {
      expect(screen.getByText(card.depth)).toBeInTheDocument();
    }
  });
});
