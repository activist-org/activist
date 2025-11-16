// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";
import type { RouteLocationNormalized } from "vue-router";

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";

import ModalBase from "../../../app/components/modal/ModalBase.vue";
import { useModals } from "../../../app/stores/modals";
// MARK: Mock composables & state

const mockRoute = ref<Partial<RouteLocationNormalized>>({
  path: "/test",
  fullPath: "/test",
  params: {},
  query: {},
  hash: "",
  matched: [],
  meta: {},
});

vi.mock("vue-router", () => ({ useRoute: () => mockRoute }));

// MARK: Stubs & Helper

const dialogStubConfig = {
  props: ["open"],
  template: `<div class="dialog-stub" :data-open="open"><slot /></div>`,
};

interface ModalProps {
  modalName: string;
  imageModal?: boolean;
  [key: string]: unknown;
}

const createWrapper = (props: Partial<ModalProps> = {}, slots = {}) =>
  mount(ModalBase, {
    props: { modalName: "testModal", ...props },
    slots,
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        Dialog: dialogStubConfig,
        DialogPanel: { template: '<div v-bind="$attrs"><slot /></div>' },
        DialogBackdrop: { template: '<div class="backdrop-stub"></div>' },
        Icon: { template: '<span class="icon-stub"></span>' },
      },
    },
    attachTo: document.body,
  });

// MARK: Reusable Assertions

const assertCloseButton = (wrapper: VueWrapper) => {
  const button = wrapper.find('[data-testid="modal-close-button"]');
  expect(button.exists()).toBe(true);
  expect(button.attributes("aria-label")).toBe(
    "i18n.components.modal_base.close_modal_aria_label"
  );
  expect(button.attributes("role")).toBe("button");
};

// MARK: Tests

describe("ModalBase component", () => {
  let wrapper: VueWrapper;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a fresh Pinia instance for each test.
    pinia = createPinia();
    setActivePinia(pinia);

    // Initialize the modal store.
    const modalsStore = useModals();
    modalsStore.modals.testModal = { isOpen: false };

    // Reset route.
    mockRoute.value.path = "/test";
    mockRoute.value.fullPath = "/test";
  });

  // MARK: Accessibility

  describe("Accessibility - ARIA Attributes", () => {
    it("sets role and tabindex on image modal content", () => {
      wrapper = createWrapper({ imageModal: true });
      const content = wrapper.find('[role="button"][tabindex="0"]');
      expect(content.exists()).toBe(true);
      expect(content.attributes("aria-label")).toBe(
        "i18n.components.modal_base.close_modal_aria_label"
      );
    });

    it("does not set tabindex on standard modal content", () => {
      wrapper = createWrapper({ imageModal: false });
      const interactiveContent = wrapper.find('[role="button"][tabindex="0"]');
      expect(interactiveContent.exists()).toBe(false);
    });
  });

  // MARK: Rendering & Close Button

  describe("Rendering & Close Button", () => {
    it("renders modal with correct data-testid", () => {
      wrapper = createWrapper();
      expect(wrapper.find('[data-testid="modal-testModal"]').exists()).toBe(
        true
      );
    });

    it("renders slot content", () => {
      wrapper = createWrapper(
        {},
        { default: '<div class="test-content">Modal Content</div>' }
      );
      expect(wrapper.find(".test-content").text()).toBe("Modal Content");
    });

    it("renders close button correctly", () => {
      wrapper = createWrapper();
      assertCloseButton(wrapper);
    });
  });

  // MARK: Dynamic Classes & Variants

  describe.each([
    {
      imageModal: false,
      expectedPanel: ["container", "bg-layer-0"],
      closeBtnClasses: ["absolute", "right-0"],
    },
    {
      imageModal: true,
      expectedPanel: ["flex", "flex-col"],
      closeBtnClasses: ["absolute", "right-0", "mr-24", "mt-8"],
    },
  ])("Modal Variants", ({ imageModal, expectedPanel, closeBtnClasses }) => {
    it(`applies correct classes when imageModal=${imageModal}`, () => {
      wrapper = createWrapper({ imageModal });
      const panel = wrapper.find('[data-testid="modal-testModal"]');
      expectedPanel.forEach((c) => expect(panel.classes()).toContain(c));
      const closeButton = wrapper.find('[data-testid="modal-close-button"]');
      closeBtnClasses.forEach((c) =>
        expect(closeButton.classes()).toContain(c)
      );
    });
  });

  // MARK: Modal State Management

  describe("Modal State Management", () => {
    it("starts closed", () => {
      wrapper = createWrapper();
      const dialog = wrapper.find(".dialog-stub");
      expect(dialog.attributes("data-open")).toBe("false");
    });

    it("reacts to modal open state changes", async () => {
      const modalsStore = useModals();

      // Ensure modal starts closed.
      modalsStore.modals.testModal = { isOpen: false };
      wrapper = createWrapper();
      await nextTick();

      // Initial state should be closed.
      expect(wrapper.find(".dialog-stub").attributes("data-open")).toBe(
        "false"
      );

      // Open the modal using the store action.
      modalsStore.openModal("testModal");
      await nextTick();

      // Check the dialog is now open.
      expect(wrapper.find(".dialog-stub").attributes("data-open")).toBe("true");

      // Close the modal using the store action.
      modalsStore.closeModal("testModal");
      await nextTick();

      expect(wrapper.find(".dialog-stub").attributes("data-open")).toBe(
        "false"
      );
    });
  });

  // MARK: Close Functionality

  describe("Close Modal Functionality", () => {
    beforeEach(() => {
      const modalsStore = useModals();
      modalsStore.modals.testModal = { isOpen: true };
    });

    const triggerClose = async (wrapper: VueWrapper, selector: string) => {
      await wrapper.find(selector).trigger("click");
      expect(wrapper.emitted("closeModal")).toBeTruthy();
    };

    it("emits event on close method", async () => {
      wrapper = createWrapper();
      // Access the closeModal method through the component instance.
      const vm = wrapper.vm as unknown as { closeModal: () => void };
      vm.closeModal();
      await nextTick();
      expect(wrapper.emitted("closeModal")).toHaveLength(1);
    });

    it("closes modal on close button click", async () => {
      wrapper = createWrapper();
      await triggerClose(wrapper, '[data-testid="modal-close-button"]');
    });

    it("closes modal on backdrop click", async () => {
      wrapper = createWrapper();
      await triggerClose(wrapper, ".cursor-pointer");
    });

    it("closes modal on Enter key", async () => {
      wrapper = createWrapper();
      await wrapper.find(".cursor-pointer").trigger("keydown.enter");
      expect(wrapper.emitted("closeModal")).toBeTruthy();
    });

    it("closes modal when image modal body clicked", async () => {
      wrapper = createWrapper({ imageModal: true });
      await triggerClose(wrapper, '[role="button"][tabindex="0"]');
    });
  });

  // MARK: Visual & Responsive Styling

  describe("Visual & Responsive Styling", () => {
    it("includes dark mode backdrop classes", () => {
      wrapper = createWrapper();
      expect(wrapper.html()).toContain("dark:bg-layer-0/95");
    });

    it("applies card styling for standard modal", () => {
      wrapper = createWrapper({ imageModal: false });
      expect(
        wrapper.find('[data-testid="modal-testModal"]').classes()
      ).toContain("card-style-base");
    });

    it("applies hover/focus classes to close button", () => {
      wrapper = createWrapper();
      expect(
        wrapper.find('[data-testid="modal-close-button"]').classes()
      ).toContain("hover:text-primary-text");
    });

    it("applies fixed positioning with overflow for image modal", () => {
      wrapper = createWrapper({ imageModal: true });
      const backdrop = wrapper.find(".cursor-pointer");
      ["fixed", "top-0", "overflow-hidden", "h-screen"].forEach((c) =>
        expect(backdrop.classes()).toContain(c)
      );
    });

    it("applies standard modal responsive classes", () => {
      wrapper = createWrapper({ imageModal: false });
      const panel = wrapper.find('[data-testid="modal-testModal"]');
      ["max-w-4xl", "overflow-y-auto", "h-full"].forEach((c) =>
        expect(panel.classes()).toContain(c)
      );
      expect(panel.html()).toContain("md:h-auto");
    });
  });
});
