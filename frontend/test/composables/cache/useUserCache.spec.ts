// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useUserCache composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useUserCache } from "../../../app/composables/cache/useUserCache";

const globalWithSession = globalThis as typeof globalThis & {
  useUserSession: () => { session: { value: { user?: { id: string } } } };
};

describe("useUserCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalWithSession.useUserSession = () => ({
      session: ref({ user: { id: "user-123" } }),
    });
  });

  describe("invalidateUserCache", () => {
    it("calls invalidateQueries with the signed-in user's key", async () => {
      const { invalidateUserCache } = useUserCache();

      await invalidateUserCache();

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(invalidateQueries).toHaveBeenCalledWith({
        key: ["user", "user-123"],
      });
    });

    it("does nothing when no user is signed in", async () => {
      globalWithSession.useUserSession = () => ({
        session: ref({}),
      });
      const { invalidateUserCache } = useUserCache();

      const result = await invalidateUserCache();

      const { invalidateQueries } = globalThis.useQueryCache();

      expect(result).toBeNull();
      expect(invalidateQueries).not.toHaveBeenCalled();
    });
  });

  describe("userCacheEntries", () => {
    it("calls getEntries with the signed-in user's key and returns the result", () => {
      const mockEntries = [{ data: { id: "user-123", name: "Jane" } }];
      const { getEntries } = globalThis.useQueryCache();
      getEntries.mockReturnValue(mockEntries);

      const { userCacheEntries } = useUserCache();
      const result = userCacheEntries();

      expect(getEntries).toHaveBeenCalledWith({
        key: ["user", "user-123"],
      });
      expect(result).toBe(mockEntries);
    });

    it("falls back to an empty ID when no user is signed in", () => {
      globalWithSession.useUserSession = () => ({
        session: ref({}),
      });
      const { getEntries } = globalThis.useQueryCache();

      const { userCacheEntries } = useUserCache();
      userCacheEntries();

      expect(getEntries).toHaveBeenCalledWith({
        key: ["user", ""],
      });
    });
  });

  describe("getKeyForUser", () => {
    it("generates the correct tuple array for a specific user ID", () => {
      const { getKeyForUser } = useUserCache();

      const key = getKeyForUser("user-456");

      expect(key).toEqual(["user", "user-456"]);
    });

    it("returns consistent keys for the same ID", () => {
      const { getKeyForUser } = useUserCache();

      const key1 = getKeyForUser("user-789");
      const key2 = getKeyForUser("user-789");

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const { getKeyForUser } = useUserCache();

      const key1 = getKeyForUser("user-1");
      const key2 = getKeyForUser("user-2");

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });
  });
});
