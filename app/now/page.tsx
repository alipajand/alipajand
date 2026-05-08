import type { Metadata } from "next";
import Link from "next/link";

import { MainReveal } from "components/MainReveal/MainReveal";
import { NOW_LEDE, NOW_SECTIONS } from "data/now";
import { buildNowMetadata } from "utils/metadata";
import { LABEL_OVERLINE, SECTION_INNER, SECTION_LEDE, SECTION_X } from "utils/visual";

export const metadata: Metadata = buildNowMetadata();

export default function NowPage() {
  return (
    <MainReveal>
      <header
        className={`${SECTION_X} border-b border-border bg-background pt-28 pb-10 sm:pb-12 sm:pt-32`}
      >
        <div className={SECTION_INNER}>
          <p className={`${LABEL_OVERLINE} mb-2`}>Snapshot</p>
          <h1 className="font-display font-bold tracking-tight text-3xl sm:text-4xl text-foreground">
            Now
          </h1>
          <p className={`${SECTION_LEDE} mt-4 max-w-2xl`}>{NOW_LEDE}</p>
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
        <div className={SECTION_INNER}>
          <div className="space-y-12 sm:space-y-14">
            {NOW_SECTIONS.map((section) => (
              <section key={section.id} aria-labelledby={`now-${section.id}-heading`}>
                <h2
                  id={`now-${section.id}-heading`}
                  className="font-display font-semibold text-xl sm:text-2xl text-foreground tracking-tight"
                >
                  {section.title}
                </h2>
                <div className="mt-4 max-w-2xl space-y-4">
                  <ul className={`${SECTION_LEDE} list-disc pl-5 space-y-2 m-0`}>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {section.footer ? (
                    <p className={SECTION_LEDE}>
                      <Link
                        href={section.footer.href}
                        className="text-foreground underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                      >
                        {section.footer.label}
                      </Link>
                    </p>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </MainReveal>
  );
}
