import { render, screen } from "@testing-library/react";

import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";

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
    expect(
      screen.getByText(
        "Case studies from production work across SaaS products, enterprise analytics, AI-assisted workflows, and design systems. Each one documents the problem, my role, the decisions I made, and the product or engineering outcome."
      )
    ).toBeInTheDocument();
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
