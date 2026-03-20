import { render, screen } from "@testing-library/react";

import { HireProof } from "components/HireProof/HireProof";
import { HIRE_PROOF_HEADING, HIRE_PROOF_ITEMS } from "data/hireProof";

describe("HireProof", () => {
  it("renders section with id why-hire and heading", () => {
    render(<HireProof />);

    expect(document.getElementById("why-hire")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: new RegExp(HIRE_PROOF_HEADING, "i") })).toBeInTheDocument();
  });

  it("renders a card for each proof item", () => {
    render(<HireProof />);

    HIRE_PROOF_ITEMS.forEach((item) => {
      expect(screen.getByRole("heading", { level: 3, name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.summary)).toBeInTheDocument();
    });
  });
});
