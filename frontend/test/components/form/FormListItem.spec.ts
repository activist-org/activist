// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { useFieldArray } from "vee-validate";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FormListItem from "../../../app/components/form/FormListItem.vue";
import render from "../../../test/render";

// Setup Spies and mock vee-validate.
const pushMock = vi.fn();
const removeMock = vi.fn();
const swapMock = vi.fn();

vi.mock("vee-validate", () => ({
  useFieldArray: vi.fn(),
}));

// Helper to change mock data dynamically.
const setupMockData = (data) => {
  (useFieldArray as vi.Mock).mockReturnValue({
    fields: data,
    push: pushMock,
    remove: removeMock,
    swap: swapMock,
  });
};

describe("FormListItem Component", () => {
  // MARK: Basic Rendering

  describe("Basic Rendering", () => {
    it("renders with required props", async () => {
      await render(FormListItem, { props: { name: "socialLinks" } });
      const list = screen.getByRole("list");
      expect(list).toBeTruthy();
    });

    it("renders FormLabel if label is provided", async () => {
      await render(FormListItem, {
        props: { name: "socialLinks", label: "Social Links" },
      });
      const label = screen.getByText("Social Links");
      expect(label).toBeTruthy();
    });

    it("does not render FormLabel if no label is provided", async () => {
      await render(FormListItem, { props: { name: "socialLinks" } });
      const label = screen.queryByText("Social Links");
      expect(label).toBeNull();

      const list = screen.getByRole("list");
      expect(list).toBeTruthy();
    });
  });

  // MARK: Data Presentation

  describe("Data Presentation", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      setupMockData([]);
    });

    it("renders the slot and passes fieldArray data down", async () => {
      setupMockData([
        { key: "abc-1", value: "Social Link 1" },
        { key: "abc-2", value: "Social Link 2" },
      ]);

      await render({
        components: { FormListItem },
        template: `
          <FormListItem name="socials" label="Social Links">
            <template #default="{ fields }">
              <li v-for="item in fields" :key="item.key" data-testid="mock-item">
                {{ item.value }}
              </li>
            </template>
          </FormListItem>
        `,
      });

      const items = screen.getAllByTestId("mock-item");
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain("Social Link 1");
      expect(items[1].textContent).toContain("Social Link 2");
    });
  });

  // MARK: Logic

  describe("Logic", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      setupMockData([
        { key: "abc-1", value: "Social Link 1" },
        { key: "abc-2", value: "Social Link 2" },
      ]);
    });

    it("passes push function to the slot", async () => {
      await render({
        components: { FormListItem },
        template: `
          <FormListItem name="socials">
            <template #default="{ push }">
              <button data-testid="add-btn" @click="push('New Social Link')">Add</button>
            </template>
          </FormListItem>
        `,
      });

      await fireEvent.click(screen.getByTestId("add-btn"));

      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith("New Social Link");
    });

    it("passes remove and swap functions to the slot", async () => {
      await render({
        components: { FormListItem },
        template: `
          <FormListItem name="socials">
            <template #default="{ remove, swap }">
              <button data-testid="remove-btn" @click="remove(0)">Remove</button>
              <button data-testid="swap-btn" @click="swap(0, 1)">Swap</button>
            </template>
          </FormListItem>
        `,
      });

      await fireEvent.click(screen.getByTestId("remove-btn"));
      expect(removeMock).toHaveBeenCalledWith(0);

      await fireEvent.click(screen.getByTestId("swap-btn"));
      expect(swapMock).toHaveBeenCalledWith(0, 1);
    });
  });

  // MARK: Styling

  describe("Styling", () => {
    it("renders with base layout classes even when custom classes are added", async () => {
      const customClass = "custom-list-class";
      const { container } = await render(FormListItem, {
        props: { name: "socialLinks", classItem: customClass },
      });

      const componentRoot = container.getElementsByClassName(customClass)[0];

      expect(componentRoot).toBeTruthy();
      expect(componentRoot.classList.contains(customClass)).toBe(true);
      expect(componentRoot.classList.contains("flex")).toBe(true);
      expect(componentRoot.classList.contains("flex-col")).toBe(true);
    });
  });

  // MARK: Accessibility

  describe("Accessibility", () => {
    it("renders a semantic unordered list for screen readers", async () => {
      await render(FormListItem, { props: { name: "a11y-test" } });
      expect(screen.getByRole("list")).toBeTruthy();
    });

    it("renders label when provided for accessibility", async () => {
      await render(FormListItem, {
        props: { name: "a11y-test", label: "A11y Test Label" },
      });
      expect(screen.getByText("A11y Test Label")).toBeTruthy();
    });

    it("renders list items with role='listitem'", async () => {
      setupMockData([
        { key: "item-1", value: "Item 1" },
        { key: "item-2", value: "Item 2" },
      ]);

      await render({
        components: { FormListItem },
        template: `
            <FormListItem name="a11y-list">
                <template #default="{ fields }">
                    <li v-for="item in fields" :key="item.key">
                        {{ item.value }}
                    </li>
                </template>
            </FormListItem>
        `,
      });

      const items = screen.getAllByRole("listitem");
      expect(items.length).toBe(2);
    });

    it("links the label to the input element via the generated ID", async () => {
      await render({
        components: { FormListItem },
        template: `
            <FormListItem name="userEmail" label="User Email">
                <template #default="{ id }">
                    <input :id="id" data-testid="inner-input" />
                </template>
            </FormListItem>
        `,
      });

      const input = screen.getByLabelText("User Email");
      expect(input).toBeTruthy();
      expect(input.getAttribute("id")).toBe("form-list-item-userEmail");
    });

    it("respects custom IDs for label association", async () => {
      const customId = "my-unique-id";

      await render({
        components: { FormListItem },
        template: `
            <FormListItem name="userBio" label="User Bio" id="${customId}">
                <template #default="{ id }">
                    <textarea :id="id"></textarea>
                </template>
            </FormListItem>
        `,
      });

      const input = screen.getByLabelText("User Bio");
      expect(input.getAttribute("id")).toBe(customId);
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      setupMockData([]);
    });

    it("handles empty list gracefully", async () => {
      setupMockData([]);

      await render({
        components: { FormListItem },
        template: `
          <FormListItem name="emptyList">
            <template #default="{ fields }">
              <li v-for="item in fields" :key="item.key" data-testid="mock-item">
                {{ item.value }}
              </li>
            </template>
          </FormListItem>
        `,
      });

      const items = screen.queryAllByTestId("mock-item");
      expect(items.length).toBe(0);
    });

    it("handles large list performance", async () => {
      const largeList = Array.from({ length: 100 }, (_, i) => ({
        key: `abc-${i}`,
        value: `Item ${i}`,
      }));
      setupMockData(largeList);

      await render({
        components: { FormListItem },
        template: `
          <FormListItem name="largeList">
            <template #default="{ fields }">
              <li v-for="item in fields" :key="item.key" data-testid="mock-item">
                {{ item.value }}
              </li>
            </template>
          </FormListItem>
        `,
      });

      const items = screen.queryAllByTestId("mock-item");
      expect(items.length).toBe(100);
    });

    it("does not crash if fields is null or undefined", async () => {
      setupMockData(null);

      await render({
        components: { FormListItem },
        template: `
          <FormListItem name="brokenList">
            <template #default="{ fields }">
              <div v-if="!fields" data-testid="null-indicator">
                Fields are missing
              </div>
            </template>
          </FormListItem>
        `,
      });
      expect(screen.getByTestId("null-indicator")).toBeTruthy();
    });
  });
});
