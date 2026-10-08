import { render, screen, within } from "@testing-library/react";

import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";
import {
  PORTFOLIO_PAGE_INTRO,
  PORTFOLIO_PAGE_INTRO_LINKS,
  PORTFOLIO_PROFILE_DETAILS,
} from "data/projects";
import { PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";

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

describe("PortfolioPageContent", () => {
  it("should render the portfolio H1 and required introduction", () => {
    render(<PortfolioPageContent />);

    expect(screen.getByRole("heading", { level: 1, name: "Portfolio" })).toBeInTheDocument();
    const paragraphText = Array.from(document.querySelectorAll("header p")).map(
      (node) => node.textContent
    );
    for (const paragraph of PORTFOLIO_PAGE_INTRO) {
      expect(paragraphText).toContain(paragraph);
    }
    expect(screen.getByText(PORTFOLIO_PROFILE_DETAILS)).toBeInTheDocument();
  });

  it("should link case studies named in the introduction", () => {
    render(<PortfolioPageContent />);

    const header = document.querySelector("header") as HTMLElement;
    for (const { text, href } of PORTFOLIO_PAGE_INTRO_LINKS) {
      expect(within(header).getAllByRole("link", { name: text })[0]).toHaveAttribute("href", href);
    }
  });

  it("should render GitHub, LinkedIn, and booking links in the profile section", () => {
    render(<PortfolioPageContent />);

    const profileLinks = screen.getByRole("list", { name: PORTFOLIO_PROFILE_LINKS_ARIA_LABEL });
    const hrefs = within(profileLinks)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "https://github.com/alipajand",
      "https://linkedin.com/in/alipajand",
      "https://calendly.com/alipajand/intro",
    ]);
  });

  it("should render the text-first project index", () => {
    render(<PortfolioPageContent />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "LedgerGuard" })).toBeInTheDocument();
    expect(document.getElementById("case-studies")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Context" })).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
