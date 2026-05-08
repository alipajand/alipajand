"use client";

import Link from "next/link";

import { McpWorkflowDiagram } from "components/diagrams/McpWorkflowDiagram";
import {
  WRITING_POST_BACK_HOME,
  WRITING_POST_BACK_TO_ALL,
  WRITING_POST_MCP_FIGCAPTION,
} from "data/writing";
import { formatDate } from "utils/date";

interface WritingPostPageContentProps {
  title: string;
  date: string;
  showMcpDiagram: boolean;
  contentHtml: string;
  proseBeforeH2: string;
  proseFromH2: string;
}

export function WritingPostPageContent({
  title,
  date,
  showMcpDiagram,
  contentHtml,
  proseBeforeH2,
  proseFromH2,
}: WritingPostPageContentProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main-content" tabIndex={-1} className="outline-none px-6 sm:px-10 lg:px-20 py-24">
        <article className="max-w-5xl mx-auto">
          <p className="text-muted text-sm font-medium tabular-nums">
            <time dateTime={date}>{formatDate(date)}</time>
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-2 mb-6">
            {title}
          </h1>
          <div className="prose prose-invert prose-neutral max-w-none text-muted text-[15px] sm:text-base leading-relaxed [&_a]:text-foreground [&_a]:underline [&_a:hover]:text-muted [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-foreground [&_a:focus-visible]:ring-offset-2 [&_a:focus-visible]:ring-offset-background [&_a:focus-visible]:rounded-sm [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_hr]:border-border [&_strong]:text-foreground">
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
          <p className="mt-16 pt-8 border-t border-border gap-5 flex flex-wrap items-center">
            <Link
              href="/writing"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex min-h-11 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {WRITING_POST_BACK_TO_ALL}
            </Link>
            <span className="text-muted select-none" aria-hidden>
              ·
            </span>
            <Link
              href="/"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex min-h-11 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {WRITING_POST_BACK_HOME}
            </Link>
          </p>
        </article>
      </main>
    </div>
  );
}
