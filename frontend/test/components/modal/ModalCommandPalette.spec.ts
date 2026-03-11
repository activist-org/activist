// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ModalCommandPalette from "../../../app/components/modal/ModalCommandPalette.vue";
import { IconMap } from "../../../shared/types/icon-map";

// Mock vue-router's useRouter so we can intercept router.push calls.
// The component imports useRouter directly from "vue-router", so this module path must be mocked.
const routerPushMock = vi.fn();
vi.mock("vue-router", async (importOriginal) => {
  const original = await importOriginal<typeof import("vue-router")>();
  return {
    ...original,
    useRouter: () => {
      const realRouter = original.useRouter?.() ?? {};
      return { ...realRouter, push: routerPushMock };
    },
  };
});

// MARK: Stubs

const ModalBaseStub = {
  name: "ModalBase",
  props: ["modalName"],
  emits: ["closeModal"],
  template:
    '<div data-testid="modal-base" :data-modal-name="modalName"><slot /></div>',
};

const ComboboxStub = {
  props: ["modelValue"],
  emits: ["update:modelValue", "change"],
  template: '<div data-testid="combobox"><slot /></div>',
};

const ComboboxInputStub = {
  props: ["placeholder"],
  emits: ["change"],
  template:
    '<input data-testid="combobox-input" :placeholder="placeholder" @input="$emit(\'change\', $event)" />',
};

const ComboboxOptionsStub = {
  template: '<div data-testid="combobox-options"><slot /></div>',
};

const ComboboxOptionStub = {
  props: ["value"],
  template:
    '<li data-testid="combobox-option" @click="$emit(\'click\')"><slot v-bind="{ active: false }" /></li>',
};

const IconStub = {
  name: "Icon",
  props: ["name", "size"],
  template: '<span class="icon-stub" :data-icon="name"></span>',
};

// MARK: Test Data

interface Command {
  id: number;
  path: string;
  iconName: string;
  displayName: string;
  action: () => void;
}

const testCommands: Command[] = [
  {
    id: 1,
    path: "organizations",
    iconName: "SEARCH",
    displayName: "Organizations",
    action: vi.fn(),
  },
  {
    id: 2,
    path: "events",
    iconName: "SEARCH",
    displayName: "Events",
    action: vi.fn(),
  },
  {
    id: 3,
    path: "resources",
    iconName: "SEARCH",
    displayName: "Resources",
    action: vi.fn(),
  },
];

// MARK: Helper

const createWrapper = (props: { paletteData?: Command[] } = {}): VueWrapper =>
  mount(ModalCommandPalette, {
    props: {
      paletteData: testCommands,
      ...props,
    },
    global: {
      mocks: {
        $t: (key: string) => key,
      },
      stubs: {
        ModalBase: ModalBaseStub,
        Combobox: ComboboxStub,
        ComboboxInput: ComboboxInputStub,
        ComboboxOptions: ComboboxOptionsStub,
        ComboboxOption: ComboboxOptionStub,
        Icon: IconStub,
      },
      config: {
        globalProperties: { IconMap },
      },
    },
  });

// MARK: Tests

describe("ModalCommandPalette component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders ModalBase with correct modal name", () => {
      const wrapper = createWrapper();
      const modalBase = wrapper.find('[data-testid="modal-base"]');
      expect(modalBase.exists()).toBe(true);
      expect(modalBase.attributes("data-modal-name")).toBe(
        "ModalCommandPalette"
      );
    });

    it("renders the search input", () => {
      const wrapper = createWrapper();
      const input = wrapper.find('[data-testid="combobox-input"]');
      expect(input.exists()).toBe(true);
      expect(input.attributes("placeholder")).toBe("i18n._global.search");
    });

    it("renders search icon", () => {
      const wrapper = createWrapper();
      const icons = wrapper.findAll(".icon-stub");
      expect(icons.length).toBeGreaterThanOrEqual(1);
      expect(icons[0].attributes("data-icon")).toBe("bi:search");
    });
  });

  // MARK: Search Filtering

  describe("Search Filtering", () => {
    it("filters commands based on search term", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        searchTerm: string;
        filteredCommands: Command[];
      };

      vm.searchTerm = "organ";
      await wrapper.vm.$nextTick();

      expect(vm.filteredCommands).toHaveLength(1);
      expect(vm.filteredCommands[0].displayName).toBe("Organizations");
    });

    it("returns all matching commands for partial term", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        searchTerm: string;
        filteredCommands: Command[];
      };

      vm.searchTerm = "e";
      await wrapper.vm.$nextTick();

      // "Events" and "Resources" contain "e"; "Organizations" does not.
      expect(vm.filteredCommands).toHaveLength(2);
    });

    it("returns empty array when no commands match", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        searchTerm: string;
        filteredCommands: Command[];
      };

      vm.searchTerm = "zzz";
      await wrapper.vm.$nextTick();

      expect(vm.filteredCommands).toHaveLength(0);
    });

    it("clears filtered results when search term is emptied", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        searchTerm: string;
        filteredCommands: Command[];
      };

      vm.searchTerm = "event";
      await wrapper.vm.$nextTick();
      expect(vm.filteredCommands.length).toBeGreaterThan(0);

      vm.searchTerm = "";
      await wrapper.vm.$nextTick();
      expect(vm.filteredCommands).toHaveLength(0);
    });

    it("performs case-insensitive search", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        searchTerm: string;
        filteredCommands: Command[];
      };

      vm.searchTerm = "EVENTS";
      await wrapper.vm.$nextTick();

      expect(vm.filteredCommands).toHaveLength(1);
      expect(vm.filteredCommands[0].displayName).toBe("Events");
    });
  });

  // MARK: Navigation

  describe("Navigation", () => {
    it("navigates to command path on handleClick", () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        handleClick: (command: Command) => void;
      };

      vm.handleClick(testCommands[0]);
      expect(routerPushMock).toHaveBeenCalledWith("/organizations");
    });

    it("navigates on handleEnter when a command is selected", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        selectedCommand: Command | null;
        handleEnter: () => void;
      };

      vm.selectedCommand = testCommands[1];
      await wrapper.vm.$nextTick();

      vm.handleEnter();
      expect(routerPushMock).toHaveBeenCalledWith("/events");
    });

    it("does not navigate on handleEnter when no command is selected", () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        selectedCommand: Command | null;
        handleEnter: () => void;
      };

      vm.selectedCommand = null;
      vm.handleEnter();
      expect(routerPushMock).not.toHaveBeenCalled();
    });

    it("navigates on handleCommand when a command is selected", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        selectedCommand: Command | null;
        handleCommand: () => void;
      };

      vm.selectedCommand = testCommands[2];
      await wrapper.vm.$nextTick();

      vm.handleCommand();
      expect(routerPushMock).toHaveBeenCalledWith("/resources");
    });
  });

  // MARK: Close Behavior

  describe("Close Behavior", () => {
    it("clears search term on closeModal event", async () => {
      const wrapper = createWrapper();
      const vm = wrapper.vm as unknown as { searchTerm: string };

      vm.searchTerm = "test";
      await wrapper.vm.$nextTick();

      const modalBase = wrapper.findComponent({ name: "ModalBase" });
      await modalBase.vm.$emit("closeModal");
      await wrapper.vm.$nextTick();

      expect(vm.searchTerm).toBe("");
    });
  });
});
