// SPDX-License-Identifier: AGPL-3.0-or-later

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ModalAlert from "../../../app/components/modal/ModalAlert.vue";
import { useModalHandlers } from "../../../app/composables/generic/useModalHandlers";
import { IconMap } from "../../../shared/types/icon-map";

// MARK: Mocks

// Mock the useModalHandlers composable
const mockHandleCloseModal = vi.fn();
vi.mock("../../../app/composables/generic/useModalHandlers", () => ({
  useModalHandlers: vi.fn(() => ({
    handleCloseModal: mockHandleCloseModal,
  })),
}));

// Component stubs for globally registered components
const IconStub = {
  name: "Icon",
  props: ["name", "size", "color"],
  template: '<div data-testid="icon" :data-icon-name="name"></div>',
};

const ModalBaseStub = {
  name: "ModalBase",
  props: ["modalName"],
  template: '<div data-testid="modal-base"><slot /></div>',
};

const BtnActionStub = {
  name: "BtnAction",
  props: ["ariaLabel", "label", "cta", "fontSize"],
  emits: ["click"],
  template:
    '<button :aria-label="ariaLabel" @click="$emit(\'click\')">{{ label }}</button>',
};

type ModalAlertProps = {
  message: string;
  onConfirmation?: () => void;
  confirmBtnLabel?: string;
  name?: string;
};

const createWrapper = (props: Partial<ModalAlertProps> = {}) => {
  const pinia = createPinia();
  setActivePinia(pinia);

  return mount(ModalAlert, {
    props: {
      message: "Test message",
      ...props,
    },
    global: {
      plugins: [pinia],
      stubs: {
        ModalBase: ModalBaseStub,
        Icon: IconStub,
        BtnAction: BtnActionStub,
      },
      mocks: {
        $t: (key: string) => key,
      },
      config: {
        globalProperties: {
          IconMap,
        },
      },
    },
  });
};

describe("ModalAlert component", () => {
  const mockOnConfirmation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("displays warning icon with correct properties", () => {
      const wrapper = createWrapper();
      // Find the Icon component and check it receives the correct name prop
      const iconComponent = wrapper.findComponent({ name: "Icon" });
      expect(iconComponent.exists()).toBe(true);
      expect(iconComponent.props("name")).toBe(IconMap.WARN_OCTAGON);
    });

    it("displays message", () => {
      const wrapper = createWrapper({ message: "Custom message" });
      expect(wrapper.text()).toContain("Custom message");
    });

    it("renders confirm and cancel buttons", () => {
      const wrapper = createWrapper();

      // Check for confirm button with i18n key
      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      expect(confirmButton.exists()).toBe(true);
      expect(confirmButton.text()).toBe("i18n.components.modal_alert.confirm");

      // Check for cancel button with i18n key
      const cancelButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.cancel_action_aria_label"]'
      );
      expect(cancelButton.exists()).toBe(true);
      expect(cancelButton.text()).toBe("i18n.components.modal_alert.cancel");
    });
  });

  describe("Props and Default Values", () => {
    it("uses default modal name when not provided", () => {
      createWrapper();
      expect(vi.mocked(useModalHandlers)).toHaveBeenCalledWith("ModalAlert");
    });

    it("uses custom modal name when provided", () => {
      createWrapper({ name: "CustomModal" });
      expect(vi.mocked(useModalHandlers)).toHaveBeenCalledWith("CustomModal");
    });

    it("uses default confirm button label", () => {
      const wrapper = createWrapper();
      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      expect(confirmButton.text()).toBe("i18n.components.modal_alert.confirm");
    });

    it("uses custom confirm button label", () => {
      const wrapper = createWrapper({
        confirmBtnLabel: "Custom Confirm",
      });
      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      expect(confirmButton.text()).toBe("Custom Confirm");
    });

    it("sets correct button accessibility properties", () => {
      const wrapper = createWrapper();

      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      const cancelButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.cancel_action_aria_label"]'
      );

      expect(confirmButton.attributes("aria-label")).toBe(
        "i18n.components.modal_alert.confirm_action_aria_label"
      );
      expect(cancelButton.attributes("aria-label")).toBe(
        "i18n.components.modal_alert.cancel_action_aria_label"
      );
    });
  });

  describe("Button Interactions", () => {
    it("calls onConfirmation and closes modal on confirm", async () => {
      const wrapper = createWrapper({
        onConfirmation: mockOnConfirmation,
      });

      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      await confirmButton.trigger("click");

      expect(mockOnConfirmation).toHaveBeenCalledTimes(1);
      expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });

    it("closes modal on cancel without calling onConfirmation", async () => {
      const wrapper = createWrapper({
        onConfirmation: mockOnConfirmation,
      });

      const cancelButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.cancel_action_aria_label"]'
      );
      await cancelButton.trigger("click");

      expect(mockOnConfirmation).not.toHaveBeenCalled();
      expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });

    it("works without onConfirmation callback", async () => {
      const wrapper = createWrapper();

      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      await confirmButton.trigger("click");

      expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("ModalBase Integration", () => {
    it("passes correct modal name to ModalBase", () => {
      const wrapper = createWrapper({ name: "TestModal" });
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);
    });

    it("renders content inside ModalBase", () => {
      const wrapper = createWrapper({ message: "Test content" });
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.text()).toContain("Test content");
    });
  });

  describe("Layout and Structure", () => {
    it("has correct semantic structure", () => {
      const wrapper = createWrapper();

      // Check that ModalBase exists
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);

      // Check that Icon component exists
      const iconComponent = wrapper.findComponent({ name: "Icon" });
      expect(iconComponent.exists()).toBe(true);

      // Check that buttons exist
      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      const cancelButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.cancel_action_aria_label"]'
      );
      expect(confirmButton.exists()).toBe(true);
      expect(cancelButton.exists()).toBe(true);

      // Check that the message is displayed
      expect(wrapper.text()).toContain("Test message");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty confirmBtnLabel fallback", () => {
      const wrapper = createWrapper({ confirmBtnLabel: "" });
      const confirmButton = wrapper.find(
        '[aria-label="i18n.components.modal_alert.confirm_action_aria_label"]'
      );
      expect(confirmButton.text()).toBe("i18n.components.modal_alert.confirm");
    });
  });

  describe("Composable Integration", () => {
    it("calls useModalHandlers with correct modal name", () => {
      createWrapper({ name: "TestModal" });
      expect(vi.mocked(useModalHandlers)).toHaveBeenCalledWith("TestModal");
    });

    it("calls useModalHandlers with default name when none provided", () => {
      createWrapper();
      expect(vi.mocked(useModalHandlers)).toHaveBeenCalledWith("ModalAlert");
    });
  });
});
