import Link from "next/link";

import { SITE_NAME } from "data/site";

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="text-muted text-xs font-semibold uppercase tracking-[0.14em] mb-3">404</p>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-muted text-[15px] sm:text-base max-w-md leading-relaxed mb-10">
        That URL doesn&apos;t exist or may have moved. Try the homepage or full portfolio.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {SITE_NAME} — home
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Portfolio
        </Link>
      </div>
    </main>
  );
}
