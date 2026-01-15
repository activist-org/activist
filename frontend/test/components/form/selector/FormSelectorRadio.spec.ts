// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormSelectorRadio from "../../../../app/components/form/selector/FormSelectorRadio.vue";
import render from "../../../../test/render";

type Option = {
  value: string | number | boolean | Record<string, unknown> | undefined;
  key: string;
  content: HTMLElement | string;
  aria_label: string;
  label?: string;
  isIcon?: boolean;
  class?: string;
  checkedClass?: string;
};

const OPTIONS: Option[] = [
  {
    key: "daily",
    value: "daily",
    content: "Daily",
    aria_label: "components.form_selector_radio.option_daily",
    label: "Daily",
  },
  {
    key: "weekly",
    value: "weekly",
    content: "Weekly",
    aria_label: "components.form_selector_radio.option_weekly",
    label: "Weekly",
  },
  {
    key: "monthly",
    value: "monthly",
    content: "Monthly",
    aria_label: "components.form_selector_radio.option_monthly",
    label: "Monthly",
  },
];

const ICON_OPTIONS: Option[] = [
  {
    key: "home",
    value: "home",
    content: "bi:house",
    aria_label: "components.form_selector_radio.home",
    isIcon: true,
  },
  {
    key: "settings",
    value: "settings",
    content: "bi:gear",
    aria_label: "components.form_selector_radio.settings",
    isIcon: true,
  },
];
const renderRadio = (
  propsOverride: {
    modelValue?:
      | string
      | number
      | boolean
      | Record<string, unknown>
      | undefined;
    options?: Option[];
    toggleable?: boolean;
  } = {}
) => {
  return render(FormSelectorRadio, {
    props: {
      modelValue: undefined,
      options: OPTIONS,
      toggleable: false,
      ...propsOverride,
    },
  });
};

describe("FormSelectorRadio components", () => {
  // MARK: Logic Testing
  it("renders with props.options AND props.options[i].label set correctly", async () => {
    await renderRadio();
    expect(screen.getByText("Daily")).toBeTruthy();
    expect(screen.getByText("Weekly")).toBeTruthy();
    expect(screen.getByText("Monthly")).toBeTruthy();
  });

  it("renders icon options when props.options[i].isIcon? is true", async () => {
    await renderRadio({ options: ICON_OPTIONS });
    expect(
      screen.getByLabelText("components.form_selector_radio.home")
    ).toBeTruthy();
    expect(
      screen.getByLabelText("components.form_selector_radio.settings")
    ).toBeTruthy();
  });

  it("renders props.option[i].class property with appropriate custom class", async () => {
    const custom: Option[] = [
      {
        key: "test",
        value: "test",
        content: "Test",
        label: "Test",
        aria_label: "components.form_selector_radio.test",
        class: "bg-red-500",
      },
    ];
    await renderRadio({ options: custom });
    const element = screen.getByRole("radio");
    expect(element?.className).toContain("bg-red-500");
  });

  it("renders props.option[i].checkedClass property when checked", async () => {
    const custom: Option[] = [
      {
        key: "test",
        value: "test",
        content: "Test",
        label: "Test",
        aria_label: "components.form_selector_radio.test",
        checkedClass: "bg-blue-500",
      },
    ];
    await renderRadio({ options: custom, modelValue: "test" });
    const element = screen.getByRole("radio");
    expect(element?.className).toContain("bg-blue-500");
  });

  it("renders with props.modelValue and props.option[]<number> set as numbers", async () => {
    const numericOptions: Option[] = [
      {
        key: "one",
        value: 1,
        content: "One",
        aria_label: "components.form_selector_radio.one",
      },
      {
        key: "two",
        value: 2,
        content: "Two",
        aria_label: "components.form_selector_radio.two",
      },
    ];

    await renderRadio({ options: numericOptions, modelValue: 2 });

    const twoOption = screen.getByText("Two").closest("div");
    expect(twoOption?.className).toContain("style-menu-option-cta");
  });

  it("emits update:modelValue event AND changes modelValue successfully", async () => {
    const { container, emitted } = await renderRadio();
    const button = container.querySelector("[name='Daily']");
    expect(button).toBeTruthy();
    await fireEvent.click(button!);
    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"].length).toBeGreaterThan(0);
  });

  it("allows deselecting an option when props.toggleable is true", async () => {
    const { emitted } = await renderRadio({
      modelValue: "daily",
      toggleable: true,
    });
    const dailyButton = screen.getByText("Daily");
    await fireEvent.click(dailyButton);
    const updateEvents = emitted()["update:modelValue"];
    expect(updateEvents).toBeTruthy();
    expect(updateEvents[updateEvents.length - 1]).toEqual([undefined]);
  });

  it("allows selecting a different option when props.toggleable is true", async () => {
    const { emitted } = await renderRadio({
      modelValue: "daily",
      toggleable: true,
    });
    const weeklyButton = screen.getByText("Weekly");
    await fireEvent.click(weeklyButton);
    const updateEvents = emitted()["update:modelValue"];
    expect(updateEvents).toBeTruthy();
    expect(updateEvents[updateEvents.length - 1]).toEqual(["weekly"]);
  });

  // MARK: Styles Testing
  it("applies rounded corners to first and last options only", async () => {
    await renderRadio();
    const daily = screen.getByText("Daily").closest("div");
    const weekly = screen.getByText("Weekly").closest("div");
    const monthly = screen.getByText("Monthly").closest("div");
    expect(daily?.className).toContain("rounded-l-lg");
    expect(monthly?.className).toContain("rounded-r-lg");
    expect(weekly?.className).not.toContain("rounded-l-lg");
    expect(weekly?.className).not.toContain("rounded-r-lg");
  });

  it("applies style-menu-option-cta to selected option", async () => {
    await renderRadio({ modelValue: "weekly" });
    const weeklyOption = screen.getByText("Weekly").closest("div");
    expect(weeklyOption?.className).toContain("style-menu-option-cta");
  });

  it("applies bg-layer-2 to unselected options", async () => {
    await renderRadio({ modelValue: "weekly" });
    const dailyOption = screen.getByText("Daily").closest("div");
    expect(dailyOption?.className).toContain("bg-layer-2");
  });

  // MARK: Accessibility
  it("supports tab navigation properly by focusing one radio element at a time", async () => {
    const { container } = await renderRadio();
    const focusableButtons = container.querySelectorAll('[tabindex="0"]');
    expect(focusableButtons.length).toBe(1);
  });

  it("has aria-label on RadioGroup", async () => {
    await renderRadio();
    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup.getAttribute("aria-label")).toBeTruthy();
  });

  it("contains aria labels for all options", async () => {
    await renderRadio();
    expect(
      screen.getByLabelText("components.form_selector_radio.option_daily")
    ).toBeTruthy();
    expect(
      screen.getByLabelText("components.form_selector_radio.option_weekly")
    ).toBeTruthy();
    expect(
      screen.getByLabelText("components.form_selector_radio.option_monthly")
    ).toBeTruthy();
  });

  // MARK: Edge Cases
  it("renders safely with empty options array", async () => {
    await renderRadio({ options: [] });
    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeTruthy();
  });

  it("handles modelValue that doesn't match any option", async () => {
    await renderRadio({ modelValue: "nonexistent" });
    const daily = screen.getByText("Daily").closest("div");
    expect(daily?.className).not.toContain("style-menu-option-cta");
    expect(daily?.className).toContain("bg-layer-2");
  });
});

/**
 * Findings:
 * - FormSelectorRadio Options don't have to contain a name, their names are
 *  automatically assigned from props.label. If a radio icon has no label, but an icon,
 *  the name property is empty. Is this intentional or a missing feature?
 *
 * - No specific classes for light and dark mode available
 * 
 * - Specific CSS classes are being tested because of the component inserting
 *  specific CSS classes based on the conditions right now. tests *could* fail in future
 *  if CSS classes were to be overhauled in future even if the component works fine
 */
