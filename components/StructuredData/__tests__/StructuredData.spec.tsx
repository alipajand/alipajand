import { render } from "@testing-library/react";
import { StructuredData } from "components/StructuredData/StructuredData";
import {
  CANONICAL_URL,
  PERSON_SCHEMA_ID,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  WEBSITE_SCHEMA_ID,
} from "data/site";

describe("StructuredData", () => {
  it("should render one script tag", () => {
    const { container } = render(<StructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
  });

  describe("Website schema", () => {
    it("should include correct website schema structure", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const websiteScript = scripts[0];
      const schema = JSON.parse(websiteScript.textContent || "{}");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema["@id"]).toBe(WEBSITE_SCHEMA_ID);
      expect(schema.name).toBe(SITE_NAME);
      expect(schema.url).toBe(CANONICAL_URL);
      expect(schema.description).toBe(SITE_META_DESCRIPTION);
    });

    it("should include publisher information", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const websiteScript = scripts[0];
      const schema = JSON.parse(websiteScript.textContent || "{}");

      expect(schema.publisher["@id"]).toBe(PERSON_SCHEMA_ID);
    });
  });

  describe("script attributes", () => {
    it("should have correct type attribute on all scripts", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');

      scripts.forEach((script) => {
        expect(script).toHaveAttribute("type", "application/ld+json");
      });
    });

    it("should have valid JSON in all scripts", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');

      scripts.forEach((script) => {
        expect(() => JSON.parse(script.textContent || "{}")).not.toThrow();
      });
    });
  });
});
