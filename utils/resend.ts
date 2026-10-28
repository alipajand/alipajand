import { Resend } from "resend";
import { isValidEmail } from "utils/contactFields";

export { isValidEmail };

const CONSUMER_DOMAINS = ["@gmail.com", "@yahoo.com", "@hotmail.com"];
const FALLBACK_FROM = "onboarding@resend.dev";

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function parseAngleEmail(value: string): string | null {
  const lt = value.indexOf("<");
  const gt = value.lastIndexOf(">");
  if (lt === -1 || gt <= lt) return null;
  return value.slice(lt + 1, gt).trim();
}

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
