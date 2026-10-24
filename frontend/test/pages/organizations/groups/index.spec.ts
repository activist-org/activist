// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GroupIndexPage from "../../../../app/pages/organizations/[orgId]/groups/[groupId]/index.vue";
import render from "../../../render";

const { mockNavigateTo } = vi.hoisted(() => ({ mockNavigateTo: vi.fn() }));

mockNuxtImport("useRoute", () => () => ({
  params: { orgId: "org-id", groupId: "group-id" },
}));
mockNuxtImport("navigateTo", () => mockNavigateTo);

describe("organization group index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([375, 1280])(
    "redirects to the group about page at %ipx wide",
    async (width) => {
      window.innerWidth = width;
      await render(GroupIndexPage);

      expect(mockNavigateTo).toHaveBeenCalledWith(
        "/en/organizations/org-id/groups/group-id/about",
        { replace: true }
      );
    }
  );
});
