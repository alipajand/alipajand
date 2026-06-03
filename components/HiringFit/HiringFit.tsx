import Link from "next/link";

import { HiringFitGridItem } from "components/HiringFit/HiringFitGridItem";
import {
  HIRING_FIT_CARDS,
  HIRING_FIT_CTA_PRIMARY_HREF,
  HIRING_FIT_CTA_PRIMARY_LABEL,
  HIRING_FIT_CTA_SECONDARY_HREF,
  HIRING_FIT_CTA_SECONDARY_LABEL,
  HIRING_FIT_HEADING,
  HIRING_FIT_LEDE,
} from "data/hiringFit";
import {
  CTA_PRIMARY,
  CTA_SECONDARY,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

export function HiringFit() {
  return (
    <section id="hiring-fit" aria-labelledby="hiring-fit-heading" className={SECTION_SHELL}>
      <div className={SECTION_INNER}>
        <h2 id="hiring-fit-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
          {HIRING_FIT_HEADING}
        </h2>
        <p className={`${SECTION_LEDE_LG} mb-10 sm:mb-12`}>{HIRING_FIT_LEDE}</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0 m-0">
          {HIRING_FIT_CARDS.map((card) => (
            <HiringFitGridItem key={card.id} card={card} />
          ))}
        </ul>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <Link href={HIRING_FIT_CTA_PRIMARY_HREF} className={`${CTA_PRIMARY} w-full sm:w-auto`}>
            {HIRING_FIT_CTA_PRIMARY_LABEL}
          </Link>
          <Link
            href={HIRING_FIT_CTA_SECONDARY_HREF}
            className={`${CTA_SECONDARY} w-full sm:w-auto`}
          >
            {HIRING_FIT_CTA_SECONDARY_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}
