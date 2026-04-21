import { render, screen } from "@testing-library/react";

import { ProofStrip } from "components/ProofStrip/ProofStrip";
import { HERO_PROOF_ROW } from "data/site";

describe("ProofStrip", () => {
  it("renders the proof section with stable id and labelled heading", () => {
    render(<ProofStrip />);

    const section = document.getElementById("proof-strip");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", "proof-strip-heading");
    expect(screen.getByRole("heading", { name: /proof at a glance/i })).toHaveAttribute(
      "id",
      "proof-strip-heading"
    );
  });

  it("renders each proof metric from site data", () => {
    render(<ProofStrip />);

    HERO_PROOF_ROW.forEach(({ value, label }) => {
      expect(screen.getByText(value)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("wraps metrics in a description list with reveal hooks", () => {
    const { container } = render(<ProofStrip />);

    expect(container.querySelector("dl")).toBeInTheDocument();
    const metrics = container.querySelectorAll("[data-metric][data-reveal]");
    expect(metrics).toHaveLength(HERO_PROOF_ROW.length);
  });
});
