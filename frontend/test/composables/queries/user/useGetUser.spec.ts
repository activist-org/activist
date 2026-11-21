// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetUser composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useUserCache } from "../../../../app/composables/cache";

// MARK: Mocks

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockUser = ref<{ id: string } | null>({ id: "user-123" });

vi.mock("../../../../app/composables/useUser", () => ({
  useUser: () => ({ user: mockUser }),
}));

const { mockGetUser } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
}));

mockNuxtImport("getUser", () => mockGetUser);

// MARK: Tests

describe("useGetUser", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockUser.value = { id: "user-123" };
    mockGetUser.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("useUserCache", () => {
    it("includes the signed-in user ID in the cache key", () => {
      const { getKeyForUser } = useUserCache();
      const key = getKeyForUser("user-123");

      expect(key).toEqual(["user", "user-123"]);
    });

    it("returns consistent key for same ID", () => {
      const { getKeyForUser } = useUserCache();
      const key1 = getKeyForUser("user-456");
      const key2 = getKeyForUser("user-456");

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const { getKeyForUser } = useUserCache();
      const key1 = getKeyForUser("user-1");
      const key2 = getKeyForUser("user-2");

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const result = useGetUser();

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const result = useGetUser();

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const result = useGetUser();

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const result = useGetUser();

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const { data } = useGetUser();

      expect(data).toBeDefined();
      expect(data).toHaveProperty("value");
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const { pending } = useGetUser();

      expect(pending).toBeDefined();
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const { error } = useGetUser();

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const { error } = useGetUser();

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Signed-out Handling

  describe("Signed-out Handling", () => {
    it("returns the same structure when no user is signed in", async () => {
      mockUser.value = null;
      const { useGetUser } =
        await import("../../../../app/composables/queries");

      const result = useGetUser();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });
  });
});
