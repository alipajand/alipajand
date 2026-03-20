"use client";

import classNames from "classnames";
import { type ContactFormHook, useContactForm } from "components/Contact/hooks/useContactForm";
import { FOCUS_RING } from "utils/visual";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed";
const labelClass = "block text-sm font-medium text-foreground";
const hintClass = "mt-1 text-xs text-muted leading-snug";

export function ContactForm() {
  const {
    selectors: {
      status,
      errorMessage,
      isSubmitting,
      formState: { errors },
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
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name <span className="text-muted font-normal">(required)</span>
        </label>
        <p id="contact-name-hint" className={hintClass}>
          How you’d like to be addressed.
        </p>
        <input
          id="contact-name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          disabled={isSubmitting}
          className={classNames(inputClass, "mt-2")}
          aria-invalid={errors.name ? true : undefined}
          aria-required
          aria-describedby={
            errors.name ? "contact-name-hint contact-name-error" : "contact-name-hint"
          }
          {...register("name", { required: "Enter your name" })}
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
          Email <span className="text-muted font-normal">(required)</span>
        </label>
        <p id="contact-email-hint" className={hintClass}>
          I only use this to reply—no mailing lists.
        </p>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          placeholder="you@company.com"
          autoComplete="email"
          disabled={isSubmitting}
          className={classNames(inputClass, "mt-2")}
          aria-invalid={errors.email ? true : undefined}
          aria-required
          aria-describedby={
            errors.email ? "contact-email-hint contact-email-error" : "contact-email-hint"
          }
          {...register("email", {
            required: "Enter your email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Use a valid email address",
            },
          })}
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
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-muted font-normal">(required)</span>
        </label>
        <p id="contact-message-hint" className={hintClass}>
          Role, location, timeline, stack, or the problem you’re solving—short is fine.
        </p>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="e.g. Staff frontend, React/TS, hybrid in Montreal, start Q2…"
          disabled={isSubmitting}
          className={classNames(inputClass, "resize-y min-h-[7.5rem] mt-2")}
          aria-invalid={errors.message ? true : undefined}
          aria-required
          aria-describedby={
            errors.message ? "contact-message-hint contact-message-error" : "contact-message-hint"
          }
          {...register("message", { required: "Add a short message" })}
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
          Message sent. I’ll reply within a few business days.
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
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
