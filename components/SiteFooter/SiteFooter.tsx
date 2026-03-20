import Link from "next/link";

import { FOCUS_RING } from "utils/visual";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/portfolio#projects", label: "Case studies" },
  { href: "/portfolio", label: "Full portfolio" },
  { href: "/#writing", label: "Writing" },
  { href: "/blog", label: "All posts" },
  { href: "/#contact", label: "Contact" },
] as const;

/** Calm internal links for crawl paths and orientation (home ↔ projects ↔ writing). */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20 py-10 sm:py-12">
        <nav aria-label="Site" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-11 items-center py-2 px-1 -mx-1 rounded-md hover:text-foreground transition-colors underline-offset-4 hover:underline ${FOCUS_RING}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
