import { Chev, Spark } from "components/hairline/Icons/Icons";
import { SectionFoot, SectionHead } from "components/hairline/SectionHead/SectionHead";
import styles from "features/home/HomeOpenSource.module.css";
import { homepageToolCount } from "data/homepage";
import {
  HOME_OPEN_SOURCE_TOOLS,
  OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL,
  OPEN_SOURCE_TOOLS,
  OPEN_SOURCE_TOOLS_CTA_HREF,
  OPEN_SOURCE_TOOLS_CTA_LABEL,
  OPEN_SOURCE_TOOLS_HEADING,
  OPEN_SOURCE_TOOLS_LEDE,
  openSourceToolRepositoryAriaLabel,
} from "data/openSourceTools";

const releaseMonth = (isoDate: string) => {
  const [year, month] = isoDate.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const HomeOpenSource = () => (
  <section id="open-source-tools" aria-labelledby="open-source-tools-heading">
    <SectionHead
      title={OPEN_SOURCE_TOOLS_HEADING}
      titleId="open-source-tools-heading"
      lede={OPEN_SOURCE_TOOLS_LEDE}
    />
    <ul className={styles.tools}>
      {HOME_OPEN_SOURCE_TOOLS.map((tool) => (
        <li key={tool.name} className={styles.tool}>
          <div className={styles.top}>
            <h3>{tool.name}</h3>
            <time className={styles.date} dateTime={tool.releasedOn}>
              {releaseMonth(tool.releasedOn)}
            </time>
          </div>
          <p>{tool.problem}</p>
          <ul aria-label={`${tool.name} capabilities`}>
            {tool.capabilities.map((capability) => (
              <li key={capability}>
                <Spark />
                {capability}
              </li>
            ))}
          </ul>
          <a
            className={styles.repo}
            href={tool.repositoryUrl}
            aria-label={openSourceToolRepositoryAriaLabel(tool.name)}
          >
            {OPEN_SOURCE_TOOL_REPOSITORY_LINK_LABEL}
            <Chev />
          </a>
        </li>
      ))}
    </ul>
    <SectionFoot
      count={homepageToolCount(HOME_OPEN_SOURCE_TOOLS.length, OPEN_SOURCE_TOOLS.length)}
      action={{ href: OPEN_SOURCE_TOOLS_CTA_HREF, label: OPEN_SOURCE_TOOLS_CTA_LABEL }}
    />
  </section>
);
