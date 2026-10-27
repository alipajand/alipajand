import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { PostDiagram } from "components/diagrams/PostDiagram";
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import { writingPostBreadcrumbs } from "data/breadcrumbs";
import { splitContentAtDiagramSlots, type DiagramSpec } from "utils/diagramBlocks";
import type { PostHeading } from "utils/headings";
import { formatDate } from "utils/date";

interface WritingPostPageContentProps {
  title: string;
  date: string;
  contentHtml: string;
  headings: PostHeading[];
  diagrams: DiagramSpec[];
}

export const WritingPostPageContent = ({
  title,
  date,
  contentHtml,
  headings,
  diagrams,
}: WritingPostPageContentProps) => {
  const segments = splitContentAtDiagramSlots(contentHtml);

  return (
    <>
      <div>
        <main id="main-content" tabIndex={-1}>
          <article>
            <header>
              <Breadcrumbs items={writingPostBreadcrumbs(title)} />
              <p>
                <time dateTime={date}>{formatDate(date)}</time>
              </p>
              <h1>{title}</h1>
            </header>
            <div>
              <div>
                <TableOfContentsDisclosure headings={headings} />
                <div>
                  {segments.map((segment, index) =>
                    segment.kind === "html" ? (
                      <div key={index} dangerouslySetInnerHTML={{ __html: segment.html }} />
                    ) : diagrams[segment.index] ? (
                      <PostDiagram key={index} spec={diagrams[segment.index]} />
                    ) : null
                  )}
                </div>
              </div>
              <aside>
                <TableOfContents headings={headings} />
              </aside>
            </div>
          </article>
        </main>
      </div>
    </>
  );
};
