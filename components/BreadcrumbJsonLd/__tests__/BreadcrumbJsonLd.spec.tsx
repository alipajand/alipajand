import { render } from "@testing-library/react";
import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";

describe("BreadcrumbJsonLd", () => {
  it("renders breadcrumb list schema", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://example.com" },
          { name: "Writing", url: "https://example.com/writing" },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent || "{}");

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://example.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writing",
        item: "https://example.com/writing",
      },
    ]);
  });
});
