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

import type { ContentImage } from "../../../shared/types/file-type";

import { getKeyForGetGroupImages } from "../../../app/composables/queries/useGetGroupImages";
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

const mockSetGroupImages = vi.fn();
const mockGetGroupImages = vi.fn((): ContentImage[] => []);
const mockClearGroupImages = vi.fn();

vi.mock("../../../app/stores/group", () => ({
  useGroupStore: () => ({
    setGroupImages: mockSetGroupImages,
    getGroupImages: mockGetGroupImages,
    clearGroupImages: mockClearGroupImages,
  }),
}));

const { mockFetchGroupImages } = vi.hoisted(() => ({
  mockFetchGroupImages: vi.fn(),
}));

mockNuxtImport("fetchGroupImages", () => mockFetchGroupImages);

// MARK: Tests

describe("useGetGroupImages", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetGroupImages.mockReturnValue([]);
    mockFetchGroupImages.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetGroupImages", () => {
    it("includes group ID in cache key", () => {
      const key = getKeyForGetGroupImages("group-123");

      expect(key).toContain("group-123");
    });

    it("returns 'groupImages:{id}' format", () => {
      expect(getKeyForGetGroupImages("group-123")).toBe(
        "groupImages:group-123"
      );
    });

    it("returns consistent key for same ID", () => {
      const key1 = getKeyForGetGroupImages("group-456");
      const key2 = getKeyForGetGroupImages("group-456");

      expect(key1).toBe(key2);
    });

    it("returns different keys for different IDs", () => {
      const key1 = getKeyForGetGroupImages("group-1");
      const key2 = getKeyForGetGroupImages("group-2");

      expect(key1).not.toBe(key2);
    });

    it("handles empty string ID", () => {
      const key = getKeyForGetGroupImages("");

      expect(key).toBe("groupImages:");
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("group-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const { data } = useGetGroupImages("group-123");

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const { data } = useGetGroupImages("group-123");

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const { pending } = useGetGroupImages("group-123");

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const { error } = useGetGroupImages("group-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const { error } = useGetGroupImages("group-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("group-123");

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty("value");
    });

    it("accepts empty string ID without error", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

      const result = useGetGroupImages("");

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as ContentImage array", async () => {
      const { useGetGroupImages } =
        await import("../../../app/composables/queries/useGetGroupImages");

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
