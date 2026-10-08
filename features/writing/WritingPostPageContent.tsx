"use client";

import type React from "react";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { PostDiagram } from "components/diagrams/PostDiagram";
import { ReadingProgress } from "components/ReadingProgress/ReadingProgress";
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from "components/TableOfContents/TableOfContents";
import { writingPostBreadcrumbs } from "data/breadcrumbs";
import { splitContentAtDiagramSlots, type DiagramSpec } from "utils/diagramBlocks";
import type { PostHeading } from "utils/headings";
import { useAutoReveal } from "utils/hooks/useAutoReveal";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { formatDate } from "utils/date";
import { PAGE_ARTICLE_SHELL, SECTION_INNER } from "utils/visual";

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
  const {
    selectors: { headerRef },
  } = usePageHeader();

  const {
    selectors: { containerRef: bodyRef },
  } = useAutoReveal({
    selector: ":scope > div > *, :scope > figure",
    y: 18,
    duration: 0.6,
    stagger: 0.05,
  });

  const segments = splitContentAtDiagramSlots(contentHtml);

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-background text-foreground">
        <main id="main-content" tabIndex={-1} className={`outline-none ${PAGE_ARTICLE_SHELL}`}>
          <article className={SECTION_INNER}>
            <header ref={headerRef as React.RefObject<HTMLElement>} className="mb-8">
              <Breadcrumbs items={writingPostBreadcrumbs(title)} className="mb-8" />
              <p data-header-meta className="text-muted text-sm font-medium tabular-nums">
                <time dateTime={date}>{formatDate(date)}</time>
              </p>
              <h1
                data-header-title
                className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-2 max-w-3xl"
              >
                {title}
              </h1>
            </header>
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:gap-14">
              <div className="min-w-0">
                <TableOfContentsDisclosure headings={headings} className="mb-8 lg:hidden" />
                <div
                  ref={bodyRef as React.RefObject<HTMLDivElement>}
                  className="article-prose prose prose-invert prose-neutral max-w-none"
                >
                  {segments.map((segment, index) =>
                    segment.kind === "html" ? (
                      <div key={index} dangerouslySetInnerHTML={{ __html: segment.html }} />
                    ) : diagrams[segment.index] ? (
                      <PostDiagram key={index} spec={diagrams[segment.index]} />
                    ) : null
                  )}
                </div>
              </div>
              <aside className="hidden lg:block">
                <TableOfContents
                  headings={headings}
                  className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4"
                />
              </aside>
            </div>
          </article>
        </main>
      </div>
    </>
  );
};
