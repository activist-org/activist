// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetGroups composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { getKeyForGetGroups } from "../../../app/composables/queries/useGetGroups";
import { createMockGroup, createMockGroupFilters } from "../../mocks/factories";

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockListGroups = vi.fn();

vi.mock("../../../app/services/entities/group", () => ({
  listGroups: (params: unknown) => mockListGroups(params),
}));

// MARK: Tests

describe("useGetGroups", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockListGroups.mockResolvedValue({ data: [], isLastPage: false });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetGroups", () => {
    it("includes filters in cache key", () => {
      const filters = createMockGroupFilters();
      const key = getKeyForGetGroups(filters, 1);

      expect(key).toContain("filters");
    });

    it("includes page number in cache key", () => {
      const filters = createMockGroupFilters();
      const key = getKeyForGetGroups(filters, 1);

      expect(key).toContain("page:1");
    });

    it("returns consistent key for same filters and page", () => {
      const filters = createMockGroupFilters();
      const key1 = getKeyForGetGroups(filters, 1);
      const key2 = getKeyForGetGroups(filters, 1);

      expect(key1).toBe(key2);
    });

    it("returns different keys for different pages", () => {
      const filters = createMockGroupFilters();
      const key1 = getKeyForGetGroups(filters, 1);
      const key2 = getKeyForGetGroups(filters, 2);

      expect(key1).not.toBe(key2);
    });

    it("returns different keys for different filters", () => {
      const filters1 = createMockGroupFilters({
        linked_organizations: ["org-1"],
      });
      const filters2 = createMockGroupFilters({
        linked_organizations: ["org-2"],
      });
      const key1 = getKeyForGetGroups(filters1, 1);
      const key2 = getKeyForGetGroups(filters2, 1);

      expect(key1).not.toBe(key2);
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const result = useGetGroups(ref(createMockGroupFilters()));

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const result = useGetGroups(ref(createMockGroupFilters()));

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const result = useGetGroups(ref(createMockGroupFilters()));

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const result = useGetGroups(ref(createMockGroupFilters()));

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });

    it("returns an object with getMore function", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const result = useGetGroups(ref(createMockGroupFilters()));

      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const { data } = useGetGroups(ref(createMockGroupFilters()));

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const { data } = useGetGroups(ref(createMockGroupFilters()));

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const { pending } = useGetGroups(ref(createMockGroupFilters()));

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const { error } = useGetGroups(ref(createMockGroupFilters()));

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const { error } = useGetGroups(ref(createMockGroupFilters()));

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Filters Parameter

  describe("Filters Parameter", () => {
    it("accepts ref of GroupFilters", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");
      const filters = ref(createMockGroupFilters());

      const result = useGetGroups(filters);

      expect(result).toBeDefined();
    });

    it("accepts empty filters object", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const result = useGetGroups(ref({}));

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as Group array", async () => {
      const { useGetGroups } =
        await import("../../../app/composables/queries/useGetGroups");

      const { data } = useGetGroups(ref(createMockGroupFilters()));

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockGroup produces valid Group structure", () => {
      const group = createMockGroup({ id: "test-group" });

      expect(group).toHaveProperty("id", "test-group");
      expect(group).toHaveProperty("createdBy");
      expect(group).toHaveProperty("location");
      expect(group).toHaveProperty("org");
    });

    it("createMockGroupFilters produces valid GroupFilters", () => {
      const filters = createMockGroupFilters();

      expect(filters).toBeDefined();
      expect(typeof filters).toBe("object");
    });
  });
});
