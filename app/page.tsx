import { HomeStructuredData } from "components/HomeStructuredData/HomeStructuredData";
import { HomePageContent } from "features/home/HomePageContent";
import { getPostsForWritingSection } from "utils/posts";

export default function Home() {
  const { featured, recent } = getPostsForWritingSection(2);

  return (
    <>
      <HomeStructuredData />
      <HomePageContent writingFeatured={featured} writingRecent={recent} />
    </>
  );
}
