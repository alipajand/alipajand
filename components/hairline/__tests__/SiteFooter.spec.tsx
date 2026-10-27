import { render, screen, within } from "@testing-library/react";

import { SiteFooter } from "components/hairline/SiteFooter/SiteFooter";
import { FOOTER_ARIA_LABEL, FOOTER_CHANNELS_ARIA_LABEL } from "data/footer";
import { LINKS } from "data/links";
import { LOCATION, SITE_NAME } from "data/site";

const hrefOf = (label: string) => LINKS.find((link) => link.label === label)?.href;

describe("SiteFooter", () => {
  it("should close the page with name, location, and site and year", () => {
    render(<SiteFooter year={2026} />);
    const footer = screen.getByRole("contentinfo", { name: FOOTER_ARIA_LABEL });
    expect(within(footer).getByText(SITE_NAME)).toBeInTheDocument();
    expect(within(footer).getByText(LOCATION)).toBeInTheDocument();
    expect(within(footer).getByText("alipajand.com · 2026")).toBeInTheDocument();
  });

  it("should list the direct channels on every page", () => {
    render(<SiteFooter year={2026} />);
    const list = screen.getByRole("list", { name: FOOTER_CHANNELS_ARIA_LABEL });
    const links = within(list).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Email", "LinkedIn", "GitHub"]);

    const email = within(list).getByRole("link", { name: "Email" });
    expect(email).toHaveAttribute("href", hrefOf("Email"));
    expect(email).not.toHaveAttribute("target");

    const linkedIn = within(list).getByRole("link", { name: "LinkedIn (opens in new tab)" });
    expect(linkedIn).toHaveAttribute("href", hrefOf("LinkedIn"));
    expect(linkedIn).toHaveAttribute("target", "_blank");
    expect(linkedIn).toHaveAttribute("rel", "noopener noreferrer");

    expect(within(list).getByRole("link", { name: "GitHub (opens in new tab)" })).toHaveAttribute(
      "href",
      hrefOf("GitHub")
    );
  });
});
