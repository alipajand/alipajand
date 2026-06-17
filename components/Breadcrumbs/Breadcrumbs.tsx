import Link from "next/link";
import { Fragment, forwardRef } from "react";

import type { BreadcrumbNavItem } from "data/breadcrumbs";
import { FOCUS_RING } from "utils/visual";

type BreadcrumbsProps = {
  items: BreadcrumbNavItem[];
  className?: string;
};

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, className = "mb-8" }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          {items.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden="true" className="text-muted/70">
                  /
                </li>
              ) : null}
              <li>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`hover:text-foreground ${FOCUS_RING} rounded-sm`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";
