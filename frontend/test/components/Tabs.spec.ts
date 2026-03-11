// SPDX-License-Identifier: AGPL-3.0-or-later
import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Tabs from "../../app/components/Tabs.vue";

// MARK: Mocks

// Mock useBreakpoint to control the responsive breakpoint flag without a real viewport.
// vi.hoisted ensures mockAboveMedium exists when the hoisted vi.mock factory executes.
// Each call creates an independent ref seeded with mockAboveMedium.value at call time;
// set mockAboveMedium.value before createWrapper(), not after mount.
const mockAboveMedium = vi.hoisted(() => ({ value: true }));

vi.mock("~/composables/generic/useBreakpoint", async () => {
  const { ref: vueRef } = await import("vue");
  return { default: () => vueRef(mockAboveMedium.value) };
});

// MARK: Test Data

const testTabs: TabPage[] = [
  {
    id: 0,
    label: "About",
    iconName: "bi:info-circle",
    routeUrl: "/org/1/about",
    selected: false,
  },
  {
    id: 1,
    label: "Events",
    iconName: "bi:calendar",
    routeUrl: "/org/1/events",
    selected: false,
  },
  { id: 2, label: "Resources", routeUrl: "/org/1/resources", selected: false },
];

// MARK: Helper

const createWrapper = (
  props: { tabs?: TabPage[]; selectedTab?: number } = {}
): VueWrapper =>
  mount(Tabs, {
    props: {
      tabs: testTabs,
      selectedTab: 0,
      ...props,
    },
    global: {
      mocks: {
        $t: (key: string) => key,
        $colorMode: { value: "dark" },
      },
      stubs: {
        TabGroup: {
          props: ["selectedIndex", "manual"],
          emits: ["change"],
          template: `<div class="tab-group-stub" :data-selected-index="selectedIndex"><slot /></div>`,
        },
        TabList: { template: '<div class="tab-list-stub"><slot /></div>' },
        Tab: {
          template: '<div class="tab-stub"><slot /></div>',
        },
        NuxtLink: {
          template: '<a v-bind="$attrs"><slot /></a>',
        },
        Icon: {
          props: ["name", "size"],
          template: '<span class="icon-stub" />',
        },
      },
    },
  });

// MARK: Tests

describe("Tabs component", () => {
  let wrapper: VueWrapper;
  let routerPushSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAboveMedium.value = true;

    // Spy on the router's push method so navigation calls can be asserted.
    const router = useRouter();
    routerPushSpy = vi.fn();
    vi.spyOn(router, "push").mockImplementation(routerPushSpy);

    // Provide $localePath on the nuxt app for i18n locale-prefixed navigation.
    const nuxtApp = useNuxtApp();
    nuxtApp.$localePath = vi.fn(
      (path: string) => `/en${path}`
    ) as typeof nuxtApp.$localePath;
  });

  // MARK: Rendering

  describe("Rendering", () => {
    it("renders all tabs", () => {
      wrapper = createWrapper();
      const tabs = wrapper.findAll(".tab-stub");
      expect(tabs).toHaveLength(3);
    });

    it("displays tab labels", () => {
      wrapper = createWrapper();
      const tabs = wrapper.findAll(".tab-stub");
      expect(tabs[0].text()).toContain("About");
      expect(tabs[1].text()).toContain("Events");
      expect(tabs[2].text()).toContain("Resources");
    });

    it("passes selectedIndex to TabGroup", () => {
      wrapper = createWrapper({ selectedTab: 1 });
      const tabGroup = wrapper.find(".tab-group-stub");
      expect(tabGroup.attributes("data-selected-index")).toBe("1");
    });
  });

  // MARK: Active/Inactive Styling

  describe("Active/Inactive Styling", () => {
    it("applies active classes only to the selected tab", () => {
      wrapper = createWrapper({ selectedTab: 0 });
      const tabStubs = wrapper.findAll(".tab-stub");
      expect(tabStubs[0].html()).toContain("bg-menu-selection");
      expect(tabStubs[0].html()).not.toContain("bg-layer-2");
      expect(tabStubs[1].html()).not.toContain("bg-menu-selection");
      expect(tabStubs[2].html()).not.toContain("bg-menu-selection");
    });

    it("applies inactive classes to non-selected tabs", () => {
      wrapper = createWrapper({ selectedTab: 0 });
      const tabStubs = wrapper.findAll(".tab-stub");
      expect(tabStubs[1].html()).toContain("bg-layer-2");
      expect(tabStubs[2].html()).toContain("bg-layer-2");
    });

    it("applies light-mode text color to selected tab", () => {
      wrapper = mount(Tabs, {
        props: { tabs: testTabs, selectedTab: 0 },
        global: {
          mocks: { $t: (key: string) => key, $colorMode: { value: "light" } },
          stubs: {
            TabGroup: {
              props: ["selectedIndex", "manual"],
              template: `<div><slot /></div>`,
            },
            TabList: { template: "<div><slot /></div>" },
            Tab: { template: '<div class="tab-stub"><slot /></div>' },
            NuxtLink: { template: '<a v-bind="$attrs"><slot /></a>' },
            Icon: { props: ["name", "size"], template: "<span />" },
          },
        },
      });
      const selectedTab = wrapper.findAll(".tab-stub")[0];
      expect(selectedTab.find("p").attributes("style")).toContain("white");
    });

    it("updates active tab when selectedTab changes", () => {
      wrapper = createWrapper({ selectedTab: 2 });
      const tabStubs = wrapper.findAll(".tab-stub");
      expect(tabStubs[2].html()).toContain("bg-menu-selection");
      expect(tabStubs[0].html()).toContain("bg-layer-2");
      expect(tabStubs[1].html()).toContain("bg-layer-2");
    });
  });

  // MARK: Responsive Icon Display

  describe("Responsive Icon Display", () => {
    it("hides icons above medium breakpoint", () => {
      mockAboveMedium.value = true;
      wrapper = createWrapper();
      const icons = wrapper.findAll(".icon-stub");
      expect(icons).toHaveLength(0);
    });

    it("shows icons below medium breakpoint for tabs with iconName", () => {
      mockAboveMedium.value = false;
      wrapper = createWrapper();
      const icons = wrapper.findAll(".icon-stub");
      // Only 2 tabs have iconName (About and Events); Resources has none.
      expect(icons).toHaveLength(2);
    });

    it("does not show icon for tabs without iconName", () => {
      mockAboveMedium.value = false;
      wrapper = createWrapper({ tabs: [testTabs[2]] });
      const icons = wrapper.findAll(".icon-stub");
      expect(icons).toHaveLength(0);
    });
  });

  // MARK: Tab Navigation

  describe("Tab Navigation", () => {
    it("navigates when TabGroup emits change event", async () => {
      wrapper = createWrapper();
      const tabGroup = wrapper.findComponent(".tab-group-stub");
      await tabGroup.vm.$emit("change", 1);
      expect(routerPushSpy).toHaveBeenCalledWith("/en/org/1/events");
    });

    it("navigates with locale prefix", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        changeTab: (index: number) => void;
      };
      vm.changeTab(0);
      expect(routerPushSpy).toHaveBeenCalledWith("/en/org/1/about");
    });

    it("does not navigate when tab has no routeUrl", () => {
      const tabsWithoutRoute: TabPage[] = [
        { id: 0, label: "Empty", routeUrl: "", selected: false },
      ];
      wrapper = createWrapper({ tabs: tabsWithoutRoute });
      const vm = wrapper.vm as unknown as {
        changeTab: (index: number) => void;
      };
      vm.changeTab(0);
      expect(routerPushSpy).not.toHaveBeenCalled();
    });

    it("does not navigate for out-of-bounds index", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm as unknown as {
        changeTab: (index: number) => void;
      };
      vm.changeTab(99);
      expect(routerPushSpy).not.toHaveBeenCalled();
    });
  });
});
