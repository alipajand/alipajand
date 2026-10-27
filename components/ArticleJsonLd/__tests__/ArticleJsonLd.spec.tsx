import { render } from "@testing-library/react";
import { ArticleJsonLd } from "components/ArticleJsonLd/ArticleJsonLd";
import { CANONICAL_URL, PERSON_SCHEMA_ID, SITE_NAME } from "data/site";

describe("ArticleJsonLd", () => {
  it("should render article JSON-LD for writing posts", () => {
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
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Test title");
    expect(schema.url).toBe(`${CANONICAL_URL}/writing/test-slug`);
    expect(schema.author["@id"]).toBe(PERSON_SCHEMA_ID);
    expect(schema.publisher["@id"]).toBe(PERSON_SCHEMA_ID);
    expect(schema.image).toEqual([`${CANONICAL_URL}/writing/test-slug/opengraph-image`]);
    expect(schema.isPartOf.name).toContain(SITE_NAME);
  });

  it("should not let a malicious title close the script element", () => {
    const title = "</script><script>alert(1)</script>";
    const { container } = render(
      <ArticleJsonLd
        post={{ slug: "test-slug", title, date: "2025-06-01", excerpt: "Test excerpt." }}
      />
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const text = script?.textContent ?? "";
    expect(text).not.toContain("</script");
    expect(container.querySelectorAll("script")).toHaveLength(1);
    expect(JSON.parse(text).headline).toBe(title);
  });
});
