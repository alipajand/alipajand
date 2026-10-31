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
