import { render, screen } from "@testing-library/react";

import { SelectedWorkGallery } from "components/SelectedWorkGallery/SelectedWorkGallery";
import { SELECTED_WORK_ITEMS } from "data/selectedWork";

describe("SelectedWorkGallery", () => {
  it("renders section, heading, description, and all gallery items", () => {
    render(<SelectedWorkGallery />);

    const section = screen.getByRole("region", { name: /selected work/i });
    expect(section).toBeInTheDocument();

    expect(
      screen.getByText(
        /Screenshots and diagrams from real work, UI components, dashboards, and automation flows./i
      )
    ).toBeInTheDocument();

    const list = screen.getByRole("list");
    const items = screen.getAllByRole("listitem");
    expect(list).toBeInTheDocument();
    expect(items).toHaveLength(SELECTED_WORK_ITEMS.length);
  });
});

