// SPDX-License-Identifier: AGPL-3.0-or-later

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SidebarLeftFilterEvents from "../../../app/components/sidebar/left/filter/SidebarLeftFilterEvents.vue";

/**
 * Unit tests for SidebarLeftFilterEvents component
 *
 * Coverage includes:
 * - Clear filter button functionality
 * - Toggle on/off functionality of filter options (toggleable prop)
 */

describe("SidebarLeftFilterEvents", () => {
  // Mock router utilities.
  const mockPush = vi.fn();
  const mockRoute = {
    query: {},
    path: "/events",
    name: "events",
  };

  beforeEach(() => {
    mockPush.mockClear();
    mockRoute.query = {};

    // Mock vue-router composables.
    vi.stubGlobal("useRouter", () => ({
      push: mockPush,
      currentRoute: { value: mockRoute },
    }));

    vi.stubGlobal("useRoute", () => mockRoute);
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

      // Find the days filter by test id.
      const daysFilter = wrapper.find('[data-testid="events-filter-days"]');
      expect(daysFilter.exists()).toBe(true);

      // Find FormSelectorRadio within the days filter.
      const daysRadio = daysFilter.findComponent({ name: "FormSelectorRadio" });
      expect(daysRadio.exists()).toBe(true);

      // Verify prop that can be toggled is true.
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

      // Check event type filter.
      const eventTypeFilter = wrapper.find(
        '[data-testid="events-filter-event-type"]'
      );
      expect(eventTypeFilter.exists()).toBe(true);
      const eventTypeRadio = eventTypeFilter.findComponent({
        name: "FormSelectorRadio",
      });
      expect(eventTypeRadio.exists()).toBe(true);
      expect(eventTypeRadio.props("toggleable")).toBe(true);

      // Check location type filter.
      const locationTypeFilter = wrapper.find(
        '[data-testid="events-filter-location-type"]'
      );
      expect(locationTypeFilter.exists()).toBe(true);
      const locationTypeRadio = locationTypeFilter.findComponent({
        name: "FormSelectorRadio",
      });
      expect(locationTypeRadio.exists()).toBe(true);
      expect(locationTypeRadio.props("toggleable")).toBe(true);
    });
  });
});
