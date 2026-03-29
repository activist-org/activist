// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGetEvent composable.
 *
 * Note: Handler execution behavior is tested in integration tests.
 * These unit tests focus on structure, cache keys, and return values.
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CommunityEvent } from "../../../shared/types/event";

import { getKeyForGetEvent } from "../../../app/composables/queries/useGetEvent";
import { createMockEvent } from "../../mocks/factories";

// MARK: Mocks

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => {
    const mockShowToastError = vi.fn();
    return {
      showToastError: mockShowToastError,
    };
  },
}));

const mockSetEvent = vi.fn();
const mockGetEvent = vi.fn((): CommunityEvent | null => null);

vi.mock("../../../app/stores/event", () => ({
  useEventStore: () => ({
    setEvent: mockSetEvent,
    getEvent: mockGetEvent,
  }),
}));

const { mockGetEventService } = vi.hoisted(() => ({
  mockGetEventService: vi.fn(),
}));

mockNuxtImport("getEvent", () => mockGetEventService);

// MARK: Tests

describe("useGetEvent", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetEvent.mockReturnValue(null);
    mockGetEventService.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // MARK: Cache Key

  describe("getKeyForGetEvent", () => {
    it("includes event ID in cache key", () => {
      const key = getKeyForGetEvent("event-123");

      expect(key).toContain("event-123");
    });

    it("returns 'event:{id}' format", () => {
      expect(getKeyForGetEvent("event-123")).toBe("event:event-123");
    });

    it("returns consistent key for same ID", () => {
      const key1 = getKeyForGetEvent("event-456");
      const key2 = getKeyForGetEvent("event-456");

      expect(key1).toBe(key2);
    });

    it("returns different keys for different IDs", () => {
      const key1 = getKeyForGetEvent("event-1");
      const key2 = getKeyForGetEvent("event-2");

      expect(key1).not.toBe(key2);
    });

    it("handles empty string ID", () => {
      const key = getKeyForGetEvent("");

      expect(key).toBe("event:");
    });
  });

  // MARK: Composable Structure

  describe("Composable Structure", () => {
    it("returns an object with data property", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("event-123");

      expect(result).toHaveProperty("data");
    });

    it("returns an object with pending property", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("event-123");

      expect(result).toHaveProperty("pending");
    });

    it("returns an object with error property", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("event-123");

      expect(result).toHaveProperty("error");
    });

    it("returns an object with refresh function", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("event-123");

      expect(result).toHaveProperty("refresh");
      expect(typeof result.refresh).toBe("function");
    });
  });

  // MARK: Reactive Properties

  describe("Reactive Properties", () => {
    it("data is a Vue ref with value property", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const { data } = useGetEvent("event-123");

      expect(data).toHaveProperty("value");
    });

    it("pending is a Vue ref with boolean value", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const { pending } = useGetEvent("event-123");

      expect(pending).toHaveProperty("value");
      expect(typeof pending.value).toBe("boolean");
    });

    it("error is a Vue ref", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const { error } = useGetEvent("event-123");

      expect(error).toHaveProperty("value");
    });

    it("error is initially falsy", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const { error } = useGetEvent("event-123");

      expect(error.value).toBeFalsy();
    });
  });

  // MARK: ID Parameter Handling

  describe("ID Parameter Handling", () => {
    it("accepts string ID", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("event-123");

      expect(result).toBeDefined();
      expect(result.data).toHaveProperty("value");
    });

    it("accepts empty string ID without error", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("");

      expect(result).toBeDefined();
    });

    it("returns same structure regardless of ID value", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const result1 = useGetEvent("event-1");
      const result2 = useGetEvent("event-2");

      expect(Object.keys(result1)).toEqual(Object.keys(result2));
    });
  });

  // MARK: Type Safety

  describe("Type Safety", () => {
    it("data.value can be CommunityEvent or null", async () => {
      const { useGetEvent } =
        await import("../../../app/composables/queries/useGetEvent");

      const { data } = useGetEvent("event-123");

      expect("value" in data).toBe(true);
    });

    it("createMockEvent produces valid CommunityEvent structure", () => {
      const event = createMockEvent({ id: "test-event" });

      expect(event).toHaveProperty("id", "test-event");
      expect(event).toHaveProperty("createdBy");
      expect(event).toHaveProperty("orgs");
    });
  });
});
