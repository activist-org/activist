// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import OrgIndexPage from "../../../app/pages/organizations/[orgId]/index.vue";
import render from "../../render";

const { mockNavigateTo } = vi.hoisted(() => ({ mockNavigateTo: vi.fn() }));

mockNuxtImport("useRoute", () => () => ({
  params: { orgId: "org-id" },
}));
mockNuxtImport("navigateTo", () => mockNavigateTo);

describe("organization index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([375, 1280])(
    "redirects to the organization about page at %ipx wide",
    async (width) => {
      window.innerWidth = width;
      await render(OrgIndexPage);

      expect(mockNavigateTo).toHaveBeenCalledWith(
        "/en/organizations/org-id/about",
        { replace: true }
      );
    }
  );
});
