import { NextResponse } from "next/server";
import type { Attachment, GetReceivingEmailResponseSuccess } from "resend";
import { escapeHtml } from "utils/escapeHtml";
import { readLimitedText } from "utils/readLimitedText";
import { getFromEmail, getResend, getToEmail } from "utils/resend";

export const WEBHOOK_MAX_BODY_BYTES = 256 * 1024;

const FORWARD_DOMAIN = "alipajand.com";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function isForForwardDomain(address: string): boolean {
  const at = address.lastIndexOf("@");
  if (at === -1) return false;
  const domain = address
    .slice(at + 1)
    .replace(/>\s*$/, "")
    .trim()
    .toLowerCase();
  return domain === FORWARD_DOMAIN;
}

const FORWARD_LABEL = "Forwarded external message";

const AUTH_RESULTS = new Set(["pass", "fail", "gray", "processing_failed", "unknown"]);
const AUTH_CHECKS = [
  ["spf", "SPF"],
  ["dkim", "DKIM"],
  ["dmarc", "DMARC"],
] as const;

type ProvenanceField = { label: string; value: string };

function singleLine(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headerValue(headers: Record<string, string> | null, name: string): string | undefined {
  if (!headers) return undefined;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  const value = key ? headers[key] : undefined;
  return typeof value === "string" && value.trim() ? value : undefined;
}

function providerAuthentication(email: GetReceivingEmailResponseSuccess): string | undefined {
  const auth: unknown = (email as { authentication?: unknown }).authentication;
  if (!auth || typeof auth !== "object") return undefined;
  const results = AUTH_CHECKS.flatMap(([key, label]) => {
    const value = (auth as Record<string, unknown>)[key];
    return typeof value === "string" && AUTH_RESULTS.has(value) ? [`${label} ${value}`] : [];
  });
  return results.length > 0 ? results.join(", ") : undefined;
}

function provenanceFields(email: GetReceivingEmailResponseSuccess): ProvenanceField[] {
  const fields: ProvenanceField[] = [
    { label: "From", value: typeof email.from === "string" ? email.from : "" },
    { label: "To", value: stringList(email.to).join(", ") },
  ];
  const date = headerValue(email.headers, "date");
  if (date) fields.push({ label: "Date", value: date });
  const auth = providerAuthentication(email);
  if (auth) fields.push({ label: "Authentication (reported by Resend)", value: auth });
  return fields
    .map((f) => ({ label: f.label, value: singleLine(f.value) }))
    .filter((f) => f.value.length > 0);
}

function provenanceText(fields: ProvenanceField[]): string {
  const lines = fields.map((f) => `${f.label}: ${f.value}`);
  return [`---------- ${FORWARD_LABEL} ----------`, ...lines, "----------", "", ""].join("\n");
}

function provenanceHtml(fields: ProvenanceField[]): string {
  const rows = fields
    .map(
      (f) =>
        `<tr><td style="padding:0 12px 0 0;vertical-align:top;white-space:nowrap;"><strong>${escapeHtml(f.label)}:</strong></td>` +
        `<td style="padding:0;">${escapeHtml(f.value)}</td></tr>`
    )
    .join("");
  return (
    `<div style="margin:0 0 16px;padding:12px;border:1px solid #c9c9c9;background:#f5f5f5;color:#222;font:13px/1.5 sans-serif;">` +
    `<p style="margin:0 0 8px;"><strong>${FORWARD_LABEL}</strong></p>` +
    `<table role="presentation" style="border-collapse:collapse;font:inherit;color:inherit;">${rows}</table>` +
    `</div>`
  );
}

function prependHtml(html: string, block: string): string {
  const body = /<body\b[^>]*>/i.exec(html);
  if (!body) return block + html;
  const at = body.index + body[0].length;
  return html.slice(0, at) + block + html.slice(at);
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const resend = getResend();
  if (!secret || !resend) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const payload = await readLimitedText(request, WEBHOOK_MAX_BODY_BYTES);
  if (payload === null) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let event: unknown;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!isRecord(event) || typeof event.type !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ignored: event.type });
  }

  const data = isRecord(event.data) ? event.data : {};
  const emailId = typeof data.email_id === "string" && data.email_id.trim() ? data.email_id : "";
  if (!emailId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const receivedFor = stringList(data.received_for);
  const recipients =
    receivedFor.length > 0 ? receivedFor : [...stringList(data.to), ...stringList(data.cc)];
  if (!recipients.some(isForForwardDomain)) {
    return NextResponse.json({ ignored: "recipient-domain" });
  }

  const { data: email, error: getError } = await resend.emails.receiving.get(emailId);
  if (getError || !email) {
    return NextResponse.json({ error: "Failed to load inbound email" }, { status: 500 });
  }

  let attachments: Attachment[] | undefined;
  if (Array.isArray(email.attachments) && email.attachments.length > 0) {
    const { data: list, error: listError } = await resend.emails.receiving.attachments.list({
      emailId,
    });
    if (listError || !list || !Array.isArray(list.data)) {
      return NextResponse.json({ error: "Failed to load attachments" }, { status: 500 });
    }
    attachments = list.data.map((a) => ({
      filename: a.filename,
      path: a.download_url,
      contentType: a.content_type,
      contentId: a.content_disposition === "inline" ? a.content_id : undefined,
    }));
  }

  const replyTo = email.reply_to && email.reply_to.length > 0 ? email.reply_to : email.from;
  const subject = email.subject || "(no subject)";
  const provenance = provenanceFields(email);
  const textHeader = provenanceText(provenance);
  const body = email.html
    ? {
        html: prependHtml(email.html, provenanceHtml(provenance)),
        text: email.text == null ? undefined : textHeader + email.text,
      }
    : { text: textHeader + (email.text ?? "(empty message)") };

  const { error: sendError } = await resend.emails.send(
    {
      from: getFromEmail(),
      to: [getToEmail()],
      replyTo,
      subject,
      ...body,
      attachments,
    },
    { idempotencyKey: `inbound-forward/${emailId}` }
  );

  if (sendError) {
    return NextResponse.json({ error: "Failed to forward email" }, { status: 500 });
  }

  return NextResponse.json({ forwarded: emailId });
}
