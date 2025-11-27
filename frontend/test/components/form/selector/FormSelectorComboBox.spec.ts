// frontend/test/components/form/selector/FormSelectorCombobox.spec.ts
import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/vue";
import render from "../../../render";
import FormSelectorCombobox from "../../../app/components/form/selector/FormSelectorCombobox.vue";

const OPTIONS = [
  { id: 1, label: "Option one", value: "one" },
  { id: 2, label: "Option two", value: "two" },
  { id: 3, label: "Another option", value: "three" },
];

const defaultProps = {
  id: "topics",
  label: "Topics",
  options: OPTIONS,
  selectedOptions: [] as unknown[],
  hasColOptions: true,
};

const renderCombobox = (propsOverride: Partial<typeof defaultProps> = {}) => {
  return render(FormSelectorCombobox, {
    props: {
      ...defaultProps,
      ...propsOverride,
    },
  });
};

describe("FormSelectorCombobox", () => {
  // LOGIC TESTING

  it("renders a textbox with the given label as placeholder and no chips when nothing is selected", async () => {
    await renderCombobox();

    // FormTextInput renders an <input role="textbox">
    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
    expect(input.getAttribute("placeholder")).toBe("Topics");

    // No chips should be rendered when selectedOptions is empty
    const chipsList = screen.queryByRole("list");
    expect(chipsList).toBeNull();
    const chip = screen.queryByText("Option one");
    expect(chip).toBeNull();
  });

  it("maps selectedOptions values to chips using the options prop", async () => {
    await renderCombobox({
      selectedOptions: ["one", "two"],
    });

    // Only the labels of selected options should appear as chips
    const chipOne = screen.getByText("Option one");
    const chipTwo = screen.getByText("Option two");

    expect(chipOne).toBeTruthy();
    expect(chipTwo).toBeTruthy();
  });

  it("emits update:selectedOptions when a chip is clicked (option removed)", async () => {
    const { emitted } = await renderCombobox({
      selectedOptions: ["one", "two"],
    });

    // Clicking a chip should call onClick and update the v-model, causing an emit
    const chipOne = screen.getByText("Option one");
    await fireEvent.click(chipOne);

    const updateEvents = emitted()["update:selectedOptions"] as
      | unknown[][]
      | undefined;
    expect(updateEvents).toBeTruthy();

    const lastEvent = updateEvents![updateEvents!.length - 1] as unknown[];
    const lastPayload = lastEvent[0] as string[];
    expect(lastPayload.length).toBe(1);
    expect(lastPayload).toEqual(["two"]);
  });

  it("ignores selectedOptions values that do not exist in options", async () => {
    await renderCombobox({
      selectedOptions: ["one", "missing"],
    });

    // Only the existing option should show as chip
    const existingChip = screen.getByText("Option one");
    expect(existingChip).toBeTruthy();

    const missingChip = screen.queryByText("missing");
    expect(missingChip).toBeNull();
  });

  // STYLE (Tailwind classes / layout behaviour)

  it("uses column layout classes when hasColOptions is true", async () => {
    await renderCombobox({
      selectedOptions: ["one"],
      hasColOptions: true,
    });

    // The chips <ul> is rendered as a flex column with vertical spacing
    const chipsList = screen.getByRole("list") as HTMLElement;
    expect(chipsList).toBeTruthy();

    const className = chipsList.className;
    expect(className).toContain("flex");
    expect(className).toContain("flex-col");
    expect(className).toContain("space-y-2");
  });

  it("uses row layout classes when hasColOptions is false", async () => {
    await renderCombobox({
      selectedOptions: ["one"],
      hasColOptions: false,
    });

    const chipsList = screen.getByRole("list") as HTMLElement;
    expect(chipsList).toBeTruthy();

    const className = chipsList.className;
    expect(className).toContain("flex");
    expect(className).toContain("space-x-1");
    expect(className).not.toContain("flex-col");
  });

  // ACCESSIBILITY (roles and ARIA attributes)

  it("exposes combobox and textbox roles with basic ARIA attributes", async () => {
    await renderCombobox();

    // Headless UI wraps the input in an element with role="combobox"
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeTruthy();

    // It should advertise that it autocompletes from a list
    expect(combobox.getAttribute("aria-autocomplete")).toBe("list");

    // By default the menu should not be expanded
    // (Headless UI sets aria-expanded on the combobox root)
    expect(combobox.getAttribute("aria-expanded")).toBe("false");

    // Inner input should be exposed as textbox
    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();
  });

  // EDGE CASES

  it("renders safely when options is empty", async () => {
    await renderCombobox({
      options: [],
      selectedOptions: [],
    });

    // Still renders an input
    const input = screen.getByRole("textbox");
    expect(input).toBeTruthy();

    // No chips list should be rendered
    const chipsList = screen.queryByRole("list");
    expect(chipsList).toBeNull();
  });
});
