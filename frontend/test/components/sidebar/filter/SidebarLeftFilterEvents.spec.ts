// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for SidebarLeftFilterEvents.vue.
 * Route query sync behavior is tested in test/utils/routeUtils.spec.ts
 * (routeQueryToEventsFilterFormData). Here we verify component integration.
 *
 * @see https://github.com/activist-org/activist/issues/1738
 * @see https://github.com/activist-org/activist/issues/1753
 */
import "../../../../vue-shim.d.ts";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SidebarLeftFilterEvents from "~/components/sidebar/left/filter/SidebarLeftFilterEvents.vue";

import {
  createUseRouteMockWithMutableQuery,
  createUseRouterMock,
} from "../../../mocks/composableMocks";

describe("SidebarLeftFilterEvents Route Query Sync", () => {
  let mockRoute: { path: string; query: Record<string, unknown>; name: string };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute = { path: "/events", query: {}, name: "events" };
    globalThis.useRouter = createUseRouterMock(vi.fn(), { value: mockRoute });
    globalThis.useRoute = createUseRouteMockWithMutableQuery(mockRoute);
  });

  describe("Query to Form Sync", () => {
    it("handles empty query object", async () => {
      mockRoute.query = {};

      const wrapper = mount(SidebarLeftFilterEvents, {
        global: {
          stubs: { Icon: true },
          mocks: { $t: (k: string) => k, $te: () => true },
        },
      });

      await wrapper.vm.$nextTick();

      // Watcher sets topics via normalizeArrayFromURLQuery; empty -> []
      const form = wrapper.findComponent({ name: "Form" });
      expect(form.props("initialValues")).toEqual({ topics: [] });
    });
  });
});
