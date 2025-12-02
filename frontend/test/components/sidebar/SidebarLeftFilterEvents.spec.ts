// SidebarLeft.spec.ts

// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for SidebarLeft.vue
 */
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, reactive, ref } from "vue";

import SidebarLeft from "../../../app/components/sidebar/left/SidebarLeft.vue";
import SidebarLeftFilter from "../../../app/components/sidebar/left/SidebarLeftFilter.vue";

// --- MOCK DEPENDENCIES REQUIRED BY SidebarLeftFilter.vue ---

// Mock i18n
globalThis.useI18n = () => ({
  t: (key: string) => key,
  te: (key: string) => key.includes("aria_label") || key.includes("_global"), // Simplified te mock
});

// Mock IconMap enum/object
const IconMap = {
  TRASH: "icon-trash",
  LIST_UNORDERED: "icon-list",
  PIN_MAP_FILL: "icon-map",
  CALENDAR_DATE_FILL: "icon-calendar",
};
globalThis.IconMap = IconMap;

// Mock ViewType enum
const ViewType = {
  LIST: "list",
  MAP: "map",
  CALENDAR: "calendar",
};
globalThis.ViewType = ViewType;

// Mock GLOBAL_TOPICS (used by optionsTopics)
const GLOBAL_TOPICS = [
  { label: "topic.tech", topic: "tech" },
  { label: "topic.environment", topic: "env" },
];
globalThis.GLOBAL_TOPICS = GLOBAL_TOPICS;

// Mock Form and FormItem components (stubbed for simplicity, just need them to render tags)
const Form = {
  template: "<div><slot/></div>",
  props: ["schema", "initialValues", "sendOnChange"],
};
const FormItem = {
  template: "<div><slot :id='name' :handleChange='() => {}' :value='{ value: initialValue }' :errorMessage='{ value: null }'/></div>",
  props: ["name", "label", "initialValue"],
};

// Mock other form controls (stubbed)
const FormSelectorRadio = {
  template: "<div class='form-radio-mock'><button v-for='opt in options' :key='opt.key' @click='$emit(\"update:modelValue\", opt.value)'>{{ opt.content }}</button></div>",
  props: ["options", "modelValue", "toggleable"],
};
const FormTextInputSearch = {
  template: "<input type='text' />",
  props: ["modelValue"],
};
const FormSelectorCombobox = {
  template: "<div><slot/></div>",
  props: ["options", "selectedOptions"],
};

// Provide a minimal global auto-import for useState used inside component.
globalThis.useState = function <T>(key: string, init?: () => T) {
  const val = init ? init() : (undefined as unknown as T);
  return ref(val);
};

// --- SHARED MOCKS ---

// Shared mock store object so test and component share same instance.
const mockSidebarStore = reactive({
  collapsed: false,
  collapsedSwitch: false,
  toggleCollapsed: vi.fn(),
  toggleCollapsedSwitch: vi.fn(),
});

vi.mock("~/stores/sidebar", () => ({
  useSidebar: () => mockSidebarStore,
}));

// Mock route utilities and vue-router hooks used by the component.
vi.mock("~/utils/routeUtils", () => ({
  currentRoutePathIncludes: (path: string, routeName: string) => {
    // Return true for 'home' to match default map.
    return routeName.includes(path);
  },
  isCurrentRoutePathSubpageOf: () => false,
}));

// Shared mock router push function
const mockRouterPush = vi.fn();

// Default router mock (no query)
vi.mock("vue-router", () => ({
  useRoute: () => ({ query: {}, path: "/home", name: "home" }),
  useRouter: () => ({
    currentRoute: { value: { name: "home" } },
    push: mockRouterPush,
  }),
}));

describe("SidebarLeft.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    // Reset shared mock store values before each test.
    mockSidebarStore.collapsed = false;
    mockSidebarStore.collapsedSwitch = false;
    mockSidebarStore.toggleCollapsed.mockClear();
    mockSidebarStore.toggleCollapsedSwitch.mockClear();
    mockRouterPush.mockClear();

    wrapper = mount(SidebarLeft, {
      global: {
        // --- FIX: Unstub SidebarLeftFilter to run filter tests ---
        stubs: {
          SidebarLeftHeader: true,
          SidebarLeftMainSectionSelectors: true,
          SidebarLeftContent: true,
          // SidebarLeftFilter: true, // REMOVED
          SidebarLeftFooter: true,
          SearchBar: true,
          Icon: true,
          // Stubs for Form components needed by SidebarLeftFilter
          Form: Form, 
          FormItem: FormItem,
          FormSelectorRadio: FormSelectorRadio,
          FormTextInputSearch: FormTextInputSearch,
          FormSelectorCombobox: FormSelectorCombobox,
        },
        components: {
          SidebarLeftFilter, // REGISTERED
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
      // Ensure the component mounts with DOM so refs/element manipulation works.
      attachTo: document.body,
    });
  });

  // --- EXISTING TESTS ---

  it("renders aside element with navigation role and aria-label from $t", () => {
    const aside = wrapper.find("aside");
    expect(aside.exists()).toBe(true);
    expect(aside.attributes("role")).toBe("navigation");
    expect(aside.attributes("aria-label")).toContain(
      "i18n.components.sidebar_left.sidebar_left_aria_label"
    );
    expect(aside.attributes("tabindex")).toBe("0");
  });

  it("expands on mouseover and collapses on mouseleave (updates store)", async () => {
    // Initialize store as collapsed to test opening.
    mockSidebarStore.collapsed = true;
    mockSidebarStore.collapsedSwitch = false;

    await nextTick();

    const aside = wrapper.find("aside");
    expect(aside.exists()).toBe(true);

    // mouseover: collapseSidebar(false) should set collapsed = false.
    await aside.trigger("mouseover");
    expect(mockSidebarStore.collapsed).toBe(false);

    // mouseleave: collapseSidebar(true) should set collapsed = true.
    await aside.trigger("mouseleave");
    expect(mockSidebarStore.collapsed).toBe(true);
  });

  it("focus and focusout behavior: focus keeps expanded, focusout collapses unless relatedTarget inside wrapper", async () => {
    // Start as collapsed.
    mockSidebarStore.collapsed = true;
    await nextTick();

    const aside = wrapper.find("aside");
    // trigger focus leads to collapseSidebar(false).
    await aside.trigger("focus");
    expect(mockSidebarStore.collapsed).toBe(false);

    // focusout with relatedTarget inside the aside should keep expanded (collapsed=false).
    await aside.trigger("focusout", { relatedTarget: aside.element });
    expect(mockSidebarStore.collapsed).toBe(false);

    // focusout with relatedTarget outside (null) should collapse.
    await aside.trigger("focusout", { relatedTarget: null });
    expect(mockSidebarStore.collapsed).toBe(true);
  });

  it("applies correct width classes depending on collapsed and collapsedSwitch states", async () => {
    const aside = wrapper.find("aside");

    expect(aside.classes()).toContain("w-56");

    // Update reactive store state.
    mockSidebarStore.collapsed = true;
    mockSidebarStore.collapsedSwitch = true;
    await nextTick();

    // Vue now re-renders class list updates.
    const classes = aside.classes().join(" ");
    expect(classes).toMatch(/w-(16|20)/);
  });

  it("content overflow class toggles based on collapsed state", async () => {
    const contentDiv = wrapper
      .findAll("div")
      .find((n) => (n.attributes("class") || "").includes("overflow-x-hidden"));
    expect(contentDiv).toBeTruthy();

    mockSidebarStore.collapsed = false;
    mockSidebarStore.collapsedSwitch = false;
    await nextTick();
    expect(contentDiv!.attributes("class")).toContain("overflow-y-auto");

    mockSidebarStore.collapsed = true;
    mockSidebarStore.collapsedSwitch = true;
    await nextTick();

    // Vue updates and overflow-y-auto disappears.
    expect(contentDiv!.attributes("class")).not.toContain("overflow-y-auto");
  });

  it("detects scrollable content and updates width class when scrollable", async () => {
    const aside = wrapper.find("aside");
    // Ensure expanded state.
    mockSidebarStore.collapsed = false;
    mockSidebarStore.collapsedSwitch = false;
    await nextTick();

    const vmAny = wrapper.vm as any;
    const contentRefEl = vmAny.$refs?.content as HTMLElement | undefined;
    expect(contentRefEl).toBeDefined();

    Object.defineProperty(contentRefEl, "scrollHeight", {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(contentRefEl, "clientHeight", {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(contentRefEl, "scrollTop", {
      value: 10,
      configurable: true,
    });

    window.dispatchEvent(new Event("resize"));

    await new Promise((res) => setTimeout(res, 70));
    await nextTick();

    const classes = aside.classes();
    expect(classes).toContain("w-60");
  });
  
  // --- NEW FILTER TESTS START HERE ---

  // Helper function to re-mock router for this specific test
  const setupMockRouteWithFilters = (query: Record<string, any>) => {
    vi.mock("vue-router", () => ({
      useRoute: () => ({ 
        query: query, 
        path: "/home", 
        name: "home" 
      }),
      useRouter: () => ({
        currentRoute: { value: { name: "home" } },
        push: mockRouterPush,
      }),
    }));
  };

  it("clears filters and updates router on 'Clear Filters' button click", async () => {
    // 1. Setup Mock Route with Filters
    setupMockRouteWithFilters({ location: "TestLocation", type: "learn", view: ViewType.MAP });

    // 2. Re-mount the component to pick up the new route mock.
    wrapper.unmount();
    wrapper = mount(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: true,
          SidebarLeftMainSectionSelectors: true,
          SidebarLeftContent: true,
          SidebarLeftFooter: true,
          SearchBar: true,
          Icon: true,
          Form: Form, FormItem: FormItem, FormSelectorRadio: FormSelectorRadio, FormTextInputSearch: FormTextInputSearch, FormSelectorCombobox: FormSelectorCombobox,
        },
        components: { SidebarLeftFilter },
        mocks: { $t: (key: string) => key },
      },
      attachTo: document.body,
    });
    await nextTick();
    
    // Clear push calls from the watch effect on mount
    mockRouterPush.mockClear(); 

    // 3. Act: Find and Click the Clear Filters button.
    const clearButton = wrapper.find('[data-testid="events-filter-clear"]');
    expect(clearButton.exists()).toBe(true);
    await clearButton.trigger("click");
    await nextTick();

    // 4. Assert: router.push should be called with only the 'view' query.
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith({
      query: {
        view: ViewType.MAP, // The view type should be preserved.
      },
    });

    // 5. Cleanup: Revert router mock to default before exiting the test
    setupMockRouteWithFilters({}); // Revert to empty query
  });

  // Helper function to simulate delay
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  it("toggles filter off when clicked twice with a delay (days filter example)", async () => {
    // Ensure clean state (initial mount with no query, handled by beforeEach/cleanup)
    mockRouterPush.mockClear();

    // 1. Find the FormSelectorRadio options for "days"
    const daysFilterDiv = wrapper.find('[data-testid="events-filter-days"]');
    expect(daysFilterDiv.exists()).toBe(true);
    
    // Find the '7 days' option (second button in the mocked radio group)
    const day7Option = daysFilterDiv.findAll('button')[1]; 
    expect(day7Option.exists()).toBe(true);

    // --- First Click: Select the filter ---
    await day7Option.trigger("click");
    await nextTick();

    // 2. Assert: Push with filter added
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith({
      query: expect.objectContaining({
        days_ahead: "7",
        view: ViewType.MAP,
      }),
    });
    mockRouterPush.mockClear();

    // 3. Wait for 500ms 
    await delay(500); 

    // --- Second Click: Toggle off the filter ---
    await day7Option.trigger("click");
    await nextTick();

    // 4. Assert: Push without the filter
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith({
      query: {
        view: ViewType.MAP, // 'days_ahead' filter should be gone
      },
    });
  });
});