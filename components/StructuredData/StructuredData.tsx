"use client";

import { CANONICAL_URL, HERO_SUB, KEYWORDS, SITE_NAME, TAGLINE } from "data/site";
import { LINKS } from "data/links";

export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: CANONICAL_URL,
    jobTitle: "Senior Product Engineer",
    description: HERO_SUB,
    knowsAbout: KEYWORDS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Montreal",
      addressRegion: "Quebec",
      addressCountry: "CA",
    },
    sameAs: [
      LINKS.find((link) => link.label === "GitHub")?.href,
      LINKS.find((link) => link.label === "LinkedIn")?.href,
    ].filter((url): url is string => Boolean(url)),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: CANONICAL_URL,
    description: HERO_SUB,
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${SITE_NAME} - ${TAGLINE}`,
    url: CANONICAL_URL,
    description: HERO_SUB,
    mainEntity: {
      "@type": "Person",
      name: SITE_NAME,
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
