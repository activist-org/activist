
// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import type { ComponentPublicInstance } from "vue";

import SidebarLeftFilterEvents from "../../../app/components/sidebar/left/filter/SidebarLeftFilterEvents.vue";
import { ViewType } from "../../../shared/types/view-types";

/**
 * Unit tests for SidebarLeftFilterEvents component
 *
 * Coverage includes:
 * - Clear filter button functionality
 * - Toggle on/off functionality of filter options (toggleable prop)
 */

describe("SidebarLeftFilterEvents", () => {
  // Mock router utilities
  const mockPush = vi.fn();
  const mockRoute = {
    query: {},
    path: "/events",
    name: "events",
  };

  beforeEach(() => {
    mockPush.mockClear();
    mockRoute.query = {};

    // Mock vue-router composables
    vi.stubGlobal("useRouter", () => ({
      push: mockPush,
      currentRoute: { value: mockRoute },
    }));

    vi.stubGlobal("useRoute", () => mockRoute);
  });

  describe("Clear Filter Button Functionality", () => {
    it("renders the clear filter button with correct label and icon", () => {
      const wrapper = mount(SidebarLeftFilterEvents, {
        global: {
          stubs: {
            Icon: true,
            Form: true,
            FormItem: true,
            FormSelectorRadio: true,
            FormTextInputSearch: true,
            FormSelectorCombobox: true,
          },
          mocks: {
            $t: (key: string) => {
              if (
                key ===
                "i18n.components.sidebar_left_filter_events.clear_filters_aria_label"
              ) {
                return "Clear filters";
              }
              return key;
            },
            $te: (key: string) =>
              key ===
              "i18n.components.sidebar_left_filter_events.clear_filters_aria_label",
          },
        },
      });

      const clearButton = wrapper.find('[data-testid="events-filter-clear"]');
      expect(clearButton.exists()).toBe(true);
      expect(clearButton.text()).toContain("Clear filters");
      expect(clearButton.attributes("aria-label")).toBe("Clear filters");
      expect(clearButton.attributes("type")).toBe("button");
    });

    it("clicking clear button resets formData and formKey", async () => {
      // Set up route with existing filters
      mockRoute.query = {
        days_ahead: "7",
        type: "action",
        setting: "online",
        location: "New York",
        topics: ["climate", "education"],
        view: ViewType.LIST,
      };

      const wrapper = mount(SidebarLeftFilterEvents, {
        global: {
          stubs: {
            Icon: true,
            Form: true,
            FormItem: true,
            FormSelectorRadio: true,
            FormTextInputSearch: true,
            FormSelectorCombobox: true,
          },
          mocks: {
            $t: (key: string) => key,
            $te: () => true,
          },
        },
      });

      const vm = wrapper.vm as ComponentPublicInstance & {
        formKey: number;
        formData: Record<string, unknown>;
      };
      const initialFormKey = vm.formKey;

      // Trigger the clear button click
      const clearButton = wrapper.find('[data-testid="events-filter-clear"]');
      await clearButton.trigger("click");
      await nextTick();

      // Verify formData was reset to empty object
      expect(vm.formData).toEqual({});

      // Verify formKey was incremented (toggles between 0 and 1)
      expect(vm.formKey).not.toBe(initialFormKey);
    });

    it("clear button click handler invokes router.push indirectly through clearFilters", async () => {
      // Set up route with calendar view and filters
      mockRoute.query = {
        days_ahead: "30",
        type: "learn",
        view: ViewType.CALENDAR,
      };

      const wrapper = mount(SidebarLeftFilterEvents, {
        global: {
          stubs: {
            Icon: true,
            Form: true,
            FormItem: true,
            FormSelectorRadio: true,
            FormTextInputSearch: true,
            FormSelectorCombobox: true,
          },
          mocks: {
            $t: (key: string) => key,
            $te: () => true,
          },
        },
      });

      // Get initial form key value
      const vm = wrapper.vm as ComponentPublicInstance & {
        formKey: number;
        formData: Record<string, unknown>;
      };
      const initialFormKey = vm.formKey;

      // Trigger the clear button click
      const clearButton = wrapper.find('[data-testid="events-filter-clear"]');
      await clearButton.trigger("click");
      await nextTick();

      // Verify side effects of clearFilters being called
      // 1. formData should be reset
      expect(vm.formData).toEqual({});
      // 2. formKey should be different (toggled)
      expect(vm.formKey).not.toBe(initialFormKey);
    });
  });

  describe("Toggle On/Off Functionality of Filter Options", () => {
    it("passes toggleable=true prop to days filter FormSelectorRadio", () => {
      const wrapper = mount(SidebarLeftFilterEvents, {
        global: {
          stubs: {
            Icon: true,
          },
          mocks: {
            $t: (key: string) => key,
            $te: () => true,
          },
        },
      });

      // Find the days filter by test id
      const daysFilter = wrapper.find('[data-testid="events-filter-days"]');
      expect(daysFilter.exists()).toBe(true);

      // Find FormSelectorRadio within the days filter
      const daysRadio = daysFilter.findComponent({ name: "FormSelectorRadio" });
      expect(daysRadio.exists()).toBe(true);

      // Verify toggleable prop is true
      expect(daysRadio.props("toggleable")).toBe(true);
    });

    it("passes toggleable=true prop to event type and location type filters", () => {
      const wrapper = mount(SidebarLeftFilterEvents, {
        global: {
          stubs: {
            Icon: true,
          },
          mocks: {
            $t: (key: string) => key,
            $te: () => true,
          },
        },
      });

      // Check event type filter
      const eventTypeFilter = wrapper.find('[data-testid="events-filter-event-type"]');
      expect(eventTypeFilter.exists()).toBe(true);
      const eventTypeRadio = eventTypeFilter.findComponent({ name: "FormSelectorRadio" });
      expect(eventTypeRadio.exists()).toBe(true);
      expect(eventTypeRadio.props("toggleable")).toBe(true);

      // Check location type filter
      const locationTypeFilter = wrapper.find('[data-testid="events-filter-location-type"]');
      expect(locationTypeFilter.exists()).toBe(true);
      const locationTypeRadio = locationTypeFilter.findComponent({ name: "FormSelectorRadio" });
      expect(locationTypeRadio.exists()).toBe(true);
      expect(locationTypeRadio.props("toggleable")).toBe(true);
    });
  });
});
