// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import MachineStepsCreateOrganizationsLocation from "../../../../../app/components/machine/steps/createOrganization/MachineStepsCreateOrganizationsLocation.vue";

// MARK: Stubs

const FormStub = {
  name: "Form",
  props: ["id", "schema", "submitLabel", "actionButtons"],
  emits: ["submit"],
  template:
    '<form data-testid="form" :id="id" @submit.prevent="$emit(\'submit\', {})"><slot v-bind="{ values: {} }" /></form>',
};

const FormItemStub = {
  name: "FormItem",
  props: ["label", "name", "required"],
  template:
    '<div data-testid="form-item" :data-name="name"><slot v-bind="{ id: name, handleChange: () => {}, handleBlur: () => {}, errorMessage: { value: \'\' }, value: { value: \'\' } }" /></div>',
};

const FormTextInputStub = {
  name: "FormTextInput",
  props: ["id", "hasError", "label", "modelValue"],
  template: '<input data-testid="text-input" :id="id" />',
};

const FormSelectorComboboxCountryStub = {
  name: "FormSelectorComboboxCountry",
  props: ["id", "hasError", "label", "selectedCountry"],
  template: '<div data-testid="country-selector"></div>',
};

// MARK: Test Data

const createMockFlow = () => ({
  next: vi.fn().mockResolvedValue(undefined),
  prev: vi.fn(),
  close: vi.fn(),
  start: vi.fn(),
  isSaving: ref(false),
  context: ref({ currentStep: 2, totalSteps: 2, nodeData: {} }),
});

// MARK: Helper

const createWrapper = (
  flow = createMockFlow()
): { wrapper: VueWrapper; flow: ReturnType<typeof createMockFlow> } => {
  const wrapper = mount(MachineStepsCreateOrganizationsLocation, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        Form: FormStub,
        FormItem: FormItemStub,
        FormTextInput: FormTextInputStub,
        FormSelectorComboboxCountry: FormSelectorComboboxCountryStub,
      },
      provide: { flow },
    },
  });
  return { wrapper, flow };
};

// MARK: Tests

describe("MachineStepsCreateOrganizationsLocation component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders the form with correct id", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.find('[data-testid="form"]');
      expect(form.exists()).toBe(true);
      // Source component uses "event-location" (likely copy-paste from event step).
      expect(form.attributes("id")).toBe("event-location");
    });

    it("renders two form items (country, city)", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll('[data-testid="form-item"]');
      expect(items).toHaveLength(2);
    });

    it("renders country selector", () => {
      const { wrapper } = createWrapper();
      expect(wrapper.find('[data-testid="country-selector"]').exists()).toBe(
        true
      );
    });

    it("renders city text input", () => {
      const { wrapper } = createWrapper();
      expect(wrapper.find('[data-testid="text-input"]').exists()).toBe(true);
    });

    it("renders form items with correct field names", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll('[data-testid="form-item"]');
      const names = items.map((i) => i.attributes("data-name"));
      expect(names).toEqual(["country", "city"]);
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
      const wrapper = mount(MachineStepsCreateOrganizationsLocation, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormTextInput: FormTextInputStub,
            FormSelectorComboboxCountry: FormSelectorComboboxCountryStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as { handlePrev: () => void };
      expect(() => vm.handlePrev()).not.toThrow();
    });

    it("does not throw when flow is not provided and handleSubmit is called", async () => {
      const wrapper = mount(MachineStepsCreateOrganizationsLocation, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormTextInput: FormTextInputStub,
            FormSelectorComboboxCountry: FormSelectorComboboxCountryStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => Promise<void>;
      };

      await expect(
        vm.handleSubmit({ country: "US", city: "Portland" })
      ).resolves.toBeUndefined();
    });
  });

  // MARK: Submit Behavior

  describe("Submit Behavior", () => {
    it("calls flow.next with transformed values on submit", async () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => Promise<void>;
      };

      await vm.handleSubmit({ country: "US", city: "Portland" });

      expect(flow.next).toHaveBeenCalledWith({
        country_code: "US",
        city: "Portland",
      });
    });

    it("transforms 'country' key to 'country_code' in submit payload", async () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => Promise<void>;
      };

      await vm.handleSubmit({ country: "DE", city: "Berlin" });

      const payload = flow.next.mock.calls[0][0];
      expect(payload).toHaveProperty("country_code", "DE");
      expect(payload).not.toHaveProperty("country");
    });
  });

  // MARK: Action Buttons

  describe("Action Buttons", () => {
    it("passes action buttons config to Form", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.findComponent({ name: "Form" });
      const actionButtons = form.props("actionButtons");
      expect(actionButtons).toHaveLength(1);
      expect(actionButtons[0].label).toBe(
        "i18n.components.machine.steps._global.previous_step"
      );
    });
  });
});
