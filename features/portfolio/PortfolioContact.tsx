import { LinkRows } from "components/hairline/LinkRows/LinkRows";
import styles from "features/portfolio/PortfolioContact.module.css";
import { CONTACT_AVAILABILITY } from "data/contact";
import { LINKS } from "data/links";
import { PORTFOLIO_CONTACT_EYEBROW, PORTFOLIO_CONTACT_HEADING } from "data/portfolioIndex";
import { PORTFOLIO_PROFILE_LINK_LABELS, PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";

const PROFILE_LINKS = PORTFOLIO_PROFILE_LINK_LABELS.flatMap((label) => {
  const link = LINKS.find((item) => item.label === label);
  return link ? [link] : [];
});

export const PortfolioContact = () => (
  <section id="contact" className={styles.contact} aria-labelledby="portfolio-contact-heading">
    <div className={styles.lead}>
      <span className={styles.eyebrow}>{PORTFOLIO_CONTACT_EYEBROW}</span>
      <h2 id="portfolio-contact-heading" className={styles.title}>
        {PORTFOLIO_CONTACT_HEADING}
      </h2>
      <p className={styles.body}>{CONTACT_AVAILABILITY}</p>
    </div>
    <div className={styles.links}>
      <LinkRows
        links={PROFILE_LINKS}
        analyticsPrefix="portfolio_profile_link"
        label={PORTFOLIO_PROFILE_LINKS_ARIA_LABEL}
      />
    </div>
  </section>
);
