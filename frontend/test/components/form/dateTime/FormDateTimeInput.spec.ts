// SPDX-License-Identifier: AGPL-3.0-or-later

import { mount } from "@vue/test-utils";
import { DatePicker } from "v-calendar";
import { describe, it, expect, vi, beforeEach } from "vitest";

import FormDateTimeInput from "../../../../app/components/form/dateTime/FormDateTimeInput.vue";
import { createUseColorModeSpy } from "../../../mocks/composableMocks";

globalThis.useColorMode = createUseColorModeSpy("dark", "dark");

// Mock Icon component.
vi.mock("#components", () => ({
  Icon: {
    name: "Icon",
    template: "<span />",
  },
}));

describe("FormDateTimeInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders DatePicker component", () => {
    const wrapper = mount(FormDateTimeInput);
    expect(wrapper.findComponent(DatePicker).exists()).toBe(true);
  });

  it("passes light color mode to DatePicker when preference is light", () => {
    globalThis.useColorMode = createUseColorModeSpy("light", "light");
    vi.mocked(useColorMode).mockReturnValue({
      preference: "light",
    });
    const wrapper = mount(FormDateTimeInput);
    const datePicker = wrapper.findComponent(DatePicker);
    expect(datePicker.props("color")).toBe("light");
  });

  it("passes dark color mode to DatePicker when preference is not light", async () => {
    globalThis.useColorMode = createUseColorModeSpy("dark", "dark");
    vi.mocked(useColorMode).mockReturnValue({
      preference: "dark",
    });

    const wrapper = mount(FormDateTimeInput);
    const datePicker = wrapper.findComponent(DatePicker);
    expect(datePicker.props("color")).toBe("dark");
  });

  it("sets is-range prop on DatePicker", () => {
    const wrapper = mount(FormDateTimeInput);
    const datePicker = wrapper.findComponent(DatePicker);
    expect(datePicker.props("isRange")).toBe(true);
  });

  it("initializes range with default dates", () => {
    const wrapper = mount(FormDateTimeInput);
    const { vm } = wrapper;
    expect(vm.range.start).toEqual(new Date(2020, 9, 12));
    expect(vm.range.end).toEqual(new Date(2020, 9, 16));
  });

  it("renders two FormTextInput components in template slot", () => {
    const wrapper = mount(FormDateTimeInput, {
      global: {
        stubs: {
          FormTextInput: {
            name: "FormTextInput",
            template: '<input type="text" />',
            props: ["value"],
          },
        },
      },
    });

    const inputs = wrapper.findAll("input");
    expect(inputs.length).toBe(2);
  });

  it("renders arrow icon between inputs", () => {
    const wrapper = mount(FormDateTimeInput, {
      global: {
        stubs: {
          FormTextInput: {
            name: "FormTextInput",
            template: '<input type="text" />',
          },
          Icon: {
            name: "Icon",
            template: '<span class="icon-arrow" />',
            props: ["name", "size"],
          },
        },
      },
    });

    const icon = wrapper.find(".icon-arrow");
    expect(icon.exists()).toBe(true);
  });

  it("passes inputEvents.start to first FormTextInput", () => {
    const startEvents = { input: vi.fn(), change: vi.fn() };
    const wrapper = mount(FormDateTimeInput, {
      global: {
        stubs: {
          DatePicker: {
            name: "DatePicker",
            template: `
              <div>
                <slot
                  :inputValue="{ start: '', end: '' }"
                  :inputEvents="{ start: $attrs.startEvents, end: {} }"
                />
              </div>
            `,
            props: ["startEvents"],
          },
          FormTextInput: {
            name: "FormTextInput",
            template: "<input />",
            emits: ["input"],
          },
          Icon: {
            name: "Icon",
            template: "<span />",
          },
        },
        attrs: {
          startEvents,
        },
      },
    });

    const inputs = wrapper.findAllComponents({ name: "FormTextInput" });
    expect(inputs.length).toBe(2);
  });

  it("passes inputEvents.end to second FormTextInput", () => {
    const endEvents = { input: vi.fn(), change: vi.fn() };
    const wrapper = mount(FormDateTimeInput, {
      global: {
        stubs: {
          DatePicker: {
            name: "DatePicker",
            template: `
              <div>
                <slot
                  :inputValue="{ start: '', end: '' }"
                  :inputEvents="{ start: {}, end: $attrs.endEvents }"
                />
              </div>
            `,
            props: ["endEvents"],
          },
          FormTextInput: {
            name: "FormTextInput",
            template: "<input />",
            emits: ["input"],
          },
          Icon: {
            name: "Icon",
            template: "<span />",
          },
        },
        attrs: {
          endEvents,
        },
      },
    });

    const inputs = wrapper.findAllComponents({ name: "FormTextInput" });
    expect(inputs.length).toBe(2);
  });
});
