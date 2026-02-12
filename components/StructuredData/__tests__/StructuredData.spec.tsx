import { render } from "@testing-library/react";
import { StructuredData } from "components/StructuredData/StructuredData";
import { LINKS } from "data/links";
import { CANONICAL_URL, HERO_SUB, KEYWORDS, SITE_NAME, TAGLINE } from "data/site";

describe("StructuredData", () => {
  it("should render three script tags", () => {
    const { container } = render(<StructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(3);
  });

  describe("Person schema", () => {
    it("should include correct person schema structure", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const personScript = scripts[0];
      const schema = JSON.parse(personScript.textContent || "{}");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe(SITE_NAME);
      expect(schema.url).toBe(CANONICAL_URL);
      expect(schema.jobTitle).toBe("Senior Product Engineer");
      expect(schema.description).toBe(HERO_SUB);
      expect(schema.knowsAbout).toEqual(KEYWORDS);
    });

    it("should include address information", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const personScript = scripts[0];
      const schema = JSON.parse(personScript.textContent || "{}");

      expect(schema.address["@type"]).toBe("PostalAddress");
      expect(schema.address.addressLocality).toBe("Montreal");
      expect(schema.address.addressRegion).toBe("Quebec");
      expect(schema.address.addressCountry).toBe("CA");
    });

    it("should include sameAs links from LINKS data", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const personScript = scripts[0];
      const schema = JSON.parse(personScript.textContent || "{}");

      expect(Array.isArray(schema.sameAs)).toBe(true);
      const githubLink = LINKS.find((link) => link.label === "GitHub")?.href;
      const linkedInLink = LINKS.find((link) => link.label === "LinkedIn")?.href;

      if (githubLink) {
        expect(schema.sameAs).toContain(githubLink);
      }
      if (linkedInLink) {
        expect(schema.sameAs).toContain(linkedInLink);
      }
    });

    it("should filter out undefined sameAs values", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const personScript = scripts[0];
      const schema = JSON.parse(personScript.textContent || "{}");

      schema.sameAs.forEach((url: unknown) => {
        expect(url).toBeTruthy();
        expect(typeof url).toBe("string");
      });
    });
  });

  describe("Website schema", () => {
    it("should include correct website schema structure", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const websiteScript = scripts[1];
      const schema = JSON.parse(websiteScript.textContent || "{}");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBe(SITE_NAME);
      expect(schema.url).toBe(CANONICAL_URL);
      expect(schema.description).toBe(HERO_SUB);
    });

    it("should include publisher information", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const websiteScript = scripts[1];
      const schema = JSON.parse(websiteScript.textContent || "{}");

      expect(schema.publisher["@type"]).toBe("Person");
      expect(schema.publisher.name).toBe(SITE_NAME);
    });
  });

  describe("ProfilePage schema", () => {
    it("should include correct profile page schema structure", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const profileScript = scripts[2];
      const schema = JSON.parse(profileScript.textContent || "{}");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("ProfilePage");
      expect(schema.name).toBe(`${SITE_NAME} - ${TAGLINE}`);
      expect(schema.url).toBe(CANONICAL_URL);
      expect(schema.description).toBe(HERO_SUB);
    });

    it("should include mainEntity information", () => {
      const { container } = render(<StructuredData />);
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      const profileScript = scripts[2];
      const schema = JSON.parse(profileScript.textContent || "{}");

      expect(schema.mainEntity["@type"]).toBe("Person");
      expect(schema.mainEntity.name).toBe(SITE_NAME);
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
