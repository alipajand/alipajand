import { render, screen } from "@testing-library/react";

import { LinkRows } from "components/hairline/LinkRows/LinkRows";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

const LINKS = [
  { label: "Email", value: "name@example.com", href: "mailto:name@example.com" },
  { label: "Book a call", value: "calendly.com/x", href: "https://calendly.com/x" },
];

describe("LinkRows", () => {
  it("should render a labelled list of links with no tracking attributes", () => {
    render(<LinkRows links={LINKS} label="Direct" />);

    const list = screen.getByRole("list", { name: "Direct" });
    expect(list.querySelectorAll("[data-analytics-event]")).toHaveLength(0);
    expect(screen.getAllByRole("link")).toHaveLength(LINKS.length);
  });

  it("should open only external links in a new tab and say so", () => {
    render(<LinkRows links={LINKS} />);

    const email = screen.getByRole("link", { name: "Email: name@example.com" });
    expect(email).not.toHaveAttribute("target");
    const book = screen.getByRole("link", {
      name: `Book a call: calendly.com/x${EXTERNAL_LINK_NEW_TAB_HINT}`,
    });
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });
});
