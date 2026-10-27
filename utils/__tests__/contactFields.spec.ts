/** @jest-environment node */

import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  composeContactMessage,
  contactMessageLength,
  isValidEmail,
  normalizeContactName,
} from "utils/contactFields";
import { isValidEmail as isValidEmailFromResend } from "utils/resend";

describe("contact field limits", () => {
  it("should keep the limits the API has enforced since the field caps were added", () => {
    expect(CONTACT_NAME_MAX_LENGTH).toBe(200);
    expect(CONTACT_MESSAGE_MAX_LENGTH).toBe(10_000);
  });

  it("should share one email check with the Resend helpers", () => {
    expect(isValidEmailFromResend).toBe(isValidEmail);
  });
});

describe("normalizeContactName", () => {
  it.each([
    ["", ""],
    ["   ", ""],
    ["\r\n\t", ""],
    ["  Ada  ", "Ada"],
    ["Ada\r\nLovelace", "Ada Lovelace"],
    ["Ada \r\n Lovelace", "Ada Lovelace"],
    ["Ada\u0000\u007fLovelace", "Ada Lovelace"],
  ])("should normalise %j to %j", (input, expected) => {
    expect(normalizeContactName(input)).toBe(expected);
  });

  it("should never make a name longer", () => {
    const raw = "a\r\n\t b\u0000c   d";
    expect(normalizeContactName(raw).length).toBeLessThanOrEqual(raw.length);
  });
});

describe("composeContactMessage and contactMessageLength", () => {
  it("should send the trimmed message alone when there is no company", () => {
    expect(composeContactMessage("  Hello  ", "   ")).toBe("Hello");
    expect(contactMessageLength("  Hello  ", "   ")).toBe(5);
  });

  it("should add `Company: <company>` and a blank line, 11 characters plus the company", () => {
    expect(composeContactMessage("Hello", " Acme ")).toBe("Company: Acme\n\nHello");
    expect(contactMessageLength("Hello", " Acme ")).toBe("Hello".length + "Acme".length + 11);
  });

  it("should measure what the server trims when the message is blank", () => {
    expect(contactMessageLength("   ", "Acme")).toBe("Company: Acme".length);
  });

  it.each([
    ["emoji (astral, 2 code units)", "😀", 2],
    ["flag (two regional indicators)", "🇨🇦", 4],
    ["family ZWJ sequence", "👨\u200d👩\u200d👧", 8],
    ["letter plus combining acute", "e\u0301", 2],
    ["precomposed é", "é", 1],
    ["Persian (RTL)", "سلام", 4],
    ["Hebrew with RTL mark", "\u200fשלום", 5],
  ])("should count %s in UTF-16 code units like the server", (_label, text, expected) => {
    expect(contactMessageLength(text, "")).toBe(expected);
    expect(contactMessageLength(text, "")).toBe(text.length);
  });
});
