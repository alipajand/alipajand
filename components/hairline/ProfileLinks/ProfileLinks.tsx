import styles from "components/hairline/ProfileLinks/ProfileLinks.module.css";
import { HERO_PROFILE_LINK_LABELS, HERO_PROFILE_LINKS_ARIA_LABEL, LINKS } from "data/links";
import { EXTERNAL_LINK_NEW_TAB_HINT } from "data/pageChrome";

const PROFILE_LINKS = HERO_PROFILE_LINK_LABELS.flatMap((label) => {
  const link = LINKS.find((item) => item.label === label);
  return link ? [link] : [];
});

interface ProfileLinksProps {
  className?: string;
}

export const ProfileLinks = ({ className }: ProfileLinksProps) => (
  <ul
    className={className ? `${styles.links} ${className}` : styles.links}
    aria-label={HERO_PROFILE_LINKS_ARIA_LABEL}
  >
    {PROFILE_LINKS.map((link) => {
      const external = link.href.startsWith("http");
      return (
        <li key={link.label}>
          <a
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={`${link.label}: ${link.value}${external ? EXTERNAL_LINK_NEW_TAB_HINT : ""}`}
          >
            {link.label}
            {external ? <span aria-hidden="true">↗</span> : null}
          </a>
        </li>
      );
    })}
  </ul>
);
