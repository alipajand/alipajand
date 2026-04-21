"use client";

import classNames from "classnames";
import { usePathname } from "next/navigation";

import { useNav } from "components/Nav/hooks/useNav";
import { SITE_NAME } from "data/site";
import { homeBrandAriaCurrent, navLinkAriaCurrent } from "utils/navAriaCurrent";
import { FOCUS_RING } from "utils/visual";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/blog", label: "Writing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const {
    selectors: { isScrolled, isMobileOpen, navLinksRef, mobileMenuRef, menuButtonRef },
    actions: { handleToggleMenu, handleCloseMenu },
  } = useNav();

  return (
    <header
      className={classNames(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
        isScrolled && "border-border! bg-background"
      )}
    >
      <nav aria-label="Primary" className="relative">
        <div className="px-6 sm:px-10 lg:px-20">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4 h-16">
            <Link
              href="/"
              aria-current={homeBrandAriaCurrent(pathname)}
              className={`font-display font-semibold text-foreground text-sm sm:text-base tracking-tight shrink-0 z-10 rounded-sm hover:text-muted transition-colors ${FOCUS_RING}`}
            >
              {SITE_NAME}
            </Link>
            <ul
              ref={navLinksRef}
              className="hidden sm:flex flex-1 items-center justify-end gap-6 min-w-0"
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={navLinkAriaCurrent(link.href, pathname)}
                    className={`nav-link-hover text-sm text-muted hover:text-foreground transition-colors duration-200 relative rounded-sm ${FOCUS_RING}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              className={`sm:hidden inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 p-2 text-foreground transition-transform duration-200 rounded-sm ${FOCUS_RING}`}
              onClick={handleToggleMenu}
            >
              <span
                aria-hidden
                className={classNames(
                  "w-5 h-0.5 bg-current transition-all duration-200",
                  isMobileOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                aria-hidden
                className={classNames(
                  "w-5 h-0.5 bg-current transition-all duration-200",
                  isMobileOpen && "opacity-0"
                )}
              />
              <span
                aria-hidden
                className={classNames(
                  "w-5 h-0.5 bg-current transition-all duration-200",
                  isMobileOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </button>
          </div>
        </div>
        <div
          id="mobile-nav"
          ref={mobileMenuRef}
          inert={!isMobileOpen}
          aria-hidden={!isMobileOpen}
          className="sm:hidden absolute top-16 left-0 right-0 overflow-hidden bg-background border-b border-border"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="py-6 px-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={navLinkAriaCurrent(link.href, pathname)}
                className={`font-medium text-foreground hover:text-muted transition-colors py-3 min-h-11 inline-flex items-center rounded-sm ${FOCUS_RING}`}
                onClick={handleCloseMenu}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
