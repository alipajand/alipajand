import Link from "next/link";

import { LinkRows } from "components/hairline/LinkRows/LinkRows";
import styles from "features/portfolio/PortfolioContact.module.css";
import {
  CONTACT_AVAILABILITY,
  CONTACT_NOW_HREF,
  CONTACT_NOW_LEAD,
  CONTACT_NOW_LINK_LABEL,
} from "data/contact";
import { LINKS } from "data/links";
import { PORTFOLIO_CONTACT_EYEBROW, PORTFOLIO_CONTACT_HEADING } from "data/portfolioIndex";
import { PORTFOLIO_PROFILE_LINK_LABELS, PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";

const PROFILE_LINKS = PORTFOLIO_PROFILE_LINK_LABELS.flatMap((label) => {
  const link = LINKS.find((item) => item.label === label);
  return link ? [link] : [];
});

interface PortfolioContactProps {
  /** The homepage already owns `#contact`, so it renders this section under its own ids. */
  id?: string;
  headingId?: string;
}

export const PortfolioContact = ({
  id = "contact",
  headingId = "portfolio-contact-heading",
}: PortfolioContactProps) => (
  <section id={id} className={styles.contact} aria-labelledby={headingId}>
    <div className={styles.lead}>
      <span className={styles.eyebrow}>{PORTFOLIO_CONTACT_EYEBROW}</span>
      <h2 id={headingId} className={styles.title}>
        {PORTFOLIO_CONTACT_HEADING}
      </h2>
      <p className={styles.body}>
        {CONTACT_AVAILABILITY} {CONTACT_NOW_LEAD}{" "}
        <Link href={CONTACT_NOW_HREF}>{CONTACT_NOW_LINK_LABEL}</Link>.
      </p>
    </div>
    <div className={styles.links}>
      <LinkRows links={PROFILE_LINKS} label={PORTFOLIO_PROFILE_LINKS_ARIA_LABEL} />
    </div>
  </section>
);
