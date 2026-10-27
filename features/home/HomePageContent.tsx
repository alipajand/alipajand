import { Contact } from "components/Contact/Contact";
import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import { Ticker } from "components/hairline/Ticker/Ticker";
import type { WritingPost } from "components/Writing/WritingPost";
import { HomeAbout } from "features/home/HomeAbout";
import { HomeCapabilities } from "features/home/HomeCapabilities";
import { HomeHero } from "features/home/HomeHero";
import { HomeOpenSource } from "features/home/HomeOpenSource";
import { HomeSelectedWork } from "features/home/HomeSelectedWork";
import { HomeWriting } from "features/home/HomeWriting";
import {
  HOMEPAGE_CAPABILITY_TICKER,
  HOMEPAGE_DISPLAY_WORDS,
  HOMEPAGE_TOOLING_TICKER,
  HOMEPAGE_WRITING_HEADING,
} from "data/homepage";

interface HomePageContentProps {
  writingFeatured: WritingPost | null;
  writingRecent: WritingPost[];
}

export const HomePageContent = ({ writingFeatured, writingRecent }: HomePageContentProps) => (
  <main id="main-content" tabIndex={-1}>
    <DisplayWord words={HOMEPAGE_DISPLAY_WORDS} variant="hero" motion="scroll" reach={0.42} />
    <HomeHero />
    <Ticker items={HOMEPAGE_CAPABILITY_TICKER} icon="ring" direction={1} />
    <HomeSelectedWork />
    <HomeAbout />
    <HomeCapabilities />
    <Ticker items={HOMEPAGE_TOOLING_TICKER} icon="spark" direction={-1} />
    <HomeOpenSource />
    <HomeWriting
      featured={writingFeatured}
      posts={writingRecent}
      heading={HOMEPAGE_WRITING_HEADING}
    />
    <Contact />
  </main>
);
