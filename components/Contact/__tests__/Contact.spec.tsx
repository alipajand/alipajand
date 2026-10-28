import { render, screen } from "@testing-library/react";

import { Contact } from "components/Contact/Contact";
import {
  CONTACT_AVAILABILITY,
  CONTACT_NOW_HREF,
  CONTACT_NOW_LINK_LABEL,
  CONTACT_SECTION_BODY,
} from "data/contact";
import { CONTACT_FIELD_MESSAGE_HINT } from "data/contactForm";
import { CONTACT_FORM_LEDE } from "data/site";

describe("Contact", () => {
  describe("default rendering", () => {
    it("should render the section with id contact", () => {
      render(<Contact />);

      const section = document.getElementById("contact");
      expect(section).toBeInTheDocument();
    });

    it("should render the contact heading", () => {
      render(<Contact />);

      expect(screen.getByRole("heading", { name: /open to new work/i })).toBeInTheDocument();
    });

    it("should render contact links for Email, LinkedIn, and GitHub", () => {
      render(<Contact />);

      expect(screen.getByText("alipajand@gmail.com")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    });

    it("should render a booking link to the Calendly intro call", () => {
      render(<Contact />);

      expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
        "href",
        "https://calendly.com/alipajand/intro"
      );
    });

    it("should render reasons list and form jump CTA", () => {
      render(<Contact />);
      expect(screen.getByRole("heading", { name: /send context/i })).toBeInTheDocument();
    });

    it("should render the updated hiring paragraph", () => {
      render(<Contact />);
      expect(screen.getByText(CONTACT_SECTION_BODY)).toBeInTheDocument();
      expect(screen.getByText(CONTACT_AVAILABILITY, { exact: false })).toBeInTheDocument();
    });

    it("should point from the availability line to /now", () => {
      render(<Contact />);
      const link = screen.getByRole("link", { name: CONTACT_NOW_LINK_LABEL });
      expect(link).toHaveAttribute("href", CONTACT_NOW_HREF);
      expect(link.closest("p")).toHaveTextContent(
        `${CONTACT_AVAILABILITY} See ${CONTACT_NOW_LINK_LABEL}.`
      );
    });

    it("should keep the form introduction distinct from the message-field hint", () => {
      render(<Contact />);

      expect(CONTACT_FORM_LEDE).not.toBe(CONTACT_FIELD_MESSAGE_HINT);
      expect(screen.getByText(CONTACT_FORM_LEDE)).toBeInTheDocument();
      expect(screen.getByText(CONTACT_FIELD_MESSAGE_HINT)).toBeInTheDocument();
    });
  });
});
