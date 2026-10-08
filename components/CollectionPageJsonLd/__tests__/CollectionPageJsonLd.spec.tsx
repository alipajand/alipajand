import { render } from "@testing-library/react";

import { CollectionPageJsonLd } from "components/CollectionPageJsonLd/CollectionPageJsonLd";
import { PERSON_SCHEMA_ID, WEBSITE_SCHEMA_ID } from "data/site";

describe("CollectionPageJsonLd", () => {
  it("should render a CollectionPage with an ordered ItemList", () => {
    const { container } = render(
      <CollectionPageJsonLd
        url="https://example.com/list"
        name="List"
        description="A list"
        items={[
          { url: "https://example.com/a", name: "A", type: "Article" },
          {
            url: "https://example.com/b",
            name: "B",
            description: "Second",
            type: "SoftwareSourceCode",
            properties: { codeRepository: "https://github.com/x/b" },
          },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script!.textContent!);

    expect(schema["@type"]).toBe("CollectionPage");
    expect(schema.isPartOf).toEqual({ "@id": WEBSITE_SCHEMA_ID });
    expect(schema.about).toEqual({ "@id": PERSON_SCHEMA_ID });
    expect(schema.mainEntity.numberOfItems).toBe(2);
    expect(schema.mainEntity.itemListElement[0]).toMatchObject({
      position: 1,
      url: "https://example.com/a",
      item: { "@type": "Article", name: "A" },
    });
    expect(schema.mainEntity.itemListElement[1].item).toMatchObject({
      "@type": "SoftwareSourceCode",
      description: "Second",
      codeRepository: "https://github.com/x/b",
    });
  });
});
