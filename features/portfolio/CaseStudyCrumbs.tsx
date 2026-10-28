import Link from "next/link";

import styles from "features/portfolio/CaseStudyCrumbs.module.css";
import { portfolioCaseStudyBreadcrumbs } from "data/breadcrumbs";
import { PROJECT_BREADCRUMB_ARIA_LABEL } from "data/projectsUi";

export const CaseStudyCrumbs = ({ name }: { name: string }) => {
  const items = portfolioCaseStudyBreadcrumbs(name);
  return (
    <nav className={styles.crumbs} aria-label={PROJECT_BREADCRUMB_ARIA_LABEL}>
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};
