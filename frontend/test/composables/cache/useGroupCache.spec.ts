// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupCache composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGroupCache } from "../../../app/composables/cache/useGroupCache";

describe("useGroupCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("invalidateGroupCache", () => {
    it("calls invalidateQueries with the correct key for a specific group ID", async () => {
      const { invalidateGroupCache } = useGroupCache();

      await invalidateGroupCache("group-123");

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["group", "group-123"],
      });
    });
  });

  describe("invalidateGroupList", () => {
    it("calls invalidateQueries with the root list key", async () => {
      const { invalidateGroupList } = useGroupCache();

      await invalidateGroupList();

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["group", "list"],
      });
    });
  });

  describe("invalidateGroupImageCache", () => {
    it("calls invalidateQueries with the group image key", async () => {
      const { invalidateGroupImageCache } = useGroupCache();

      await invalidateGroupImageCache("group-123");

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["group", "imageList", "group-123"],
      });
    });
  });

  describe("groupCacheEntries", () => {
    it("calls getEntries with the specific group ID key and returns the result", () => {
      const mockEntries = [{ data: { id: "group-123", name: "Test Group" } }];
      const { getEntries } = globalThis.useQueryCache();
      getEntries.mockReturnValue(mockEntries);

      const { groupCacheEntries } = useGroupCache();
      const result = groupCacheEntries("group-123");

      expect(getEntries).toHaveBeenCalledWith({
        key: ["group", "group-123"],
      });
      expect(result).toBe(mockEntries);
    });
  });

  describe("getKeyForGroups", () => {
    it("generates the correct tuple array for list queries with filters", () => {
      const { getKeyForGroups } = useGroupCache();
      const filters = { search: "test" };

      const key = getKeyForGroups(filters);

      expect(key).toEqual(["group", "list", { filters }]);
    });

    it("generates the correct tuple array when filters are undefined", () => {
      const { getKeyForGroups } = useGroupCache();

      const key = getKeyForGroups(undefined);

      expect(key).toEqual(["group", "list", { filters: undefined }]);
    });
  });

  describe("getKeyForGroup", () => {
    it("generates the correct tuple array for a specific group ID", () => {
      const { getKeyForGroup } = useGroupCache();

      const key = getKeyForGroup("group-123");

      expect(key).toEqual(["group", "group-123"]);
    });
  });
});
