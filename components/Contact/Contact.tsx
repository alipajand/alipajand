import Link from "next/link";

import styles from "components/Contact/Contact.module.css";
import { ContactForm } from "components/Contact/ContactForm";
import { LinkRows } from "components/hairline/LinkRows/LinkRows";
import {
  CONTACT_AVAILABILITY,
  CONTACT_DIRECT_LABEL,
  CONTACT_NOW_HREF,
  CONTACT_NOW_LEAD,
  CONTACT_NOW_LINK_LABEL,
  CONTACT_SECTION_BODY,
  CONTACT_SECTION_HEADING,
} from "data/contact";
import { HOMEPAGE_CONTACT_EYEBROW } from "data/homepage";
import { LINKS } from "data/links";

/** Homepage contact: the pitch and form on the left, direct channels on the right. */
export const Contact = () => (
  <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
    <div className={styles.lead}>
      <span className={styles.eyebrow}>{HOMEPAGE_CONTACT_EYEBROW}</span>
      <h2 id="contact-heading" className={styles.title}>
        {CONTACT_SECTION_HEADING}
      </h2>
      <p className={styles.body}>{CONTACT_SECTION_BODY}</p>
      <p className={styles.availability}>
        {CONTACT_AVAILABILITY} {CONTACT_NOW_LEAD}{" "}
        <Link href={CONTACT_NOW_HREF}>{CONTACT_NOW_LINK_LABEL}</Link>.
      </p>
      <ContactForm />
    </div>
    <div className={styles.links}>
      <span className={styles.eyebrow}>{CONTACT_DIRECT_LABEL}</span>
      <LinkRows links={LINKS} label={CONTACT_DIRECT_LABEL} />
    </div>
  </section>
);
