// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetOrganizationImages composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { ContentImage } from "../../../shared/types/file-type";

import { ORGANIZATION_IMAGE_KEYS } from "../../../app/composables/queries/useGetOrganizationImages";
import { createMockContentImage } from "../../mocks/factories";

// MARK: Mocks

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetImages = vi.fn();

vi.mock("../../../app/stores/data/organization", () => ({
  useOrganizationImageStore: () => ({
    setImages: mockSetImages,
  }),
}));

const { mockFetchOrganizationImages } = vi.hoisted(() => ({
  mockFetchOrganizationImages: vi.fn(),
}));

mockNuxtImport("fetchOrganizationImages", () => mockFetchOrganizationImages);

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

describe("useGetOrganizationImages", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockFetchOrganizationImages.mockResolvedValue([]);

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

  describe("ORGANIZATION_IMAGE_KEYS.byId", () => {
    it("includes organization ID in cache key", () => {
      const key = ORGANIZATION_IMAGE_KEYS.byId("org-123");

      expect(key).toEqual(["organizationImages", "org-123"]);
    });

    it("returns consistent key for same ID", () => {
      const key1 = ORGANIZATION_IMAGE_KEYS.byId("org-456");
      const key2 = ORGANIZATION_IMAGE_KEYS.byId("org-456");

      expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
    });

    it("returns different keys for different IDs", () => {
      const key1 = ORGANIZATION_IMAGE_KEYS.byId("org-1");
      const key2 = ORGANIZATION_IMAGE_KEYS.byId("org-2");

      expect(JSON.stringify(key1)).not.toBe(JSON.stringify(key2));
    });

    it("handles empty string ID", () => {
      const key = ORGANIZATION_IMAGE_KEYS.byId("");

      expect(JSON.stringify(key)).toBe(
        JSON.stringify(["organizationImages", ""])
      );
    });

    it("keys the query by the requested organization", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      useGetOrganizationImages("org-123");

      expect(lastOptions.key()).toEqual(
        ORGANIZATION_IMAGE_KEYS.byId("org-123")
      );
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("org-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("org-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("org-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("org-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data defaults to an empty array before the query resolves", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { data } = useGetOrganizationImages("org-123");

      expect(data.value).toEqual([]);
    });

    it("data exposes the images once the query resolves", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { data } = useGetOrganizationImages("org-123");
      queryData.value = [createMockContentImage({ id: "img-1" })];

      expect(data.value).toHaveLength(1);
      expect(data.value[0]).toHaveProperty("id", "img-1");
    });

    it("error is a Vue ref", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { error } = useGetOrganizationImages("org-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { error } = useGetOrganizationImages("org-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Query Function

  describe("Query Function", () => {
    it("fetches the images for the requested organization", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      useGetOrganizationImages("org-123");
      await lastOptions.query();

      expect(mockFetchOrganizationImages).toHaveBeenCalledWith("org-123");
    });

    it("caches the fetched images in the store", async () => {
      const images = [createMockContentImage({ id: "img-1" })];
      mockFetchOrganizationImages.mockResolvedValue(images);

      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      useGetOrganizationImages("org-123");
      await lastOptions.query();

      expect(mockSetImages).toHaveBeenCalledWith(images);
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("org-123");

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty("value");
    });

    it("accepts empty string ID without error", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("");

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as ContentImage array", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { data } = useGetOrganizationImages("org-123");

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockContentImage produces valid ContentImage structure", () => {
      const image = createMockContentImage({ id: "test-img" });

      expect(image).toHaveProperty("id", "test-img");
      expect(image).toHaveProperty("fileObject");
    });
  });
});
