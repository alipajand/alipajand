"use client";

import { useContactForm } from "components/Contact/hooks/useContactForm";

const inputClass =
  "w-full px-4 py-2.5 rounded-md bg-card border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent disabled:opacity-60";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    status,
    errorMessage,
    isSubmitting,
  } = useContactForm();

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-12 space-y-4"
      data-reveal
      aria-label="Contact form"
      noValidate
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          disabled={isSubmitting}
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Your message..."
          disabled={isSubmitting}
          className={`${inputClass} resize-y min-h-25`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message", { required: "Message is required" })}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>
      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400" role="status">
          Message sent. I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="hover-scale inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-accent-muted hover:text-background transition-colors disabled:opacity-60 disabled:pointer-events-none"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
