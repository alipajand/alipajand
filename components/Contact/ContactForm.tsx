"use client";

import classNames from "classnames";
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
import { FOCUS_RING } from "utils/visual";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:border-transparent disabled:opacity-60 disabled:cursor-not-allowed";
const labelClass = "block text-sm font-medium text-foreground";
const hintClass = "mt-1 text-xs text-muted leading-snug";

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
      className="space-y-5 max-w-xl"
      aria-labelledby="contact-form-heading"
      aria-busy={isSubmitting}
      noValidate
      data-analytics-form="contact"
    >
      {validationErrors.length > 0 ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <p className="font-semibold">{CONTACT_FORM_ERROR_SUMMARY_HEADING}</p>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            {validationErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          {CONTACT_FIELD_NAME_LABEL}{" "}
          <span className="text-muted font-normal">{CONTACT_FORM_REQUIRED_MARKER}</span>
        </label>
        <p id="contact-name-hint" className={hintClass}>
          {CONTACT_FIELD_NAME_HINT}
        </p>
        <input
          id="contact-name"
          type="text"
          placeholder={CONTACT_FIELD_NAME_PLACEHOLDER}
          autoComplete="name"
          disabled={isSubmitting}
          className={classNames(inputClass, "mt-2")}
          {...register("name", { required: CONTACT_VALIDATION_NAME_REQUIRED })}
          aria-invalid={errors.name ? "true" : "false"}
          aria-required
          aria-describedby={
            errors.name ? "contact-name-hint contact-name-error" : "contact-name-hint"
          }
        />
        {errors.name && (
          <p
            id="contact-name-error"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          {CONTACT_FIELD_EMAIL_LABEL}{" "}
          <span className="text-muted font-normal">{CONTACT_FORM_REQUIRED_MARKER}</span>
        </label>
        <p id="contact-email-hint" className={hintClass}>
          {CONTACT_FIELD_EMAIL_HINT}
        </p>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          placeholder={CONTACT_FIELD_EMAIL_PLACEHOLDER}
          autoComplete="email"
          disabled={isSubmitting}
          className={classNames(inputClass, "mt-2")}
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
          <p
            id="contact-email-error"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-company" className={labelClass}>
          {CONTACT_FIELD_COMPANY_LABEL}{" "}
          <span className="text-muted font-normal">{CONTACT_FORM_OPTIONAL_MARKER}</span>
        </label>
        <p id="contact-company-hint" className={hintClass}>
          {CONTACT_FIELD_COMPANY_HINT}
        </p>
        <input
          id="contact-company"
          type="text"
          placeholder={CONTACT_FIELD_COMPANY_PLACEHOLDER}
          autoComplete="organization"
          disabled={isSubmitting}
          className={classNames(inputClass, "mt-2")}
          {...register("company")}
          aria-describedby="contact-company-hint"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {CONTACT_FIELD_MESSAGE_LABEL}{" "}
          <span className="text-muted font-normal">{CONTACT_FORM_REQUIRED_MARKER}</span>
        </label>
        <p id="contact-message-hint" className={hintClass}>
          {CONTACT_FIELD_MESSAGE_HINT}
        </p>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={CONTACT_FIELD_MESSAGE_PLACEHOLDER}
          disabled={isSubmitting}
          className={classNames(inputClass, "resize-y min-h-30 mt-2")}
          {...register("message", { required: CONTACT_VALIDATION_MESSAGE_REQUIRED })}
          aria-invalid={errors.message ? "true" : "false"}
          aria-required
          aria-describedby={
            errors.message ? "contact-message-hint contact-message-error" : "contact-message-hint"
          }
        />
        {errors.message && (
          <p
            id="contact-message-error"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.message.message}
          </p>
        )}
      </div>
      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400" role="status" aria-live="polite">
          {CONTACT_FORM_SUCCESS_MESSAGE}
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert" aria-live="assertive">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        data-analytics-event="contact_form_submit_click"
        className={`hover-scale inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-semibold hover:bg-accent-muted hover:text-background transition-colors disabled:opacity-60 disabled:pointer-events-none ${FOCUS_RING}`}
      >
        {isSubmitting ? CONTACT_FORM_SUBMIT_LOADING : CONTACT_FORM_SUBMIT_IDLE}
      </button>
    </form>
  );
};
