// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FormSelectorComboboxOrganizations from "../../../../app/components/form/selector/FormSelectorComboboxOrganizations.vue";
import { createMockOrganization } from "../../../mocks/factories";
import render from "../../../render";

const mockGetMore = vi.fn();
const mockPending = { value: false };

const stubs = {
  FormSelectorCombobox: {
    props: [
      "id",
      "disabled",
      "canFetchMore",
      "fetchMore",
      "hasColOptions",
      "label",
      "options",
      "selectedOptions",
      "showLoadingSlot",
    ],
    emits: ["update:selectedOptions", "update:filterValue"],
    template: `
      <div
        data-testid="form-selector-combobox"
        :data-options="JSON.stringify(options)"
        :data-selected="JSON.stringify(selectedOptions)"
        :data-label="label"
        :data-disabled="disabled"
        :data-show-loading-slot="showLoadingSlot"
      >
        <button
          data-testid="emit-selection"
          @click="$emit('update:selectedOptions', options.map((o) => o.value))"
        />
        <button
          data-testid="emit-filter"
          @click="$emit('update:filterValue', 'search text')"
        />
      </div>
    `,
  },
};

mockNuxtImport("useGetOrganizationsByUser", () => () => ({
  data: {
    value: [
      createMockOrganization({ id: "org-1", name: "Human Rights Watch" }),
      createMockOrganization({ id: "org-2", name: "Local Advocacy Group" }),
    ],
  },
  getMore: mockGetMore,
  pending: mockPending,
}));

beforeEach(() => {
  mockPending.value = false;
  vi.stubGlobal("useDebounce", () => ({
    debounce: <T extends (...args: unknown[]) => void>(fn: T) => fn,
  }));
});

describe("FormSelectorComboboxOrganizations", () => {
  it("builds combobox options from the fetched organizations", async () => {
    const { container } = await render(FormSelectorComboboxOrganizations, {
      props: {
        id: "orgs-selector",
        selectedOrganizations: [],
        label: "Organizations",
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(JSON.parse(combobox.getAttribute("data-options")!)).toEqual([
      { label: "Human Rights Watch", id: "org-1", value: "org-1" },
      { label: "Local Advocacy Group", id: "org-2", value: "org-2" },
    ]);
  });

  it("passes the label, disabled, and selectedOrganizations through", async () => {
    const selectedOrganization = createMockOrganization({ id: "org-2" });

    const { container } = await render(FormSelectorComboboxOrganizations, {
      props: {
        id: "orgs-selector",
        selectedOrganizations: [selectedOrganization],
        label: "Organizations",
        disabled: true,
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(combobox.getAttribute("data-label")).toBe("Organizations");
    expect(combobox.getAttribute("data-disabled")).toBe("true");
    expect(JSON.parse(combobox.getAttribute("data-selected")!)).toEqual([
      selectedOrganization,
    ]);
  });

  it("defaults selectedOptions to an empty array when selectedOrganizations is not provided", async () => {
    const { container } = await render(FormSelectorComboboxOrganizations, {
      props: {
        id: "orgs-selector",
        selectedOrganizations: undefined as never,
        label: "Organizations",
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(combobox.getAttribute("data-selected")).toBe("[]");
  });

  it("reflects the pending fetch state as showLoadingSlot", async () => {
    mockPending.value = true;

    const { container } = await render(FormSelectorComboboxOrganizations, {
      props: {
        id: "orgs-selector",
        selectedOrganizations: [],
        label: "Organizations",
      },
      global: { stubs },
    });

    const combobox = container.querySelector(
      "[data-testid='form-selector-combobox']"
    )!;
    expect(combobox.getAttribute("data-show-loading-slot")).toBe("true");
  });

  it("emits update:selectedOrganizations when the combobox selection changes", async () => {
    const { emitted } = await render(FormSelectorComboboxOrganizations, {
      props: {
        id: "orgs-selector",
        selectedOrganizations: [],
        label: "Organizations",
      },
      global: { stubs },
    });

    await fireEvent.click(screen.getByTestId("emit-selection"));

    expect(emitted()["update:selectedOrganizations"]).toEqual([
      [["org-1", "org-2"]],
    ]);
  });

  it("does not throw when the filter value changes", async () => {
    await render(FormSelectorComboboxOrganizations, {
      props: {
        id: "orgs-selector",
        selectedOrganizations: [],
        label: "Organizations",
      },
      global: { stubs },
    });

    await expect(
      fireEvent.click(screen.getByTestId("emit-filter"))
    ).resolves.not.toThrow();
  });
});
