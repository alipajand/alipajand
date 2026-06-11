"use client";

import { useState } from "react";
import {
  type FormState,
  useForm,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";

import { CONTACT_FORM_ERROR_GENERIC, CONTACT_FORM_ERROR_NETWORK } from "data/contactForm";
import { trackGtagEvent } from "utils/analytics";

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

function composeMessage(message: string, company: string): string {
  const trimmedMessage = message.trim();
  const trimmedCompany = company.trim();
  if (!trimmedCompany) return trimmedMessage;
  return `Company: ${trimmedCompany}\n\n${trimmedMessage}`;
}

export function useContactForm(): ContactFormHook {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  async function submitToApi(data: ContactFormValues) {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          message: composeMessage(data.message, data.company),
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(body.error ?? CONTACT_FORM_ERROR_GENERIC);
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
  }

  return {
    selectors: {
      status,
      errorMessage,
      isSubmitting: status === "loading",
      formState: form.formState,
    },
    actions: {
      register: form.register,
      handleSubmit: form.handleSubmit(submitToApi),
    },
  };
}
