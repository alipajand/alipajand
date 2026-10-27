import Link from "next/link";
import { Fragment } from "react";

import styles from "features/now/NowBreadcrumbs.module.css";
import type { BreadcrumbNavItem } from "data/breadcrumbs";

interface NowBreadcrumbsProps {
  items: readonly BreadcrumbNavItem[];
}

/** The mono breadcrumb row under the navigation: earlier pages link, the current page is marked. */
export const NowBreadcrumbs = ({ items }: NowBreadcrumbsProps) => (
  <nav className={styles.crumbs} aria-label="Breadcrumb">
    <ol>
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? (
            <li className={styles.crumbSep} aria-hidden="true">
              /
            </li>
          ) : null}
          <li>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        </Fragment>
      ))}
    </ol>
  </nav>
);
