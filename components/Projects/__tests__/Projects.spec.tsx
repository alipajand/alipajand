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
  it("renders the primary case-study collection with the required id", () => {
    render(<Projects />);

    expect(document.getElementById("case-studies")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Selected case studies" })).toBeInTheDocument();
    expect(screen.getByLabelText("Primary case study collection")).toBeInTheDocument();
  });

  it("orders the named case-study cards before the other selected work section", () => {
    const { container } = render(<Projects />);
    const cardHeadings = Array.from(container.querySelectorAll("[data-project-card] h3")).map(
      (heading) => heading.textContent
    );

    expect(cardHeadings.slice(0, 4)).toEqual([
      "LedgerGuard",
      "AlwaysGeeky Games",
      "Emplifi",
      "MapBylaw",
    ]);
    expect(
      screen.getByRole("heading", { name: "Other selected product work" })
    ).toBeInTheDocument();
    expect(cardHeadings[4]).toBe("ControlTech");
  });

  it("keeps open-source work out of the commercial case-study grid and links to the open-source page", () => {
    render(<Projects />);

    expect(screen.queryByText(/Agent Readiness Kit/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View open-source work" })).toHaveAttribute(
      "href",
      "/open-source"
    );
  });

  it("renders normalized case-study sections and related navigation", () => {
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

  it("renders ownership statements without factual review notes on case studies", () => {
    render(<Projects />);

    expect(
      screen.getByText(
        /I owned the frontend implementation and interaction work, collaborating with product, design, analytics, and backend contributors/i
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/Factual review note:/i)).not.toBeInTheDocument();
  });

  it("renders the table of contents links for a detailed case study", () => {
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
