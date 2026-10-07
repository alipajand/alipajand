import { NextResponse } from "next/server";
import type { Attachment, WebhookEventPayload } from "resend";
import { getFromEmail, getResend, getToEmail } from "utils/resend";

/**
 * Receives Resend webhooks and forwards inbound mail (e.g. info@alipajand.com)
 * to the personal inbox. Replies go straight to the original sender.
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
  const body = email.html
    ? { html: email.html, text: email.text ?? undefined }
    : { text: email.text ?? "(empty message)" };

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
