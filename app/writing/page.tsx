import type { Metadata } from "next";

import { WritingIndexPageContent } from "features/writing/WritingIndexPageContent";
import { getAllPosts } from "utils/posts";
import { buildWritingIndexMetadata } from "utils/metadata";

export const metadata: Metadata = buildWritingIndexMetadata();

export default async function WritingPage() {
  const posts = getAllPosts();
  return <WritingIndexPageContent posts={posts} />;
}
