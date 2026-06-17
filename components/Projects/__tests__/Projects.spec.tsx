import { render, screen, within } from "@testing-library/react";

import { Projects } from "components/Projects/Projects";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

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

describe("Projects", () => {
  it("should render the primary case-study collection with the required id", () => {
    render(<Projects />);

    expect(document.getElementById("case-studies")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(5);
    expect(screen.getByRole("heading", { level: 2, name: "LedgerGuard" })).toBeInTheDocument();
  });

  it("should order case studies in the portfolio sequence", () => {
    render(<Projects />);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)
    ).toEqual(["LedgerGuard", "AlwaysGeeky Games", "Emplifi", "MapBylaw", "ControlTech"]);
  });

  it("should keep open-source work out of the commercial case-study collection", () => {
    render(<Projects />);

    expect(screen.queryByText(/Agent Readiness Kit/i)).not.toBeInTheDocument();
  });

  it("should render normalized case-study sections and related navigation", () => {
    render(<Projects />);

    expect(screen.getAllByRole("heading", { name: "Overview" }).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("heading", { name: "Context and constraints" }).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "My responsibility" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Key decisions" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Interface evidence" }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByRole("link", { name: /Back to all case studies/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /Next case study: AlwaysGeeky Games/i })
    ).toHaveAttribute("href", "#project-design-system-marketplace-login-web3");
  });

  it("should render ownership statements without factual review notes on case studies", () => {
    render(<Projects />);

    expect(
      screen.getByText(
        /I owned the frontend implementation and interaction work, collaborating with product, design, analytics, and backend contributors/i
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/Factual review note:/i)).not.toBeInTheDocument();
  });

  it("should render the table of contents links for a detailed case study", () => {
    render(<Projects />);

    const nav = screen
      .getAllByRole("navigation")
      .find((element) =>
        element.getAttribute("aria-label")?.includes("Table of contents for LedgerGuard")
      );

    expect(nav).toBeDefined();
    if (!nav) return;

    expect(within(nav).getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "#ledgerguard-deterministic-commitments-ledger-overview"
    );
    expect(within(nav).getByRole("link", { name: "Outcome" })).toHaveAttribute(
      "href",
      "#ledgerguard-deterministic-commitments-ledger-outcome"
    );
  });
});
