"use client";

import { NavDesktopPrimaryLink } from "components/Nav/NavDesktopPrimaryLink";
import { NavMobilePrimaryLink } from "components/Nav/NavMobilePrimaryLink";
import { useNav } from "components/Nav/hooks/useNav";
import {
  NAV_ARIA_PRIMARY,
  NAV_MENU_CLOSE_LABEL,
  NAV_MENU_OPEN_LABEL,
  NAV_PRIMARY_LINKS,
} from "data/nav";
import { SITE_NAME } from "data/site";
import { homeBrandAriaCurrent } from "utils/navAriaCurrent";

import Link from "next/link";

export const Nav = () => {
  const {
    selectors: { isMobileOpen, pathname, mobileMenuRef, menuButtonRef },
    actions: { handleToggleMenu, handleCloseMenu },
  } = useNav();

  return (
    <header>
      <nav aria-label={NAV_ARIA_PRIMARY}>
        <div>
          <div>
            <Link href="/" aria-current={homeBrandAriaCurrent(pathname)}>
              {SITE_NAME}
            </Link>
            <ul>
              {NAV_PRIMARY_LINKS.map((link) => (
                <NavDesktopPrimaryLink
                  key={link.href}
                  pathname={pathname}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </ul>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={isMobileOpen ? NAV_MENU_CLOSE_LABEL : NAV_MENU_OPEN_LABEL}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              onClick={handleToggleMenu}
            >
              {isMobileOpen ? NAV_MENU_CLOSE_LABEL : NAV_MENU_OPEN_LABEL}
            </button>
          </div>
        </div>
        <div id="mobile-nav" ref={mobileMenuRef} hidden={!isMobileOpen}>
          <div>
            {NAV_PRIMARY_LINKS.map((link) => (
              <NavMobilePrimaryLink
                key={link.href}
                pathname={pathname}
                href={link.href}
                label={link.label}
                onNavigate={handleCloseMenu}
              />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
