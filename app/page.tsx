import type { Metadata } from "next";

import { HomeStructuredData } from "components/HomeStructuredData/HomeStructuredData";
import { HomePageContent } from "features/home/HomePageContent";
import { CANONICAL_URL } from "data/site";
import { currentTime } from "utils/clock";
import { getPostsForWritingSection } from "utils/posts";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: CANONICAL_URL },
};

export default function Home() {
  const { featured, recent } = getPostsForWritingSection(2, currentTime());

  return (
    <>
      <HomeStructuredData />
      <HomePageContent writingFeatured={featured} writingRecent={recent} />
    </>
  );
}
