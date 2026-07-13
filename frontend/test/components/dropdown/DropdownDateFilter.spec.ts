// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import DropdownDateFilter from "../../../app/components/dropdown/DropdownDateFilter.vue";
import render from "../../render";

describe("DropdownDateFilter", () => {
  it("defaults to the 'Last 30 days' filter", async () => {
    await render(DropdownDateFilter);

    expect(screen.getByText("Last 30 days")).toBeTruthy();
  });

  it("shows all filter options when opened", async () => {
    await render(DropdownDateFilter);

    await fireEvent.click(screen.getByRole("button"));

    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeTruthy();
    const options = screen.getAllByRole("option");
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      "Last week",
      "Last 30 days",
      "Last 60 days",
      "Last year",
    ]);
  });

  it("switches the selected filter when a different option is chosen", async () => {
    await render(DropdownDateFilter);

    await fireEvent.click(screen.getByRole("button"));
    await fireEvent.click(screen.getByRole("option", { name: "Last year" }));

    expect(screen.getByText("Last year")).toBeTruthy();
    expect(screen.queryByText("Last 30 days")).toBeNull();
  });
});
