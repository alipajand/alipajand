import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import { Ticker } from "components/hairline/Ticker/Ticker";
import { EngineeringPrinciplesDisplay } from "features/engineering-principles/EngineeringPrinciplesDisplay";
import { EngineeringPrinciplesHero } from "features/engineering-principles/EngineeringPrinciplesHero";
import { EngineeringPrinciplesList } from "features/engineering-principles/EngineeringPrinciplesList";
import { EngineeringPrinciplesReview } from "features/engineering-principles/EngineeringPrinciplesReview";
import {
  ENGINEERING_PRINCIPLES_DISPLAY_LINES,
  ENGINEERING_PRINCIPLES_SECTIONS,
} from "data/engineeringPrinciples";
import { PAGE_NEXT_LINKS, PAGE_NEXT_LINKS_ARIA_LABEL } from "data/pageChrome";

const TITLES = ENGINEERING_PRINCIPLES_SECTIONS.map((section) => section.title);

export const EngineeringPrinciplesPageContent = () => (
  <main id="main-content" tabIndex={-1}>
    <EngineeringPrinciplesDisplay lines={ENGINEERING_PRINCIPLES_DISPLAY_LINES} />
    <EngineeringPrinciplesHero />
    <Ticker items={TITLES} icon="spark" direction={1} />
    <EngineeringPrinciplesList />
    <EngineeringPrinciplesReview />
    <NextLinks links={PAGE_NEXT_LINKS} label={PAGE_NEXT_LINKS_ARIA_LABEL} />
  </main>
);
