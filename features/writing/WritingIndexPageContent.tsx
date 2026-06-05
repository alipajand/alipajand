"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { WritingIndexPost } from "features/writing/WritingIndexPost";
import { WritingIndexPostListItem } from "features/writing/WritingIndexPostListItem";
import {
  WRITING_INDEX_BACK_HOME,
  WRITING_INDEX_EMPTY_MESSAGE,
  WRITING_SECTION_HEADING,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";
import { gsap, prefersReducedMotion, registerGSAPPlugins } from "utils/gsap";
import { DUR, EASE, STAGGER } from "utils/motion";

interface WritingIndexPageContentProps {
  posts: WritingIndexPost[];
}

export function WritingIndexPageContent({ posts }: WritingIndexPageContentProps) {
  const headerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    registerGSAPPlugins();

    const header = headerRef.current;
    const list = listRef.current;
    if (!header) return;

    const heading = header.querySelector<HTMLElement>("[data-writ-heading]");
    const lede = header.querySelector<HTMLElement>("[data-writ-lede]");
    const aside = header.querySelector<HTMLElement>("[data-writ-aside]");
    const items = list ? list.querySelectorAll<HTMLElement>("[data-writ-item]") : [];

    const els = [heading, lede, aside].filter(Boolean) as HTMLElement[];

    if (prefersReducedMotion()) {
      gsap.set([...els, ...items], { opacity: 1, y: 0 });
      return;
    }

    gsap.set(els, { opacity: 0, y: 24 });
    gsap.set([...items], { opacity: 0, y: 32 });

    const tl = gsap.timeline({ delay: 0.05, defaults: { ease: EASE.smooth } });
    tl.to(els, { opacity: 1, y: 0, duration: DUR.md, stagger: 0.08 });
    tl.to(
      [...items],
      { opacity: 1, y: 0, duration: DUR.md, stagger: STAGGER.normal },
      `-=${DUR.sm}`
    );
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main
        id="main-content"
        tabIndex={-1}
        className="outline-none px-6 sm:px-10 lg:px-20 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <header ref={headerRef} className="mb-12 sm:mb-16">
            <h1
              data-writ-heading
              className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-3"
            >
              {WRITING_SECTION_HEADING}
            </h1>
            <p data-writ-lede className="text-muted text-base sm:text-lg leading-relaxed">
              {WRITING_SECTION_LEDE}
            </p>
            <p
              data-writ-aside
              className="mt-4 text-[15px] sm:text-base text-foreground/85 leading-relaxed border-l-2 border-border pl-4 sm:pl-5"
            >
              {WRITING_WHY_IT_MATTERS}
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-muted">{WRITING_INDEX_EMPTY_MESSAGE}</p>
          ) : (
            <ul ref={listRef} className="space-y-6 sm:space-y-8 list-none p-0 m-0">
              {posts.map((post) => (
                <li key={post.slug} data-writ-item>
                  <WritingIndexPostListItem post={post} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-16">
            <Link
              href="/"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium inline-flex min-h-11 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {WRITING_INDEX_BACK_HOME}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
