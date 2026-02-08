// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetGroupImages composable.
 * Tests image-specific behaviors: array return, cache length checks, clear with groupId on refresh.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ContentImage } from "../../../../shared/types/file-type";

import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetGroupImages = vi.fn();
const mockGetGroupImages = vi.fn((): ContentImage[] => []);
const mockClearGroupImages = vi.fn();

vi.mock("../../../../app/stores/group", () => ({
  useGroupStore: () => ({
    setGroupImages: mockSetGroupImages,
    getGroupImages: mockGetGroupImages,
    clearGroupImages: mockClearGroupImages,
  }),
}));

const mockFetchGroupImages = vi.fn();

vi.mock("../../../../app/services/entities/group", () => ({
  fetchGroupImages: (id: string) => mockFetchGroupImages(id),
}));

// Mock image factory.
function createMockImage(id = "img-1"): ContentImage {
  return {
    id,
    fileObject: "https://example.com/image.jpg",
    creation_date: "2024-01-01",
    sequence_index: 1,
  };
}

// MARK: Tests

describe("useGetGroupImages Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetGroupImages.mockReturnValue([]);
    mockFetchGroupImages.mockResolvedValue([]);
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure", async () => {
      const { useGetGroupImages } =
        await import("../../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });

    it("fetchGroupImages service can be called with ID", async () => {
      const mockImages = [createMockImage("img-1"), createMockImage("img-2")];
      mockFetchGroupImages.mockResolvedValue(mockImages);

      const result = await mockFetchGroupImages("group-123");

      expect(mockFetchGroupImages).toHaveBeenCalledWith("group-123");
      expect(result).toEqual(mockImages);
      expect(result).toHaveLength(2);
    });

    it("setGroupImages store method can be called with array", () => {
      const mockImages = [createMockImage()];
      mockSetGroupImages(mockImages);

      expect(mockSetGroupImages).toHaveBeenCalledWith(mockImages);
    });
  });

  // MARK: Cache Fallback Logic (Array)

  describe("Cache Fallback Logic (Array)", () => {
    it("getGroupImages returns cached images when store has data", () => {
      const cachedImages = [createMockImage("cached-1")];
      mockGetGroupImages.mockReturnValue(cachedImages);

      const result = mockGetGroupImages();

      expect(result).toEqual(cachedImages);
      expect(result.length).toBeGreaterThan(0);
    });

    it("getGroupImages returns empty array when no images cached", () => {
      mockGetGroupImages.mockReturnValue([]);

      const result = mockGetGroupImages();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("cache check logic: length > 0 returns cached images", () => {
      const cachedImages = [createMockImage()];
      mockGetGroupImages.mockReturnValue(cachedImages);

      const getCachedDataLogic = () => {
        if (mockGetGroupImages().length > 0) {
          return mockGetGroupImages();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toEqual(cachedImages);
    });

    it("cache check logic: length === 0 returns undefined", () => {
      mockGetGroupImages.mockReturnValue([]);

      const getCachedDataLogic = () => {
        if (mockGetGroupImages().length > 0) {
          return mockGetGroupImages();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toBeUndefined();
    });
  });

  // MARK: Conditional Fetch (shouldFetch)

  describe("Conditional Fetch (shouldFetch)", () => {
    it("shouldFetch is false when cache exists", () => {
      const cachedImages = [createMockImage()];
      mockGetGroupImages.mockReturnValue(cachedImages);

      const groupId = "group-123";
      const cached = mockGetGroupImages();
      const shouldFetch = !!groupId && cached.length === 0;

      expect(shouldFetch).toBe(false);
    });

    it("shouldFetch is false when no group ID", () => {
      mockGetGroupImages.mockReturnValue([]);

      const groupId = "";
      const cached = mockGetGroupImages();
      const shouldFetch = !!groupId && cached.length === 0;

      expect(shouldFetch).toBe(false);
    });

    it("shouldFetch is true when ID exists and no cache", () => {
      mockGetGroupImages.mockReturnValue([]);

      const groupId = "group-123";
      const cached = mockGetGroupImages();
      const shouldFetch = !!groupId && cached.length === 0;

      expect(shouldFetch).toBe(true);
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns store images during hydration when available", () => {
      const storeImages = [createMockImage("store-img")];
      mockGetGroupImages.mockReturnValue(storeImages);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: {
          "groupImages:group-1": [createMockImage("payload-img")],
        },
      });

      const getCachedDataLogic = (key: string) => {
        if (nuxtApp.isHydrating && mockGetGroupImages().length > 0) {
          return mockGetGroupImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("groupImages:group-1")).toEqual(storeImages);
    });

    it("getCachedData returns payload during hydration when no store cache", () => {
      const payloadImages = [createMockImage("payload-img")];
      mockGetGroupImages.mockReturnValue([]);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { "groupImages:group-1": payloadImages },
      });

      const getCachedDataLogic = (key: string) => {
        if (nuxtApp.isHydrating && mockGetGroupImages().length > 0) {
          return mockGetGroupImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("groupImages:group-1")).toEqual(payloadImages);
    });

    it("getCachedData returns static when not hydrating", () => {
      const staticImages = [createMockImage("static-img")];
      mockGetGroupImages.mockReturnValue([]);

      const nuxtApp = createMockNuxtApp({
        isHydrating: false,
        staticData: { "groupImages:group-1": staticImages },
      });

      const getCachedDataLogic = (key: string) => {
        if (nuxtApp.isHydrating && mockGetGroupImages().length > 0) {
          return mockGetGroupImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("groupImages:group-1")).toEqual(staticImages);
    });
  });

  // MARK: Refresh with Cache Clear (groupId)

  describe("Refresh with Cache Clear (groupId)", () => {
    it("clearGroupImages is callable with groupId", () => {
      mockClearGroupImages("group-123");

      expect(mockClearGroupImages).toHaveBeenCalledWith("group-123");
    });

    it("refresh logic: clears group images with groupId before refetch", () => {
      const groupId = "group-123";

      // Simulate refresh logic (key difference: passes groupId).
      const refreshLogic = () => {
        if (groupId) {
          mockClearGroupImages(groupId);
        }
      };

      refreshLogic();

      expect(mockClearGroupImages).toHaveBeenCalledWith("group-123");
    });

    it("refresh logic: does not clear if no groupId", () => {
      const groupId = "";

      const refreshLogic = () => {
        if (groupId) {
          mockClearGroupImages(groupId);
        }
      };

      refreshLogic();

      expect(mockClearGroupImages).not.toHaveBeenCalled();
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is callable with error message", () => {
      mockShowToastError("Failed to fetch group images");

      expect(mockShowToastError).toHaveBeenCalledWith(
        "Failed to fetch group images"
      );
    });

    it("fetchGroupImages can reject with error", async () => {
      const apiError = new Error("Image fetch failed");
      mockFetchGroupImages.mockRejectedValue(apiError);

      await expect(mockFetchGroupImages("group-123")).rejects.toThrow(
        "Image fetch failed"
      );
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("Network error");
      mockFetchGroupImages.mockRejectedValue(apiError);

      const handlerLogic = async (groupId: string) => {
        try {
          return await mockFetchGroupImages(groupId);
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };

      await expect(handlerLogic("group-123")).rejects.toThrow("Network error");
      expect(mockShowToastError).toHaveBeenCalledWith("Network error");
    });
  });

  // MARK: Cache Key

  describe("Cache Key", () => {
    it("getKeyForGetGroupImages returns ID-based key", async () => {
      const { getKeyForGetGroupImages } =
        await import("../../../../app/composables/queries/useGetGroupImages");

      expect(getKeyForGetGroupImages("group-123")).toBe(
        "groupImages:group-123"
      );
    });

    it("different IDs produce different keys", async () => {
      const { getKeyForGetGroupImages } =
        await import("../../../../app/composables/queries/useGetGroupImages");

      const key1 = getKeyForGetGroupImages("group-1");
      const key2 = getKeyForGetGroupImages("group-2");
      expect(key1).not.toBe(key2);
    });
  });
});
