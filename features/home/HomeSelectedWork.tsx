import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import { SectionFoot, SectionHead } from "components/hairline/SectionHead/SectionHead";
import { Tags } from "components/hairline/Tags/Tags";
import { CaseGlyph } from "features/home/CaseGlyph";
import styles from "features/home/HomeSelectedWork.module.css";
import {
  HOMEPAGE_CASE_STUDIES,
  HOMEPAGE_CASE_STUDIES_HEADING,
  HOMEPAGE_CASE_STUDIES_LEDE,
  homepageCaseCount,
} from "data/homepage";
import { PROJECTS } from "data/projects";
import {
  SELECTED_WORK_CARD_CTA,
  SELECTED_WORK_SECTION_CTA_HREF,
  SELECTED_WORK_SECTION_CTA_LABEL,
} from "data/selectedWork";

const pad = (index: number) => String(index + 1).padStart(2, "0");

/** "LedgerGuard — Full-Stack AI Contract Intelligence" → name and subtitle. */
const splitTitle = (title: string): [string, string | undefined] => {
  const [name, ...rest] = title.split(" — ");
  return [name, rest.length > 0 ? rest.join(" — ") : undefined];
};

export const HomeSelectedWork = () => (
  <section id="case-studies" aria-labelledby="case-studies-heading">
    <SectionHead
      title={HOMEPAGE_CASE_STUDIES_HEADING}
      titleId="case-studies-heading"
      lede={HOMEPAGE_CASE_STUDIES_LEDE}
    />
    <ul className={styles.cases}>
      {HOMEPAGE_CASE_STUDIES.map((caseStudy, index) => {
        const [name, subtitle] = splitTitle(caseStudy.title);
        return (
          <li key={caseStudy.id} className={styles.case}>
            <div className={styles.top}>
              <span className={styles.label}>
                [{pad(index)}] {caseStudy.label}
              </span>
              <CaseGlyph id={caseStudy.id} className={styles.glyph} />
            </div>
            <h3 className={styles.title}>
              <Link href={caseStudy.href} className={styles.link}>
                {name}
                {subtitle ? <small>{subtitle}</small> : null}
              </Link>
            </h3>
            <p>{caseStudy.summary}</p>
            {caseStudy.supportingLine ? (
              <p className={styles.support}>{caseStudy.supportingLine}</p>
            ) : null}
            <Tags tags={caseStudy.tags} label={`${name} tags`} />
            <span className={styles.go} aria-hidden="true">
              {SELECTED_WORK_CARD_CTA}
              <Chev />
            </span>
          </li>
        );
      })}
    </ul>
    <SectionFoot
      count={homepageCaseCount(HOMEPAGE_CASE_STUDIES.length, PROJECTS.length)}
      action={{ href: SELECTED_WORK_SECTION_CTA_HREF, label: SELECTED_WORK_SECTION_CTA_LABEL }}
    />
  </section>
);
