/** @jest-environment node */

const send = jest.fn();

jest.mock("utils/resend", () => ({
  ...jest.requireActual("utils/resend"),
  getResend: () => ({ emails: { send } }),
  getFromEmail: () => "onboarding@resend.dev",
  getToEmail: () => "inbox@example.com",
}));

import { POST } from "../route";

const validPayload = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello" };

function post(payload: Record<string, unknown>) {
  return POST(
    new Request("https://alipajand.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

describe("POST /api/contact field validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    send.mockResolvedValue({ data: { id: "sent-1" }, error: null });
  });

  it("should send the same email shape for a normal message", async () => {
    const res = await post(validPayload);
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "onboarding@resend.dev",
        to: ["inbox@example.com"],
        replyTo: "ada@example.com",
        subject: "Portfolio contact from Ada Lovelace",
      })
    );
  });

  it("should collapse line breaks and control characters in the name before it reaches the subject", async () => {
    const res = await post({ ...validPayload, name: "Ada\r\nBcc: victim@example.com\t\u0000X" });
    expect(res.status).toBe(200);
    const { subject, html } = send.mock.calls[0][0];
    expect(subject).toBe("Portfolio contact from Ada Bcc: victim@example.com X");
    expect(subject).not.toMatch(/[\r\n]/);
    expect(html).not.toMatch(/Ada\r\n/);
  });

  it("should reject a name made only of control characters", async () => {
    const res = await post({ ...validPayload, name: "\r\n\t" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Name is required" });
  });

  it("should keep line breaks in the message body", async () => {
    await post({ ...validPayload, message: "Line one\nLine two" });
    expect(send.mock.calls[0][0].html).toContain("Line one\nLine two");
  });

  it("should accept a 200-character name and a 10,000-character message", async () => {
    const res = await post({ ...validPayload, name: "N".repeat(200), message: "M".repeat(10_000) });
    expect(res.status).toBe(200);
  });

  it("should reject a name longer than 200 characters", async () => {
    const res = await post({ ...validPayload, name: "N".repeat(201) });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Name is too long" });
    expect(send).not.toHaveBeenCalled();
  });

  it("should reject a message longer than 10,000 characters", async () => {
    const res = await post({ ...validPayload, message: "M".repeat(10_001) });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Message is too long" });
    expect(send).not.toHaveBeenCalled();
  });

  it.each(['"x",other@example.com', "a@b.co,c@d.co", "a@b.co;c@d.co", "Name <a@b.co>"])(
    "should reject the address-list syntax %s as a reply-to",
    async (email) => {
      const res = await post({ ...validPayload, email });
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid email address" });
      expect(send).not.toHaveBeenCalled();
    }
  );

  it.each(["first.last+tag@example.co.uk", "o'brien@example.ie", "x_y-z@sub.example.com"])(
    "should still accept the ordinary address %s",
    async (email) => {
      const res = await post({ ...validPayload, email });
      expect(res.status).toBe(200);
    }
  );
});
