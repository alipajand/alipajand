import { render, screen } from "@testing-library/react";
import { ContactLink } from "components/Hero/ContactLink";

describe("ContactLink", () => {
  describe("rendering", () => {
    it("should render a link with correct href", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" />);

      const link = screen.getByRole("link", { name: "Email" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "mailto:test@example.com");
    });

    it("should render with aria-label", () => {
      render(<ContactLink label="GitHub" href="https://github.com" />);

      const link = screen.getByRole("link", { name: "GitHub" });
      expect(link).toBeInTheDocument();
    });

    it("should render icon span with aria-hidden", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" iconSrc="/icon.svg" />);

      const link = screen.getByRole("link");
      const icon = link.querySelector("span[aria-hidden='true']");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("external links", () => {
    it("should add target='_blank' and rel='noopener noreferrer' for http links", () => {
      render(<ContactLink label="GitHub" href="https://github.com" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should add target='_blank' and rel='noopener noreferrer' for http:// links", () => {
      render(<ContactLink label="Website" href="http://example.com" />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should not add target and rel for non-http links", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" />);

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("should not add target and rel for relative links", () => {
      render(<ContactLink label="About" href="/about" />);

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });
  });

  describe("icon styling", () => {
    it("should apply mask styles when iconSrc is provided", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" iconSrc="/icon.svg" />);

      const icon = screen.getByRole("link").querySelector("span");
      expect(icon).toHaveStyle({
        maskImage: "url(/icon.svg)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      });
    });

    it("should apply webkit mask styles when iconSrc is provided", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" iconSrc="/icon.svg" />);

      const icon = screen.getByRole("link").querySelector("span");
      expect(icon).toHaveStyle({
        maskImage: "url(/icon.svg)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      });
    });

    it("should not apply mask styles when iconSrc is not provided", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" />);

      const icon = screen.getByRole("link").querySelector("span");
      const style = icon?.getAttribute("style");
      expect(style).not.toContain("mask-image");
      expect(style).not.toContain("maskImage");
    });
  });

  describe("accessibility", () => {
    it("should have focus-visible styles", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("focus-visible:ring-2");
    });

    it("should have correct className", () => {
      render(<ContactLink label="Email" href="mailto:test@example.com" />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("text-muted", "hover:text-foreground", "transition-colors");
    });
  });
});
