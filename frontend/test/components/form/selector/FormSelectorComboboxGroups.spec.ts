// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import FormSelectorComboboxGroups from "../../../../app/components/form/selector/FormSelectorComboboxGroups.vue";
import { createMockGroup } from "../../../mocks/factories";
import render from "../../../render";

const mockGetMore = vi.fn();

const stubs = {
  FormSelectorCombobox: {
    props: [
      "id",
      "canFetchMore",
      "fetchMore",
      "hasColOptions",
      "label",
      "options",
      "selectedOptions",
    ],
    emits: ["update:selectedOptions"],
    template: `
      <div
        data-testid="form-selector-combobox"
        :data-options="JSON.stringify(options)"
        :data-selected="JSON.stringify(selectedOptions)"
        :data-label="label"
        :data-has-col-options="hasColOptions"
      >
        <button
          data-testid="emit-selection"
          @click="$emit('update:selectedOptions', options.map((o) => o.value))"
        />
      </div>
    `,
  },
};

mockNuxtImport("useGetGroups", () => () => ({
  data: {
    value: [
      createMockGroup({ id: "group-1", name: "Local Chapter" }),
      createMockGroup({ id: "group-2", name: "Youth Wing" }),
    ],
  },
  getMore: mockGetMore,
}));

describe("FormSelectorComboboxGroups", () => {
  it("builds combobox options from the fetched groups", async () => {
    const { container } = await render(FormSelectorComboboxGroups, {
      props: {
        id: "groups-selector",
        selectedGroups: [],
        linkedOrganizations: ["org-1"],
        label: "Groups",
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(JSON.parse(combobox.getAttribute("data-options")!)).toEqual([
      { label: "Local Chapter", id: "group-1", value: "group-1" },
      { label: "Youth Wing", id: "group-2", value: "group-2" },
    ]);
  });

  it("passes the label, hasColOptions, and selectedGroups through", async () => {
    const selectedGroup = createMockGroup({ id: "group-2" });

    const { container } = await render(FormSelectorComboboxGroups, {
      props: {
        id: "groups-selector",
        selectedGroups: [selectedGroup],
        linkedOrganizations: [],
        label: "Groups",
        hasColOptions: false,
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(combobox.getAttribute("data-label")).toBe("Groups");
    expect(combobox.getAttribute("data-has-col-options")).toBe("false");
    expect(JSON.parse(combobox.getAttribute("data-selected")!)).toEqual([
      selectedGroup,
    ]);
  });

  it("defaults selectedOptions to an empty array when selectedGroups is not provided", async () => {
    const { container } = await render(FormSelectorComboboxGroups, {
      props: {
        id: "groups-selector",
        selectedGroups: undefined as never,
        linkedOrganizations: [],
        label: "Groups",
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(combobox.getAttribute("data-selected")).toBe("[]");
  });

  it("emits update:selectedGroups when the combobox selection changes", async () => {
    const { emitted } = await render(FormSelectorComboboxGroups, {
      props: {
        id: "groups-selector",
        selectedGroups: [],
        linkedOrganizations: [],
        label: "Groups",
      },
      global: { stubs },
    });

    await fireEvent.click(screen.getByTestId("emit-selection"));

    expect(emitted()["update:selectedGroups"]).toEqual([
      [["group-1", "group-2"]],
    ]);
  });
});
