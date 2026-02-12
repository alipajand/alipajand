import React, { act } from "react";
import { fireEvent, render, renderHook, waitFor } from "@testing-library/react";
import { useContactForm } from "components/Contact/hooks/useContactForm";

global.fetch = jest.fn();

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

function ContactFormWithHook() {
  const { actions } = useContactForm();
  return (
    <form onSubmit={actions.handleSubmit} data-testid="contact-form">
      <input {...actions.register("name")} data-testid="name" />
      <input {...actions.register("email")} data-testid="email" type="email" />
      <textarea {...actions.register("message")} data-testid="message" />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("useContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(fetch).mockReset();
  });

  describe("initial state", () => {
    it("should return initial state with idle status", () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.selectors.status).toBe("idle");
      expect(result.current.selectors.errorMessage).toBeNull();
      expect(result.current.selectors.isSubmitting).toBe(false);
      expect(result.current.selectors.formState).toBeDefined();
      expect(result.current.actions.register).toBeDefined();
      expect(result.current.actions.handleSubmit).toBeDefined();
    });

    it("should have default form values", () => {
      const { result } = renderHook(() => useContactForm());

      const formValues = result.current.actions.register("name");
      expect(formValues).toBeDefined();
    });
  });

  describe("form submission", () => {
    it("should set status to loading when submitting", async () => {
      let resolveFetch: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });

      jest.mocked(fetch).mockImplementation(() => fetchPromise as Promise<Response>);

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;

      const submitPromise = handleSubmit({
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
      } as unknown as React.BaseSyntheticEvent);

      await waitFor(() => {
        expect(result.current.selectors.status).toBe("loading");
        expect(result.current.selectors.isSubmitting).toBe(true);
      });

      resolveFetch!({
        ok: true,
        json: async () => ({}),
      } as Response);

      await submitPromise;
    });

    it("should set status to success on successful submission", async () => {
      jest.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;
      await act(async () => {
        await handleSubmit({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.selectors.status).toBe("success");
      expect(result.current.selectors.isSubmitting).toBe(false);
      expect(result.current.selectors.errorMessage).toBeNull();
    });

    it("should trim form values before sending", async () => {
      const fetchMock = jest.mocked(fetch);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const { getByTestId } = render(<ContactFormWithHook />);

      await act(async () => {
        fireEvent.change(getByTestId("name"), { target: { value: "  Test User  " } });
        fireEvent.change(getByTestId("email"), { target: { value: "  test@example.com  " } });
        fireEvent.change(getByTestId("message"), { target: { value: "  Test message  " } });
      });
      await act(async () => {
        fireEvent.submit(getByTestId("contact-form"));
      });

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            message: "Test message",
          }),
        });
      });
    });

    it("should set status to error when API returns error", async () => {
      jest.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "API Error" }),
      } as Response);

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;
      await act(async () => {
        await handleSubmit({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.selectors.status).toBe("error");
      expect(result.current.selectors.errorMessage).toBe("API Error");
      expect(result.current.selectors.isSubmitting).toBe(false);
    });

    it("should set default error message when API error has no error field", async () => {
      jest.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as Response);

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;
      await act(async () => {
        await handleSubmit({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.selectors.status).toBe("error");
      expect(result.current.selectors.errorMessage).toBe("Something went wrong. Please try again.");
    });

    it("should handle fetch errors", async () => {
      jest.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;
      await act(async () => {
        await handleSubmit({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.selectors.status).toBe("error");
      expect(result.current.selectors.errorMessage).toBe(
        "Failed to send. Please try again or email directly."
      );
    });

    it("should handle invalid JSON response", async () => {
      jest.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;
      await act(async () => {
        await handleSubmit({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.selectors.status).toBe("error");
      expect(result.current.selectors.errorMessage).toBe("Something went wrong. Please try again.");
    });

    it("should reset error message when submitting again after error", async () => {
      jest.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "First error" }),
      } as Response);

      const { result } = renderHook(() => useContactForm());

      const handleSubmit = result.current.actions.handleSubmit;
      await act(async () => {
        await handleSubmit({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      expect(result.current.selectors.errorMessage).toBe("First error");

      jest.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await act(async () => {
        await handleSubmit({
          name: "Test User 2",
          email: "test2@example.com",
          message: "Test message 2",
        } as unknown as React.BaseSyntheticEvent);
      });
      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });
      expect(result.current.selectors.errorMessage).toBeNull();
    });
  });
});
