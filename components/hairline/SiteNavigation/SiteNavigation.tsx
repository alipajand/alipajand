"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { Chev } from "components/hairline/Icons/Icons";
import { useSiteMenu } from "components/hairline/SiteNavigation/useSiteMenu";
import styles from "components/hairline/SiteNavigation/SiteNavigation.module.css";
import { LINKS } from "data/links";
import {
  NAV_ARIA_PRIMARY,
  NAV_BOOK_CALL_LABEL,
  NAV_MENU_CLOSE_LABEL,
  NAV_MENU_OPEN_LABEL,
  NAV_PRIMARY_LINKS,
  NAV_STATUS_LABEL,
} from "data/nav";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";
import { SITE_NAME } from "data/site";
import { useMotion } from "utils/motion/useMotion";
import { homeBrandAriaCurrent, navLinkAriaCurrent } from "utils/navAriaCurrent";

const BOOK_CALL = LINKS.find((link) => link.label === NAV_BOOK_CALL_LABEL);

/** The 2px line along the header's bottom edge that tracks how far the page has scrolled. */
const ScrollProgress = ({ pathname }: { pathname: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useMotion(
    ref,
    ({ element }) => ({
      onScroll: ({ y, max }) => {
        element.style.setProperty("--p", (max > 0 ? y / max : 0).toFixed(4));
      },
      destroy: () => element.style.removeProperty("--p"),
    }),
    { alwaysActive: true, resetKey: pathname }
  );

  return <span ref={ref} className={styles.progress} aria-hidden="true" />;
};

/**
 * The boxed site header: name, primary links, the open-to-roles status and a booking link. Below
 * 960px the links drop to a second row; below 520px they fold behind a disclosure button.
 */
export const SiteNavigation = () => {
  const pathname = usePathname() ?? "/";
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menu = useSiteMenu(pathname, menuButtonRef);

  // Following the menu's link to the page already open changes no route, so RouteChangeFocus does
  // not move focus. The focused link is hidden as the menu closes, which drops focus to the body;
  // move it to the main content instead, as a route change does.
  const followMenuLink = (href: string) => () => {
    menu.close();
    if (href === pathname) document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  const links = NAV_PRIMARY_LINKS.map((link) => ({
    ...link,
    current: navLinkAriaCurrent(link.href, pathname),
  }));

  return (
    <header className={styles.nav}>
      <Link className={styles.name} href="/" aria-current={homeBrandAriaCurrent(pathname)}>
        {SITE_NAME}
      </Link>

      <nav className={styles.links} aria-label={NAV_ARIA_PRIMARY}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} aria-current={link.current}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.cta}>
        <span>
          <span className={styles.dot} aria-hidden="true" />
          {NAV_STATUS_LABEL}
        </span>
        {BOOK_CALL ? (
          <a
            href={BOOK_CALL.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${NAV_BOOK_CALL_LABEL}${EXTERNAL_LINK_NEW_TAB_HINT}`}
          >
            {NAV_BOOK_CALL_LABEL}
          </a>
        ) : null}
      </div>

      <div className={styles.menu}>
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menu.isOpen}
          aria-controls="site-menu"
          onClick={menu.toggle}
        >
          {menu.isOpen ? NAV_MENU_CLOSE_LABEL : NAV_MENU_OPEN_LABEL}
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      <ul
        id="site-menu"
        className={styles.panel}
        aria-label={NAV_ARIA_PRIMARY}
        hidden={!menu.isOpen}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} aria-current={link.current} onClick={followMenuLink(link.href)}>
              {link.label}
              <Chev />
            </Link>
          </li>
        ))}
      </ul>

      <ScrollProgress pathname={pathname} />
    </header>
  );
};
