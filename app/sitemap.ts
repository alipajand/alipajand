import type { MetadataRoute } from "next";

import { NOW_UPDATED } from "data/now";
import { CANONICAL_URL } from "data/site";
import { getDedicatedCaseStudySlugs } from "utils/projects";
import { getAllPosts } from "utils/posts";

/**
 * `lastModified` is set only where the content carries its own date (posts, /now). The other pages
 * have no recorded revision date, and the build time would claim every deploy changed them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${CANONICAL_URL}/writing/${post.slug}`,
    lastModified: post.date || new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = getDedicatedCaseStudySlugs().map((slug) => ({
    url: `${CANONICAL_URL}/portfolio/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: CANONICAL_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${CANONICAL_URL}/writing`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${CANONICAL_URL}/engineering-principles`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${CANONICAL_URL}/now`,
      lastModified: NOW_UPDATED,
      changeFrequency: "weekly",
      priority: 0.72,
    },
    {
      url: `${CANONICAL_URL}/open-source`,
      changeFrequency: "monthly",
      priority: 0.78,
    },
    ...postEntries,
    ...caseStudyEntries,
  ];
}
