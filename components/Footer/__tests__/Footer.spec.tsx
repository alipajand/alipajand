import { render, screen } from "@testing-library/react";

import { Footer } from "components/Footer/Footer";
import { FOOTER_ARIA_LABEL, footerCopyright, getFooterNavLinksFlat } from "data/footer";
import { LINKS } from "data/links";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

const LATEST_WRITINGS = [
  {
    slug: "post-one",
    title: "First writing",
    date: "2026-01-01",
    excerpt: "Excerpt one",
  },
  {
    slug: "post-two",
    title: "Second writing",
    date: "2025-12-01",
    excerpt: "Excerpt two",
  },
] as const;

describe("Footer", () => {
  it("should render the footer landmark with its aria label", () => {
    render(<Footer latestWritings={[...LATEST_WRITINGS]} />);
    expect(screen.getByRole("contentinfo", { name: FOOTER_ARIA_LABEL })).toBeInTheDocument();
  });

  it("should render every footer navigation link", () => {
    render(<Footer latestWritings={[...LATEST_WRITINGS]} />);
    for (const link of getFooterNavLinksFlat()) {
      expect(screen.getByRole("link", { name: link.label })).toBeInTheDocument();
    }
  });

  it("should render direct links with large icons and safe target/rel attributes", () => {
    render(<Footer latestWritings={[...LATEST_WRITINGS]} />);
    const external = LINKS.find((channel) => channel.href.startsWith("http"));
    const internal = LINKS.find((channel) => !channel.href.startsWith("http"));

    expect(external).toBeDefined();
    expect(internal).toBeDefined();

    const externalLink = screen.getByRole("link", {
      name: `${external!.label}${EXTERNAL_LINK_NEW_TAB_HINT}`,
    });
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(externalLink.querySelector("span[aria-hidden='true']")).toHaveClass("size-5");

    const internalLink = screen.getByRole("link", { name: internal!.label });
    expect(internalLink).not.toHaveAttribute("target");
    expect(internalLink.querySelector("span[aria-hidden='true']")).toHaveClass("size-5");
  });

  it("should render the current year in the copyright line", () => {
    render(<Footer latestWritings={[...LATEST_WRITINGS]} />);
    const year = new Date().getFullYear();
    expect(screen.getByText(footerCopyright(year))).toBeInTheDocument();
  });
});
