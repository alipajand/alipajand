"use client";

import type { WritingPost } from "components/Writing/WritingPost";
import { About } from "components/About/About";
import { Contact } from "components/Contact/Contact";
import { Hero } from "components/Hero/Hero";
import { HiringFit } from "components/HiringFit/HiringFit";
import { MainReveal } from "components/MainReveal/MainReveal";
import { OpenSourceTools } from "components/OpenSourceTools/OpenSourceTools";
import { SelectedWork } from "components/SelectedWork/SelectedWork";
import { Writing } from "components/Writing/Writing";
import { HOMEPAGE_WRITING_HEADING } from "data/homepage";

interface HomePageContentProps {
  writingFeatured: WritingPost | null;
  writingRecent: WritingPost[];
}

export const HomePageContent = ({ writingFeatured, writingRecent }: HomePageContentProps) => {
  return (
    <MainReveal>
      <Hero />
      <SelectedWork />
      <About />
      <HiringFit />
      <OpenSourceTools />
      <Writing
        featured={writingFeatured}
        posts={writingRecent}
        heading={HOMEPAGE_WRITING_HEADING}
      />
      <Contact />
    </MainReveal>
  );
};
