"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { McpWorkflowDiagram } from "components/diagrams/McpWorkflowDiagram";
import { ReadingProgress } from "components/ReadingProgress/ReadingProgress";
import {
  WRITING_POST_BACK_HOME,
  WRITING_POST_BACK_TO_ALL,
  WRITING_POST_MCP_FIGCAPTION,
} from "data/writing";
import { gsap, prefersReducedMotion, registerGSAPPlugins } from "utils/gsap";
import { DUR, EASE } from "utils/motion";
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

export function WritingPostPageContent({
  title,
  date,
  showMcpDiagram,
  contentHtml,
  proseBeforeH2,
  proseFromH2,
}: WritingPostPageContentProps) {
  const dateRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    const els = [dateRef.current, titleRef.current, bodyRef.current].filter(Boolean);
    if (!els.length) return;

    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(els, { opacity: 0, y: 28 });

    const tl = gsap.timeline({ delay: 0.05, defaults: { ease: EASE.smooth } });
    tl.to(els, { opacity: 1, y: 0, duration: DUR.md, stagger: 0.1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-background text-foreground">
        <main id="main-content" tabIndex={-1} className={`outline-none ${PAGE_ARTICLE_SHELL}`}>
          <article className={SECTION_INNER}>
            <p ref={dateRef} className="text-muted text-sm font-medium tabular-nums">
              <time dateTime={date}>{formatDate(date)}</time>
            </p>
            <h1
              ref={titleRef}
              className="font-display font-bold text-3xl sm:text-4xl text-foreground mt-2 mb-6"
            >
              {title}
            </h1>
            <div
              ref={bodyRef}
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
    </>
  );
}
