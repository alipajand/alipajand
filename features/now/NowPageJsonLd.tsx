import { NOW_META_DESCRIPTION, NOW_PAGE_TITLE, NOW_UPDATED } from "data/now";
import { CANONICAL_URL, PERSON_SCHEMA_ID, SITE_NAME, WEBSITE_SCHEMA_ID } from "data/site";
import { serializeJsonLd } from "utils/jsonLd";

/** The /now page as a `WebPage`, dated by the hand-set `NOW_UPDATED`, not by the build. */
export const NowPageJsonLd = () => {
  const url = `${CANONICAL_URL}/now`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: `${NOW_PAGE_TITLE} · ${SITE_NAME}`,
    description: NOW_META_DESCRIPTION,
    inLanguage: "en",
    dateModified: NOW_UPDATED,
    isPartOf: { "@id": WEBSITE_SCHEMA_ID },
    about: { "@id": PERSON_SCHEMA_ID },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
};
