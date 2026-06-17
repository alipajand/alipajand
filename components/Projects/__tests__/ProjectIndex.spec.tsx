import { render, screen } from "@testing-library/react";

import { ProjectIndex } from "components/Projects/ProjectIndex";

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

describe("ProjectIndex", () => {
  it("should render the case-studies section with text-first index entries", () => {
    render(<ProjectIndex />);

    expect(document.getElementById("case-studies")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "LedgerGuard" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "AlwaysGeeky Games" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Emplifi" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "MapBylaw" })).toBeInTheDocument();
  });

  it("should not render project figures or full case-study sections", () => {
    render(<ProjectIndex />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Overview" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Key decisions" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Interface evidence" })).not.toBeInTheDocument();
  });

  it("should link dedicated projects to /portfolio/{slug}", () => {
    render(<ProjectIndex />);

    expect(
      screen
        .getAllByRole("link", { name: "Read case study" })
        .map((link) => link.getAttribute("href"))
    ).toEqual([
      "/portfolio/ledgerguard",
      "/portfolio/alwaysgeeky",
      "/portfolio/emplifi",
      "/portfolio/mapbylaw",
    ]);
  });

  it("should preserve legacy project anchor ids on index items", () => {
    render(<ProjectIndex />);

    expect(
      document.getElementById("project-ledgerguard-deterministic-commitments-ledger")
    ).toBeInTheDocument();
    expect(
      document.getElementById("project-design-system-marketplace-login-web3")
    ).toBeInTheDocument();
    expect(document.getElementById("project-data-dashboards-emplifi")).toBeInTheDocument();
    expect(document.getElementById("project-mapbylaw-platform-ui-ai-reports")).toBeInTheDocument();
  });

  it("should render index-only projects in additional experience without a case-study link", () => {
    render(<ProjectIndex />);

    expect(screen.getByRole("heading", { name: "Additional experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "ControlTech" })).toBeInTheDocument();
    expect(document.getElementById("project-pwa-performance-controltech")).toBeInTheDocument();

    const controlTechArticle = document.getElementById("project-pwa-performance-controltech");
    expect(controlTechArticle?.querySelector("a[href^='/portfolio/']")).toBeNull();
  });
});
