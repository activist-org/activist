// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MachineStepsCreateEventType from "../../../../../app/components/machine/steps/createEvent/MachineStepsCreateEventType.vue";
import {
  FormItemStub,
  FormSelectorComboboxTopicsStub,
  FormSelectorRadioStub,
  FormStub,
} from "../../../../mocks/componentStubs";
import { createMockFlow } from "../../../../mocks/composableMocks";

// MARK: Helper

const createWrapper = (
  flow = createMockFlow(2, 5)
): { wrapper: VueWrapper; flow: ReturnType<typeof createMockFlow> } => {
  const wrapper = mount(MachineStepsCreateEventType, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        Form: FormStub,
        FormItem: FormItemStub,
        FormSelectorRadio: FormSelectorRadioStub,
        FormSelectorComboboxTopics: FormSelectorComboboxTopicsStub,
      },
      provide: { flow },
    },
  });
  return { wrapper, flow };
};

// MARK: Tests

describe("MachineStepsCreateEventType component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders the form with correct id", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.find('[data-testid="form"]');
      expect(form.exists()).toBe(true);
      expect(form.attributes("id")).toBe("event-type-and-roles");
    });

    it("renders three form items (setting, type, topics)", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll(".form-item-stub");
      expect(items).toHaveLength(3);
    });

    it("renders all three fields as required", () => {
      const { wrapper } = createWrapper();
      const formItems = wrapper.findAllComponents({ name: "FormItem" });
      expect(formItems).toHaveLength(3);
      formItems.forEach((item) => {
        // Bare `required` attribute passes "" (defined), absence passes undefined.
        expect(item.props("required")).toBeDefined();
      });
    });

    it("renders form items with correct field names", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll(".form-item-stub");
      const names = items.map((i) => i.attributes("data-name"));
      expect(names).toEqual(["setting", "type", "topics"]);
    });

    it("renders two radio selectors (location type and event type)", () => {
      const { wrapper } = createWrapper();
      const radios = wrapper.findAll('[data-testid="radio-selector"]');
      expect(radios).toHaveLength(2);
    });

    it("renders topics combobox selector", () => {
      const { wrapper } = createWrapper();
      expect(wrapper.find('[data-testid="topics-selector"]').exists()).toBe(
        true
      );
    });

    it("includes data-testid attributes on location type and event type items", () => {
      const { wrapper } = createWrapper();
      expect(
        wrapper.find('[data-testid="events-filter-location-type"]').exists()
      ).toBe(true);
      expect(
        wrapper.find('[data-testid="events-filter-event-type"]').exists()
      ).toBe(true);
    });
  });

  // MARK: Radio Options

  describe("Radio Options", () => {
    it("provides location type options to the setting radio selector", () => {
      const { wrapper } = createWrapper();
      const vm = wrapper.vm as unknown as {
        optionLocations: Array<{ value: string; key: string }>;
      };

      expect(vm.optionLocations).toHaveLength(2);
      expect(vm.optionLocations[0].value).toBe("physical");
      expect(vm.optionLocations[1].value).toBe("online");
    });

    it("provides event type options to the type radio selector", () => {
      const { wrapper } = createWrapper();
      const vm = wrapper.vm as unknown as {
        optionEventTypes: Array<{ value: string; key: string }>;
      };

      expect(vm.optionEventTypes).toHaveLength(2);
      expect(vm.optionEventTypes[0].value).toBe("learn");
      expect(vm.optionEventTypes[1].value).toBe("action");
    });
  });

  // MARK: Navigation

  describe("Navigation", () => {
    it("calls flow.prev on handlePrev", () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as { handlePrev: () => void };
      vm.handlePrev();

      expect(flow.prev).toHaveBeenCalledOnce();
    });

    it("does not throw when flow is not provided and handlePrev is called", () => {
      const wrapper = mount(MachineStepsCreateEventType, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormSelectorRadio: FormSelectorRadioStub,
            FormSelectorComboboxTopics: FormSelectorComboboxTopicsStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as { handlePrev: () => void };
      expect(() => vm.handlePrev()).not.toThrow();
    });
  });

  // MARK: Submit Behavior

  describe("Submit Behavior", () => {
    it("calls flow.next with transformed values on submit", () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => void;
      };

      vm.handleSubmit({
        setting: "physical",
        type: "action",
        topics: ["climate", "justice"],
      });

      expect(flow.next).toHaveBeenCalledWith({
        location_type: "physical",
        type: "action",
        topics: ["climate", "justice"],
      });
    });

    it("transforms 'setting' key to 'location_type' in submit payload", () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => void;
      };

      vm.handleSubmit({ setting: "online", type: "learn", topics: [] });

      const payload = flow.next.mock.calls[0][0];
      expect(payload).toHaveProperty("location_type", "online");
      expect(payload).not.toHaveProperty("setting");
    });

    it("does not throw when flow is not provided and handleSubmit is called", () => {
      const wrapper = mount(MachineStepsCreateEventType, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormSelectorRadio: FormSelectorRadioStub,
            FormSelectorComboboxTopics: FormSelectorComboboxTopicsStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => void;
      };

      expect(() =>
        vm.handleSubmit({ setting: "online", type: "learn", topics: [] })
      ).not.toThrow();
    });
  });

  // MARK: Action Buttons

  describe("Action Buttons", () => {
    it("passes previous step button config to Form", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.findComponent({ name: "Form" });
      const actionButtons = form.props("actionButtons");
      expect(actionButtons).toHaveLength(1);
      expect(actionButtons[0].label).toBe(
        "i18n.components.machine.steps._global.previous_step"
      );
    });

    it("passes submit label to Form", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.findComponent({ name: "Form" });
      expect(form.props("submitLabel")).toBe("i18n._global.next_step");
    });
  });
});
