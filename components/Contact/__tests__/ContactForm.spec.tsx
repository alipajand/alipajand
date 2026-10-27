import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ContactForm } from "components/Contact/ContactForm";
import {
  CONTACT_FORM_ERROR_GENERIC,
  CONTACT_FORM_ERROR_SUMMARY_HEADING,
  CONTACT_FORM_SUCCESS_MESSAGE,
  CONTACT_VALIDATION_EMAIL_REQUIRED,
  CONTACT_VALIDATION_MESSAGE_REQUIRED,
  CONTACT_VALIDATION_MESSAGE_TOO_LONG,
  CONTACT_VALIDATION_MESSAGE_WITH_COMPANY_TOO_LONG,
  CONTACT_VALIDATION_NAME_REQUIRED,
  CONTACT_VALIDATION_NAME_TOO_LONG,
} from "data/contactForm";

const originalFetch = global.fetch;
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("An update to") &&
      args[0].includes("was not wrapped in act")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

const fillForm = (name: string, email: string, message: string) => {
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: message } });
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("ContactForm", () => {
  it("should render name, email, message fields and submit button", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("should show validation error when name is empty on submit", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getAllByText("Enter your name").length).toBeGreaterThan(0);
    });
    expect(screen.getByText(CONTACT_FORM_ERROR_SUMMARY_HEADING)).toBeInTheDocument();
  });

  it("should show validation error for invalid email", async () => {
    render(<ContactForm />);
    fillForm("Jane", "bad-email", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getAllByText("Use a valid email address").length).toBeGreaterThan(0);
    });
  });

  it("should focus the validation summary when submit fails client-side validation", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(CONTACT_FORM_ERROR_SUMMARY_HEADING)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.activeElement).toHaveTextContent(CONTACT_FORM_ERROR_SUMMARY_HEADING);
    });
  });

  it("should move focus to the field when an error summary link is followed", async () => {
    render(<ContactForm />);
    fillForm("Jane", "bad-email", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    const summaryLink = await screen.findByRole("link", { name: "Use a valid email address" });
    expect(summaryLink).toHaveAttribute("href", "#contact-email");
    fireEvent.click(summaryLink);
    expect(document.activeElement).toBe(screen.getByLabelText(/email/i));
  });

  it("should show validation error when message is empty", async () => {
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getAllByText("Add a short message").length).toBeGreaterThan(0);
    });
  });

  it("should succes message on successful submit for shows", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello there");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(CONTACT_FORM_SUCCESS_MESSAGE)).toBeInTheDocument();
    });
  });

  it("should show error message when API returns not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Server error" }),
    });
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("should show generic error when API returns not ok without body.error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong. Please try again./i)).toBeInTheDocument();
    });
  });

  it("should show error message when fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to send. Please try again or email directly./i)
      ).toBeInTheDocument();
    });
  });

  it("should show Sending… while submitting", async () => {
    let resolve: () => void;
    const promise = new Promise<void>((r) => {
      resolve = r;
    });
    (global.fetch as jest.Mock).mockReturnValue(promise);
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sending/i })).toBeInTheDocument();
    });
    resolve!();
  });
});

describe("ContactForm limits shared with the API", () => {
  const submit = () => fireEvent.click(screen.getByRole("button", { name: /send message/i }));
  const company = () => screen.getByLabelText(/company/i);
  const count = () => document.getElementById("contact-message-count")!;
  const okResponse = () =>
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

  const expectBlocked = async (message: string) => {
    submit();
    await waitFor(() => {
      expect(screen.getAllByText(message).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(CONTACT_FORM_ERROR_SUMMARY_HEADING)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  };

  const expectSent = async () => {
    submit();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    return JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
  };

  it("should refuse a whitespace-only name, message or email before sending", async () => {
    render(<ContactForm />);
    fillForm("   ", " \t ", "  \n  ");
    await expectBlocked(CONTACT_VALIDATION_NAME_REQUIRED);
    expect(screen.getAllByText(CONTACT_VALIDATION_EMAIL_REQUIRED).length).toBeGreaterThan(0);
    expect(screen.getAllByText(CONTACT_VALIDATION_MESSAGE_REQUIRED).length).toBeGreaterThan(0);
  });

  it("should refuse a blank message even when a company is filled in", async () => {
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "   ");
    fireEvent.change(company(), { target: { value: "Acme" } });
    await expectBlocked(CONTACT_VALIDATION_MESSAGE_REQUIRED);
  });

  it("should send a 200-character name and refuse 201", async () => {
    okResponse();
    render(<ContactForm />);
    fillForm("N".repeat(200), "jane@example.com", "Hello");
    expect((await expectSent()).name).toHaveLength(200);

    (global.fetch as jest.Mock).mockClear();
    fillForm("N".repeat(201), "jane@example.com", "Hello");
    await expectBlocked(CONTACT_VALIDATION_NAME_TOO_LONG);
    expect(screen.getByRole("link", { name: CONTACT_VALIDATION_NAME_TOO_LONG })).toHaveAttribute(
      "href",
      "#contact-name"
    );
  });

  it("should collapse CR/LF and tabs in the name before counting it, as the server does", async () => {
    okResponse();
    render(<ContactForm />);
    // Text inputs drop CR/LF themselves; the tabs remain and collapse to one space: 200 characters.
    fillForm(`${"N".repeat(100)}\t\r\n\t${"N".repeat(99)}`, "jane@example.com", "Hello");
    const { name } = await expectSent();
    expect(name.length).toBeGreaterThan(200);
    expect(name.replace(/[\s]+/g, " ")).toHaveLength(200);
  });

  it("should send a 10,000-character message and refuse 10,001", async () => {
    okResponse();
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "M".repeat(10_000));
    expect(count()).toHaveTextContent("10,000 / 10,000 characters");
    expect(count()).not.toHaveAttribute("data-over");
    expect((await expectSent()).message).toHaveLength(10_000);

    (global.fetch as jest.Mock).mockClear();
    fillForm("Jane", "jane@example.com", "M".repeat(10_001));
    expect(count()).toHaveTextContent("10,001 / 10,000 characters");
    expect(count()).toHaveAttribute("data-over");
    await expectBlocked(CONTACT_VALIDATION_MESSAGE_TOO_LONG);
  });

  it("should count the company line against the message limit", async () => {
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "M".repeat(9_990));
    fireEvent.change(company(), { target: { value: "Acme" } });
    // "Company: Acme\n\n" adds 15 characters.
    expect(count()).toHaveTextContent("10,005 / 10,000 characters, including company");
    await expectBlocked(CONTACT_VALIDATION_MESSAGE_WITH_COMPANY_TOO_LONG);

    fireEvent.change(company(), { target: { value: "" } });
    await waitFor(() => {
      expect(screen.queryByText(CONTACT_VALIDATION_MESSAGE_WITH_COMPANY_TOO_LONG)).toBeNull();
    });
    expect(count()).toHaveTextContent("9,990 / 10,000 characters");
  });

  it("should re-check a message that was already checked when the company pushes it over", async () => {
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "M".repeat(9_990));
    fireEvent.blur(screen.getByLabelText(/message/i));
    fireEvent.change(company(), { target: { value: "Acme" } });
    await waitFor(() => {
      expect(document.getElementById("contact-message-error")).toHaveTextContent(
        CONTACT_VALIDATION_MESSAGE_WITH_COMPANY_TOO_LONG
      );
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([
    ["emoji", "😀", 5_000, 5_001],
    ["combining marks", "é", 5_000, 5_001],
    ["RTL text", "سلام", 2_500, 2_501],
  ])("should count %s in UTF-16 code units like the server", async (_label, unit, fits, over) => {
    okResponse();
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", unit.repeat(fits));
    expect(count()).toHaveTextContent("10,000 / 10,000 characters");
    await expectSent();

    (global.fetch as jest.Mock).mockClear();
    fillForm("Jane", "jane@example.com", unit.repeat(over));
    expect(count()).toHaveAttribute("data-over");
    await expectBlocked(CONTACT_VALIDATION_MESSAGE_TOO_LONG);
  });

  it("should describe the message field with its hint and count, and the error when there is one", async () => {
    render(<ContactForm />);
    const message = screen.getByLabelText(/message/i);
    expect(message).toHaveAttribute(
      "aria-describedby",
      "contact-message-hint contact-message-count"
    );
    expect(count()).toHaveTextContent("0 / 10,000 characters");
    expect(count()).not.toHaveAttribute("aria-live");
    expect(count()).not.toHaveAttribute("role");

    submit();
    await waitFor(() => {
      expect(message).toHaveAttribute(
        "aria-describedby",
        "contact-message-hint contact-message-count contact-message-error"
      );
    });
  });

  it("should show the generic message, not the server's wording, for a 400", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Message is too long" }),
    });
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello");
    submit();
    await waitFor(() => {
      expect(screen.getByText(CONTACT_FORM_ERROR_GENERIC)).toBeInTheDocument();
    });
    expect(screen.queryByText("Message is too long")).toBeNull();
  });
});
