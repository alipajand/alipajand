import { CANONICAL_URL, PERSON_SCHEMA_ID, WEBSITE_SCHEMA_ID } from "data/site";

export interface CollectionPageJsonLdItem {
  url: string;
  name: string;
  description?: string;
  /** schema.org type of the listed item, e.g. "Article" or "SoftwareSourceCode". */
  type: string;
  /** Extra schema.org properties for the item (codeRepository, datePublished, ...). */
  properties?: Record<string, unknown>;
}

interface CollectionPageJsonLdProps {
  url: string;
  /** Stable node id other schemas reference via isPartOf. Defaults to the page URL. */
  id?: string;
  name: string;
  description: string;
  items: CollectionPageJsonLdItem[];
}

export const CollectionPageJsonLd = ({
  url,
  id,
  name,
  description,
  items,
}: CollectionPageJsonLdProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": id ?? url,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_SCHEMA_ID },
    author: { "@id": PERSON_SCHEMA_ID },
    about: { "@id": PERSON_SCHEMA_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        item: {
          "@type": item.type,
          "@id": item.url,
          url: item.url,
          name: item.name,
          ...(item.description ? { description: item.description } : {}),
          author: { "@id": PERSON_SCHEMA_ID, url: CANONICAL_URL },
          ...item.properties,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
