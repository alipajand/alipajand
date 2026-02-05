"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export type ContactFormStatus = "idle" | "loading" | "success" | "error";

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const DEFAULT_VALUES: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};

export function useContactForm() {
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
          message: data.message.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      form.reset(DEFAULT_VALUES);
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send. Please try again or email directly.");
    }
  }

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(submitToApi),
    formState: form.formState,
    status,
    errorMessage,
    isSubmitting: status === "loading",
  };
}
