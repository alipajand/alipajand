import { render, screen } from "@testing-library/react";

import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";
import { PORTFOLIO_PAGE_INTRO, PORTFOLIO_PROFILE_DETAILS } from "data/projects";

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
    for (const paragraph of PORTFOLIO_PAGE_INTRO) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByText(PORTFOLIO_PROFILE_DETAILS)).toBeInTheDocument();
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
