"use client";

import Link from "next/link";

import { NotFoundMainFocus } from "components/NotFoundMainFocus/NotFoundMainFocus";
import {
  NOT_FOUND_CODE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_KEYBOARD_TIP,
  NOT_FOUND_LINK_HOME,
  NOT_FOUND_LINK_PORTFOLIO,
  NOT_FOUND_TITLE,
} from "data/notFound";

export function NotFoundPageContent() {
  return (
    <>
      <NotFoundMainFocus />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center outline-none"
      >
        <p className="text-muted text-3xl font-semibold uppercase tracking-[0.14em] mb-3">
          {NOT_FOUND_CODE}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          {NOT_FOUND_TITLE}
        </h1>
        <p className="text-muted text-[15px] sm:text-base max-w-md leading-relaxed mb-4">
          {NOT_FOUND_DESCRIPTION}
        </p>
        <p className="text-muted text-sm max-w-md leading-relaxed mb-10">
          {NOT_FOUND_KEYBOARD_TIP}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {NOT_FOUND_LINK_HOME}
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {NOT_FOUND_LINK_PORTFOLIO}
          </Link>
        </div>
      </main>
    </>
  );
}
