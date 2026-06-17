import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ContactForm } from "components/Contact/ContactForm";
import { CONTACT_FORM_ERROR_SUMMARY_HEADING, CONTACT_FORM_SUCCESS_MESSAGE } from "data/contactForm";

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
