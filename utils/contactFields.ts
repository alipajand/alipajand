export const CONTACT_NAME_MAX_LENGTH = 200;
export const CONTACT_MESSAGE_MAX_LENGTH = 10_000;
export const CONTACT_EMAIL_MAX_LENGTH = 254;

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

export function composeContactMessage(message: string, company: string): string {
  const trimmedMessage = message.trim();
  const trimmedCompany = company.trim();
  if (!trimmedCompany) return trimmedMessage;
  return `Company: ${trimmedCompany}\n\n${trimmedMessage}`;
}

export function contactMessageLength(message: string, company: string): number {
  return composeContactMessage(message, company).trim().length;
}
