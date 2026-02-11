import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ContactForm } from "components/Contact/ContactForm";

const originalFetch = global.fetch;

function fillForm(name: string, email: string, message: string) {
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: message } });
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("ContactForm", () => {
  it("renders name, email, message fields and submit button", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("shows validation error when name is empty on submit", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<ContactForm />);
    fillForm("Jane", "bad-email", "Hello");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("shows validation error when message is empty", async () => {
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });
  });

  it("shows success message on successful submit", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    render(<ContactForm />);
    fillForm("Jane", "jane@example.com", "Hello there");
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/Message sent. I'll get back to you soon./i)).toBeInTheDocument();
    });
  });

  it("shows error message when API returns not ok", async () => {
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

  it("shows generic error when API returns not ok without body.error", async () => {
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

  it("shows error message when fetch throws", async () => {
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

  it("shows Sending… while submitting", async () => {
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
