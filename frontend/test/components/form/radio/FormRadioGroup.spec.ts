// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import FormRadioGroup from "../../../../app/components/form/radio/FormRadioGroup.vue";

// Define a stub to isolate the Group logic from the Button logic
const FormRadioBtnStub = {
  name: "FormRadioBtn",
  template:
    '<div class="form-radio-btn-stub" @click="$emit(\'update:modelValue\', value)"></div>',
  props: ["label", "value", "modelValue", "customColor"],
  emits: ["update:modelValue"],
};

describe("FormRadioGroup", () => {
  const defaultOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ];

  it("renders the correct number of radio buttons", () => {
    const wrapper = mount(FormRadioGroup, {
      props: {
        options: defaultOptions,
        modelValue: "opt1",
      },
      global: {
        stubs: {
          FormRadioBtn: FormRadioBtnStub,
        },
      },
    });

    const buttons = wrapper.findAllComponents(FormRadioBtnStub);
    expect(buttons.length).toBe(2);
  });

  it("passes common props (modelValue) down to children", () => {
    const wrapper = mount(FormRadioGroup, {
      props: {
        options: defaultOptions,
        modelValue: "opt2",
      },
      global: {
        stubs: {
          FormRadioBtn: FormRadioBtnStub,
        },
      },
    });

    const buttons = wrapper.findAllComponents(FormRadioBtnStub);

    // Check first button props
    expect(buttons[0].props("modelValue")).toBe("opt2");
    expect(buttons[0].props("value")).toBe("opt1");
    expect(buttons[0].props("label")).toBe("Option 1");
  });

  it("emits update:modelValue when a child component emits it", async () => {
    const wrapper = mount(FormRadioGroup, {
      props: {
        options: defaultOptions,
        modelValue: "opt1",
      },
      global: {
        stubs: {
          FormRadioBtn: FormRadioBtnStub,
        },
      },
    });

    const buttons = wrapper.findAllComponents(FormRadioBtnStub);

    // Simulate the child emitting the update event (the stub has a click listener for this)
    await buttons[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["opt2"]);
  });

  it("applies vertical styling classes when 'vertical' prop is true", () => {
    const wrapper = mount(FormRadioGroup, {
      props: {
        options: defaultOptions,
        vertical: true,
      },
    });

    const container = wrapper.find("div");
    expect(container.classes()).toContain("flex-col");
    expect(container.classes()).toContain("gap-2");
  });

  it("does not apply vertical styling by default", () => {
    const wrapper = mount(FormRadioGroup, {
      props: {
        options: defaultOptions,
        // vertical: false is default
      },
    });

    const container = wrapper.find("div");
    expect(container.classes()).not.toContain("flex-col");
  });

  describe("Custom Color Logic", () => {
    it("passes the group customColor to children if option has none", () => {
      const wrapper = mount(FormRadioGroup, {
        props: {
          options: [{ label: "A", value: "a" }],
          customColor: "blue-500",
        },
        global: { stubs: { FormRadioBtn: FormRadioBtnStub } },
      });

      const button = wrapper.findComponent(FormRadioBtnStub);
      expect(button.props("customColor")).toBe("blue-500");
    });

    it("prioritizes the option's customColor over the group's customColor", () => {
      const wrapper = mount(FormRadioGroup, {
        props: {
          options: [
            { label: "A", value: "a", customColor: "red-500" }, // Override
          ],
          customColor: "blue-500", // Group default
        },
        global: { stubs: { FormRadioBtn: FormRadioBtnStub } },
      });

      const button = wrapper.findComponent(FormRadioBtnStub);
      expect(button.props("customColor")).toBe("red-500");
    });
  });

  describe("Key Generation", () => {
    // This test ensures the template logic for :key works with objects
    it("handles object values correctly", () => {
      const objectOptions = [
        { label: "Obj 1", value: { id: 100, name: "test" } },
        { label: "Obj 2", value: { id: 101, name: "test2" } },
      ];

      const wrapper = mount(FormRadioGroup, {
        props: {
          options: objectOptions,
          modelValue: "", // Type alignment
        },
        global: { stubs: { FormRadioBtn: FormRadioBtnStub } },
      });

      const buttons = wrapper.findAllComponents(FormRadioBtnStub);
      expect(buttons.length).toBe(2);

      // Verify the value passed is the actual object
      expect(buttons[0].props("value")).toEqual({ id: 100, name: "test" });
    });
  });
});
