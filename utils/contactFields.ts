/**
 * Contact form field rules shared by the form (`components/Contact`) and `POST /api/contact`,
 * so the browser never accepts input the server will refuse.
 *
 * Lengths are `String.prototype.length` (UTF-16 code units), which is what the server checks:
 * an emoji or other astral character counts as 2, a letter plus a combining mark counts as 2.
 */

export const CONTACT_NAME_MAX_LENGTH = 200;
export const CONTACT_MESSAGE_MAX_LENGTH = 10_000;
export const CONTACT_EMAIL_MAX_LENGTH = 254;

/** The name lands in the email subject, so control characters (CR, LF, tab, NUL, ...) collapse to one space. */
export function normalizeContactName(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function isValidEmail(value: string): boolean {
  if (value.length === 0 || value.length > CONTACT_EMAIL_MAX_LENGTH) return false;

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

  // Address-list and display-name syntax would let one field carry several
  // recipients (e.g. `"x",other@example.com` as a reply-to).
  if (/[,;"<>()[\]\\]/.test(value)) return false;

  return true;
}

/** The form has no company field on the API; it is sent as the first line of the message. */
export function composeContactMessage(message: string, company: string): string {
  const trimmedMessage = message.trim();
  const trimmedCompany = company.trim();
  if (!trimmedCompany) return trimmedMessage;
  return `Company: ${trimmedCompany}\n\n${trimmedMessage}`;
}

/** Length of the message as the server measures it, including the company line. */
export function contactMessageLength(message: string, company: string): number {
  return composeContactMessage(message, company).trim().length;
}
