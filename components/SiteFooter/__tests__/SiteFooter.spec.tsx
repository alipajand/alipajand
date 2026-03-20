import { render, screen } from "@testing-library/react";
import { SiteFooter } from "components/SiteFooter/SiteFooter";

describe("SiteFooter", () => {
  it("renders internal navigation links", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("navigation", { name: /site/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute(
      "href",
      "/portfolio#projects"
    );
    expect(screen.getByRole("link", { name: "Full portfolio" })).toHaveAttribute(
      "href",
      "/portfolio"
    );
    expect(screen.getByRole("link", { name: "Writing" })).toHaveAttribute("href", "/#writing");
    expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
  });
});
