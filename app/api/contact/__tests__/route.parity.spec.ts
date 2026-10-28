/** @jest-environment node */

const send = jest.fn();

jest.mock("utils/resend", () => ({
  ...jest.requireActual("utils/resend"),
  getResend: () => ({ emails: { send } }),
  getFromEmail: () => "onboarding@resend.dev",
  getToEmail: () => "inbox@example.com",
}));

import type { ContactFormValues } from "components/Contact/hooks/useContactForm";
import { contactFieldRules } from "components/Contact/contactFieldRules";
import { composeContactMessage } from "utils/contactFields";
import { POST } from "../route";

const base: ContactFormValues = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "",
  message: "Hello",
};

type Validate = (value: string, values: ContactFormValues) => true | string;

function clientAccepts(values: ContactFormValues): boolean {
  return (["name", "email", "message"] as const).every(
    (field) => (contactFieldRules[field].validate as Validate)(values[field], values) === true
  );
}

function serverBody(values: ContactFormValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    message: composeContactMessage(values.message, values.company),
  };
}

async function serverStatus(body: Record<string, unknown>): Promise<number> {
  const res = await POST(
    new Request("https://alipajand.com/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
  );
  return res.status;
}

const repeat = (unit: string, codeUnits: number) => unit.repeat(codeUnits / unit.length);

const cases: Array<[string, Partial<ContactFormValues>, boolean]> = [
  ["blank name", { name: "" }, false],
  ["whitespace-only name", { name: "   \t " }, false],
  ["CR/LF-only name", { name: "\r\n\r\n" }, false],
  ["CR/LF inside name", { name: "Ada\r\nBcc: x@example.com" }, true],
  ["name at the limit", { name: "N".repeat(200) }, true],
  ["name at limit+1", { name: "N".repeat(201) }, false],
  ["name at the limit after trimming", { name: `  ${"N".repeat(200)}  ` }, true],
  [
    "name at the limit after control characters collapse",
    { name: `${"N".repeat(199)}\r\n\r\nX` },
    false,
  ],
  [
    "name collapsed back under the limit",
    { name: `${"N".repeat(99)}\r\n\r\n${"N".repeat(99)}` },
    true,
  ],
  ["astral name at the limit", { name: repeat("😀", 200) }, true],
  ["astral name at limit+2", { name: repeat("😀", 202) }, false],
  ["combining-mark name at the limit", { name: repeat("e\u0301", 200) }, true],
  ["combining-mark name over the limit", { name: repeat("e\u0301", 202) }, false],
  ["RTL name", { name: "علی پژند" }, true],
  ["blank email", { email: "" }, false],
  ["whitespace-only email", { email: "   " }, false],
  ["email with surrounding spaces", { email: "  ada@example.com  " }, true],
  ["address list in email", { email: '"x",bcc@example.com' }, false],
  ["email without a dot in the domain", { email: "ada@example" }, false],
  ["email with a non-breaking space", { email: "ada\u00a0@example.com" }, true],
  ["email over 254 characters", { email: `${"a".repeat(243)}@example.com` }, false],
  ["blank message", { message: "" }, false],
  ["whitespace-only message", { message: " \n\t " }, false],
  ["message at the limit", { message: "M".repeat(10_000) }, true],
  ["message at limit+1", { message: "M".repeat(10_001) }, false],
  ["message at the limit after trimming", { message: `\n ${"M".repeat(10_000)} \n` }, true],
  [
    "message plus company at the limit",
    { message: "M".repeat(10_000 - 15), company: "Acme" },
    true,
  ],
  ["message plus company at limit+1", { message: "M".repeat(10_000 - 14), company: "Acme" }, false],
  [
    "message under the limit, company pushes it over",
    { message: "M".repeat(9_995), company: "Acme" },
    false,
  ],
  ["blank company adds nothing", { message: "M".repeat(10_000), company: "   " }, true],
  ["emoji message at the limit", { message: repeat("😀", 10_000) }, true],
  ["emoji message at limit+2", { message: repeat("😀", 10_002) }, false],
  ["combining-mark message at the limit", { message: repeat("a\u0301", 10_000) }, true],
  ["combining-mark message over the limit", { message: repeat("a\u0301", 10_002) }, false],
  ["RTL message at the limit", { message: repeat("سلام", 10_000) }, true],
  ["RTL message over the limit", { message: repeat("سلام", 10_004) }, false],
];

describe("contact form rules and POST /api/contact agree", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: "sent-1" }, error: null });
  });

  it.each(cases)("%s", async (_label, overrides, accepted) => {
    const values = { ...base, ...overrides };
    expect(clientAccepts(values)).toBe(accepted);
    expect(await serverStatus(serverBody(values))).toBe(accepted ? 200 : 400);
  });

  it("should refuse a blank message with a company in the form, which the server would send", async () => {
    // The composed body is "Company: Acme\n\n", which the server trims to a non-empty message.
    const values = { ...base, message: "   ", company: "Acme" };
    expect(clientAccepts(values)).toBe(false);
    expect(await serverStatus(serverBody(values))).toBe(200);
  });

  it("should keep any body within the field limits under the 64 KB request cap", () => {
    // JSON escapes a control character as \u00XX: 6 bytes for one code unit, the worst case.
    const worst = serverBody({
      name: "\u0001".repeat(200),
      email: `${"a".repeat(242)}@example.com`,
      company: "",
      message: `M${"\u0001".repeat(9_998)}M`,
    });
    expect(new TextEncoder().encode(JSON.stringify(worst)).byteLength).toBeLessThan(64 * 1024);
  });
});

describe("POST /api/contact without the form", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: "sent-1" }, error: null });
  });

  it.each([
    ["name", { ...serverBody(base), name: "N".repeat(201) }, "Name is too long"],
    ["message", { ...serverBody(base), message: "M".repeat(10_001) }, "Message is too long"],
    [
      "message plus company",
      { ...serverBody(base), message: composeContactMessage("M".repeat(9_990), "Acme") },
      "Message is too long",
    ],
    ["whitespace name", { ...serverBody(base), name: " \r\n " }, "Name is required"],
    ["whitespace message", { ...serverBody(base), message: " \n " }, "Message is required"],
  ])("should still refuse an over-limit or blank %s sent directly", async (_label, body, error) => {
    const res = await POST(
      new Request("https://alipajand.com/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error });
    expect(send).not.toHaveBeenCalled();
  });
});
