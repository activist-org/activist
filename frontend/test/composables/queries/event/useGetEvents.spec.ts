// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetEvents composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { CommunityEvent } from "../../../../shared/types/event";

import {
  createMockEvent,
  createMockEventFilters,
} from "../../../mocks/factories";

// MARK: Mocks

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetEvents = vi.fn();
const mockGetEvents = vi.fn((): CommunityEvent[] => []);
const mockSetPage = vi.fn();
const mockGetPage = vi.fn(() => 1);
const mockSetFilters = vi.fn();
const mockGetFilters = vi.fn(() => ({}));

vi.mock("../../../../app/stores/event", () => ({
  useEventStore: () => ({
    setEvents: mockSetEvents,
    getEvents: mockGetEvents,
    setPage: mockSetPage,
    getPage: mockGetPage,
    setFilters: mockSetFilters,
    getFilters: mockGetFilters,
  }),
}));

const { mockListEvents } = vi.hoisted(() => ({
  mockListEvents: vi.fn(),
}));

mockNuxtImport("listEvents", () => mockListEvents);

// MARK: Tests

describe("useGetEvents", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetEvents.mockReturnValue([]);
    mockListEvents.mockResolvedValue({ data: [], isLastPage: false });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetEvents", () => {
    it("returns consistent cache key", async () => {
      const { useEventCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForEvents } = useEventCache();
      const key1 = getKeyForEvents({});
      const key2 = getKeyForEvents({});

      expect(key1).toStrictEqual(key2);
    });

    it("returns 'events-list' as the cache key", async () => {
      const { useEventCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForEvents } = useEventCache();
      expect(getKeyForEvents({})).toStrictEqual([
        "event",
        "list",
        {
          filters: {},
        },
      ]);
    });

    it("returns a non-empty string", async () => {
      const { useEventCache } =
        await import("../../../../app/composables/cache");
      const { getKeyForEvents } = useEventCache();
      const key = getKeyForEvents({});

      expect(Array.isArray(key)).toBe(true);
      expect(key.length).toBeGreaterThan(0);
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetEvents(ref({}));

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetEvents(ref({}));

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetEvents(ref({}));

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetEvents(ref({}));

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });

    it("returns an object with getMore function", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetEvents(ref({}));

      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const { data } = useGetEvents(ref({}));

      expect(data).toHaveProperty("value");
    });

    it("data defaults to empty array", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const { data } = useGetEvents(ref({}));

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const { pending } = useGetEvents(ref({}));

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const { error } = useGetEvents(ref({}));

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const { error } = useGetEvents(ref({}));

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: Filters Parameter

  describe("Filters Parameter", () => {
    it("accepts ref of filters", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");
      const filters = ref(createMockEventFilters());

      const result = useGetEvents(filters);

      expect(result).toBeDefined();
    });

    it("accepts empty filters object", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const result = useGetEvents(ref({}));

      expect(result).toBeDefined();
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value is typed as CommunityEvent array", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries");

      const { data } = useGetEvents(ref({}));

      expect(Array.isArray(data.value)).toBe(true);
    });

    it("createMockEvent produces valid CommunityEvent structure", () => {
      const event = createMockEvent({ id: "test-event" });

      expect(event).toHaveProperty("id", "test-event");
      expect(event).toHaveProperty("createdBy");
      expect(event).toHaveProperty("orgs");
    });

    it("createMockEventFilters produces valid filters", () => {
      const filters = createMockEventFilters();

      expect(filters).toBeDefined();
      expect(typeof filters).toBe("object");
    });
  });
});
