import styles from "components/hairline/LinkRows/LinkRows.module.css";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

export interface LinkRow {
  label: string;
  value: string;
  href: string;
}

interface LinkRowsProps {
  links: readonly LinkRow[];
  label?: string;
}

const isExternal = (href: string) => href.startsWith("http");

/**
 * Boxed rows of direct links: label on the left, the address in mono on the right.
 */
export const LinkRows = ({ links, label }: LinkRowsProps) => (
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
          >
            <span>{link.label}</span>
            <span className={styles.value}>{link.value}</span>
          </a>
        </li>
      );
    })}
  </ul>
);
