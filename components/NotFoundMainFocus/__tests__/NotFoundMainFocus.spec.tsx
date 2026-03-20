import { render } from "@testing-library/react";

import { NotFoundMainFocus } from "components/NotFoundMainFocus/NotFoundMainFocus";

describe("NotFoundMainFocus", () => {
  it("focuses #main-content when present", () => {
    const main = document.createElement("main");
    main.id = "main-content";
    main.tabIndex = -1;
    document.body.appendChild(main);

    render(<NotFoundMainFocus />);

    expect(document.activeElement).toBe(main);

    document.body.removeChild(main);
  });
});
