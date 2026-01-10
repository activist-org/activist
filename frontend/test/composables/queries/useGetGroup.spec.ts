// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetGroup composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Group } from "../../../shared/types/group";

import { getKeyForGetGroup } from "../../../app/composables/queries/useGetGroup";
import { createMockGroup } from "../../mocks/factories";

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetGroup = vi.fn();
const mockGetGroup = vi.fn((): Group | null => null);

vi.mock("../../../app/stores/group", () => ({
  useGroupStore: () => ({
    setGroup: mockSetGroup,
    getGroup: mockGetGroup,
  }),
}));

const mockGetGroupService = vi.fn();

vi.mock("../../../app/services/entities/group", () => ({
  getGroup: (id: string) => mockGetGroupService(id),
}));

// MARK: Tests

describe("useGetGroup", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetGroup.mockReturnValue(null);
    mockGetGroupService.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetGroup", () => {
    it("includes group ID in cache key", () => {
      const key = getKeyForGetGroup("group-123");

      expect(key).toContain("group-123");
    });

    it("returns 'group:{id}' format", () => {
      expect(getKeyForGetGroup("group-123")).toBe("group:group-123");
    });

    it("returns consistent key for same ID", () => {
      const key1 = getKeyForGetGroup("group-456");
      const key2 = getKeyForGetGroup("group-456");

      expect(key1).toBe(key2);
    });

    it("returns different keys for different IDs", () => {
      const key1 = getKeyForGetGroup("group-1");
      const key2 = getKeyForGetGroup("group-2");

      expect(key1).not.toBe(key2);
    });

    it("handles empty string ID", () => {
      const key = getKeyForGetGroup("");

      expect(key).toBe("group:");
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("group-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("group-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("group-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("group-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { data } = useGetGroup("group-123");

      expect(data).toHaveProperty("value");
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { pending } = useGetGroup("group-123");

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { error } = useGetGroup("group-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { error } = useGetGroup("group-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("group-123");

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty("value");
    });

    it("accepts empty string ID without error", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result = useGetGroup("");

      expect(result).toBeDefined();
    });

    it("returns same structure regardless of ID value", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const result1 = useGetGroup("group-1");
      const result2 = useGetGroup("group-2");

      expect(Object.keys(result1)).toEqual(Object.keys(result2));
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value can be Group or null", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { data } = useGetGroup("group-123");

      expect("value" in data).toBe(true);
    });

    it("createMockGroup produces valid Group structure", () => {
      const group = createMockGroup({ id: "test-group" });

      expect(group).toHaveProperty("id", "test-group");
      expect(group).toHaveProperty("createdBy");
      expect(group).toHaveProperty("location");
      expect(group).toHaveProperty("org");
    });
  });
});
