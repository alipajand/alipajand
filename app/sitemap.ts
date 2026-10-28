import type { MetadataRoute } from "next";

import { NOW_UPDATED } from "data/now";
import { CANONICAL_URL } from "data/site";
import { getDedicatedCaseStudySlugs } from "utils/projects";
import { currentTime } from "utils/clock";
import { getPublishedPosts } from "utils/posts";
import { modifiedDate } from "utils/publication";

/** Hourly, so a scheduled post goes live within an hour of its date without a deploy. */
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts(currentTime());
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${CANONICAL_URL}/writing/${post.slug}`,
    lastModified: modifiedDate(post),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = getDedicatedCaseStudySlugs().map((slug) => ({
    url: `${CANONICAL_URL}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: CANONICAL_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${CANONICAL_URL}/writing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${CANONICAL_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${CANONICAL_URL}/engineering-principles`,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.78,
    },
    ...postEntries,
    ...caseStudyEntries,
  ];
}
