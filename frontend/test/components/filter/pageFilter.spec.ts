// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import PageFilter from "../../../app/components/page/PageFilter.vue";
import { createUseDeviceMock } from "../../mocks/composableMocks";

// Explicitly set up useDevice mock using factory (Pattern 1: default behavior).
// Note: The test also provides useDevice via global.provide for component injection,
// but we set up globalThis.useDevice for auto-import compatibility.
globalThis.useDevice = createUseDeviceMock();

describe("PageFilter", () => {
  const minimumProps = {
    sections: [
      {
        title: "Popular Tags",
        tags: [
          { id: 1, name: "Tag 1", selected: false },
          { id: 2, name: "Tag 2", selected: false },
          { id: 3, name: "Tag 3", selected: false },
          { id: 4, name: "Tag 4", selected: false },
        ],
      },
    ],
    tabs: [
      { id: "tab1", name: "Tab 1" },
      { id: "tab2", name: "Tab 2" },
      { id: "tab3", name: "Tab 3" },
    ],
  };

  it("should render", () => {
    // Basic render test with minimum required props.
    render(PageFilter, {
      props: minimumProps,
      global: {
        provide: {
          useDevice: () => ({ isMacOS: false }),
        },
        stubs: {
          Icon: true,
          BtnTag: true,
          TooltipBase: true,
        },
      },
    });

    expect(screen.getByText("Popular Tags")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Filter" })).toBeTruthy();
    expect(screen.getByLabelText("Search to filter")).toBeTruthy();
  });
});
