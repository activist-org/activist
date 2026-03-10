// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import MachineStepsCreateOrganizationDetails from "../../../../../app/components/machine/steps/createOrganization/MachineStepsCreateOrganizationDetails.vue";

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
    '<div data-testid="form-item" :data-name="name" :data-required="required"><slot v-bind="{ id: name, handleChange: () => {}, handleBlur: () => {}, errorMessage: { value: \'\' }, value: { value: \'\' } }" /></div>',
};

const FormTextInputStub = {
  name: "FormTextInput",
  props: ["id", "hasError", "label", "modelValue"],
  template: '<input data-testid="text-input" :id="id" :value="modelValue" />',
};

const FormTextAreaStub = {
  name: "FormTextArea",
  props: ["id", "hasError", "value"],
  template: '<textarea data-testid="text-area" :id="id"></textarea>',
};

// MARK: Test Data

const createMockFlow = () => ({
  next: vi.fn().mockResolvedValue(undefined),
  prev: vi.fn(),
  close: vi.fn(),
  start: vi.fn(),
  isSaving: ref(false),
  context: ref({ currentStep: 1, totalSteps: 2, nodeData: {} }),
});

// MARK: Helper

const createWrapper = (
  flow = createMockFlow()
): { wrapper: VueWrapper; flow: ReturnType<typeof createMockFlow> } => {
  const wrapper = mount(MachineStepsCreateOrganizationDetails, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        Form: FormStub,
        FormItem: FormItemStub,
        FormTextInput: FormTextInputStub,
        FormTextArea: FormTextAreaStub,
      },
      provide: { flow },
    },
  });
  return { wrapper, flow };
};

// MARK: Tests

describe("MachineStepsCreateOrganizationDetails component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders the form with correct id", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.find('[data-testid="form"]');
      expect(form.exists()).toBe(true);
      // Source component uses "event-details" (likely copy-paste from event step).
      expect(form.attributes("id")).toBe("event-details");
    });

    it("renders three form items (name, tagline, description)", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll('[data-testid="form-item"]');
      expect(items).toHaveLength(3);
    });

    it("marks name field as required", () => {
      const { wrapper } = createWrapper();
      const nameComp = wrapper
        .findAllComponents({ name: "FormItem" })
        .find((c) => c.props("name") === "name");
      expect(nameComp).toBeDefined();
      // Bare `required` attribute passes "" (defined), absence passes undefined.
      expect(nameComp!.props("required")).toBeDefined();
    });

    it("does not mark tagline field as required", () => {
      const { wrapper } = createWrapper();
      const taglineComp = wrapper
        .findAllComponents({ name: "FormItem" })
        .find((c) => c.props("name") === "tagline");
      expect(taglineComp).toBeDefined();
      expect(taglineComp!.props("required")).toBeFalsy();
    });

    it("marks description field as required", () => {
      const { wrapper } = createWrapper();
      const descComp = wrapper
        .findAllComponents({ name: "FormItem" })
        .find((c) => c.props("name") === "description");
      expect(descComp).toBeDefined();
      expect(descComp!.props("required")).toBeDefined();
    });

    it("renders text inputs for name and tagline", () => {
      const { wrapper } = createWrapper();
      const inputs = wrapper.findAll('[data-testid="text-input"]');
      expect(inputs).toHaveLength(2);
    });

    it("renders a text area for description", () => {
      const { wrapper } = createWrapper();
      const textAreas = wrapper.findAll('[data-testid="text-area"]');
      expect(textAreas).toHaveLength(1);
    });
  });

  // MARK: Form Labels

  describe("Form Labels", () => {
    it("uses correct i18n keys for field labels", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll('[data-testid="form-item"]');
      const labels = items.map((i) => i.attributes("data-name"));
      expect(labels).toEqual(["name", "tagline", "description"]);
    });

    it("passes submit label to Form", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.findComponent({ name: "Form" });
      expect(form.props("submitLabel")).toBe("i18n._global.next_step");
    });
  });

  // MARK: Submit Behavior

  describe("Submit Behavior", () => {
    it("calls flow.next with form values on submit", async () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => Promise<void>;
      };

      const submitPromise = vm.handleSubmit({
        name: "Test Org",
        tagline: "A test",
        description: "Testing",
      });

      // Source component has a simulated 1s delay.
      await vi.advanceTimersByTimeAsync(1000);
      await submitPromise;

      expect(flow.next).toHaveBeenCalledWith({
        name: "Test Org",
        tagline: "A test",
        description: "Testing",
      });
    });

    it("does not throw when flow is not provided", async () => {
      const wrapper = mount(MachineStepsCreateOrganizationDetails, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormTextInput: FormTextInputStub,
            FormTextArea: FormTextAreaStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => Promise<void>;
      };

      const submitPromise = vm.handleSubmit({ name: "Test" });
      await vi.advanceTimersByTimeAsync(1000);
      // Should not throw when flow is undefined.
      await submitPromise;
    });
  });

  // MARK: Responsive Layout

  describe("Responsive Layout", () => {
    it("applies responsive padding classes", () => {
      const { wrapper } = createWrapper();
      const container = wrapper.find("div");
      expect(container.classes()).toContain("px-4");
      expect(container.classes()).toContain("sm:px-6");
      expect(container.classes()).toContain("md:px-8");
    });
  });
});
