"use client";

import Link from "next/link";

import { OpenSourceToolGridItem } from "components/OpenSourceTools/OpenSourceToolGridItem";
import {
  OPEN_SOURCE_TOOLS,
  OPEN_SOURCE_TOOLS_CTA_HREF,
  OPEN_SOURCE_TOOLS_CTA_LABEL,
  OPEN_SOURCE_TOOLS_HEADING,
  OPEN_SOURCE_TOOLS_LEDE,
} from "data/openSourceTools";
import { useScrollReveal } from "utils/hooks/useScrollReveal";
import {
  CTA_SECONDARY,
  SECTION_INNER,
  SECTION_LEDE_LG,
  SECTION_SHELL,
  SECTION_TITLE,
} from "utils/visual";

export const OpenSourceTools = () => {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 32, stagger: 0.08 });
  return (
    <section
      id="open-source-tools"
      ref={sectionRef}
      aria-labelledby="open-source-tools-heading"
      className={SECTION_SHELL}
    >
      <div className={SECTION_INNER}>
        <header className="mb-10 sm:mb-12" data-reveal>
          <h2 id="open-source-tools-heading" className={`${SECTION_TITLE} mb-4 sm:mb-5`}>
            {OPEN_SOURCE_TOOLS_HEADING}
          </h2>
          <p className={SECTION_LEDE_LG}>{OPEN_SOURCE_TOOLS_LEDE}</p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0 m-0">
          {OPEN_SOURCE_TOOLS.map((tool) => (
            <OpenSourceToolGridItem key={tool.name} tool={tool} />
          ))}
        </ul>

        <div className="mt-10 sm:mt-12" data-reveal>
          <Link href={OPEN_SOURCE_TOOLS_CTA_HREF} className={`${CTA_SECONDARY} w-full sm:w-auto`}>
            {OPEN_SOURCE_TOOLS_CTA_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
};
