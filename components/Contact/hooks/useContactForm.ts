"use client";

import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  type FormState,
  useForm,
  type UseFormHandleSubmit,
  type UseFormRegister,
  useWatch,
} from "react-hook-form";

import { CONTACT_FORM_ERROR_GENERIC, CONTACT_FORM_ERROR_NETWORK } from "data/contactForm";
import { trackGtagEvent } from "utils/analytics";
import { composeContactMessage, contactMessageLength } from "utils/contactFields";

export type ContactFormStatus = "idle" | "loading" | "success" | "error";

export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface ContactFormSelectors {
  status: ContactFormStatus;
  errorMessage: string | null;
  isSubmitting: boolean;
  formState: FormState<ContactFormValues>;
  validationErrors: string[];
  errorSummaryRef: RefObject<HTMLDivElement | null>;
  /** Message length as the server counts it, company line included. */
  messageLength: number;
  hasCompany: boolean;
}

export interface ContactFormActions {
  register: UseFormRegister<ContactFormValues>;
  handleSubmit: ReturnType<UseFormHandleSubmit<ContactFormValues>>;
}

export interface ContactFormHook {
  selectors: ContactFormSelectors;
  actions: ContactFormActions;
}

const DEFAULT_VALUES: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export const useContactForm = (): ContactFormHook => {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const form = useForm<ContactFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });
  const {
    formState: { errors, submitCount },
  } = form;
  const [message, company] = useWatch({ control: form.control, name: ["message", "company"] });
  const messageLength = contactMessageLength(message, company);
  const hasCompany = company.trim().length > 0;
  // The company shares the message's length budget, so a message already checked is checked again.
  useEffect(() => {
    if (form.getFieldState("message").isTouched || form.formState.submitCount > 0) {
      void form.trigger("message");
    }
  }, [company, form]);
  const validationErrors = useMemo(
    () =>
      [errors.name?.message, errors.email?.message, errors.message?.message].filter(
        (value): value is string => Boolean(value)
      ),
    [errors.email?.message, errors.message?.message, errors.name?.message]
  );
  useEffect(() => {
    if (submitCount < 1 || validationErrors.length === 0) return;
    errorSummaryRef.current?.focus();
  }, [submitCount, validationErrors]);
  const submitToApi = async (data: ContactFormValues) => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          message: composeContactMessage(data.message, data.company),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        // The form applies the server's rules first, so a 400 means the two have drifted or the
        // request was altered; the server's wording is not shown.
        setErrorMessage(
          res.status === 400 ? CONTACT_FORM_ERROR_GENERIC : (body.error ?? CONTACT_FORM_ERROR_GENERIC)
        );
        trackGtagEvent("contact_form_submit", { outcome: "error" });
        return;
      }
      setStatus("success");
      trackGtagEvent("contact_form_submit", { outcome: "success" });
      form.reset(DEFAULT_VALUES);
    } catch {
      setStatus("error");
      setErrorMessage(CONTACT_FORM_ERROR_NETWORK);
      trackGtagEvent("contact_form_submit", { outcome: "network_error" });
    }
  };
  return {
    selectors: {
      status,
      errorMessage,
      isSubmitting: status === "loading",
      formState: form.formState,
      validationErrors,
      errorSummaryRef,
      messageLength,
      hasCompany,
    },
    actions: {
      register: form.register,
      handleSubmit: form.handleSubmit(submitToApi),
    },
  };
};
