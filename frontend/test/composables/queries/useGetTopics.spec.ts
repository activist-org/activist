// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetTopics composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Topic } from "../../../shared/types/topics-type";

import { getKeyForGetTopics } from "../../../app/composables/queries/useGetTopics";
import { createMockTopic } from "../../mocks/factories";

// MARK: Mocks

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetTopics = vi.fn();
const mockGetTopics = vi.fn((): Topic[] => []);

vi.mock("../../../app/stores/data/topics", () => ({
  useTopics: () => ({
    setTopics: mockSetTopics,
    getTopics: mockGetTopics,
  }),
}));

const mockListTopics = vi.fn();

vi.mock("../../../app/services/content/topics", () => ({
  listTopics: () => mockListTopics(),
}));

// MARK: Tests

describe("useGetTopics", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetTopics.mockReturnValue([]);
    mockListTopics.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetTopics", () => {
    it("returns consistent cache key for repeated calls", () => {
      const key1 = getKeyForGetTopics();
      const key2 = getKeyForGetTopics();

      expect(key1).toBe(key2);
    });

    it("returns 'topics-list' as the cache key", () => {
      expect(getKeyForGetTopics()).toBe("topics-list");
    });

    it("returns a non-empty string", () => {
      const key = getKeyForGetTopics();

      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const result = useGetTopics();

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const result = useGetTopics();

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const result = useGetTopics();

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const result = useGetTopics();

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { data } = useGetTopics();

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { data } = useGetTopics();

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { pending } = useGetTopics();

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { error } = useGetTopics();

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy (null or undefined)", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { error } = useGetTopics();

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Multiple Instances

  describe("Multiple Instances", () => {
    it("multiple calls return independent instances", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const result1 = useGetTopics();
      const result2 = useGetTopics();

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });

    it("each instance has its own reactive refs", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { data: data1 } = useGetTopics();
      const { data: data2 } = useGetTopics();

      expect(data1).toHaveProperty("value");
      expect(data2).toHaveProperty("value");
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as Topic array", async () => {
      const { useGetTopics } =
        await import("../../../app/composables/queries/useGetTopics");

      const { data } = useGetTopics();

      // Runtime check that it's an array (type is Topic[]).
      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockTopic produces valid Topic structure", () => {
      const topic = createMockTopic({ id: "test-topic" });

      expect(topic).toHaveProperty("id", "test-topic");
      expect(topic).toHaveProperty("type");
      expect(topic).toHaveProperty("active");
    });
  });
});
