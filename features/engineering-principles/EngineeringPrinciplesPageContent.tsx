import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import { EngineeringPrinciplesSectionBlock } from "features/engineering-principles/EngineeringPrinciplesSectionBlock";
import { engineeringPrinciplesBreadcrumbs } from "data/breadcrumbs";
import {
  ENGINEERING_PRINCIPLES_HEADER_OVERLINE,
  ENGINEERING_PRINCIPLES_LEDE,
  ENGINEERING_PRINCIPLES_PAGE_TITLE,
  ENGINEERING_PRINCIPLES_SECTIONS,
  ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL,
} from "data/engineeringPrinciples";
import type { PostHeading } from "utils/headings";

const PRINCIPLE_HEADINGS: PostHeading[] = ENGINEERING_PRINCIPLES_SECTIONS.map((section) => ({
  id: section.id,
  text: section.title,
  level: 2,
}));

export const EngineeringPrinciplesPageContent = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <header>
        <div>
          <Breadcrumbs items={engineeringPrinciplesBreadcrumbs()} />
          <p>{ENGINEERING_PRINCIPLES_HEADER_OVERLINE}</p>
          <h1>{ENGINEERING_PRINCIPLES_PAGE_TITLE}</h1>
          <p>{ENGINEERING_PRINCIPLES_LEDE}</p>
        </div>
      </header>

      <div>
        <article>
          <div>
            <TableOfContentsDisclosure
              headings={PRINCIPLE_HEADINGS}
              ariaLabel={ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL}
            />
            <div>
              {ENGINEERING_PRINCIPLES_SECTIONS.map((section, index) => (
                <EngineeringPrinciplesSectionBlock
                  key={section.id}
                  section={section}
                  number={index + 1}
                />
              ))}
            </div>
          </div>
          <aside>
            <TableOfContents
              headings={PRINCIPLE_HEADINGS}
              ariaLabel={ENGINEERING_PRINCIPLES_TOC_ARIA_LABEL}
            />
          </aside>
        </article>
      </div>
    </main>
  );
};
