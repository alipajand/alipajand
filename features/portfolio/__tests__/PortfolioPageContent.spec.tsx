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

    expect(
      screen.getByRole("heading", { level: 1, name: "Product engineering case studies" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "I work across product decisions, interface design, frontend architecture, design systems, and delivery. These case studies focus on the constraints, decisions, and implementation details behind the finished interfaces."
      )
    ).toBeInTheDocument();
  });

  it("should render the text-first project index", () => {
    render(<PortfolioPageContent />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "LedgerGuard" })).toBeInTheDocument();
    expect(document.getElementById("case-studies")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Overview" })).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
