import { LINKS } from "data/links";
import {
  CONTACT_AVAILABILITY,
  CONTACT_DIRECT_LABEL,
  CONTACT_FORM_SECTION_HEADING,
  CONTACT_SECTION_BODY,
  CONTACT_SECTION_HEADING,
} from "data/contact";
import { CONTACT_FORM_LEDE } from "data/site";
import { ContactChannelCard } from "components/Contact/ContactChannelCard";
import { ContactForm } from "components/Contact/ContactForm";

export const Contact = () => {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div>
        <h2 id="contact-heading">{CONTACT_SECTION_HEADING}</h2>
        <p>{CONTACT_SECTION_BODY}</p>
        <p>{CONTACT_AVAILABILITY}</p>

        <div>
          <p>{CONTACT_DIRECT_LABEL}</p>
          <ul>
            {LINKS.map((c) => (
              <ContactChannelCard key={c.label} channel={c} />
            ))}
          </ul>
        </div>

        <div>
          <h3 id="contact-form-heading">{CONTACT_FORM_SECTION_HEADING}</h3>
          <p>{CONTACT_FORM_LEDE}</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
