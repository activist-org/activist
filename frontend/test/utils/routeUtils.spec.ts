// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

describe("utils/routeUtils", () => {
  it("isCurrentRoutePathSubpageOf returns true for valid subpages", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(
      mod.isCurrentRoutePathSubpageOf("groups", "en___groups-members")
    ).toBe(true);
    expect(mod.isCurrentRoutePathSubpageOf("groups", "groups-search")).toBe(
      false
    );
    expect(mod.isCurrentRoutePathSubpageOf("groups", "groups-create")).toBe(
      false
    );
    expect(mod.isCurrentRoutePathSubpageOf("groups", "groups")).toBe(false);
  });

  it("currentRoutePathIncludes checks routeName contains path ignoring locale prefix", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.currentRoutePathIncludes("groups", "en___groups-members")).toBe(
      true
    );
    expect(mod.currentRoutePathIncludes("events", "en___groups-members")).toBe(
      false
    );
  });

  // MARK: Edge Cases

  it("isCurrentRoutePathSubpageOf handles empty path", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    // Empty path splits by "-", so "groups-members" becomes ["groups", "members"].
    // This returns true because segments.length > 1 and subpage is "members".
    expect(mod.isCurrentRoutePathSubpageOf("", "en___groups-members")).toBe(
      true
    );
  });

  it("isCurrentRoutePathSubpageOf handles empty routeName", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.isCurrentRoutePathSubpageOf("groups", "")).toBe(false);
  });

  it("isCurrentRoutePathSubpageOf handles routeName without locale prefix", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.isCurrentRoutePathSubpageOf("groups", "groups-members")).toBe(
      true
    );
  });

  it("isCurrentRoutePathSubpageOf handles special characters in path", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(
      mod.isCurrentRoutePathSubpageOf("groups-test", "en___groups-test-members")
    ).toBe(true);
  });

  it("isCurrentRoutePathSubpageOf excludes search and create routes", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.isCurrentRoutePathSubpageOf("groups", "groups-search")).toBe(
      false
    );
    expect(mod.isCurrentRoutePathSubpageOf("groups", "groups-create")).toBe(
      false
    );
    expect(mod.isCurrentRoutePathSubpageOf("events", "events-search")).toBe(
      false
    );
    expect(mod.isCurrentRoutePathSubpageOf("events", "events-create")).toBe(
      false
    );
  });

  it("currentRoutePathIncludes handles empty path", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.currentRoutePathIncludes("", "en___groups-members")).toBe(true);
  });

  it("currentRoutePathIncludes handles empty routeName", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.currentRoutePathIncludes("groups", "")).toBe(false);
  });

  it("currentRoutePathIncludes handles routeName without locale prefix", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.currentRoutePathIncludes("groups", "groups-members")).toBe(true);
  });

  it("currentRoutePathIncludes handles multiple locale separators", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(
      mod.currentRoutePathIncludes("groups", "en___fr___groups-members")
    ).toBe(true);
  });

  it("currentRoutePathIncludes is case-sensitive", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.currentRoutePathIncludes("Groups", "en___groups-members")).toBe(
      false
    );
    expect(mod.currentRoutePathIncludes("groups", "en___Groups-members")).toBe(
      false
    );
  });

  it("currentRoutePathIncludes handles partial matches", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(mod.currentRoutePathIncludes("group", "en___groups-members")).toBe(
      true
    );
    expect(mod.currentRoutePathIncludes("member", "en___groups-members")).toBe(
      true
    );
  });

  it("isCurrentRoutePathSubpageOf handles very long route names", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    const longRouteName =
      "en___groups-very-long-subpage-name-with-many-segments";
    expect(mod.isCurrentRoutePathSubpageOf("groups", longRouteName)).toBe(true);
  });

  it("currentRoutePathIncludes handles special characters", async () => {
    const mod = await import("../../shared/utils/routeUtils");
    expect(
      mod.currentRoutePathIncludes("groups-123", "en___groups-123-members")
    ).toBe(true);
    expect(
      mod.currentRoutePathIncludes("groups_test", "en___groups_test-members")
    ).toBe(true);
  });

  // MARK: Route Query to Filter Form Data
  // @see https://github.com/activist-org/activist/issues/1738

  describe("routeQueryToEventsFilterFormData", () => {
    it("syncs query params to form data", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToEventsFilterFormData({
        topics: "ENVIRONMENT",
        location: "Berlin",
        view: "list",
      });
      expect(result).toMatchObject({
        topics: ["ENVIRONMENT"],
        location: "Berlin",
      });
      expect(result).not.toHaveProperty("view");
    });

    it("extracts view separately from formData", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToEventsFilterFormData({
        topics: "TEST",
        view: "list",
      });
      expect(result).not.toHaveProperty("view");
      expect(result).toMatchObject({ topics: ["TEST"] });
    });

    it("handles empty query object", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToEventsFilterFormData({});
      expect(result).toEqual({ topics: [] });
    });

    it("handles undefined query", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToEventsFilterFormData(undefined);
      expect(result).toEqual({ topics: [] });
    });
  });

  describe("routeQueryToOrganizationFilterFormData", () => {
    it("syncs query params to form data", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToOrganizationFilterFormData({
        topics: "ENVIRONMENT",
        location: "Berlin",
      });
      expect(result).toMatchObject({
        topics: "ENVIRONMENT",
        location: "Berlin",
      });
    });

    it("handles empty query object", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToOrganizationFilterFormData({});
      expect(result).toEqual({});
    });

    it("handles undefined query", async () => {
      const mod = await import("../../shared/utils/routeUtils");
      const result = mod.routeQueryToOrganizationFilterFormData(undefined);
      expect(result).toEqual({});
    });
  });
});
