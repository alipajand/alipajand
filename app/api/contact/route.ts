import { NextResponse } from "next/server";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  isValidEmail,
  normalizeContactName,
} from "utils/contactFields";
import { escapeHtml } from "utils/escapeHtml";
import { readLimitedText } from "utils/readLimitedText";
import { getFromEmail, getResend, getToEmail } from "utils/resend";

/** Generous for a contact message; caps what one request can make the server buffer. */
const MAX_BODY_BYTES = 64 * 1024;

/** The body as a JSON object, or null when it is not valid JSON or not an object. */
function parseJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(raw);
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // A JSON content type cannot be sent cross-site without a CORS preflight, which
  // this route does not grant, so plain HTML forms on other origins are refused.
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^application\/json\s*(;|$)/i.test(contentType.trim())) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  try {
    const raw = await readLimitedText(request, MAX_BODY_BYTES);
    if (raw === null) {
      return NextResponse.json({ error: "Message is too large" }, { status: 413 });
    }
    const body = parseJsonObject(raw);
    if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    const { name, email, message } = body;

    // The name lands in the subject line, so it is collapsed to a single line.
    const n = typeof name === "string" ? normalizeContactName(name) : "";
    const e = typeof email === "string" ? email.trim() : "";
    const m = typeof message === "string" ? message.trim() : "";

    if (!n) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!e) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!m) return NextResponse.json({ error: "Message is required" }, { status: 400 });
    if (n.length > CONTACT_NAME_MAX_LENGTH)
      return NextResponse.json({ error: "Name is too long" }, { status: 400 });
    if (m.length > CONTACT_MESSAGE_MAX_LENGTH)
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
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
      // Only the error code and status are logged: the provider's message can quote the visitor's,
      // the sender's or the recipient's address, and none of it is shown to the visitor.
      console.error("Contact email send failed", {
        name: error.name,
        statusCode: error.statusCode,
      });
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
