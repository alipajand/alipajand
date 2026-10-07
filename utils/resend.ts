import { Resend } from "resend";

const MAX_EMAIL_LENGTH = 254;
const CONSUMER_DOMAINS = ["@gmail.com", "@yahoo.com", "@hotmail.com"];
const FALLBACK_FROM = "onboarding@resend.dev";

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export function isValidEmail(value: string): boolean {
  if (value.length === 0 || value.length > MAX_EMAIL_LENGTH) return false;

  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@")) return false;

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (local.length === 0 || domain.length === 0) return false;

  const dot = domain.lastIndexOf(".");
  if (dot <= 0 || dot === domain.length - 1) return false;

  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 32 || code === 127) return false;
  }

  return true;
}

function parseAngleEmail(value: string): string | null {
  const lt = value.indexOf("<");
  const gt = value.lastIndexOf(">");
  if (lt === -1 || gt <= lt) return null;
  return value.slice(lt + 1, gt).trim();
}

/** Inbox that receives contact form submissions and forwarded inbound mail. */
export function getToEmail(): string {
  const raw = process.env.CONTACT_EMAIL?.trim() ?? "alipajand@gmail.com";
  const parsed = parseAngleEmail(raw);
  return parsed ?? raw;
}

export function getFromEmail(): string {
  const raw = process.env.RESEND_FROM?.trim();
  if (!raw) return FALLBACK_FROM;

  const email = parseAngleEmail(raw) ?? raw;
  if (!isValidEmail(email)) return FALLBACK_FROM;
  if (CONSUMER_DOMAINS.some((d) => email.endsWith(d))) return FALLBACK_FROM;
  return raw;
}
