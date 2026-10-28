import styles from "components/Contact/Contact.module.css";
import { ContactForm } from "components/Contact/ContactForm";
import { CONTACT_SECTION_BODY, CONTACT_SECTION_HEADING } from "data/contact";
import { HOMEPAGE_CONTACT_EYEBROW } from "data/homepage";

/**
 * Homepage contact: the pitch on the left, the form on the right. Availability and direct links
 * follow in the "Let's talk" section rendered after it.
 */
export const Contact = () => (
  <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
    <div className={styles.lead}>
      <span className={styles.eyebrow}>{HOMEPAGE_CONTACT_EYEBROW}</span>
      <h2 id="contact-heading" className={styles.title}>
        {CONTACT_SECTION_HEADING}
      </h2>
      <p className={styles.body}>{CONTACT_SECTION_BODY}</p>
    </div>
    <div className={styles.formColumn}>
      <ContactForm />
    </div>
  </section>
);
