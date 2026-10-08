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
  it("should render person and profile page schemas", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);
  });

  it("should include the expected person schema", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const schema = JSON.parse(scripts[0].textContent || "{}");

    expect(schema["@type"]).toBe("Person");
    expect(schema["@id"]).toBe(PERSON_SCHEMA_ID);
    expect(schema.name).toBe(SITE_NAME);
    expect(schema.url).toBe(CANONICAL_URL);
    expect(schema.jobTitle).toBe(PERSON_SCHEMA_JOB_TITLE);
    expect(schema.jobTitle).toBe("Staff Frontend Engineer");
    expect(schema.description).toBe(SITE_META_DESCRIPTION);
    expect(schema.knowsAbout).toEqual(KEYWORDS);
    expect(schema.knowsAbout).toEqual([
      "Frontend architecture",
      "React",
      "Next.js",
      "TypeScript",
      "Design systems",
      "Staff Frontend Engineer",
      "Senior Frontend Engineer",
      "Lead Frontend Engineer",
      "Full-Stack Engineer",
      "Node.js",
      "Web accessibility",
      "Data visualization",
      "Developer experience",
      "AI-assisted software engineering",
    ]);
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

  it("should include the expected profile page schema", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const schema = JSON.parse(scripts[1].textContent || "{}");

    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.name).toBe(`${SITE_NAME} | ${TAGLINE}`);
    expect(schema.url).toBe(CANONICAL_URL);
    expect(schema.description).toBe(SITE_META_DESCRIPTION);
    expect(schema.mainEntity["@id"]).toBe(PERSON_SCHEMA_ID);
  });

  it("should point search engines at the designed profile images", () => {
    const { container } = render(<HomeStructuredData />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const person = JSON.parse(scripts[0].textContent || "{}");
    const profilePage = JSON.parse(scripts[1].textContent || "{}");
    const expected = ["1x1", "4x3", "16x9"].map(
      (variant) => `${CANONICAL_URL}/images/profile-${variant}.png`
    );

    expect(person.image).toEqual(expected);
    expect(profilePage.image).toEqual(expected);
    expect(profilePage.primaryImageOfPage).toMatchObject({
      "@type": "ImageObject",
      url: `${CANONICAL_URL}/images/profile-1x1.png`,
      width: 1200,
      height: 1200,
    });
  });
});
