// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetGroup composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Group } from "../../../shared/types/group";

import { useGroupCache } from "../../../app/composables/cache/useGroupCache";
import { createMockGroup } from "../../mocks/factories";

// MARK: Mocks

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetGroup = vi.fn();
const mockGetGroup = vi.fn((): Group | null => null);

vi.mock("../../../app/stores/group", () => ({
  useGroupStore: () => ({
    setGroup: mockSetGroup,
    getGroup: mockGetGroup,
  }),
}));

const { mockGetGroupService } = vi.hoisted(() => ({
  mockGetGroupService: vi.fn(),
}));

mockNuxtImport("getGroup", () => mockGetGroupService);

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

  describe("useGroupCache", () => {
    it("includes group ID in cache key", () => {
      const { getKeyForGroup } = useGroupCache();
      const key = getKeyForGroup("group-123");

      expect(key).toEqual(["group", "group-123"]);
    });

    it("returns 'group:{id}' format", () => {
      const { getKeyForGroup } = useGroupCache();

      expect(getKeyForGroup("group-123")).toEqual(["group", "group-123"]);
    });

    it("returns consistent key for same ID", () => {
      const { getKeyForGroup } = useGroupCache();
      const key1 = getKeyForGroup("group-456");
      const key2 = getKeyForGroup("group-456");

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const { getKeyForGroup } = useGroupCache();
      const key1 = getKeyForGroup("group-1");
      const key2 = getKeyForGroup("group-2");

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });

    it("handles empty string ID", () => {
      const { getKeyForGroup } = useGroupCache();
      const key = getKeyForGroup("");

      expect(JSON.stringify(key)).toBe(JSON.stringify(["group", ""]));
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
    it("data is defined before the query has run", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { data } = useGetGroup("group-123");

      expect(data).toBeDefined();
      expect(data).toHaveProperty("value");
    });

    it("pending is a boolean before the query has run", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { pending } = useGetGroup("group-123");

      expect(pending).toBeDefined();
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
      expect(result.data).toBeDefined();
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
    it("data will be defined initially", async () => {
      const { useGetGroup } =
        await import("../../../app/composables/queries/useGetGroup");

      const { data } = useGetGroup("group-123");

      expect(data).toBeDefined();
      expect(data).toHaveProperty("value");
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
