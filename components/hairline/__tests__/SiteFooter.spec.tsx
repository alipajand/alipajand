import { render, screen, within } from "@testing-library/react";

import { SiteFooter } from "components/hairline/SiteFooter/SiteFooter";
import { FOOTER_ARIA_LABEL } from "data/footer";
import { LOCATION, SITE_NAME } from "data/site";

describe("SiteFooter", () => {
  it("should close the page with name, location, and site and year", () => {
    render(<SiteFooter year={2026} />);
    const footer = screen.getByRole("contentinfo", { name: FOOTER_ARIA_LABEL });
    expect(within(footer).getByText(SITE_NAME)).toBeInTheDocument();
    expect(within(footer).getByText(LOCATION)).toBeInTheDocument();
    expect(within(footer).getByText("alipajand.com · 2026")).toBeInTheDocument();
  });

  it("should not repeat the direct channels", () => {
    render(<SiteFooter year={2026} />);
    const footer = screen.getByRole("contentinfo", { name: FOOTER_ARIA_LABEL });
    expect(within(footer).queryByRole("list")).not.toBeInTheDocument();
    expect(within(footer).queryByRole("link", { name: /email|linkedin|github/i })).toBeNull();
  });
});
