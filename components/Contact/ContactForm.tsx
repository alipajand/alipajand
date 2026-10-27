"use client";

import { type ContactFormHook, useContactForm } from "components/Contact/hooks/useContactForm";
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

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-heading"
      aria-busy={isSubmitting}
      noValidate
      data-analytics-form="contact"
    >
      {validationErrors.length > 0 ? (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" aria-live="assertive">
          <p>{CONTACT_FORM_ERROR_SUMMARY_HEADING}</p>
          <ul>
            {validationErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-name">
          {CONTACT_FIELD_NAME_LABEL} <span>{CONTACT_FORM_REQUIRED_MARKER}</span>
        </label>
        <p id="contact-name-hint">{CONTACT_FIELD_NAME_HINT}</p>
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
        {errors.name && (
          <p id="contact-name-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email">
          {CONTACT_FIELD_EMAIL_LABEL} <span>{CONTACT_FORM_REQUIRED_MARKER}</span>
        </label>
        <p id="contact-email-hint">{CONTACT_FIELD_EMAIL_HINT}</p>
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
        {errors.email && (
          <p id="contact-email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-company">
          {CONTACT_FIELD_COMPANY_LABEL} <span>{CONTACT_FORM_OPTIONAL_MARKER}</span>
        </label>
        <p id="contact-company-hint">{CONTACT_FIELD_COMPANY_HINT}</p>
        <input
          id="contact-company"
          type="text"
          placeholder={CONTACT_FIELD_COMPANY_PLACEHOLDER}
          autoComplete="organization"
          disabled={isSubmitting}
          {...register("company")}
          aria-describedby="contact-company-hint"
        />
      </div>
      <div>
        <label htmlFor="contact-message">
          {CONTACT_FIELD_MESSAGE_LABEL} <span>{CONTACT_FORM_REQUIRED_MARKER}</span>
        </label>
        <p id="contact-message-hint">{CONTACT_FIELD_MESSAGE_HINT}</p>
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
        {errors.message && (
          <p id="contact-message-error" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>
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
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        data-analytics-event="contact_form_submit_click"
      >
        {isSubmitting ? CONTACT_FORM_SUBMIT_LOADING : CONTACT_FORM_SUBMIT_IDLE}
      </button>
    </form>
  );
};
