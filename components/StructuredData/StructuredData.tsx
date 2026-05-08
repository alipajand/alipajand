"use client";

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
  WEBSITE_SCHEMA_ID,
} from "data/site";
import { LINKS } from "data/links";

export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@id": PERSON_SCHEMA_ID,
    "@type": "Person",
    name: SITE_NAME,
    url: CANONICAL_URL,
    jobTitle: PERSON_SCHEMA_JOB_TITLE,
    description: SITE_META_DESCRIPTION,
    knowsAbout: KEYWORDS,
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON_SCHEMA_ADDRESS_LOCALITY,
      addressRegion: PERSON_SCHEMA_ADDRESS_REGION,
      addressCountry: PERSON_SCHEMA_ADDRESS_COUNTRY,
    },
    sameAs: [
      LINKS.find((link) => link.label === "GitHub")?.href,
      LINKS.find((link) => link.label === "LinkedIn")?.href,
    ].filter((url): url is string => Boolean(url)),
  };

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

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${SITE_NAME} - ${TAGLINE}`,
    url: CANONICAL_URL,
    description: SITE_META_DESCRIPTION,
    mainEntity: {
      "@id": PERSON_SCHEMA_ID,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
