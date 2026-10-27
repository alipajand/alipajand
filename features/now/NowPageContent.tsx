import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import { NowBreadcrumbs } from "features/now/NowBreadcrumbs";
import { NowDisplay } from "features/now/NowDisplay";
import { NowIntro } from "features/now/NowIntro";
import { NowSnapshot } from "features/now/NowSnapshot";
import { NowStack } from "features/now/NowStack";
import { NowWeekRuler } from "features/now/NowWeekRuler";
import { nowBreadcrumbs } from "data/breadcrumbs";
import { NOW_SECTIONS, NOW_STACK_SECTION_ID } from "data/now";
import { PAGE_NEXT_LINKS, PAGE_NEXT_LINKS_ARIA_LABEL } from "data/pageChrome";
import { weekOfYear } from "utils/week";

interface NowPageContentProps {
  /** Injected in tests; defaults to the render time. */
  now?: Date;
}

const stackSection = NOW_SECTIONS.find((section) => section.id === NOW_STACK_SECTION_ID);
const cellSections = NOW_SECTIONS.filter((section) => section !== stackSection);

export const NowPageContent = ({ now = new Date() }: NowPageContentProps) => (
  <main id="main-content" tabIndex={-1}>
    <NowBreadcrumbs items={nowBreadcrumbs()} />
    <NowDisplay year={now.getFullYear()} />
    <NowIntro />
    <NowWeekRuler year={now.getFullYear()} initialWeek={weekOfYear(now)} />
    <NowSnapshot sections={cellSections} />
    {stackSection ? <NowStack section={stackSection} position={cellSections.length + 1} /> : null}
    <NextLinks links={PAGE_NEXT_LINKS} label={PAGE_NEXT_LINKS_ARIA_LABEL} />
  </main>
);
