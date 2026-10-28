"use client";

import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  type FormState,
  useForm,
  type UseFormHandleSubmit,
  type UseFormRegister,
  useWatch,
} from "react-hook-form";

import {
  CONTACT_FORM_ERROR_GENERIC,
  CONTACT_FORM_ERROR_NETWORK,
  CONTACT_FORM_ERROR_RATE_LIMITED,
} from "data/contactForm";
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
  useEffect(() => {
    if (!form.getValues("message").trim()) return;
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
        setErrorMessage(
          res.status === 429
            ? CONTACT_FORM_ERROR_RATE_LIMITED
            : res.status === 400
              ? CONTACT_FORM_ERROR_GENERIC
              : (body.error ?? CONTACT_FORM_ERROR_GENERIC)
        );
        return;
      }
      setStatus("success");
      form.reset(DEFAULT_VALUES);
    } catch {
      setStatus("error");
      setErrorMessage(CONTACT_FORM_ERROR_NETWORK);
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
