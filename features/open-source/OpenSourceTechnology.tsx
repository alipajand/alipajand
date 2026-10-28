import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import { OpenSourceBadges } from "features/open-source/OpenSourceBadges";
import { OPEN_SOURCE_TECHNOLOGY_BADGES, OPEN_SOURCE_TECHNOLOGY_HEADING } from "data/openSourcePage";

export const OpenSourceTechnology = () => (
  <section id="technology" aria-labelledby="tech-title">
    <SectionHead title={OPEN_SOURCE_TECHNOLOGY_HEADING} titleId="tech-title" />
    <OpenSourceBadges badges={OPEN_SOURCE_TECHNOLOGY_BADGES} />
  </section>
);
