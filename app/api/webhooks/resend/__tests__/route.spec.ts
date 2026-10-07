/** @jest-environment node */

const verify = jest.fn();
const getInbound = jest.fn();
const listAttachments = jest.fn();
const send = jest.fn();

jest.mock("utils/resend", () => ({
  getResend: () =>
    process.env.RESEND_API_KEY
      ? {
          webhooks: { verify },
          emails: { send, receiving: { get: getInbound, attachments: { list: listAttachments } } },
        }
      : null,
  getFromEmail: () => "Ali Pajand <hello@alipajand.com>",
  getToEmail: () => "inbox@example.com",
}));

import { POST } from "../route";

const receivedEvent = {
  type: "email.received",
  created_at: "2026-10-07T12:16:32.000Z",
  data: { email_id: "inbound-1" },
};

const inboundEmail = {
  id: "inbound-1",
  from: "Sender <sender@example.com>",
  to: ["info@alipajand.com"],
  reply_to: null,
  subject: "Hello",
  html: "<p>Hi</p>",
  text: "Hi",
  attachments: [],
};

function makeRequest() {
  return new Request("https://alipajand.com/api/webhooks/resend", {
    method: "POST",
    headers: { "svix-id": "msg_1", "svix-timestamp": "1", "svix-signature": "v1,sig" },
    body: JSON.stringify(receivedEvent),
  });
}

describe("POST /api/webhooks/resend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_WEBHOOK_SECRET = "whsec_test";
    verify.mockReturnValue(receivedEvent);
    getInbound.mockResolvedValue({ data: inboundEmail, error: null });
    send.mockResolvedValue({ data: { id: "sent-1" }, error: null });
  });

  it("should return 503 when the webhook secret is missing", async () => {
    delete process.env.RESEND_WEBHOOK_SECRET;
    const res = await POST(makeRequest());
    expect(res.status).toBe(503);
  });

  it("should return 503 when the Resend API key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(makeRequest());
    expect(res.status).toBe(503);
  });

  it("should reject requests with an invalid signature", async () => {
    verify.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("should pass the raw body and svix headers to verification", async () => {
    await POST(makeRequest());
    expect(verify).toHaveBeenCalledWith({
      payload: JSON.stringify(receivedEvent),
      headers: { id: "msg_1", timestamp: "1", signature: "v1,sig" },
      webhookSecret: "whsec_test",
    });
  });

  it("should ignore events other than email.received", async () => {
    verify.mockReturnValue({ type: "email.delivered", data: {} });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ignored: "email.delivered" });
    expect(send).not.toHaveBeenCalled();
  });

  it("should forward inbound mail with reply-to set to the original sender", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      {
        from: "Ali Pajand <hello@alipajand.com>",
        to: ["inbox@example.com"],
        replyTo: "Sender <sender@example.com>",
        subject: "Hello",
        html: "<p>Hi</p>",
        text: "Hi",
        attachments: undefined,
      },
      { idempotencyKey: "inbound-forward/inbound-1" }
    );
    expect(listAttachments).not.toHaveBeenCalled();
  });

  it("should prefer the Reply-To header and fill in an empty subject and body", async () => {
    getInbound.mockResolvedValue({
      data: {
        ...inboundEmail,
        reply_to: ["replies@example.com"],
        subject: "",
        html: null,
        text: null,
      },
      error: null,
    });
    await POST(makeRequest());
    expect(send.mock.calls[0][0]).toMatchObject({
      replyTo: ["replies@example.com"],
      subject: "(no subject)",
      text: "(empty message)",
    });
    expect(send.mock.calls[0][0]).not.toHaveProperty("html");
  });

  it("should forward attachments by download URL", async () => {
    getInbound.mockResolvedValue({
      data: { ...inboundEmail, attachments: [{ id: "a1" }, { id: "a2" }] },
      error: null,
    });
    listAttachments.mockResolvedValue({
      data: {
        data: [
          {
            filename: "cv.pdf",
            download_url: "https://files.example.com/cv.pdf",
            content_type: "application/pdf",
            content_disposition: "attachment",
            content_id: "ignored",
          },
          {
            filename: "logo.png",
            download_url: "https://files.example.com/logo.png",
            content_type: "image/png",
            content_disposition: "inline",
            content_id: "logo",
          },
        ],
      },
      error: null,
    });
    await POST(makeRequest());
    expect(listAttachments).toHaveBeenCalledWith({ emailId: "inbound-1" });
    expect(send.mock.calls[0][0].attachments).toEqual([
      {
        filename: "cv.pdf",
        path: "https://files.example.com/cv.pdf",
        contentType: "application/pdf",
        contentId: undefined,
      },
      {
        filename: "logo.png",
        path: "https://files.example.com/logo.png",
        contentType: "image/png",
        contentId: "logo",
      },
    ]);
  });

  it("should return 500 so Resend retries when the inbound email cannot be loaded", async () => {
    getInbound.mockResolvedValue({ data: null, error: { message: "not found" } });
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });

  it("should return 500 when attachments cannot be listed", async () => {
    getInbound.mockResolvedValue({
      data: { ...inboundEmail, attachments: [{ id: "a1" }] },
      error: null,
    });
    listAttachments.mockResolvedValue({ data: null, error: { message: "boom" } });
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });

  it("should return 500 when forwarding fails", async () => {
    send.mockResolvedValue({ data: null, error: { message: "rate limited" } });
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
  });
});
