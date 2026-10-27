import Link from "next/link";

import { SelectedWorkCard } from "components/SelectedWork/SelectedWorkCard";
import {
  HOMEPAGE_CASE_STUDIES,
  HOMEPAGE_CASE_STUDIES_HEADING,
  HOMEPAGE_CASE_STUDIES_LEDE,
} from "data/homepage";
import { SELECTED_WORK_SECTION_CTA_HREF, SELECTED_WORK_SECTION_CTA_LABEL } from "data/selectedWork";

export const SelectedWork = () => {
  return (
    <section id="case-studies" aria-labelledby="selected-work-heading">
      <div>
        <header>
          <h2 id="selected-work-heading">{HOMEPAGE_CASE_STUDIES_HEADING}</h2>
          <p>{HOMEPAGE_CASE_STUDIES_LEDE}</p>
        </header>

        <ul>
          {HOMEPAGE_CASE_STUDIES.map((caseStudy) => (
            <li key={caseStudy.id}>
              <SelectedWorkCard caseStudy={caseStudy} />
            </li>
          ))}
        </ul>

        <div>
          <Link href={SELECTED_WORK_SECTION_CTA_HREF}>{SELECTED_WORK_SECTION_CTA_LABEL}</Link>
        </div>
      </div>
    </section>
  );
};
