import { render, screen } from "@testing-library/react";

import { LinkRows } from "components/hairline/LinkRows/LinkRows";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

const LINKS = [
  { label: "Email", value: "name@example.com", href: "mailto:name@example.com" },
  { label: "Book a call", value: "calendly.com/x", href: "https://calendly.com/x" },
];

describe("LinkRows", () => {
  it("should tag each link with its analytics event name", () => {
    render(<LinkRows links={LINKS} analyticsPrefix="contact_link" label="Direct" />);

    expect(screen.getByRole("list", { name: "Direct" })).toBeInTheDocument();
    const book = screen.getByRole("link", { name: /^Book a call/ });
    expect(book).toHaveAttribute("data-analytics-event", "contact_link_book_a_call");
  });

  it("should open only external links in a new tab and say so", () => {
    render(<LinkRows links={LINKS} analyticsPrefix="contact_link" />);

    const email = screen.getByRole("link", { name: "Email: name@example.com" });
    expect(email).not.toHaveAttribute("target");
    const book = screen.getByRole("link", {
      name: `Book a call: calendly.com/x${EXTERNAL_LINK_NEW_TAB_HINT}`,
    });
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });
});
