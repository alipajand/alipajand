import { render, screen } from "@testing-library/react";

import { Contact } from "components/Contact/Contact";
import { CONTACT_SECTION_BODY } from "data/contact";
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

    it("should leave direct links to the Let's talk section that follows it", () => {
      render(<Contact />);

      expect(screen.queryByRole("link", { name: /email/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /book a call/i })).not.toBeInTheDocument();
    });

    it("should render reasons list and form jump CTA", () => {
      render(<Contact />);
      expect(screen.getByRole("heading", { name: /send context/i })).toBeInTheDocument();
    });

    it("should render the updated hiring paragraph", () => {
      render(<Contact />);
      expect(screen.getByText(CONTACT_SECTION_BODY)).toBeInTheDocument();
    });

    it("should keep the form introduction distinct from the message-field hint", () => {
      render(<Contact />);

      expect(CONTACT_FORM_LEDE).not.toBe(CONTACT_FIELD_MESSAGE_HINT);
      expect(screen.getByText(CONTACT_FORM_LEDE)).toBeInTheDocument();
      expect(screen.getByText(CONTACT_FIELD_MESSAGE_HINT)).toBeInTheDocument();
    });
  });
});
