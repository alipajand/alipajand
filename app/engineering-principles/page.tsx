import type { Metadata } from "next";
import Link from "next/link";

import { MainReveal } from "components/MainReveal/MainReveal";
import {
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_SECTIONS,
} from "data/engineeringPrinciples";
import { buildEngineeringPrinciplesMetadata } from "utils/metadata";
import { LABEL_OVERLINE, SECTION_INNER, SECTION_LEDE, SECTION_X } from "utils/visual";

export const metadata: Metadata = buildEngineeringPrinciplesMetadata();

export default function EngineeringPrinciplesPage() {
  return (
    <MainReveal>
      <header
        className={`${SECTION_X} border-b border-border bg-background pt-28 pb-10 sm:pb-12 sm:pt-32`}
      >
        <div className={SECTION_INNER}>
          <p className={`${LABEL_OVERLINE} mb-2`}>Philosophy</p>
          <h1 className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground">
            Engineering principles
          </h1>
          <p className={`${SECTION_LEDE} mt-4 max-w-2xl`}>{ENGINEERING_PRINCIPLES_LEDE}</p>
          <p className="mt-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              ← Back to homepage
            </Link>
          </p>
        </div>
      </header>

      <div className={`${SECTION_X} py-14 sm:py-16 lg:py-20 border-t border-border bg-background`}>
        <article className={SECTION_INNER}>
          <div className="space-y-12 sm:space-y-14">
            {ENGINEERING_PRINCIPLES_SECTIONS.map((section) => (
              <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2
                  id={`${section.id}-heading`}
                  className="font-display font-semibold text-xl sm:text-2xl text-foreground tracking-tight"
                >
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((p, i) => (
                    <p key={`${section.id}-${i}`} className={`${SECTION_LEDE} max-w-2xl`}>
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </MainReveal>
  );
}
