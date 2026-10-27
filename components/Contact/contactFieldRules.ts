import type { RegisterOptions } from "react-hook-form";

import type { ContactFormValues } from "components/Contact/hooks/useContactForm";
import {
  CONTACT_VALIDATION_EMAIL_PATTERN,
  CONTACT_VALIDATION_EMAIL_REQUIRED,
  CONTACT_VALIDATION_MESSAGE_REQUIRED,
  CONTACT_VALIDATION_MESSAGE_TOO_LONG,
  CONTACT_VALIDATION_MESSAGE_WITH_COMPANY_TOO_LONG,
  CONTACT_VALIDATION_NAME_REQUIRED,
  CONTACT_VALIDATION_NAME_TOO_LONG,
} from "data/contactForm";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  contactMessageLength,
  isValidEmail,
  normalizeContactName,
} from "utils/contactFields";

type Rules<K extends keyof ContactFormValues> = RegisterOptions<ContactFormValues, K>;

/**
 * Field rules that mirror `POST /api/contact` on the values the form will actually send
 * (trimmed, name normalised, company folded into the message), so anything that passes here
 * passes there. No native `maxlength`: it would truncate a paste silently and cannot see the
 * company's share of the message budget.
 */
export const contactFieldRules: {
  name: Rules<"name">;
  email: Rules<"email">;
  message: Rules<"message">;
} = {
  name: {
    validate: (value) => {
      const name = normalizeContactName(value);
      if (!name) return CONTACT_VALIDATION_NAME_REQUIRED;
      if (name.length > CONTACT_NAME_MAX_LENGTH) return CONTACT_VALIDATION_NAME_TOO_LONG;
      return true;
    },
  },
  email: {
    validate: (value) => {
      const email = value.trim();
      if (!email) return CONTACT_VALIDATION_EMAIL_REQUIRED;
      if (!isValidEmail(email)) return CONTACT_VALIDATION_EMAIL_PATTERN;
      return true;
    },
  },
  message: {
    validate: (value, values) => {
      if (!value.trim()) return CONTACT_VALIDATION_MESSAGE_REQUIRED;
      if (contactMessageLength(value, values.company) > CONTACT_MESSAGE_MAX_LENGTH) {
        return values.company.trim()
          ? CONTACT_VALIDATION_MESSAGE_WITH_COMPANY_TOO_LONG
          : CONTACT_VALIDATION_MESSAGE_TOO_LONG;
      }
      return true;
    },
  },
};
