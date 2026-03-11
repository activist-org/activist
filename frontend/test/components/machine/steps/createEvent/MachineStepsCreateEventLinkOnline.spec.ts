// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MachineStepsCreateEventLinkOnline from "../../../../../app/components/machine/steps/createEvent/MachineStepsCreateEventLinkOnline.vue";
import { createMockFlow } from "../../../../mocks/composableMocks";
import {
  FormItemStub,
  FormStub,
  FormTextInputStub,
} from "../../../../mocks/componentStubs";

// MARK: Helper

const createWrapper = (
  flow = createMockFlow(4, 5)
): { wrapper: VueWrapper; flow: ReturnType<typeof createMockFlow> } => {
  const wrapper = mount(MachineStepsCreateEventLinkOnline, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        Form: FormStub,
        FormItem: FormItemStub,
        FormTextInput: FormTextInputStub,
      },
      provide: { flow },
    },
  });
  return { wrapper, flow };
};

// MARK: Tests

describe("MachineStepsCreateEventLinkOnline component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders the form with correct id", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.find('[data-testid="form"]');
      expect(form.exists()).toBe(true);
      expect(form.attributes("id")).toBe("event-link-online");
    });

    it("renders a single form item for the online link", () => {
      const { wrapper } = createWrapper();
      const items = wrapper.findAll('[data-testid="form-item"]');
      expect(items).toHaveLength(1);
      expect(items[0].attributes("data-name")).toBe("onlineLocationLink");
    });

    it("renders a text input for the URL", () => {
      const { wrapper } = createWrapper();
      expect(wrapper.find('[data-testid="text-input"]').exists()).toBe(true);
    });

    it("uses correct i18n key for the link label", () => {
      const { wrapper } = createWrapper();
      const formItem = wrapper.findComponent({ name: "FormItem" });
      expect(formItem.props("label")).toBe(
        "i18n.components.machine_steps_create_event_link_online.link_to_event"
      );
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

    it("does not throw when flow is not provided", () => {
      const wrapper = mount(MachineStepsCreateEventLinkOnline, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormTextInput: FormTextInputStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as { handlePrev: () => void };
      expect(() => vm.handlePrev()).not.toThrow();
    });
  });

  // MARK: Submit Behavior

  describe("Submit Behavior", () => {
    it("calls flow.next with form values on submit", () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => void;
      };

      vm.handleSubmit({ onlineLocationLink: "https://meet.example.com/event" });

      expect(flow.next).toHaveBeenCalledWith({
        onlineLocationLink: "https://meet.example.com/event",
      });
    });

    it("passes values through without transformation", () => {
      const flow = createMockFlow();
      const { wrapper } = createWrapper(flow);

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => void;
      };

      const values = { onlineLocationLink: "" };
      vm.handleSubmit(values);

      expect(flow.next).toHaveBeenCalledWith(values);
    });

    it("does not throw when flow is not provided and handleSubmit is called", () => {
      const wrapper = mount(MachineStepsCreateEventLinkOnline, {
        global: {
          mocks: { $t: (key: string) => key },
          stubs: {
            Form: FormStub,
            FormItem: FormItemStub,
            FormTextInput: FormTextInputStub,
          },
        },
      });

      const vm = wrapper.vm as unknown as {
        handleSubmit: (values: Record<string, unknown>) => void;
      };

      expect(() =>
        vm.handleSubmit({ onlineLocationLink: "https://example.com" })
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
      expect(actionButtons[0].cta).toBe(false);
    });

    it("passes submit label to Form", () => {
      const { wrapper } = createWrapper();
      const form = wrapper.findComponent({ name: "Form" });
      expect(form.props("submitLabel")).toBe("i18n._global.next_step");
    });
  });
});
