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

import type { ContentImage } from "../../../shared/types/file-type";

import { getKeyForGetOrganizationImages } from "../../../app/composables/queries/useGetOrganizationImages";
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
const mockGetImages = vi.fn((): ContentImage[] => []);
const mockClearImages = vi.fn();

vi.mock("../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setImages: mockSetImages,
    getImages: mockGetImages,
    clearImages: mockClearImages,
  }),
}));

const { mockFetchOrganizationImages } = vi.hoisted(() => ({
  mockFetchOrganizationImages: vi.fn(),
}));

mockNuxtImport("fetchOrganizationImages", () => mockFetchOrganizationImages);

// MARK: Tests

describe("useGetOrganizationImages", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetImages.mockReturnValue([]);
    mockFetchOrganizationImages.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetOrganizationImages", () => {
    it("includes organization ID in cache key", () => {
      const key = getKeyForGetOrganizationImages("org-123");

      expect(key).toContain("org-123");
    });

    it("returns 'organizationImages:{id}' format", () => {
      expect(getKeyForGetOrganizationImages("org-123")).toBe(
        "organizationImages:org-123"
      );
    });

    it("returns consistent key for same ID", () => {
      const key1 = getKeyForGetOrganizationImages("org-456");
      const key2 = getKeyForGetOrganizationImages("org-456");

      expect(key1).toBe(key2);
    });

    it("returns different keys for different IDs", () => {
      const key1 = getKeyForGetOrganizationImages("org-1");
      const key2 = getKeyForGetOrganizationImages("org-2");

      expect(key1).not.toBe(key2);
    });

    it("handles empty string ID", () => {
      const key = getKeyForGetOrganizationImages("");

      expect(key).toBe("organizationImages:");
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
    it("data is a Vue ref with value property", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { data } = useGetOrganizationImages("org-123");

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { data } = useGetOrganizationImages("org-123");

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetOrganizationImages } =
        await import("../../../app/composables/queries/useGetOrganizationImages");

      const { pending } = useGetOrganizationImages("org-123");

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
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
