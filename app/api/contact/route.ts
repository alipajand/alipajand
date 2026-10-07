import { NextResponse } from "next/server";
import { getFromEmail, getResend, getToEmail, isValidEmail } from "utils/resend";

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
