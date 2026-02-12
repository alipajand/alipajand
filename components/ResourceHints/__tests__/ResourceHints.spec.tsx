import { render } from "@testing-library/react";
import { ResourceHints } from "components/ResourceHints/ResourceHints";

describe("ResourceHints", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("should return null", () => {
    const { container } = render(<ResourceHints />);
    expect(container.firstChild).toBeNull();
  });

  it("should add preconnect link for googletagmanager.com", () => {
    render(<ResourceHints />);

    const preconnect = document.head.querySelector('link[rel="preconnect"][href="https://www.googletagmanager.com"]');
    expect(preconnect).toBeInTheDocument();
    expect(preconnect).toHaveAttribute("crossOrigin", "anonymous");
  });

  it("should add dns-prefetch link for googletagmanager.com", () => {
    render(<ResourceHints />);

    const dnsPrefetch = document.head.querySelector('link[rel="dns-prefetch"][href="https://www.googletagmanager.com"]');
    expect(dnsPrefetch).toBeInTheDocument();
  });

  it("should not add duplicate links if they already exist", () => {
    const existingPreconnect = document.createElement("link");
    existingPreconnect.rel = "preconnect";
    existingPreconnect.href = "https://www.googletagmanager.com";
    document.head.appendChild(existingPreconnect);

    render(<ResourceHints />);

    const links = document.head.querySelectorAll('link[rel="preconnect"][href="https://www.googletagmanager.com"]');
    expect(links).toHaveLength(1);
  });

  it("should add both preconnect and dns-prefetch when neither exists", () => {
    render(<ResourceHints />);

    const preconnect = document.head.querySelector('link[rel="preconnect"][href="https://www.googletagmanager.com"]');
    const dnsPrefetch = document.head.querySelector('link[rel="dns-prefetch"][href="https://www.googletagmanager.com"]');

    expect(preconnect).toBeInTheDocument();
    expect(dnsPrefetch).toBeInTheDocument();
  });

  it("should handle multiple renders without duplicates", () => {
    const { rerender } = render(<ResourceHints />);
    rerender(<ResourceHints />);
    rerender(<ResourceHints />);

    const preconnectLinks = document.head.querySelectorAll('link[rel="preconnect"][href="https://www.googletagmanager.com"]');
    const dnsPrefetchLinks = document.head.querySelectorAll('link[rel="dns-prefetch"][href="https://www.googletagmanager.com"]');

    expect(preconnectLinks).toHaveLength(1);
    expect(dnsPrefetchLinks).toHaveLength(1);
  });
});
