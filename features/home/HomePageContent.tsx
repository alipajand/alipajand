"use client";

import type { WritingPost } from "components/Writing/WritingPost";
import { Contact } from "components/Contact/Contact";
import { Hero } from "components/Hero/Hero";
import { HiringFit } from "components/HiringFit/HiringFit";
import { MainReveal } from "components/MainReveal/MainReveal";
import { ProofStrip } from "components/ProofStrip/ProofStrip";
import { SelectedWork } from "components/SelectedWork/SelectedWork";
import { Testimonials } from "components/Testimonials/Testimonials";
import { Writing } from "components/Writing/Writing";

interface HomePageContentProps {
  writingFeatured: WritingPost | null;
  writingRecent: WritingPost[];
}

export function HomePageContent({ writingFeatured, writingRecent }: HomePageContentProps) {
  return (
    <MainReveal>
      <Hero />
      <ProofStrip />
      <SelectedWork />
      <HiringFit />
      <Writing featured={writingFeatured} posts={writingRecent} />
      <Testimonials />
      <Contact />
    </MainReveal>
  );
}
