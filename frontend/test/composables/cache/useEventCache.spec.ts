// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventCache composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

// Adjust this import path to match your file structure
import { useEventCache } from "../../../app/composables/cache/useEventCache";

describe("useEventCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("invalidateEventCache", () => {
    it("calls invalidateQueries with the correct key for a specific event ID", async () => {
      const { invalidateEventCache } = useEventCache();

      await invalidateEventCache("evt-123");

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["event", "evt-123"],
      });
    });
  });

  describe("invalidateEventList", () => {
    it("calls invalidateQueries with the root list key", async () => {
      const { invalidateEventList } = useEventCache();

      await invalidateEventList();

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["event", "list"],
      });
    });
  });

  describe("eventCacheEntries", () => {
    it("calls getEntries with the specific event ID key and returns the result", () => {
      const mockEntries = [{ data: { id: "evt-123", name: "Protest" } }];
      const { getEntries } = globalThis.useQueryCache();
      getEntries.mockReturnValue(mockEntries);

      const { eventCacheEntries } = useEventCache();
      const result = eventCacheEntries("evt-123");

      expect(getEntries).toHaveBeenCalledWith({
        key: ["event", "evt-123"],
      });
      expect(result).toBe(mockEntries);
    });
  });

  describe("getKeyForEvents", () => {
    it("generates the correct tuple array for list queries with filters", () => {
      const { getKeyForEvents } = useEventCache();
      const filters = { status: "upcoming", city: "London" };

      const key = getKeyForEvents(filters);

      expect(key).toEqual(["event", "list", { filters }]);
    });

    it("generates the correct tuple array when filters are undefined", () => {
      const { getKeyForEvents } = useEventCache();

      const key = getKeyForEvents(undefined);

      expect(key).toEqual(["event", "list", { filters: undefined }]);
    });
  });

  describe("getKeyForEvent", () => {
    it("generates the correct tuple array for a specific event ID", () => {
      const { getKeyForEvent } = useEventCache();

      const key = getKeyForEvent("evt-123");

      expect(key).toEqual(["event", "evt-123"]);
    });
  });
});
