// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import FormRadioBtn from "../../../../app/components/form/radio/FormRadioBtn.vue";

describe("FormRadioBtn", () => {
  it("renders the label correctly", () => {
    const wrapper = mount(FormRadioBtn, {
      props: {
        label: "My Option",
        value: "option1",
        modelValue: "option2",
        compareBy: "",
      },
    });

    expect(wrapper.text()).toBe("My Option");
  });

  it("is unchecked by default when modelValue does not match", () => {
    const wrapper = mount(FormRadioBtn, {
      props: {
        value: "option1",
        modelValue: "option2",
        compareBy: "",
      },
    });

    const input = wrapper.find("input");
    expect(input.element.checked).toBe(false);

    // Check default unchecked classes
    const container = wrapper.find("div");
    expect(container.classes()).toContain("style-menu-option");
    expect(container.classes()).toContain("bg-layer-2");
  });

  it("is checked when modelValue matches value", () => {
    const wrapper = mount(FormRadioBtn, {
      props: {
        value: "option1",
        modelValue: "option1",
        compareBy: "", // Necessary for primitives
      },
    });

    const input = wrapper.find("input");
    expect(input.element.checked).toBe(true);

    const container = wrapper.find("div");
    expect(container.classes()).toContain("style-menu-option-cta");
  });

  it("emits update:modelValue with the value when clicked", async () => {
    const wrapper = mount(FormRadioBtn, {
      props: {
        value: "new-value",
        modelValue: "old-value",
        compareBy: "",
      },
    });

    const input = wrapper.find("input");
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["new-value"]);
  });

  it("handles object comparison using compareBy prop", () => {
    // Here we DO want the default compareBy="id" behavior
    const optionValue = { id: 123, name: "Test" };
    const modelValue = { id: 123, name: "Test Copy" };

    const wrapper = mount(FormRadioBtn, {
      props: {
        value: optionValue,
        modelValue: modelValue,
        compareBy: "id",
      },
    });

    const input = wrapper.find("input");
    expect(input.element.checked).toBe(true);
    expect(wrapper.find("div").classes()).toContain("style-menu-option-cta");
  });

  it("fails object comparison when compareBy property differs", () => {
    const optionValue = { id: 123, name: "Test" };
    const modelValue = { id: 456, name: "Test" };

    const wrapper = mount(FormRadioBtn, {
      props: {
        value: optionValue,
        modelValue: modelValue,
        compareBy: "id",
      },
    });

    const input = wrapper.find("input");
    expect(input.element.checked).toBe(false);
  });

  it("applies custom color classes when checked and customColor is provided", () => {
    const color = "red-500";
    const wrapper = mount(FormRadioBtn, {
      props: {
        value: "selected",
        modelValue: "selected",
        customColor: color,
        compareBy: "",
      },
    });

    const container = wrapper.find("div");

    expect(container.classes()).not.toContain("style-menu-option-cta");
    expect(container.classes()).toContain(`bg-${color}/60`);
  });
});
