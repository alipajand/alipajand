"use client";

import type React from "react";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { McpWorkflowDiagram } from "components/diagrams/McpWorkflowDiagram";
import { ReadingProgress } from "components/ReadingProgress/ReadingProgress";
import { writingPostBreadcrumbs } from "data/breadcrumbs";
import { WRITING_POST_MCP_FIGCAPTION } from "data/writing";
import { useAutoReveal } from "utils/hooks/useAutoReveal";
import { usePageHeader } from "utils/hooks/usePageHeader";
import { formatDate } from "utils/date";
import { PAGE_ARTICLE_SHELL, SECTION_INNER } from "utils/visual";

interface WritingPostPageContentProps {
  title: string;
  date: string;
  showMcpDiagram: boolean;
  contentHtml: string;
  proseBeforeH2: string;
  proseFromH2: string;
}

export const WritingPostPageContent = ({
  title,
  date,
  showMcpDiagram,
  contentHtml,
  proseBeforeH2,
  proseFromH2,
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

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-background text-foreground">
        <main id="main-content" tabIndex={-1} className={`outline-none ${PAGE_ARTICLE_SHELL}`}>
          <article className={SECTION_INNER}>
            <header ref={headerRef as React.RefObject<HTMLElement>} className="mb-6">
              <Breadcrumbs items={writingPostBreadcrumbs(title)} className="mb-8" />
              <p data-header-meta className="text-muted text-sm font-medium tabular-nums">
                <time dateTime={date}>{formatDate(date)}</time>
              </p>
              <h1
                data-header-title
                className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-2"
              >
                {title}
              </h1>
            </header>
            <div
              ref={bodyRef as React.RefObject<HTMLDivElement>}
              className="prose prose-invert prose-neutral max-w-none text-muted text-[15px] sm:text-base leading-relaxed [&_a]:break-words [&_a]:text-foreground [&_a]:underline [&_a:hover]:text-muted [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-foreground [&_a:focus-visible]:ring-offset-2 [&_a:focus-visible]:ring-offset-background [&_a:focus-visible]:rounded-sm [&_code]:break-words [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_hr]:border-border [&_strong]:text-foreground"
            >
              {showMcpDiagram ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: proseBeforeH2 }} />
                  <figure className="not-prose my-6 space-y-2">
                    <McpWorkflowDiagram />
                    <figcaption className="text-muted text-sm leading-snug px-0">
                      {WRITING_POST_MCP_FIGCAPTION}
                    </figcaption>
                  </figure>
                  <div dangerouslySetInnerHTML={{ __html: proseFromH2 }} />
                </>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              )}
            </div>
          </article>
        </main>
      </div>
    </>
  );
};
