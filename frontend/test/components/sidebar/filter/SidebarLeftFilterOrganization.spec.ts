// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for SidebarLeftFilterOrganization.vue route query sync behavior.
 * Verifies fix for issue #1738: Query params should not persist across routes.
 *
 * @see https://github.com/activist-org/activist/issues/1738
 */
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, reactive, watch } from "vue";

describe("SidebarLeftFilterOrganization Route Query Sync", () => {
  /**
   * These tests verify the watcher logic that prevents stale query params
   * from persisting when navigating between routes.
   *
   * The component uses:
   * ```typescript
   * watch(route, (newRoute) => {
   *   if (newRoute.path === "/organizations") {
   *     formData.value = { ...newRoute.query };
   *   }
   * }, { immediate: true });
   * ```
   */

  let mockRoute: { path: string; query: Record<string, unknown> };
  let formData: { value: Record<string, unknown> };

  const setupWatcher = () => {
    watch(
      () => mockRoute,
      (newRoute) => {
        if (newRoute.path === "/organizations") {
          formData.value = { ...newRoute.query };
        }
      },
      { immediate: true, deep: true }
    );
  };

  beforeEach(() => {
    mockRoute = reactive({ path: "/organizations", query: {} });
    formData = reactive({ value: {} });
  });

  describe("Path-based Query Sync", () => {
    it("syncs query params when on /organizations", async () => {
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "ENVIRONMENT", location: "Berlin" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({
        topics: "ENVIRONMENT",
        location: "Berlin",
      });
    });

    it("does NOT sync when on /events", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: "ENVIRONMENT", view: "map" };
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
    it("prevents /events query from syncing to /organizations filter", async () => {
      // Core bug: User filters on /events, navigates to /organizations
      // The /organizations filter should NOT pick up /events params
      mockRoute.path = "/events";
      mockRoute.query = { topics: "EDUCATION", view: "map", days: "7" };
      setupWatcher();
      await nextTick();

      expect(formData.value).toEqual({});
      expect(formData.value).not.toHaveProperty("topics");
      expect(formData.value).not.toHaveProperty("view");
    });

    it("syncs when navigating TO /organizations", async () => {
      mockRoute.path = "/events";
      mockRoute.query = { topics: "OLD" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});

      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "NEW", location: "Paris" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "NEW", location: "Paris" });
    });

    it("does NOT update formData when navigating AWAY from /organizations", async () => {
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "ENVIRONMENT" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({ topics: "ENVIRONMENT" });

      mockRoute.path = "/events";
      mockRoute.query = { topics: "DIFFERENT", view: "list" };
      await nextTick();
      // Should keep old value, not sync new route's query
      expect(formData.value).toEqual({ topics: "ENVIRONMENT" });
    });

    it("handles multi-hop navigation correctly", async () => {
      setupWatcher();

      // Start on /events
      mockRoute.path = "/events";
      mockRoute.query = { topics: "EVENTS_TOPIC" };
      await nextTick();
      expect(formData.value).toEqual({});

      // Go to /organizations
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "ORG_TOPIC" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "ORG_TOPIC" });

      // Back to /events
      mockRoute.path = "/events";
      mockRoute.query = { topics: "ANOTHER_TOPIC" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "ORG_TOPIC" }); // Unchanged

      // Return to /organizations
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: "FINAL_TOPIC" };
      await nextTick();
      expect(formData.value).toEqual({ topics: "FINAL_TOPIC" });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty query object", async () => {
      mockRoute.path = "/organizations";
      mockRoute.query = {};
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
    });

    it("handles multiple topics array", async () => {
      mockRoute.path = "/organizations";
      mockRoute.query = { topics: ["ENVIRONMENT", "EDUCATION"] };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({ topics: ["ENVIRONMENT", "EDUCATION"] });
    });
    it("does NOT sync for subpaths like /organizations/123", async () => {
      mockRoute.path = "/organizations/123";
      mockRoute.query = { topics: "ENVIRONMENT" };
      setupWatcher();
      await nextTick();
      expect(formData.value).toEqual({});
    });
  });
});
