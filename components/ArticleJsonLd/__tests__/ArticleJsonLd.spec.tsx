import { render } from "@testing-library/react";
import { ArticleJsonLd } from "components/ArticleJsonLd/ArticleJsonLd";
import { CANONICAL_URL, PERSON_SCHEMA_ID, SITE_NAME } from "data/site";

describe("ArticleJsonLd", () => {
  it("renders BlogPosting JSON-LD", () => {
    const { container } = render(
      <ArticleJsonLd
        post={{
          slug: "test-slug",
          title: "Test title",
          date: "2025-06-01",
          excerpt: "Test excerpt.",
        }}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const schema = JSON.parse(script?.textContent || "{}");
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("Test title");
    expect(schema.url).toBe(`${CANONICAL_URL}/blog/test-slug`);
    expect(schema.author["@id"]).toBe(PERSON_SCHEMA_ID);
    expect(schema.publisher["@id"]).toBe(PERSON_SCHEMA_ID);
    expect(schema.isPartOf.name).toContain(SITE_NAME);
  });
});
