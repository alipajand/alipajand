import { Hero } from "components/Hero/Hero";
import { ProofStrip } from "components/ProofStrip/ProofStrip";
import { HireProof } from "components/HireProof/HireProof";
import { SelectedWorkGallery } from "components/SelectedWorkGallery/SelectedWorkGallery";
import { Testimonials } from "components/Testimonials/Testimonials";
import { Writing } from "components/Writing/Writing";
import { HiringSummary } from "components/HiringSummary/HiringSummary";
import { Contact } from "components/Contact/Contact";
import { MainReveal } from "components/MainReveal/MainReveal";
import { getPostsForWritingSection } from "utils/posts";

export default function Home() {
  const { featured: featuredPost, recent: writingPosts } = getPostsForWritingSection(2);

  return (
    <>
      <MainReveal>
        <main id="main-content" tabIndex={-1}>
          <Hero />
          <ProofStrip />
          <HireProof />
          <SelectedWorkGallery />
          <Testimonials />
          <Writing featured={featuredPost} posts={writingPosts} />
          <HiringSummary />
          <Contact />
        </main>
      </MainReveal>
    </>
  );
}
