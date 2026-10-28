import { Ticker } from "components/hairline/Ticker/Ticker";
import { OpenSourceActivity } from "features/open-source/OpenSourceActivity";
import { OpenSourceCta } from "features/open-source/OpenSourceCta";
import { OpenSourceDisplay } from "features/open-source/OpenSourceDisplay";
import { OpenSourceHero } from "features/open-source/OpenSourceHero";
import { OpenSourcePrinciples } from "features/open-source/OpenSourcePrinciples";
import { OpenSourceProjects } from "features/open-source/OpenSourceProjects";
import { OpenSourceTechnology } from "features/open-source/OpenSourceTechnology";
import type { ContributionSnapshot } from "data/openSourceActivity";
import { OPEN_SOURCE_TECHNOLOGY_TICKER, OPEN_SOURCE_TOOL_TICKER } from "data/openSourcePage";

interface OpenSourcePageContentProps {
  activity: ContributionSnapshot;
}

export const OpenSourcePageContent = ({ activity }: OpenSourcePageContentProps) => (
  <main id="main-content" tabIndex={-1}>
    <OpenSourceDisplay />
    <OpenSourceHero />
    <Ticker items={OPEN_SOURCE_TECHNOLOGY_TICKER} icon="ring" direction={1} />
    <OpenSourceProjects />
    <OpenSourcePrinciples />
    <OpenSourceTechnology />
    <OpenSourceActivity snapshot={activity} />
    <Ticker items={OPEN_SOURCE_TOOL_TICKER} icon="spark" direction={-1} />
    <OpenSourceCta />
  </main>
);
