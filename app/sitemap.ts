import type { MetadataRoute } from "next";

import { CANONICAL_URL } from "data/site";
import { getAllPosts } from "utils/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${CANONICAL_URL}/writing/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
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
      lastModified: new Date(),
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
  ];
}
