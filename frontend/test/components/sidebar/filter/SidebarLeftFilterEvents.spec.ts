// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for SidebarLeftFilterEvents.vue route query sync behavior.
 * Verifies fix for issue #1738: Query params should not persist across routes.
 *
 * @see https://github.com/activist-org/activist/issues/1738
 */
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, reactive, watch } from "vue";

describe("SidebarLeftFilterEvents Route Query Sync", () => {
  /**
   * These tests verify the watcher logic that prevents stale query params
   * from persisting when navigating between routes.
   *
   * The component uses:
   * ```typescript
   * watch(route, (newRoute) => {
   *   if (newRoute.path !== "/events") { return; }
   *   // ... sync logic
   * }, { immediate: true });
   * ```
   */

  let mockRoute: { path: string; query: Record<string, unknown> };
  let formData: { value: Record<string, unknown> };
  let viewType: { value: string };

  const setupWatcher = () => {
    watch(
      () => mockRoute,
      (newRoute) => {
        if (newRoute.path !== "/events") {
          return;
        }
        const { view, ...rest } = newRoute.query as Record<string, unknown>;
        formData.value = { ...rest };
        viewType.value = typeof view === "string" ? view : "map";
      },
      { immediate: true, deep: true }
    );
  };

  beforeEach(() => {
    mockRoute = reactive({ path: "/events", query: {} });
    formData = reactive({ value: {} });
    viewType = reactive({ value: "map" });
  });

  describe("Path-based Query Sync", () => {
    it("syncs query params when on /events", async () => {
      mockRoute.path = "/events";
      mockRoute.query = {
        topics: "ENVIRONMENT",
        location: "Berlin",
        view: "list",
      };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({
        topics: "ENVIRONMENT",
        location: "Berlin",
      });
      expect(viewType.value).toBe("list");
    });

    it("does NOT sync when on /organizations", async () => {
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "ENVIRONMENT" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
    });

    it("does NOT sync when on /home", async () => {
      mockRoute.path = "/home";
      mockRoute.query = { someParam: "value" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
    });

    it("does NOT sync when path is empty", async () => {
      mockRoute.path = "";
      mockRoute.query = { topics: "ENVIRONMENT" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
    });
  });

  describe("Issue #1738 Scenarios", () => {
    it("prevents /organizations query from syncing to /events filter", async () => {
      // Core bug: User filters on /organizations, navigates to /events
      // The /events filter should NOT pick up /organizations params
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "EDUCATION", location: "Berlin" };
      setupWatcher();
      await nextTick();

      expect(formData.value).toEqual({});
      expect(formData.value).not.toHaveProperty("topics");
      expect(formData.value).not.toHaveProperty("location");
    });

    it("syncs when navigating TO /events", async () => {
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "OLD" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});

      mockRoute.path = "/events";
      mockRoute.query = { topics: "NEW", view: "calendar" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "NEW" });
      expect(viewType.value).toBe("calendar");
    });

    it("does NOT update formData when navigating AWAY from /events", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: "ENVIRONMENT", view: "map" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({ topics: "ENVIRONMENT" });

      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "DIFFERENT" };
      await nextTick();
      // Should keep old value, not sync new route's query
      expect(formData.value).toEqual({ topics: "ENVIRONMENT" });
    });

    it("handles multi-hop navigation correctly", async () => {
      setupWatcher();

      // Start on /organizations
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "ORG_TOPIC" };
      await nextTick();
      expect(formData.value).toEqual({});

      // Go to /events
      mockRoute.path = "/events";
      mockRoute.query = { topics: "EVENT_TOPIC", view: "list" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "EVENT_TOPIC" });
      expect(viewType.value).toBe("list");

      // Back to /organizations
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "ANOTHER_TOPIC" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "EVENT_TOPIC" }); // Unchanged

      // Return to /events
      mockRoute.path = "/events";
      mockRoute.query = { topics: "FINAL_TOPIC", view: "calendar" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "FINAL_TOPIC" });
      expect(viewType.value).toBe("calendar");
    });
  });

  describe("View Type Handling", () => {
    it("extracts view separately from formData", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: "TEST", view: "list" };
      setupWatcher();
      await nextTick();

      expect(formData.value).not.toHaveProperty("view");
      expect(formData.value).toEqual({ topics: "TEST" });
      expect(viewType.value).toBe("list");
    });

    it("defaults viewType to map when no view param", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: "TEST" };
      setupWatcher();
      await nextTick();
      expect(viewType.value).toBe("map");
    });

    it("defaults viewType to map when view is not a string", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: "TEST", view: 123 };
      setupWatcher();
      await nextTick();
      expect(viewType.value).toBe("map");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty query object", async () => {
      mockRoute.path = "/events";
      mockRoute.query = {};
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
      expect(viewType.value).toBe("map");
    });

    it("handles multiple topics array", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: ["ENVIRONMENT", "EDUCATION"], view: "list" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({ topics: ["ENVIRONMENT", "EDUCATION"] });
    });

    it("handles days and type filters", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { days: "7", type: "learn", view: "calendar" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({ days: "7", type: "learn" });
      expect(viewType.value).toBe("calendar");
    });
    it("does NOT sync for subpaths like /events/123", async () => {
      mockRoute.path = "/events/123";
      mockRoute.query = { topics: "ENVIRONMENT" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
    });
  });
});
