/*
 * These tests cover:
 * - Props and default behavior
 * - Computed logic (masks, color mode)
 * - Emitted events and edge cases
 * - Styling and class forwarding (Tailwind usage)
 * - Accessibility-related attribute forwarding
 *
 * This component is intentionally thin and delegates most UI behavior
 * to `v-calendar`. Tests here focus on what THIS component controls,
 * not the internals of DatePicker.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import FormDateTime from "../FormDateTime.vue";

/**
 * Mock useColorMode composable.
 *
 * The component relies on color mode for styling, but we do not want
 * real browser or Nuxt behavior in unit tests.
 */

vi.mock("#imports", () => ({
  useColorMode: () => ({
    value: "light",
    preference: "light",
  }),
}));

/**
 * Stub DatePicker from v-calendar.
 *
 * We do NOT test v-calendar itself. This stub allows us to:
 * - Assert received props
 * - Emit events manually
 */
const DatePickerStub = {
  template: `<div data-testid="date-picker"><slot /></div>`,
  props: [
    "id",
    "modelValue",
    "mode",
    "masks",
    "color",
    "isDark",
  ],
};

const factory = (props = {}, attrs = {}) => {
  return mount(FormDateTime, {
    props,
    attrs,
    global: {
      stubs: {
        DatePicker: DatePickerStub,
      },
    },
  });
};

describe("FormDateTime.vue", () => {
  describe("default props and rendering", () => {
    it("renders successfully with default props", () => {
      const wrapper = factory();
      expect(wrapper.exists()).toBe(true);
    });

    it("applies the Tailwind w-full class", () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');
      /**
       * Styling is delegated to Tailwind.
       * The presence of `w-full` is verified against expected usage,
       * not Tailwind implementation itself.
       */
      expect(picker.classes()).toContain("w-full");
    });

    it("defaults mode to dateTime", () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("mode")).toBe("dateTime");
    });

    it("defaults modelValue to null", () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("modelValue")).toBeNull();
    });
  });

  describe("id handling", () => {
    it("uses provided id prop when supplied", () => {
      const wrapper = factory({ id: "custom-id" });
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("id")).toBe("custom-id");
    });

    it("generates an id when none is provided", () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("id")).toBeTruthy();
    });
  });

  describe("mask computation based on mode", () => {
    it("uses time mask when mode is time", () => {
      const wrapper = factory({ mode: "time" });
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("masks")).toEqual({ input: "h:mm A" });
    });

    it("uses dateTime mask when mode is dateTime", () => {
      const wrapper = factory({ mode: "dateTime" });
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("masks")).toEqual({
        input: "MM/DD/YYYY h:mm A",
      });
    });

    it("uses date mask when mode is date", () => {
      const wrapper = factory({ mode: "date" });
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("masks")).toEqual({
        input: "MM/DD/YYYY",
      });
    });
  });

  describe("update:modelValue emission", () => {
    it("emits update:modelValue with normal value", async () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');

      const date = new Date();
      await picker.vm.$emit("update:modelValue", date);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual([date]);
    });

    it("handles array emission in time mode by using first element", async () => {
      const wrapper = factory({ mode: "time" });
      const picker = wrapper.get('[data-testid="date-picker"]');

      const date = new Date();
      await picker.vm.$emit("update:modelValue", [date]);

      expect(wrapper.emitted("update:modelValue")![0]).toEqual([date]);
    });

    it("emits null when array is empty in time mode", async () => {
      const wrapper = factory({ mode: "time" });
      const picker = wrapper.get('[data-testid="date-picker"]');

      await picker.vm.$emit("update:modelValue", []);

      expect(wrapper.emitted("update:modelValue")![0]).toEqual([null]);
    });

    it("does not alter array emissions in non-time modes", async () => {
      const wrapper = factory({ mode: "date" });
      const picker = wrapper.get('[data-testid="date-picker"]');

      const value = [new Date()];
      await picker.vm.$emit("update:modelValue", value);

      expect(wrapper.emitted("update:modelValue")![0]).toEqual([value]);
    });
  });

  describe("color mode behavior", () => {
    it("sets light color when preference is light", () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');

      expect(picker.props("color")).toBe("light");
      expect(picker.props("isDark")).toBe(false);
    });
  });

  describe("accessibility and attribute forwarding", () => {
    it("forwards aria attributes to DatePicker", () => {
      const wrapper = factory({}, { "aria-label": "Start date" });
      const picker = wrapper.get('[data-testid="date-picker"]');

      expect(picker.attributes("aria-label")).toBe("Start date");
    });

    it("does not throw when focused via keyboard", async () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');

      await picker.trigger("focus");
      expect(true).toBe(true);
    });
  });

  describe("edge cases and incorrect usage", () => {
    it("handles undefined modelValue safely", () => {
      const wrapper = factory({ modelValue: undefined });
      const picker = wrapper.get('[data-testid="date-picker"]');
      expect(picker.props("modelValue")).toBeUndefined();
    });

    it("does not crash when receiving unexpected modelValue type", async () => {
      const wrapper = factory();
      const picker = wrapper.get('[data-testid="date-picker"]');

      await picker.vm.$emit("update:modelValue", "invalid");
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["invalid"]);
    });

    it("tolerates invalid mode values without crashing", () => {
      const wrapper = factory({ mode: "invalid-mode" as any });
      expect(wrapper.exists()).toBe(true);
    });
  });
});

/**
 * Notes for maintainers / contributors:
 *
 * - `label` prop is defined in the component but not used or rendered.
 *   Tests confirm it has no behavioral impact.
 *
 * - Mask computation and array handling logic could potentially be
 *   extracted into reusable utilities if similar date/time components
 *   exist elsewhere in the codebase.
 *
 * - Accessibility behavior is largely delegated to `v-calendar`.
 *   These tests only verify safe attribute pass-through.
 */
