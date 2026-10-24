// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EventIndexPage from "../../../app/pages/events/[eventId]/index.vue";
import render from "../../render";

const { mockNavigateTo } = vi.hoisted(() => ({ mockNavigateTo: vi.fn() }));

mockNuxtImport("useRoute", () => () => ({
  params: { eventId: "event-id" },
}));
mockNuxtImport("navigateTo", () => mockNavigateTo);

describe("event index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([375, 1280])(
    "redirects to the event about page at %ipx wide",
    async (width) => {
      window.innerWidth = width;
      await render(EventIndexPage);

      expect(mockNavigateTo).toHaveBeenCalledWith("/en/events/event-id/about", {
        replace: true,
      });
    }
  );
});
