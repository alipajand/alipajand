import {
  CANONICAL_URL,
  PERSON_SCHEMA_ID,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  WEBSITE_SCHEMA_ID,
} from "data/site";

export function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@id": WEBSITE_SCHEMA_ID,
    "@type": "WebSite",
    name: SITE_NAME,
    url: CANONICAL_URL,
    description: SITE_META_DESCRIPTION,
    publisher: {
      "@id": PERSON_SCHEMA_ID,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
