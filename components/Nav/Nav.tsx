"use client";

import classNames from "classnames";
import { useNav } from "components/Nav/hooks/useNav";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#innovation", label: "Innovation" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "/blog", label: "Writing" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const RESUME_HREF = "/resume.pdf";

export function Nav() {
  const {
    selectors: { isScrolled, isMobileOpen, navLinksRef, mobileMenuRef },
    actions: { handleToggleMenu, handleCloseMenu },
  } = useNav();

  return (
    <header
      className={classNames(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled && "border-b border-border bg-background/80 backdrop-blur-sm"
      )}
    >
      <nav className="flex items-center justify-end sm:justify-center px-6 sm:px-10 lg:px-20 h-16 max-w-7xl mx-auto">
        <ul ref={navLinksRef} className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link-hover text-sm text-muted hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-hover text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              Resume
            </a>
          </li>
        </ul>
        <button
          type="button"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-nav"
          className="sm:hidden flex flex-col gap-1.5 p-2 text-foreground transition-transform duration-200"
          onClick={handleToggleMenu}
        >
          <span
            className={classNames(
              "w-5 h-0.5 bg-current transition-all duration-200",
              isMobileOpen && "rotate-45 translate-y-2"
            )}
          />
          <span
            className={classNames(
              "w-5 h-0.5 bg-current transition-all duration-200",
              isMobileOpen && "opacity-0"
            )}
          />
          <span
            className={classNames(
              "w-5 h-0.5 bg-current transition-all duration-200",
              isMobileOpen && "-rotate-45 -translate-y-2"
            )}
          />
        </button>
      </nav>
      <div
        id="mobile-nav"
        ref={mobileMenuRef}
        aria-hidden={!isMobileOpen}
        className="sm:hidden absolute top-16 left-0 right-0 overflow-hidden bg-background border-b border-border"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="py-6 px-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-medium text-foreground hover:text-muted transition-colors py-2"
              onClick={handleCloseMenu}
            >
              {link.label}
            </a>
          ))}
          <a
            href={RESUME_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-muted transition-colors py-2"
            onClick={handleCloseMenu}
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}
