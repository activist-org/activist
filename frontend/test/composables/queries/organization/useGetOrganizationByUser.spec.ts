// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetOrganizationsByUser composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import {
  createMockOrganization,
  createMockOrganizationFilters,
} from "../../../mocks/factories";

// MARK: Mocks

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const { mockListOrganizationsByUserId } = vi.hoisted(() => ({
  mockListOrganizationsByUserId: vi.fn(),
}));

mockNuxtImport(
  "listOrganizationsByUserId",
  () => mockListOrganizationsByUserId
);

// MARK: Tests

describe("useGetOrganizationsByUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListOrganizationsByUserId.mockResolvedValue({
      data: [],
      isLastPage: false,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetOrganizationsByUser", () => {
    it("includes userId in cache key", async () => {
      const { useOrganizationCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForOrganizationsByUser } = useOrganizationCache();
      const key = getKeyForOrganizationsByUser("user-123", {});
      expect(key).toContain("user-123");
    });

    it("includes filters in cache key when provided", async () => {
      const filters = createMockOrganizationFilters();
      const { useOrganizationCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForOrganizationsByUser } = useOrganizationCache();
      const key = getKeyForOrganizationsByUser("user-123", filters);

      expect(key).toContainEqual({ filters });
    });

    it("returns consistent key for same parameters", async () => {
      const { useOrganizationCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForOrganizationsByUser } = useOrganizationCache();
      const key1 = getKeyForOrganizationsByUser("user-123", {});
      const key2 = getKeyForOrganizationsByUser("user-123", {});

      expect(key1).toStrictEqual(key2);
    });

    it("returns different keys for different userIds", async () => {
      const { useOrganizationCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForOrganizationsByUser } = useOrganizationCache();
      const key1 = getKeyForOrganizationsByUser("user-1", {});
      const key2 = getKeyForOrganizationsByUser("user-2", {});

      expect(key1).not.toStrictEqual(key2);
    });

    it("returns different keys for different filters", async () => {
      const { useOrganizationCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForOrganizationsByUser } = useOrganizationCache();
      const key1 = getKeyForOrganizationsByUser("user-123", {
        name: "a",
      });
      const key2 = getKeyForOrganizationsByUser("user-123", {
        name: "b",
      });

      expect(key1).not.toBe(key2);
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });

    it("returns an object with getMore function", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganizationsByUser("user-123");

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganizationsByUser("user-123");

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const { pending } = useGetOrganizationsByUser("user-123");

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const { error } = useGetOrganizationsByUser("user-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const { error } = useGetOrganizationsByUser("user-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: UserId Parameter

  describe("UserId Parameter", () => {
    it("accepts string userId", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toBeDefined();
    });

    it("accepts empty string userId without error", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("");

      expect(result).toBeDefined();
    });
  });

  // MARK: Optional Filters

  describe("Optional Filters", () => {
    it("works without filters parameter", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toBeDefined();
    });

    it("accepts ref of OrganizationFilters", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");
      const filters = ref(createMockOrganizationFilters());

      const result = useGetOrganizationsByUser("user-123", filters);

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as Organization array", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganizationsByUser("user-123");

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockOrganization produces valid Organization structure", () => {
      const org = createMockOrganization({ id: "test-org" });

      expect(org).toHaveProperty("id", "test-org");
      expect(org).toHaveProperty("createdBy");
      expect(org).toHaveProperty("location");
    });
  });
});
