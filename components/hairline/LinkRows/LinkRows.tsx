"use client";

import styles from "components/hairline/LinkRows/LinkRows.module.css";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

export interface LinkRow {
  label: string;
  value: string;
  href: string;
}

interface LinkRowsProps {
  links: readonly LinkRow[];
  /** Prefix for each link's `data-analytics-event`, followed by the snake-cased label. */
  analyticsPrefix: string;
  label?: string;
}

const isExternal = (href: string) => href.startsWith("http");
const slug = (label: string) => label.toLowerCase().replace(/\s+/g, "_");

/**
 * Boxed rows of direct links: label on the left, the address in mono on the right.
 */
export const LinkRows = ({ links, analyticsPrefix, label }: LinkRowsProps) => (
  <ul className={styles.links} aria-label={label}>
    {links.map((link) => {
      const external = isExternal(link.href);
      return (
        <li key={link.label}>
          <a
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={`${link.label}: ${link.value}${external ? EXTERNAL_LINK_NEW_TAB_HINT : ""}`}
            data-analytics-event={`${analyticsPrefix}_${slug(link.label)}`}
          >
            <span>{link.label}</span>
            <span className={styles.value}>{link.value}</span>
          </a>
        </li>
      );
    })}
  </ul>
);
