import Link from "next/link";
import { forwardRef, Fragment } from "react";

import type { BreadcrumbNavItem } from "data/breadcrumbs";

type BreadcrumbsProps = {
  items: BreadcrumbNavItem[];
};

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(({ items }, ref) => {
  return (
    <nav ref={ref} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? <li aria-hidden="true">/</li> : null}
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
});

Breadcrumbs.displayName = "Breadcrumbs";
