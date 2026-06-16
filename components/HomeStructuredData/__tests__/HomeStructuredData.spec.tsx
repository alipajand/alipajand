import { render } from "@testing-library/react";
import { HomeStructuredData } from "components/HomeStructuredData/HomeStructuredData";
import { LINKS } from "data/links";
import {
  CANONICAL_URL,
  KEYWORDS,
  PERSON_SCHEMA_ADDRESS_COUNTRY,
  PERSON_SCHEMA_ADDRESS_LOCALITY,
  PERSON_SCHEMA_ADDRESS_REGION,
  PERSON_SCHEMA_ID,
  PERSON_SCHEMA_JOB_TITLE,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  TAGLINE,
} from "data/site";

describe("HomeStructuredData", () => {
  it("renders person and profile page schemas", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);
  });

  it("includes the expected person schema", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const schema = JSON.parse(scripts[0].textContent || "{}");

    expect(schema["@type"]).toBe("Person");
    expect(schema["@id"]).toBe(PERSON_SCHEMA_ID);
    expect(schema.name).toBe(SITE_NAME);
    expect(schema.url).toBe(CANONICAL_URL);
    expect(schema.jobTitle).toBe(PERSON_SCHEMA_JOB_TITLE);
    expect(schema.description).toBe(SITE_META_DESCRIPTION);
    expect(schema.knowsAbout).toEqual(KEYWORDS);
    expect(schema.address.addressLocality).toBe(PERSON_SCHEMA_ADDRESS_LOCALITY);
    expect(schema.address.addressRegion).toBe(PERSON_SCHEMA_ADDRESS_REGION);
    expect(schema.address.addressCountry).toBe(PERSON_SCHEMA_ADDRESS_COUNTRY);
    expect(schema.sameAs).toEqual(
      expect.arrayContaining(
        LINKS.filter((link) => link.label === "GitHub" || link.label === "LinkedIn").map(
          (link) => link.href
        )
      )
    );
  });

  it("includes the expected profile page schema", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const schema = JSON.parse(scripts[1].textContent || "{}");

    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.name).toBe(`${SITE_NAME} — ${TAGLINE}`);
    expect(schema.url).toBe(CANONICAL_URL);
    expect(schema.description).toBe(SITE_META_DESCRIPTION);
    expect(schema.mainEntity["@id"]).toBe(PERSON_SCHEMA_ID);
  });
});
