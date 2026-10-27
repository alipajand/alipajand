"use client";

import type { MouseEvent } from "react";

import styles from "components/Contact/ContactForm.module.css";
import { type ContactFormHook, useContactForm } from "components/Contact/hooks/useContactForm";
import { Chev } from "components/hairline/Icons/Icons";
import {
  CONTACT_FIELD_COMPANY_HINT,
  CONTACT_FIELD_COMPANY_LABEL,
  CONTACT_FIELD_COMPANY_PLACEHOLDER,
  CONTACT_FIELD_EMAIL_HINT,
  CONTACT_FIELD_EMAIL_LABEL,
  CONTACT_FIELD_EMAIL_PLACEHOLDER,
  CONTACT_FIELD_MESSAGE_HINT,
  CONTACT_FIELD_MESSAGE_LABEL,
  CONTACT_FIELD_MESSAGE_PLACEHOLDER,
  CONTACT_FIELD_NAME_HINT,
  CONTACT_FIELD_NAME_LABEL,
  CONTACT_FIELD_NAME_PLACEHOLDER,
  CONTACT_FORM_ERROR_SUMMARY_HEADING,
  CONTACT_FORM_OPTIONAL_MARKER,
  CONTACT_FORM_REQUIRED_MARKER,
  CONTACT_FORM_SUBMIT_IDLE,
  CONTACT_FORM_SUBMIT_LOADING,
  CONTACT_FORM_SUCCESS_MESSAGE,
  CONTACT_VALIDATION_EMAIL_PATTERN,
  CONTACT_VALIDATION_EMAIL_REQUIRED,
  CONTACT_VALIDATION_MESSAGE_REQUIRED,
  CONTACT_VALIDATION_NAME_REQUIRED,
} from "data/contactForm";
import { CONTACT_FORM_SECTION_HEADING } from "data/contact";
import { CONTACT_FORM_LEDE } from "data/site";

const focusField = (event: MouseEvent<HTMLAnchorElement>) => {
  const field = document.getElementById(event.currentTarget.hash.slice(1));
  if (!field) return;
  event.preventDefault();
  field.focus();
};

/**
 * The contact form. Validation, submission and analytics live in `useContactForm`; this component
 * only renders the fields, the linked error summary and the status line.
 */
export const ContactForm = () => {
  const {
    selectors: {
      status,
      errorMessage,
      isSubmitting,
      formState: { errors },
      validationErrors,
      errorSummaryRef,
    },
    actions: { handleSubmit, register },
  }: ContactFormHook = useContactForm();

  const summaryItems = [
    { id: "contact-name", message: errors.name?.message },
    { id: "contact-email", message: errors.email?.message },
    { id: "contact-message", message: errors.message?.message },
  ].filter((item): item is { id: string; message: string } => Boolean(item.message));

  return (
    <form
      id="contact-form"
      className={styles.form}
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-heading"
      aria-busy={isSubmitting}
      noValidate
      data-analytics-form="contact"
    >
      <div className={styles.head}>
        <h3 id="contact-form-heading">{CONTACT_FORM_SECTION_HEADING}</h3>
        <p className={styles.lede}>{CONTACT_FORM_LEDE}</p>
      </div>

      {validationErrors.length > 0 ? (
        <div
          ref={errorSummaryRef}
          className={styles.summary}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
        >
          <p>{CONTACT_FORM_ERROR_SUMMARY_HEADING}</p>
          <ul>
            {summaryItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={focusField}>
                  {item.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.grid}>
        <div className={styles.field} data-invalid={errors.name ? "" : undefined}>
          <label htmlFor="contact-name">
            {CONTACT_FIELD_NAME_LABEL}{" "}
            <span className={styles.marker}>{CONTACT_FORM_REQUIRED_MARKER}</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder={CONTACT_FIELD_NAME_PLACEHOLDER}
            autoComplete="name"
            disabled={isSubmitting}
            {...register("name", { required: CONTACT_VALIDATION_NAME_REQUIRED })}
            aria-invalid={errors.name ? "true" : "false"}
            aria-required
            aria-describedby={
              errors.name ? "contact-name-hint contact-name-error" : "contact-name-hint"
            }
          />
          <p id="contact-name-hint" className={styles.hint}>
            {CONTACT_FIELD_NAME_HINT}
          </p>
          {errors.name && (
            <p id="contact-name-error" className={styles.error} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className={styles.field} data-invalid={errors.email ? "" : undefined}>
          <label htmlFor="contact-email">
            {CONTACT_FIELD_EMAIL_LABEL}{" "}
            <span className={styles.marker}>{CONTACT_FORM_REQUIRED_MARKER}</span>
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            placeholder={CONTACT_FIELD_EMAIL_PLACEHOLDER}
            autoComplete="email"
            disabled={isSubmitting}
            {...register("email", {
              required: CONTACT_VALIDATION_EMAIL_REQUIRED,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: CONTACT_VALIDATION_EMAIL_PATTERN,
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            aria-required
            aria-describedby={
              errors.email ? "contact-email-hint contact-email-error" : "contact-email-hint"
            }
          />
          <p id="contact-email-hint" className={styles.hint}>
            {CONTACT_FIELD_EMAIL_HINT}
          </p>
          {errors.email && (
            <p id="contact-email-error" className={styles.error} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className={`${styles.field} ${styles.wide}`}>
          <label htmlFor="contact-company">
            {CONTACT_FIELD_COMPANY_LABEL}{" "}
            <span className={styles.marker}>{CONTACT_FORM_OPTIONAL_MARKER}</span>
          </label>
          <input
            id="contact-company"
            type="text"
            placeholder={CONTACT_FIELD_COMPANY_PLACEHOLDER}
            autoComplete="organization"
            disabled={isSubmitting}
            {...register("company")}
            aria-describedby="contact-company-hint"
          />
          <p id="contact-company-hint" className={styles.hint}>
            {CONTACT_FIELD_COMPANY_HINT}
          </p>
        </div>
        <div
          className={`${styles.field} ${styles.wide}`}
          data-invalid={errors.message ? "" : undefined}
        >
          <label htmlFor="contact-message">
            {CONTACT_FIELD_MESSAGE_LABEL}{" "}
            <span className={styles.marker}>{CONTACT_FORM_REQUIRED_MARKER}</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder={CONTACT_FIELD_MESSAGE_PLACEHOLDER}
            disabled={isSubmitting}
            {...register("message", { required: CONTACT_VALIDATION_MESSAGE_REQUIRED })}
            aria-invalid={errors.message ? "true" : "false"}
            aria-required
            aria-describedby={
              errors.message ? "contact-message-hint contact-message-error" : "contact-message-hint"
            }
          />
          <p id="contact-message-hint" className={styles.hint}>
            {CONTACT_FIELD_MESSAGE_HINT}
          </p>
          {errors.message && (
            <p id="contact-message-error" className={styles.error} role="alert">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.status}>
          {status === "success" && (
            <p role="status" aria-live="polite">
              {CONTACT_FORM_SUCCESS_MESSAGE}
            </p>
          )}
          {status === "error" && errorMessage && (
            <p role="alert" aria-live="assertive">
              {errorMessage}
            </p>
          )}
        </div>
        <button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          data-analytics-event="contact_form_submit_click"
        >
          {isSubmitting ? CONTACT_FORM_SUBMIT_LOADING : CONTACT_FORM_SUBMIT_IDLE}
          <Chev />
        </button>
      </div>
    </form>
  );
};
