import Link from "next/link";

import { NowBulletItem } from "features/now/NowBulletItem";
import type { NowSection } from "data/now";
import { SECTION_LEDE } from "utils/visual";

interface NowSectionBlockProps {
  section: NowSection;
}

export function NowSectionBlock({ section }: NowSectionBlockProps) {
  return (
    <section data-reveal aria-labelledby={`now-${section.id}-heading`}>
      <h2
        id={`now-${section.id}-heading`}
        className="font-display font-semibold text-xl sm:text-2xl text-foreground tracking-tight"
      >
        {section.title}
      </h2>
      <div className="mt-4 max-w-2xl space-y-4">
        <ul className={`${SECTION_LEDE} list-disc pl-5 space-y-2 m-0`}>
          {section.items.map((item) => (
            <NowBulletItem key={item}>{item}</NowBulletItem>
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
  );
}
