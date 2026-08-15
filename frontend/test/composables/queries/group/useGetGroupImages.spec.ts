// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetGroupImages composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { ContentImage } from "../../../../shared/types/file-type";

import { useGroupCache } from "../../../../app/composables/cache";
import { createMockContentImage } from "../../../mocks/factories";

// MARK: Mocks

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetImages = vi.fn();

vi.mock("../../../../app/stores/data/group", () => ({
  useGroupImageStore: () => ({
    setImages: mockSetImages,
  }),
}));

const { mockFetchGroupImages } = vi.hoisted(() => ({
  mockFetchGroupImages: vi.fn(),
}));

mockNuxtImport("fetchGroupImages", () => mockFetchGroupImages);

// The shared auto-import mock returns an empty object, which is enough for the
// entity queries but not here, since this composable reads the query's data.
interface QueryOptions {
  key: () => readonly string[];
  query: () => Promise<ContentImage[]>;
}

const globalWithQuery = globalThis as typeof globalThis & {
  useQuery: (options: QueryOptions) => unknown;
};

let queryData = ref<ContentImage[] | undefined>(undefined);
let lastOptions: QueryOptions;
const mockRefresh = vi.fn();

// MARK: Tests

describe("useGetGroupImages", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockFetchGroupImages.mockResolvedValue([]);

    queryData = ref<ContentImage[] | undefined>(undefined);
    globalWithQuery.useQuery = (options: QueryOptions) => {
      lastOptions = options;
      return {
        data: queryData,
        isLoading: ref(false),
        error: ref(null),
        refresh: mockRefresh,
      };
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("useGroupCache", () => {
    it("includes group ID in cache key", () => {
      const { getKeyForGroupListImage } = useGroupCache();
      const key = getKeyForGroupListImage("group-123");

      expect(key).toEqual(["group", "imageList", "group-123"]);
    });

    it("returns consistent key for same ID", () => {
      const { getKeyForGroupListImage } = useGroupCache();
      const key1 = getKeyForGroupListImage("group-456");
      const key2 = getKeyForGroupListImage("group-456");

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const { getKeyForGroupListImage } = useGroupCache();
      const key1 = getKeyForGroupListImage("group-1");
      const key2 = getKeyForGroupListImage("group-2");

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });

    it("handles empty string ID", () => {
      const { getKeyForGroupListImage } = useGroupCache();
      const key = getKeyForGroupListImage("");

      expect(JSON.stringify(key)).toBe(
        JSON.stringify(["group", "imageList", ""])
      );
    });

    it("keys the query by the requested group", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      useGetGroupImages("group-123");
      const { getKeyForGroupListImage } = useGroupCache();

      expect(lastOptions.key()).toEqual(getKeyForGroupListImage("group-123"));
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data defaults to an empty array before the query resolves", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const { data } = useGetGroupImages("group-123");

      expect(data.value).toEqual([]);
    });

    it("data exposes the images once the query resolves", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const { data } = useGetGroupImages("group-123");
      queryData.value = [createMockContentImage({ id: "img-1" })];

      expect(data.value).toHaveLength(1);
      expect(data.value[0]).toHaveProperty("id", "img-1");
    });

    it("error is a Vue ref", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const { error } = useGetGroupImages("group-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const { error } = useGetGroupImages("group-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Query Function

  describe("Query Function", () => {
    it("fetches the images for the requested group", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      useGetGroupImages("group-123");
      await lastOptions.query();

      expect(mockFetchGroupImages).toHaveBeenCalledWith("group-123");
    });

    it("caches the fetched images in the store", async () => {
      const images = [createMockContentImage({ id: "img-1" })];
      mockFetchGroupImages.mockResolvedValue(images);

      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      useGetGroupImages("group-123");
      await lastOptions.query();

      expect(mockSetImages).toHaveBeenCalledWith(images);
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const result = useGetGroupImages("group-123");

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty("value");
    });

    it("accepts empty string ID without error", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const result = useGetGroupImages("");

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as ContentImage array", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries");

      const { data } = useGetGroupImages("group-123");

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockContentImage produces valid ContentImage structure", () => {
      const image = createMockContentImage({ id: "test-img" });

      expect(image).toHaveProperty("id", "test-img");
      expect(image).toHaveProperty("fileObject");
    });
  });
});
