// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetOrganizationEvents composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationCache } from "../../../../app/composables/cache";

// MARK: Mocks

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const { mockListOrganizationEvents } = vi.hoisted(() => ({
  mockListOrganizationEvents: vi.fn(),
}));

mockNuxtImport("listOrganizationEvents", () => mockListOrganizationEvents);

interface InfiniteQueryOptions {
  key: () => readonly unknown[];
  query: (context: { pageParam: number }) => Promise<unknown>;
  getNextPageParam: (lastPage: unknown, allPages: unknown[]) => number | null;
}

const globalWithInfiniteQuery = globalThis as typeof globalThis & {
  useInfiniteQuery: (options: InfiniteQueryOptions) => unknown;
};

let queryData = ref<{ pages: unknown[] } | undefined>(undefined);
let lastOptions: InfiniteQueryOptions;
const mockLoadNextPage = vi.fn();

// MARK: Tests

describe("useGetOrganizationEvents", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockListOrganizationEvents.mockResolvedValue({
      data: [],
      isLastPage: true,
    });

    queryData = ref<{ pages: unknown[] } | undefined>(undefined);
    globalWithInfiniteQuery.useInfiniteQuery = (
      options: InfiniteQueryOptions
    ) => {
      lastOptions = options;
      return {
        data: queryData,
        isLoading: ref(false),
        error: ref(null),
        loadNextPage: mockLoadNextPage,
      };
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("useOrganizationCache", () => {
    it("includes organization ID and filters in cache key", () => {
      const { getKeyForOrganizationEvents } = useOrganizationCache();
      const key = getKeyForOrganizationEvents("org-123", {});

      expect(key).toEqual([
        "organization",
        "org-123",
        "events",
        { filters: {} },
      ]);
    });

    it("returns consistent key for same ID and filters", () => {
      const { getKeyForOrganizationEvents } = useOrganizationCache();
      const key1 = getKeyForOrganizationEvents("org-456", {});
      const key2 = getKeyForOrganizationEvents("org-456", {});

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const { getKeyForOrganizationEvents } = useOrganizationCache();
      const key1 = getKeyForOrganizationEvents("org-1", {});
      const key2 = getKeyForOrganizationEvents("org-2", {});

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });

    it("keys the query by the requested organization and filters", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");
      const { getKeyForOrganizationEvents } = useOrganizationCache();

      useGetOrganizationEvents("org-123");

      expect(lastOptions.key()).toEqual(
        getKeyForOrganizationEvents("org-123", {})
      );
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationEvents("org-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationEvents("org-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationEvents("org-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationEvents("org-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });

    it("returns an object with getMore function", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationEvents("org-123");

      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });

    it("returns an object with filters property", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetOrganizationEvents("org-123");

      expect(result).toHaveProperty("filters");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data defaults to an empty array before the query resolves", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganizationEvents("org-123");

      expect(data.value).toEqual([]);
    });

    it("data flattens the paginated response", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const { data } = useGetOrganizationEvents("org-123");
      queryData.value = {
        pages: [{ data: [{ id: "event-1" }], isLastPage: true }],
      };

      expect(data.value).toEqual([{ id: "event-1" }]);
    });

    it("error is a Vue ref", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const { error } = useGetOrganizationEvents("org-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const { error } = useGetOrganizationEvents("org-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Query Function

  describe("Query Function", () => {
    it("fetches events for the requested organization with pagination params", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      useGetOrganizationEvents("org-123");
      await lastOptions.query({ pageParam: 1 });

      expect(mockListOrganizationEvents).toHaveBeenCalledWith("org-123", {
        page: 1,
        page_size: 10,
      });
    });

    it("does not fetch when pageParam is falsy", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      useGetOrganizationEvents("org-123");
      const result = await lastOptions.query({ pageParam: 0 });

      expect(mockListOrganizationEvents).not.toHaveBeenCalled();
      expect(result).toEqual({ data: [], isLastPage: true });
    });

    it("returns null for getNextPageParam when the last page is reached", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      useGetOrganizationEvents("org-123");

      expect(lastOptions.getNextPageParam({ isLastPage: true }, [])).toBeNull();
    });

    it("returns the next page number when more pages remain", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      useGetOrganizationEvents("org-123");

      expect(lastOptions.getNextPageParam({ isLastPage: false }, [{}])).toBe(2);
    });
  });

  // MARK: getMore

  describe("getMore", () => {
    it("delegates to loadNextPage", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const { getMore } = useGetOrganizationEvents("org-123");
      getMore();

      expect(mockLoadNextPage).toHaveBeenCalled();
    });
  });

  // MARK: refresh

  describe("refresh", () => {
    it("invalidates the organization events cache", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");
      const { getKeyForOrganizationEvents } = useOrganizationCache();

      const { refresh } = useGetOrganizationEvents("org-123");
      await refresh();

      const { useQueryCache } = await import("@pinia/colada");
      expect(useQueryCache().invalidateQueries).toHaveBeenCalledWith({
        key: ["organization", "org-123", "events"],
      });
      // Sanity check the cache key helper used elsewhere is consistent.
      expect(getKeyForOrganizationEvents("org-123", {})).toEqual([
        "organization",
        "org-123",
        "events",
        { filters: {} },
      ]);
    });

    it("does not invalidate when organization ID is empty", async () => {
      const { useGetOrganizationEvents } =
        await import("../../../../app/composables/queries");

      const { refresh } = useGetOrganizationEvents("");
      await refresh();

      const { useQueryCache } = await import("@pinia/colada");
      expect(useQueryCache().invalidateQueries).not.toHaveBeenCalled();
    });
  });
});
