import Link from "next/link";
import { Fragment } from "react";

import styles from "features/writing/WritingPostCrumbs.module.css";
import { writingPostBreadcrumbs } from "data/breadcrumbs";

interface WritingPostCrumbsProps {
  title: string;
  wrap?: boolean;
}

export const WritingPostCrumbs = ({ title, wrap = false }: WritingPostCrumbsProps) => (
  <nav className={wrap ? `${styles.crumbs} ${styles.wrap}` : styles.crumbs} aria-label="Breadcrumb">
    <ol>
      {writingPostBreadcrumbs(title).map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? <li aria-hidden="true">/</li> : null}
          <li className={item.href ? undefined : styles.current}>
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
