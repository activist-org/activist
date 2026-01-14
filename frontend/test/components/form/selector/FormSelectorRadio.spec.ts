// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

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
  /**
   * TODO:
   * - Logic (props, events, emits)
   * - Styles
   * - Accessibility
   * - Edge Cases
   * - Reference / Documentation
   */

  // MARK: Logic Testing

  /**
   * TODO Logic Testing:
   * emits:
   *   - update:modelValue<modelValue>
   * function:
   *   - onOptionClick: emit update:modelValue event
   */

  it("renders with props.options AND props.options[i].label set correctly", async () => {
    await renderRadio();
    expect(screen.getByText("Daily")).toBeTruthy();
    expect(screen.getByText("Weekly")).toBeTruthy();
    expect(screen.getByText("Monthly")).toBeTruthy();
  });

  it("renders icon options when props.options[i].isIcon? is true", async () => {
    const { container } = await renderRadio({ options: ICON_OPTIONS });
    console.log(container.innerHTML);
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
    await renderRadio({ options: custom, modelValue: 'test' });
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
});

/**
 * Findings:
 * - FormSelectorRadio Options don't have to contain a name, their names are
 *  automatically assigned from props.label. If a radio icon has no label, but an icon,
 *  the name property is empty. Is this intentional or a missing feature?
 *
 */
