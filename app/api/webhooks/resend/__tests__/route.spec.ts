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

import { createHmac } from "node:crypto";

import { POST, WEBHOOK_MAX_BODY_BYTES } from "../route";

const receivedEvent = {
  type: "email.received",
  created_at: "2026-10-07T12:16:32.000Z",
  data: {
    email_id: "inbound-1",
    to: ["info@alipajand.com"],
    cc: [],
    received_for: ["info@alipajand.com"],
  },
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

  describe("body size", () => {
    const oversized = (headers: Record<string, string> = {}) =>
      new Request("https://alipajand.com/api/webhooks/resend", {
        method: "POST",
        headers: {
          "svix-id": "msg_1",
          "svix-timestamp": "1",
          "svix-signature": "v1,sig",
          ...headers,
        },
        body: "x".repeat(WEBHOOK_MAX_BODY_BYTES + 1),
      });

    it("should answer 413 before verifying a body over the cap", async () => {
      const res = await POST(oversized());
      expect(res.status).toBe(413);
      expect(verify).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    });

    it("should answer 413 when Content-Length declares more than the cap", async () => {
      const res = await POST(oversized({ "content-length": String(WEBHOOK_MAX_BODY_BYTES * 10) }));
      expect(res.status).toBe(413);
      expect(verify).not.toHaveBeenCalled();
    });

    it("should still verify a body at the cap", async () => {
      verify.mockReturnValue({ type: "email.delivered", data: {} });
      const body = "x".repeat(WEBHOOK_MAX_BODY_BYTES);
      const res = await POST(
        new Request("https://alipajand.com/api/webhooks/resend", { method: "POST", body })
      );
      expect(res.status).toBe(200);
      expect(verify).toHaveBeenCalledWith(expect.objectContaining({ payload: body }));
    });
  });

  it("should ignore events other than email.received", async () => {
    verify.mockReturnValue({ type: "email.delivered", data: {} });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ignored: "email.delivered" });
    expect(send).not.toHaveBeenCalled();
  });

  it("should ignore inbound mail that is not addressed to alipajand.com", async () => {
    verify.mockReturnValue({
      ...receivedEvent,
      data: {
        ...receivedEvent.data,
        to: ["security@ledgerguard.io"],
        received_for: ["security@ledgerguard.io"],
      },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ignored: "recipient-domain" });
    expect(getInbound).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("should not match lookalike domains", async () => {
    verify.mockReturnValue({
      ...receivedEvent,
      data: { ...receivedEvent.data, received_for: ["info@mail.alipajand.com.evil.io"] },
    });
    const res = await POST(makeRequest());
    expect(await res.json()).toEqual({ ignored: "recipient-domain" });
    expect(send).not.toHaveBeenCalled();
  });

  it("should forward when an alipajand.com address is among several recipients", async () => {
    verify.mockReturnValue({
      ...receivedEvent,
      data: {
        ...receivedEvent.data,
        received_for: ["security@ledgerguard.io", "Info@AliPajand.com"],
      },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("should fall back to To and Cc headers when received_for is empty", async () => {
    verify.mockReturnValue({
      ...receivedEvent,
      data: {
        ...receivedEvent.data,
        to: ["someone@example.com"],
        cc: ["Ali <hello@alipajand.com>"],
        received_for: [],
      },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
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
        html: expect.stringMatching(/<\/div><p>Hi<\/p>$/),
        text: [
          "---------- Forwarded external message ----------",
          "From: Sender <sender@example.com>",
          "To: info@alipajand.com",
          "----------",
          "",
          "Hi",
        ].join("\n"),
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
      text: expect.stringMatching(
        /^---------- Forwarded external message -+\n[\s\S]*\(empty message\)$/
      ),
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

  describe("forwarding header", () => {
    function forwarded() {
      return send.mock.calls[0][0] as { html?: string; text?: string; replyTo: unknown };
    }

    function withInbound(overrides: Record<string, unknown>) {
      getInbound.mockResolvedValue({ data: { ...inboundEmail, ...overrides }, error: null });
    }

    it("should label the forward with the original From, To and Date, escaped for HTML", async () => {
      withInbound({
        from: `"O'Brien & Co" <ob@example.com>`,
        to: ["info@alipajand.com", "Team <team@alipajand.com>"],
        headers: { Date: "Tue, 7 Oct 2026 12:16:32 +0000", "message-id": "<1@example.com>" },
      });
      await POST(makeRequest());
      const { html, text } = forwarded();

      expect(html).toMatch(/^<div[^>]*><p[^>]*><strong>Forwarded external message<\/strong><\/p>/);
      expect(html).toContain("&quot;O&#039;Brien &amp; Co&quot; &lt;ob@example.com&gt;");
      expect(html).toContain("info@alipajand.com, Team &lt;team@alipajand.com&gt;");
      expect(html).toContain("<strong>Date:</strong>");
      expect(html).toContain("Tue, 7 Oct 2026 12:16:32 +0000");
      expect(html).not.toContain(`"O'Brien & Co"`);
      expect(html).toMatch(/<p>Hi<\/p>$/);

      expect(text).toBe(
        [
          "---------- Forwarded external message ----------",
          `From: "O'Brien & Co" <ob@example.com>`,
          "To: info@alipajand.com, Team <team@alipajand.com>",
          "Date: Tue, 7 Oct 2026 12:16:32 +0000",
          "----------",
          "",
          "Hi",
        ].join("\n")
      );
    });

    it("should omit the Date line when the original has no Date header", async () => {
      withInbound({ headers: { "message-id": "<1@example.com>", date: "   " } });
      await POST(makeRequest());
      const { html, text } = forwarded();
      expect(html).not.toContain("Date:");
      expect(text).not.toContain("Date:");
      expect(text).toContain("To: info@alipajand.com\n----------\n");
    });

    it("should omit the Date line when the email has no headers at all", async () => {
      withInbound({ headers: null });
      await POST(makeRequest());
      expect(forwarded().html).not.toContain("Date:");
      expect(forwarded().text).not.toContain("Date:");
    });

    it("should escape a sender containing a script tag", async () => {
      withInbound({
        from: `"<script>alert(1)</script>" <evil@example.com>`,
        to: ["<img src=x onerror=alert(1)>@alipajand.com"],
      });
      await POST(makeRequest());
      const { html } = forwarded();
      expect(html).not.toContain("<script");
      expect(html).not.toContain("<img");
      expect(html).toContain(
        "&quot;&lt;script&gt;alert(1)&lt;/script&gt;&quot; &lt;evil@example.com&gt;"
      );
      expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;@alipajand.com");
    });

    it("should keep each header value on one line so it cannot fake extra fields", async () => {
      withInbound({ from: "Sender <sender@example.com>\r\nAuthentication: SPF pass" });
      await POST(makeRequest());
      const { text } = forwarded();
      expect(text).toContain("From: Sender <sender@example.com> Authentication: SPF pass\n");
      expect(text?.split("\n").filter((l) => l.startsWith("Authentication"))).toEqual([]);
    });

    it("should make no authentication claim when Resend reports no results", async () => {
      withInbound({
        headers: {
          "Authentication-Results": "mx.example.com; spf=pass; dkim=pass; dmarc=pass",
          "Received-SPF": "pass",
        },
      });
      await POST(makeRequest());
      const { html, text } = forwarded();
      for (const body of [html, text]) {
        expect(body).not.toMatch(/SPF|DKIM|DMARC|authenticat|verified/i);
      }
    });

    it("should ignore an authentication field with no documented values", async () => {
      withInbound({ authentication: { spf: "PASS", dkim: true, dmarc: null } });
      await POST(makeRequest());
      const { html, text } = forwarded();
      for (const body of [html, text]) {
        expect(body).not.toMatch(/SPF|DKIM|DMARC|authenticat/i);
      }
    });

    it("should show the results Resend reports in its authentication field", async () => {
      withInbound({ authentication: { spf: "pass", dkim: "gray", dmarc: "fail" } });
      await POST(makeRequest());
      const { html, text } = forwarded();
      expect(text).toContain(
        "Authentication (reported by Resend): SPF pass, DKIM gray, DMARC fail\n"
      );
      expect(html).toContain("<strong>Authentication (reported by Resend):</strong>");
      expect(html).toContain("SPF pass, DKIM gray, DMARC fail");
    });

    it("should insert the HTML block after the body tag of a full document", async () => {
      withInbound({
        html: '<html><head><title>x</title></head><body class="m"><p>Hi</p></body></html>',
      });
      await POST(makeRequest());
      expect(forwarded().html).toMatch(
        /^<html><head><title>x<\/title><\/head><body class="m"><div[^>]*>[\s\S]*Forwarded external message[\s\S]*<\/div><p>Hi<\/p><\/body><\/html>$/
      );
    });

    it("should label a text-only message without adding an HTML body", async () => {
      withInbound({ html: null, text: "Plain body" });
      await POST(makeRequest());
      const sent = send.mock.calls[0][0];
      expect(sent).not.toHaveProperty("html");
      expect(sent.text).toMatch(
        /^---------- Forwarded external message -+\nFrom: Sender <sender@example.com>\n/
      );
      expect(sent.text).toMatch(/\n\nPlain body$/);
    });

    it("should leave the text body out when the original only has HTML", async () => {
      withInbound({ text: null });
      await POST(makeRequest());
      expect(forwarded().text).toBeUndefined();
      expect(forwarded().html).toContain("Forwarded external message");
    });

    it("should keep Reply-To pointed at the original sender, not the forwarding address", async () => {
      await POST(makeRequest());
      expect(forwarded().replyTo).toBe("Sender <sender@example.com>");

      send.mockClear();
      withInbound({ reply_to: ["replies@example.com", "other@example.com"] });
      await POST(makeRequest());
      expect(forwarded().replyTo).toEqual(["replies@example.com", "other@example.com"]);
      expect(send.mock.calls[0][0].from).toBe("Ali Pajand <hello@alipajand.com>");
    });

    it("should keep attachments alongside the labelled body", async () => {
      withInbound({ attachments: [{ id: "a1" }] });
      listAttachments.mockResolvedValue({
        data: {
          data: [
            {
              filename: "cv.pdf",
              download_url: "https://files.example.com/cv.pdf",
              content_type: "application/pdf",
              content_disposition: "attachment",
              content_id: null,
            },
          ],
        },
        error: null,
      });
      await POST(makeRequest());
      const sent = send.mock.calls[0][0];
      expect(sent.attachments).toEqual([
        {
          filename: "cv.pdf",
          path: "https://files.example.com/cv.pdf",
          contentType: "application/pdf",
          contentId: undefined,
        },
      ]);
      expect(sent.html).toContain("Forwarded external message");
    });

    it("should send an identical payload under the same idempotency key on a retry", async () => {
      withInbound({ headers: { date: "Tue, 7 Oct 2026 12:16:32 +0000" } });
      await POST(makeRequest());
      await POST(makeRequest());
      expect(send).toHaveBeenCalledTimes(2);
      const [first, second] = send.mock.calls;
      expect(first[1]).toEqual({ idempotencyKey: "inbound-forward/inbound-1" });
      expect(second[1]).toEqual({ idempotencyKey: "inbound-forward/inbound-1" });
      expect(second[0]).toEqual(first[0]);
    });
  });

  describe("signed payloads verified with the real SDK", () => {
    const secret = `whsec_${Buffer.from("local-test-signing-secret-0123456789").toString("base64")}`;

    function signedRequest(payload: string, { tamper = false } = {}) {
      const id = "msg_signed";
      const timestamp = String(Math.floor(Date.now() / 1000));
      const key = Buffer.from(secret.slice("whsec_".length), "base64");
      const signature = createHmac("sha256", key)
        .update(`${id}.${timestamp}.${payload}`)
        .digest("base64");
      return new Request("https://alipajand.com/api/webhooks/resend", {
        method: "POST",
        headers: {
          "svix-id": id,
          "svix-timestamp": timestamp,
          "svix-signature": `v1,${signature}`,
        },
        body: tamper ? `${payload} ` : payload,
      });
    }

    beforeEach(() => {
      process.env.RESEND_WEBHOOK_SECRET = secret;
      const { Resend } = jest.requireActual<typeof import("resend")>("resend");
      const real = new Resend("re_test");
      verify.mockImplementation((args) => real.webhooks.verify(args));
    });

    it("should forward a correctly signed email.received event", async () => {
      const res = await POST(signedRequest(JSON.stringify(receivedEvent)));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ forwarded: "inbound-1" });
      expect(send.mock.calls[0][1]).toEqual({ idempotencyKey: "inbound-forward/inbound-1" });
    });

    it("should reject a body changed after signing", async () => {
      const res = await POST(signedRequest(JSON.stringify(receivedEvent), { tamper: true }));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid signature" });
      expect(getInbound).not.toHaveBeenCalled();
    });

    it("should reject a signature made with another secret", async () => {
      const req = signedRequest(JSON.stringify(receivedEvent));
      process.env.RESEND_WEBHOOK_SECRET = `whsec_${Buffer.from("another-secret-0123456789").toString("base64")}`;
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(send).not.toHaveBeenCalled();
    });

    it.each([
      ["an empty body", ""],
      ["a JSON null", "null"],
      ["a JSON array", "[]"],
      ["an event without a type", JSON.stringify({ data: receivedEvent.data })],
      ["an email.received event without data", JSON.stringify({ type: "email.received" })],
      [
        "an email.received event without an email id",
        JSON.stringify({ type: "email.received", data: { received_for: ["info@alipajand.com"] } }),
      ],
      [
        "an email.received event with a blank email id",
        JSON.stringify({ type: "email.received", data: { ...receivedEvent.data, email_id: " " } }),
      ],
    ])("should answer 400 to %s", async (_label, payload) => {
      const res = await POST(signedRequest(payload));
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid payload" });
      expect(getInbound).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    });

    it("should answer 400 to a signed body that is not JSON", async () => {
      const res = await POST(signedRequest("not json"));
      expect(res.status).toBe(400);
      expect(send).not.toHaveBeenCalled();
    });

    it("should acknowledge an unknown event type without loading anything", async () => {
      const res = await POST(signedRequest(JSON.stringify({ type: "domain.unknown", data: {} })));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ignored: "domain.unknown" });
      expect(getInbound).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    });
  });

  describe("malformed provider fields", () => {
    function withEvent(data: Record<string, unknown>) {
      verify.mockReturnValue({ ...receivedEvent, data: { ...receivedEvent.data, ...data } });
    }

    function withInbound(overrides: Record<string, unknown>) {
      getInbound.mockResolvedValue({ data: { ...inboundEmail, ...overrides }, error: null });
    }

    function sent() {
      return send.mock.calls[0][0] as {
        html?: string;
        text?: string;
        replyTo: unknown;
        attachments: unknown;
      };
    }

    it("should treat non-array recipient lists and non-string entries as empty", async () => {
      withEvent({ received_for: "info@alipajand.com", to: { 0: "info@alipajand.com" }, cc: [42] });
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ignored: "recipient-domain" });
      expect(getInbound).not.toHaveBeenCalled();
    });

    it("should skip non-string entries and still match a valid recipient", async () => {
      withEvent({ received_for: [null, 7, "info@alipajand.com"] });
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
      expect(send).toHaveBeenCalledTimes(1);
    });

    it("should forward a message with no From, leaving the line and Reply-To out", async () => {
      withInbound({ from: undefined, reply_to: null });
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
      const { html, text, replyTo } = sent();
      expect(replyTo).toBeUndefined();
      expect(text).not.toContain("From:");
      expect(html).not.toContain("From:");
      expect(text).toMatch(/^---------- Forwarded external message -+\nTo: info@alipajand.com\n/);
    });

    it("should forward a message with an empty or missing To, leaving the line out", async () => {
      for (const to of [[], undefined, "info@alipajand.com"]) {
        send.mockClear();
        withInbound({ to });
        const res = await POST(makeRequest());
        expect(res.status).toBe(200);
        expect(sent().text).not.toContain("To:");
        expect(sent().html).not.toContain("To:");
        expect(sent().text).toContain("From: Sender <sender@example.com>\n----------\n");
      }
    });

    it("should keep a From with CRLF and a script tag on one escaped line in both bodies", async () => {
      withInbound({
        from: "<script>alert(1)</script> <a@example.com>\r\nDate: Mon, 1 Jan 2001\r\nX: y",
      });
      await POST(makeRequest());
      const { html, text } = sent();
      const fromLines = text!.split("\n").filter((l) => l.startsWith("From:"));
      expect(fromLines).toEqual([
        "From: <script>alert(1)</script> <a@example.com> Date: Mon, 1 Jan 2001 X: y",
      ]);
      expect(text!.split("\n").some((l) => l.startsWith("Date:"))).toBe(false);
      expect(html).not.toMatch(/<script/i);
      expect(html).not.toMatch(/[\r\n]/);
      expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt; &lt;a@example.com&gt; Date:");
    });

    it("should leave the Date line out when the Date header is not a string", async () => {
      for (const date of [1730000000, ["Tue, 7 Oct 2026"], { value: "x" }, null]) {
        send.mockClear();
        withInbound({ headers: { date } });
        const res = await POST(makeRequest());
        expect(res.status).toBe(200);
        expect(sent().text).not.toContain("Date:");
        expect(sent().html).not.toContain("Date:");
      }
    });

    it("should keep a very large header on one line without failing", async () => {
      const huge = `Tue, 7 Oct 2026 ${"x".repeat(200_000)}\r\n${"<b>".repeat(10_000)}`;
      withInbound({ headers: { date: huge }, from: `${"A".repeat(100_000)} <a@example.com>` });
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
      const { html, text } = sent();
      const block = text!.slice(0, text!.indexOf("----------\n\n"));
      expect(block.split("\n")).toEqual([
        "---------- Forwarded external message ----------",
        expect.stringMatching(/^From: A+ <a@example.com>$/),
        "To: info@alipajand.com",
        expect.stringMatching(/^Date: Tue, 7 Oct 2026 x+ (<b>)+$/),
        "",
      ]);
      expect(html).not.toContain("<b>");
      expect(html).toContain("&lt;b&gt;");
    });

    it("should never read sender-supplied authentication headers", async () => {
      withInbound({
        headers: {
          "Authentication-Results": "mx.example.com; spf=pass; dkim=pass; dmarc=pass",
          "ARC-Authentication-Results": "i=1; mx.example.com; spf=pass; dkim=pass; dmarc=pass",
          "ARC-Seal": "i=1; a=rsa-sha256; cv=none; d=example.com; s=a; b=abc",
          "ARC-Message-Signature": "i=1; a=rsa-sha256; d=example.com; s=a; b=abc",
          "DKIM-Signature": "v=1; a=rsa-sha256; d=alipajand.com; s=resend; b=abc",
          "Received-SPF": "pass (domain of alipajand.com designates 1.2.3.4)",
        },
        authentication: { spf: "fail", dkim: "fail", dmarc: "fail" },
      });
      await POST(makeRequest());
      const { html, text } = sent();
      expect(text).toContain(
        "Authentication (reported by Resend): SPF fail, DKIM fail, DMARC fail\n"
      );
      for (const body of [html, text]) {
        expect(body).not.toMatch(/pass/i);
        expect(body).not.toMatch(
          /ARC-|DKIM-Signature|Received-SPF|Authentication-Results|1\.2\.3\.4/
        );
      }
    });

    it("should accept each documented authentication value and skip missing checks", async () => {
      withInbound({ authentication: { spf: "processing_failed", dmarc: "unknown" } });
      await POST(makeRequest());
      expect(sent().text).toContain(
        "Authentication (reported by Resend): SPF processing_failed, DMARC unknown\n"
      );
      expect(sent().text).not.toContain("DKIM");
    });

    it("should ignore an authentication field that is not an object", async () => {
      for (const authentication of ["spf=pass", ["pass"], 1]) {
        send.mockClear();
        withInbound({ authentication });
        await POST(makeRequest());
        expect(sent().text).not.toMatch(/Authentication|pass/);
      }
    });

    it("should forward when the provider omits the attachments list", async () => {
      withInbound({ attachments: undefined });
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
      expect(listAttachments).not.toHaveBeenCalled();
      expect(sent().attachments).toBeUndefined();
    });

    it("should return 500 when the attachment listing has no data array", async () => {
      withInbound({ attachments: [{ id: "a1" }] });
      listAttachments.mockResolvedValue({ data: { object: "list" }, error: null });
      const res = await POST(makeRequest());
      expect(res.status).toBe(500);
      expect(send).not.toHaveBeenCalled();
    });

    it("should return 500 and retry under the same key when an attachment cannot be fetched", async () => {
      withInbound({ attachments: [{ id: "a1" }] });
      listAttachments.mockResolvedValue({
        data: {
          data: [
            {
              filename: "cv.pdf",
              download_url: "https://files.example.com/expired.pdf",
              content_type: "application/pdf",
              content_disposition: "attachment",
              content_id: null,
            },
          ],
        },
        error: null,
      });
      send.mockResolvedValueOnce({
        data: null,
        error: { name: "application_error", message: "Failed to fetch attachment" },
      });
      expect((await POST(makeRequest())).status).toBe(500);
      expect((await POST(makeRequest())).status).toBe(200);
      expect(send.mock.calls.map((call) => call[1])).toEqual([
        { idempotencyKey: "inbound-forward/inbound-1" },
        { idempotencyKey: "inbound-forward/inbound-1" },
      ]);
    });
  });
});
