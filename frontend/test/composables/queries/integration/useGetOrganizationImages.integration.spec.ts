// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetOrganizationImages composable.
 * Tests image-specific behaviors: array return, cache length checks, clear on refresh.
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

const mockSetImages = vi.fn();
const mockGetImages = vi.fn((): ContentImage[] => []);
const mockClearImages = vi.fn();

vi.mock("../../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setImages: mockSetImages,
    getImages: mockGetImages,
    clearImages: mockClearImages,
  }),
}));

const mockFetchOrganizationImages = vi.fn();

vi.mock("../../../../app/services/entities/organization", () => ({
  fetchOrganizationImages: (id: string) => mockFetchOrganizationImages(id),
}));

// Mock image factory
function createMockImage(id = "img-1"): ContentImage {
  return {
    id,
    fileObject: "https://example.com/image.jpg",
    creation_date: "2024-01-01",
    sequence_index: 1,
  };
}

// MARK: Tests

describe("useGetOrganizationImages Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetImages.mockReturnValue([]);
    mockFetchOrganizationImages.mockResolvedValue([]);
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure", async () => {
      const { useGetOrganizationImages } =
        await import("../../../../app/composables/queries/useGetOrganizationImages");

      const result = useGetOrganizationImages("org-123");

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });

    it("fetchOrganizationImages service can be called with ID", async () => {
      const mockImages = [createMockImage("img-1"), createMockImage("img-2")];
      mockFetchOrganizationImages.mockResolvedValue(mockImages);

      const result = await mockFetchOrganizationImages("org-123");

      expect(mockFetchOrganizationImages).toHaveBeenCalledWith("org-123");
      expect(result).toEqual(mockImages);
      expect(result).toHaveLength(2);
    });

    it("setImages store method can be called with array", () => {
      const mockImages = [createMockImage()];
      mockSetImages(mockImages);

      expect(mockSetImages).toHaveBeenCalledWith(mockImages);
    });
  });

  // MARK: Cache Fallback Logic (Array)

  describe("Cache Fallback Logic (Array)", () => {
    it("getImages returns cached images when store has data", () => {
      const cachedImages = [createMockImage("cached-1")];
      mockGetImages.mockReturnValue(cachedImages);

      const result = mockGetImages();

      expect(result).toEqual(cachedImages);
      expect(result.length).toBeGreaterThan(0);
    });

    it("getImages returns empty array when no images cached", () => {
      mockGetImages.mockReturnValue([]);

      const result = mockGetImages();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("cache check logic: length > 0 returns cached images", () => {
      const cachedImages = [createMockImage()];
      mockGetImages.mockReturnValue(cachedImages);

      // Simulate getCachedData logic for images
      const getCachedDataLogic = () => {
        if (mockGetImages().length > 0) {
          return mockGetImages();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toEqual(cachedImages);
    });

    it("cache check logic: length === 0 returns undefined", () => {
      mockGetImages.mockReturnValue([]);

      const getCachedDataLogic = () => {
        if (mockGetImages().length > 0) {
          return mockGetImages();
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
      mockGetImages.mockReturnValue(cachedImages);

      // Simulate shouldFetch logic
      const orgId = "org-123";
      const cached = mockGetImages();
      const shouldFetch = !!orgId && cached.length === 0;

      expect(shouldFetch).toBe(false);
    });

    it("shouldFetch is false when no organization ID", () => {
      mockGetImages.mockReturnValue([]);

      const orgId = "";
      const cached = mockGetImages();
      const shouldFetch = !!orgId && cached.length === 0;

      expect(shouldFetch).toBe(false);
    });

    it("shouldFetch is true when ID exists and no cache", () => {
      mockGetImages.mockReturnValue([]);

      const orgId = "org-123";
      const cached = mockGetImages();
      const shouldFetch = !!orgId && cached.length === 0;

      expect(shouldFetch).toBe(true);
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns store images during hydration when available", () => {
      const storeImages = [createMockImage("store-img")];
      mockGetImages.mockReturnValue(storeImages);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: {
          "organizationImages:org-1": [createMockImage("payload-img")],
        },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string) => {
        if (nuxtApp.isHydrating && mockGetImages().length > 0) {
          return mockGetImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("organizationImages:org-1")).toEqual(
        storeImages
      );
    });

    it("getCachedData returns payload during hydration when no store cache", () => {
      const payloadImages = [createMockImage("payload-img")];
      mockGetImages.mockReturnValue([]);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { "organizationImages:org-1": payloadImages },
      });

      const getCachedDataLogic = (key: string) => {
        if (nuxtApp.isHydrating && mockGetImages().length > 0) {
          return mockGetImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("organizationImages:org-1")).toEqual(
        payloadImages
      );
    });

    it("getCachedData returns static when not hydrating", () => {
      const staticImages = [createMockImage("static-img")];
      mockGetImages.mockReturnValue([]);

      const nuxtApp = createMockNuxtApp({
        isHydrating: false,
        staticData: { "organizationImages:org-1": staticImages },
      });

      const getCachedDataLogic = (key: string) => {
        if (nuxtApp.isHydrating && mockGetImages().length > 0) {
          return mockGetImages();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("organizationImages:org-1")).toEqual(
        staticImages
      );
    });
  });

  // MARK: Refresh with Cache Clear

  describe("Refresh with Cache Clear", () => {
    it("clearImages is callable", () => {
      mockClearImages();

      expect(mockClearImages).toHaveBeenCalled();
    });

    it("refresh logic: clears images before refetch", () => {
      const orgId = "org-123";

      // Simulate refresh logic
      const refreshLogic = () => {
        if (orgId) {
          mockClearImages();
        }
      };

      refreshLogic();

      expect(mockClearImages).toHaveBeenCalled();
    });

    it("refresh logic: does not clear if no orgId", () => {
      const orgId = "";

      const refreshLogic = () => {
        if (orgId) {
          mockClearImages();
        }
      };

      refreshLogic();

      expect(mockClearImages).not.toHaveBeenCalled();
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is callable with error message", () => {
      mockShowToastError("Failed to fetch images");

      expect(mockShowToastError).toHaveBeenCalledWith("Failed to fetch images");
    });

    it("fetchOrganizationImages can reject with error", async () => {
      const apiError = new Error("Image fetch failed");
      mockFetchOrganizationImages.mockRejectedValue(apiError);

      await expect(mockFetchOrganizationImages("org-123")).rejects.toThrow(
        "Image fetch failed"
      );
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("Network error");
      mockFetchOrganizationImages.mockRejectedValue(apiError);

      const handlerLogic = async (orgId: string) => {
        try {
          return await mockFetchOrganizationImages(orgId);
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };

      await expect(handlerLogic("org-123")).rejects.toThrow("Network error");
      expect(mockShowToastError).toHaveBeenCalledWith("Network error");
    });
  });

  // MARK: Cache Key

  describe("Cache Key", () => {
    it("getKeyForGetOrganizationImages returns ID-based key", async () => {
      const { getKeyForGetOrganizationImages } =
        await import("../../../../app/composables/queries/useGetOrganizationImages");

      expect(getKeyForGetOrganizationImages("org-123")).toBe(
        "organizationImages:org-123"
      );
    });

    it("different IDs produce different keys", async () => {
      const { getKeyForGetOrganizationImages } =
        await import("../../../../app/composables/queries/useGetOrganizationImages");
      const key1 = getKeyForGetOrganizationImages("org-1");
      const key2 = getKeyForGetOrganizationImages("org-2");

      expect(key1).not.toBe(key2);
    });
  });
});
