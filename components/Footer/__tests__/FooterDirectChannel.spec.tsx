import { render, screen } from "@testing-library/react";

import { FooterDirectChannel } from "components/Footer/FooterDirectChannel";

describe("FooterDirectChannel", () => {
  it("should render an icon link with the channel label exposed to assistive tech", () => {
    render(<FooterDirectChannel label="GitHub" href="https://github.com/alipajand" />);

    const link = screen.getByRole("link", { name: "GitHub (opens in new tab)" });
    expect(link).toHaveAttribute("href", "https://github.com/alipajand");
    expect(link.querySelector("span[aria-hidden='true']")).toHaveClass("size-5");
  });

  it("should not add target and rel for mailto links", () => {
    render(<FooterDirectChannel label="Email" href="mailto:alipajand@gmail.com" />);

    const link = screen.getByRole("link", { name: "Email" });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });
});
