import { NextResponse } from "next/server";
import type { Attachment, GetReceivingEmailResponseSuccess, WebhookEventPayload } from "resend";
import { getFromEmail, getResend, getToEmail } from "utils/resend";

/** Only mail addressed to this domain is forwarded; the Resend account also receives for other domains. */
const FORWARD_DOMAIN = "alipajand.com";

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

/** Values Resend documents for each `authentication` result. */
const AUTH_RESULTS = new Set(["pass", "fail", "gray", "processing_failed", "unknown"]);
const AUTH_CHECKS = [
  ["spf", "SPF"],
  ["dkim", "DKIM"],
  ["dmarc", "DMARC"],
] as const;

type ProvenanceField = { label: string; value: string };

/** Collapses line breaks and other control characters so a value stays on one line. */
function singleLine(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function headerValue(headers: Record<string, string> | null, name: string): string | undefined {
  if (!headers) return undefined;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  const value = key ? headers[key] : undefined;
  return typeof value === "string" && value.trim() ? value : undefined;
}

/**
 * SPF/DKIM/DMARC results from Resend's `authentication` field, which its API
 * documents as computed by the receiving server rather than read from the
 * message, so a sender cannot forge them. The SDK types do not declare the
 * field yet, so only the documented values are accepted. A missing field or an
 * unknown value yields nothing: absence is never shown as a result, and
 * headers such as `Authentication-Results` are never read.
 */
function providerAuthentication(email: GetReceivingEmailResponseSuccess): string | undefined {
  const auth: unknown = (email as { authentication?: unknown }).authentication;
  if (!auth || typeof auth !== "object") return undefined;
  const results = AUTH_CHECKS.flatMap(([key, label]) => {
    const value = (auth as Record<string, unknown>)[key];
    return typeof value === "string" && AUTH_RESULTS.has(value) ? [`${label} ${value}`] : [];
  });
  return results.length > 0 ? results.join(", ") : undefined;
}

/**
 * The original sender as the message states it, plus Resend's checks when it
 * reports them. The forward is sent and signed from this domain, so without
 * this block an external message reads as if it came from here.
 */
function provenanceFields(email: GetReceivingEmailResponseSuccess): ProvenanceField[] {
  const fields: ProvenanceField[] = [
    { label: "From", value: email.from ?? "" },
    { label: "To", value: (email.to ?? []).join(", ") },
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

/** Puts the block at the top of the visible body, after `<body>` when the HTML has one. */
function prependHtml(html: string, block: string): string {
  const body = /<body\b[^>]*>/i.exec(html);
  if (!body) return block + html;
  const at = body.index + body[0].length;
  return html.slice(0, at) + block + html.slice(at);
}

/**
 * Receives Resend webhooks and forwards inbound mail (e.g. info@alipajand.com)
 * to the personal inbox. Replies go straight to the original sender. Each
 * forward opens with a labelled block naming the original sender, recipients
 * and date, so it cannot pass for mail sent from this domain.
 *
 * Non-2xx responses make Resend retry, so failures that may be transient
 * return 500 and the send is made idempotent per inbound email id.
 */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const resend = getResend();
  if (!secret || !resend) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const payload = await request.text();

  let event: WebhookEventPayload;
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

  if (event.type !== "email.received") {
    return NextResponse.json({ ignored: event.type });
  }

  const receivedFor = event.data.received_for ?? [];
  const recipients =
    receivedFor.length > 0 ? receivedFor : [...(event.data.to ?? []), ...(event.data.cc ?? [])];
  if (!recipients.some(isForForwardDomain)) {
    return NextResponse.json({ ignored: "recipient-domain" });
  }

  const emailId = event.data.email_id;

  const { data: email, error: getError } = await resend.emails.receiving.get(emailId);
  if (getError || !email) {
    return NextResponse.json({ error: "Failed to load inbound email" }, { status: 500 });
  }

  let attachments: Attachment[] | undefined;
  if (email.attachments.length > 0) {
    const { data: list, error: listError } = await resend.emails.receiving.attachments.list({
      emailId,
    });
    if (listError || !list) {
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
