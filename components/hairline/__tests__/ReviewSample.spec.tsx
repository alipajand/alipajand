import { fireEvent, render, screen, within } from "@testing-library/react";

import { ReviewSample } from "components/hairline/ReviewSample/ReviewSample";
import { getProjectBySlug } from "utils/projects";

const sample = getProjectBySlug("ledgerguard")!.caseStudy.reviewSample!;

const totals = () => {
  const [counted, pending] = screen.getAllByRole("definition");
  return { counted: counted.textContent, pending: pending.textContent };
};

const pane = (name: RegExp) => screen.getByRole("region", { name });

describe("ReviewSample", () => {
  it("should count only contracts whose commitment is confirmed", () => {
    render(<ReviewSample {...sample} />);
    expect(totals()).toEqual({ counted: "USD 184,000", pending: "USD 158,400" });
  });

  it("should open on the first contract with a term left to confirm", () => {
    render(<ReviewSample {...sample} />);
    expect(
      within(pane(/^Contracts$/)).getByRole("button", { name: /Corvid Security/ })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Confirm annual commitment" })).toBeVisible();
  });

  it("should show the clause a term came from when the term is selected", () => {
    render(<ReviewSample {...sample} />);
    fireEvent.click(
      within(pane(/^Contracts$/)).getByRole("button", { name: /Halcyon Freight Systems/ })
    );
    fireEvent.click(
      within(pane(/^Extracted terms/)).getByRole("button", { name: /Notice period/ })
    );
    const source = pane(/^Source · § 12\.2 · page 5$/);
    expect(within(source).getByText("at least thirty (30) days").tagName).toBe("MARK");
  });

  it("should move a commitment into the total once it is confirmed, and reset", () => {
    render(<ReviewSample {...sample} />);
    fireEvent.click(within(pane(/^Contracts$/)).getByRole("button", { name: /Corvid Security/ }));
    expect(
      within(pane(/^Extracted terms/)).getByRole("button", { name: /Annual commitment/ })
    ).toHaveAttribute("aria-pressed", "true");

    const confirm = screen.getByRole("button", { name: "Confirm annual commitment" });
    fireEvent.click(confirm);
    expect(totals()).toEqual({ counted: "USD 246,400", pending: "USD 96,000" });
    expect(confirm).toHaveAccessibleName("✓ Confirmed");
    expect(confirm).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(confirm);
    expect(totals()).toEqual({ counted: "USD 246,400", pending: "USD 96,000" });

    fireEvent.click(screen.getByRole("button", { name: "Reset sample" }));
    expect(totals()).toEqual({ counted: "USD 184,000", pending: "USD 158,400" });
  });

  it("should label every term's status in text, not only by mark", () => {
    render(<ReviewSample {...sample} />);
    fireEvent.click(
      within(pane(/^Contracts$/)).getByRole("button", { name: /Brightwave Analytics/ })
    );
    const terms = within(pane(/^Extracted terms/)).getAllByRole("button");
    expect(terms).toHaveLength(3);
    for (const term of terms) expect(term).toHaveTextContent(/Suggested$/);
  });
});
