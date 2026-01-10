// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetOrganization composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Organization } from "../../../shared/types/organization";

import { getKeyForGetOrganization } from "../../../app/composables/queries/useGetOrganization";
import { createMockOrganization } from "../../mocks/factories";

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetOrganization = vi.fn();
const mockGetOrganization = vi.fn((): Organization | null => null);

vi.mock("../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setOrganization: mockSetOrganization,
    getOrganization: mockGetOrganization,
  }),
}));

const mockGetOrganizationService = vi.fn();

vi.mock("../../../app/services/entities/organization", () => ({
  getOrganization: (id: string) => mockGetOrganizationService(id),
}));

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

  describe("getKeyForGetOrganization", () => {
    it("includes organization ID in cache key", () => {
      const key = getKeyForGetOrganization("org-123");

      expect(key).toContain("org-123");
    });

    it("returns 'organization:{id}' format", () => {
      expect(getKeyForGetOrganization("org-123")).toBe("organization:org-123");
    });

    it("returns consistent key for same ID", () => {
      const key1 = getKeyForGetOrganization("org-456");
      const key2 = getKeyForGetOrganization("org-456");

      expect(key1).toBe(key2);
    });

    it("returns different keys for different IDs", () => {
      const key1 = getKeyForGetOrganization("org-1");
      const key2 = getKeyForGetOrganization("org-2");

      expect(key1).not.toBe(key2);
    });

    it("handles empty string ID", () => {
      const key = getKeyForGetOrganization("");

      expect(key).toBe("organization:");
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("org-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const { data } = useGetOrganization("org-123");

      expect(data).toHaveProperty("value");
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const { pending } = useGetOrganization("org-123");

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const { error } = useGetOrganization("org-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const { error } = useGetOrganization("org-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("org-123");

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty("value");
    });

    it("accepts empty string ID without error", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result = useGetOrganization("");

      expect(result).toBeDefined();
    });

    it("returns same structure regardless of ID value", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const result1 = useGetOrganization("org-1");
      const result2 = useGetOrganization("org-2");

      expect(Object.keys(result1)).toEqual(Object.keys(result2));
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value can be Organization or null", async () => {
      const { useGetOrganization } =
        await import("../../../app/composables/queries/useGetOrganization");

      const { data } = useGetOrganization("org-123");

      // Runtime check that value exists (type is Organization | null).
      expect("value" in data).toBe(true);
    });

    it("createMockOrganization produces valid Organization structure", () => {
      const org = createMockOrganization({ id: "test-org" });

      expect(org).toHaveProperty("id", "test-org");
      expect(org).toHaveProperty("createdBy");
      expect(org).toHaveProperty("location");
    });
  });
});
