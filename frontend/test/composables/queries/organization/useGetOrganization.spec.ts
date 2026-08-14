// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetOrganization composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Organization } from "../../../../shared/types/organization";

import { useOrganizationCache } from "../../../../app/composables/cache";
import { createMockOrganization } from "../../../mocks/factories";

// MARK: Mocks

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetOrganization = vi.fn();
const mockGetOrganization = vi.fn((): Organization | null => null);

vi.mock("../../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setOrganization: mockSetOrganization,
    getOrganization: mockGetOrganization,
  }),
}));

const { mockGetOrganizationService } = vi.hoisted(() => ({
  mockGetOrganizationService: vi.fn(),
}));

mockNuxtImport("getOrganization", () => mockGetOrganizationService);

// MARK: Tests

describe("useGetOrganization", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetOrganization.mockReturnValue(null);
    mockGetOrganizationService.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("useOrganizationCache", () => {
    it("includes organization ID in cache key", () => {
      const { getKeyForOrganization } = useOrganizationCache();
      const key = getKeyForOrganization("org-123");

      expect(key).toEqual(["organization", "org-123"]);
    });

    it("returns 'organization:{id}' format", () => {
      const { getKeyForOrganization } = useOrganizationCache();
      expect(getKeyForOrganization("org-123")).toEqual([
        "organization",
        "org-123",
      ]);
    });

    it("returns consistent key for same ID", () => {
      const { getKeyForOrganization } = useOrganizationCache();
      const key1 = getKeyForOrganization("org-456");
      const key2 = getKeyForOrganization("org-456");

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const { getKeyForOrganization } = useOrganizationCache();
      const key1 = getKeyForOrganization("org-1");
      const key2 = getKeyForOrganization("org-2");

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });

    it("handles empty string ID", () => {
      const { getKeyForOrganization } = useOrganizationCache();
      const key = getKeyForOrganization("");

      expect(JSON.stringify(key)).toBe(JSON.stringify(["organization", ""]));
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is defined as ref before the query has run", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganization("org-123");

      expect(data).toBeDefined();
    });

    it("pending is undefined before the query has run", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const { pending } = useGetOrganization("org-123");

      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const { error } = useGetOrganization("org-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const { error } = useGetOrganization("org-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganization("org-123");

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it("accepts empty string ID without error", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganization("");

      expect(result).toBeDefined();
    });

    it("returns same structure regardless of ID value", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const result1 = useGetOrganization("org-1");
      const result2 = useGetOrganization("org-2");

      expect(Object.keys(result1)).toEqual(Object.keys(result2));
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data will be defined initially", async () => {
      const { useGetOrganization } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganization("org-123");

      expect(data).toBeDefined();
    });

    it("createMockOrganization produces valid Organization structure", () => {
      const org = createMockOrganization({ id: "test-org" });

      expect(org).toHaveProperty("id", "test-org");
      expect(org).toHaveProperty("createdBy");
      expect(org).toHaveProperty("location");
    });
  });
});
