import Link from "next/link";

import { NowBulletItem } from "features/now/NowBulletItem";
import type { NowSection } from "data/now";

interface NowSectionBlockProps {
  section: NowSection;
}

export const NowSectionBlock = ({ section }: NowSectionBlockProps) => {
  return (
    <section aria-labelledby={`now-${section.id}-heading`}>
      <h2 id={`now-${section.id}-heading`}>{section.title}</h2>
      <div>
        <ul>
          {section.items.map((item) => (
            <NowBulletItem key={item}>{item}</NowBulletItem>
          ))}
        </ul>
        {section.footer ? (
          <p>
            <Link href={section.footer.href}>{section.footer.label}</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
};
