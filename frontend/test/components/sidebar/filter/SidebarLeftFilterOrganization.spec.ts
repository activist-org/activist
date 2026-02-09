// SPDX-License-Identifier: AGPL-3.0-or-later
/// <reference path="../../../../vue-shim.d.ts" />
/**
 * Unit tests for SidebarLeftFilterOrganization.vue.
 * Route query sync behavior is tested in test/utils/routeUtils.spec.ts
 * (routeQueryToOrganizationFilterFormData). Here we verify component integration.
 *
 * @see https://github.com/activist-org/activist/issues/1738
 * @see https://github.com/activist-org/activist/issues/1753
 */
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SidebarLeftFilterOrganization from "~/components/sidebar/left/filter/SidebarLeftFilterOrganization.vue";
import {
  createUseRouteMockWithMutableQuery,
  createUseRouterMock,
} from "../../../mocks/composableMocks";

describe("SidebarLeftFilterOrganization Route Query Sync", () => {
  let mockRoute: { path: string; query: Record<string, unknown>; name: string };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute = { path: "/organizations", query: {}, name: "organizations" };
    globalThis.useRouter = createUseRouterMock(vi.fn(), { value: mockRoute });
    globalThis.useRoute = createUseRouteMockWithMutableQuery(mockRoute);
  });

  describe("Query to Form Sync", () => {
    it("handles empty query object", async () => {
      mockRoute.query = {};

      const wrapper = mount(SidebarLeftFilterOrganization, {
        global: {
          stubs: { Icon: true },
          mocks: { $t: (k: string) => k, $te: () => true },
        },
      });

      await wrapper.vm.$nextTick();

      const form = wrapper.findComponent({ name: "Form" });
      expect(form.props("initialValues")).toEqual({});
    });
  });
});
