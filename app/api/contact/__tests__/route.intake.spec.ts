/** @jest-environment node */

const send = jest.fn();

jest.mock("utils/resend", () => ({
  ...jest.requireActual("utils/resend"),
  getResend: () => ({ emails: { send } }),
  getFromEmail: () => "onboarding@resend.dev",
  getToEmail: () => "inbox@example.com",
}));

import { POST } from "../route";

const validPayload = { name: "Ada", email: "ada@example.com", message: "Hello" };

function makeRequest(body: BodyInit, headers: Record<string, string>) {
  return new Request("https://alipajand.com/api/contact", { method: "POST", headers, body });
}

describe("POST /api/contact request intake", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    send.mockResolvedValue({ data: { id: "sent-1" }, error: null });
  });

  it("should accept a JSON request from the site's own form", async () => {
    const res = await POST(
      makeRequest(JSON.stringify(validPayload), { "content-type": "application/json" })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("should accept a JSON content type with a charset parameter", async () => {
    const res = await POST(
      makeRequest(JSON.stringify(validPayload), {
        "content-type": "application/json; charset=utf-8",
      })
    );
    expect(res.status).toBe(200);
  });

  it.each([
    ["text/plain", "text/plain;charset=UTF-8"],
    ["form-encoded", "application/x-www-form-urlencoded"],
    ["multipart", "multipart/form-data; boundary=x"],
    ["lookalike", "application/jsonp"],
  ])("should refuse a %s body that a cross-site form could send", async (_label, type) => {
    const res = await POST(makeRequest(JSON.stringify(validPayload), { "content-type": type }));
    expect(res.status).toBe(415);
    expect(await res.json()).toEqual({ error: "Unsupported content type" });
    expect(send).not.toHaveBeenCalled();
  });

  it("should refuse a request with no content type", async () => {
    const res = await POST(
      new Request("https://alipajand.com/api/contact", {
        method: "POST",
        body: new Blob([JSON.stringify(validPayload)]),
      })
    );
    expect(res.status).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it("should refuse a body larger than 64 KB without sending mail", async () => {
    const big = JSON.stringify({ ...validPayload, message: "A".repeat(70 * 1024) });
    const res = await POST(makeRequest(big, { "content-type": "application/json" }));
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "Message is too large" });
    expect(send).not.toHaveBeenCalled();
  });

  it("should refuse an oversized streamed body that declares no length", async () => {
    const chunk = new TextEncoder().encode("A".repeat(16 * 1024));
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (sent >= 10) {
          controller.close();
          return;
        }
        sent += 1;
        controller.enqueue(chunk);
      },
    });
    const req = new Request("https://alipajand.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: stream,
      duplex: "half",
    } as RequestInit);
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(sent).toBeLessThan(10);
    expect(send).not.toHaveBeenCalled();
  });

  it("should keep the generic error for malformed JSON", async () => {
    const res = await POST(makeRequest("{bad", { "content-type": "application/json" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to send message" });
  });
});
