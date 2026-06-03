import { NextResponse } from "next/server";
import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const MAX_EMAIL_LENGTH = 254;
const CONSUMER_DOMAINS = ["@gmail.com", "@yahoo.com", "@hotmail.com"];

function isValidEmail(value: string): boolean {
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

function getToEmail(): string {
  const raw = process.env.CONTACT_EMAIL?.trim() ?? "alipajand@gmail.com";
  const parsed = parseAngleEmail(raw);
  return parsed ?? raw;
}

function getFromEmail(): string {
  const raw = process.env.RESEND_FROM?.trim();
  if (!raw) return "onboarding@resend.dev";

  const email = parseAngleEmail(raw) ?? raw;
  if (!isValidEmail(email)) return "onboarding@resend.dev";
  if (CONSUMER_DOMAINS.some((d) => email.endsWith(d))) return "onboarding@resend.dev";
  return raw;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const n = typeof name === "string" ? name.trim() : "";
    const e = typeof email === "string" ? email.trim() : "";
    const m = typeof message === "string" ? message.trim() : "";

    if (!n) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!e) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!m) return NextResponse.json({ error: "Message is required" }, { status: 400 });
    if (!isValidEmail(e))
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
    }

    const { error } = await resend.emails.send({
      from: getFromEmail(),
      to: [getToEmail()],
      replyTo: e,
      subject: `Portfolio contact from ${n}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(n)} &lt;${escapeHtml(e)}&gt;</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(m)}</pre>
      `,
    });

    if (error) {
      const isResendRestriction = /only send testing emails|verify a domain|from address/i.test(
        error.message ?? ""
      );
      const userMessage = isResendRestriction
        ? "Verify a domain at resend.com/domains and set RESEND_FROM to an email on that domain."
        : error.message;
      return NextResponse.json({ error: userMessage }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
