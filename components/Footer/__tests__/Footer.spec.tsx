import { render, screen } from "@testing-library/react";

import { Footer } from "components/Footer/Footer";
import { FOOTER_ARIA_LABEL, FOOTER_NAV_LINKS, footerCopyright } from "data/footer";
import { LINKS } from "data/links";

describe("Footer", () => {
  it("renders the footer landmark with its aria label", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo", { name: FOOTER_ARIA_LABEL })).toBeInTheDocument();
  });

  it("renders every footer navigation link", () => {
    render(<Footer />);
    for (const link of FOOTER_NAV_LINKS) {
      expect(screen.getByRole("link", { name: link.label })).toBeInTheDocument();
    }
  });

  it("renders external direct links with safe target/rel attributes", () => {
    render(<Footer />);
    const external = LINKS.find((channel) => channel.href.startsWith("http"));
    const internal = LINKS.find((channel) => !channel.href.startsWith("http"));

    expect(external).toBeDefined();
    expect(internal).toBeDefined();

    const externalLink = screen.getByRole("link", { name: external!.label });
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");

    const internalLink = screen.getByRole("link", { name: internal!.label });
    expect(internalLink).not.toHaveAttribute("target");
  });

  it("renders the current year in the copyright line", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(footerCopyright(year))).toBeInTheDocument();
  });
});
