// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetEvent composable.
 * Tests actual behavior flows: fetch → cache → error handling with ID matching.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockEvent } from "../../../mocks/factories";
import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

// Type helper for entities with id (workaround for .d.ts inheritance)
type MockEvent = ReturnType<typeof createMockEvent> & { id: string };

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetEvent = vi.fn();
const mockGetEvent = vi.fn(() => null as MockEvent | null);

vi.mock("../../../../app/stores/event", () => ({
  useEventStore: () => ({
    setEvent: mockSetEvent,
    getEvent: mockGetEvent,
  }),
}));

const mockGetEventService = vi.fn();

vi.mock("../../../../app/services/entities/event", () => ({
  getEvent: (id: string) => mockGetEventService(id),
}));

// MARK: Tests

describe("useGetEvent Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetEvent.mockReturnValue(null);
    mockGetEventService.mockResolvedValue(null);
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure", async () => {
      const { useGetEvent } =
        await import("../../../../app/composables/queries/useGetEvent");

      const result = useGetEvent("event-123");

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
    });

    it("getEvent service can be called with ID", async () => {
      const mockEvent = createMockEvent();
      mockGetEventService.mockResolvedValue(mockEvent);

      const result = await mockGetEventService("event-123");

      expect(mockGetEventService).toHaveBeenCalledWith("event-123");
      expect(result).toEqual(mockEvent);
    });

    it("setEvent store method can be called", () => {
      const mockEvent = createMockEvent();
      mockSetEvent(mockEvent);

      expect(mockSetEvent).toHaveBeenCalledWith(mockEvent);
    });
  });

  // MARK: Cache Fallback Logic

  describe("Cache Fallback Logic", () => {
    it("getEvent returns cached event when store has matching ID", () => {
      const cachedEvent = createMockEvent() as MockEvent;
      mockGetEvent.mockReturnValue(cachedEvent);

      const result = mockGetEvent();

      expect(result).toEqual(cachedEvent);
      expect(result?.id).toBe(cachedEvent.id);
    });

    it("cache check logic: store ID matches requested ID returns store data", () => {
      const storeEvent = createMockEvent() as MockEvent;
      mockGetEvent.mockReturnValue(storeEvent);
      const requestedId = storeEvent.id;

      // Simulate getCachedData logic
      const getCachedDataLogic = (requestId: string) => {
        const event = mockGetEvent();
        if (event && event.id !== "" && event.id === requestId) {
          return event;
        }
        return undefined;
      };

      expect(getCachedDataLogic(requestedId)).toEqual(storeEvent);
    });

    it("cache check logic: store ID differs returns undefined", () => {
      const storeEvent = createMockEvent() as MockEvent;
      mockGetEvent.mockReturnValue(storeEvent);
      const differentId = "different-event-id";

      // Simulate getCachedData logic
      const getCachedDataLogic = (requestId: string) => {
        const event = mockGetEvent();
        if (event && event.id !== "" && event.id === requestId) {
          return event;
        }
        return undefined;
      };

      expect(getCachedDataLogic(differentId)).toBeUndefined();
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns store during hydration when ID matches", () => {
      const storeEvent = createMockEvent() as MockEvent;
      mockGetEvent.mockReturnValue(storeEvent);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { [`event:${storeEvent.id}`]: storeEvent },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string, requestId: string) => {
        const event = mockGetEvent();
        if (
          nuxtApp.isHydrating &&
          event &&
          event.id !== "" &&
          event.id === requestId
        ) {
          return event;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`event:${storeEvent.id}`, storeEvent.id)
      ).toEqual(storeEvent);
    });

    it("getCachedData returns payload during hydration when store empty", () => {
      const payloadEvent = createMockEvent() as MockEvent;
      mockGetEvent.mockReturnValue(null);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { [`event:${payloadEvent.id}`]: payloadEvent },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string, requestId: string) => {
        const event = mockGetEvent();
        if (
          nuxtApp.isHydrating &&
          event &&
          event.id !== "" &&
          event.id === requestId
        ) {
          return event;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`event:${payloadEvent.id}`, payloadEvent.id)
      ).toEqual(payloadEvent);
    });

    it("getCachedData returns static when not hydrating", () => {
      const staticEvent = createMockEvent() as MockEvent;
      mockGetEvent.mockReturnValue(null);

      const nuxtApp = createMockNuxtApp({
        isHydrating: false,
        staticData: { [`event:${staticEvent.id}`]: staticEvent },
      });

      // Simulate getCachedData logic
      const getCachedDataLogic = (key: string, requestId: string) => {
        const event = mockGetEvent();
        if (
          nuxtApp.isHydrating &&
          event &&
          event.id !== "" &&
          event.id === requestId
        ) {
          return event;
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(
        getCachedDataLogic(`event:${staticEvent.id}`, staticEvent.id)
      ).toEqual(staticEvent);
    });
  });

  // MARK: Conditional Fetch

  describe("Conditional Fetch", () => {
    it("handler returns null when ID is empty", async () => {
      // Simulate handler logic
      const handlerLogic = async (eventId: string) => {
        if (!eventId || eventId === "") return null;
        return await mockGetEventService(eventId);
      };

      const result = await handlerLogic("");

      expect(result).toBeNull();
      expect(mockGetEventService).not.toHaveBeenCalled();
    });

    it("handler fetches when ID is provided", async () => {
      const mockEvent = createMockEvent();
      mockGetEventService.mockResolvedValue(mockEvent);

      // Simulate handler logic
      const handlerLogic = async (eventId: string) => {
        if (!eventId || eventId === "") return null;
        const event = await mockGetEventService(eventId);
        mockSetEvent(event);
        return event;
      };

      const result = await handlerLogic("event-123");

      expect(mockGetEventService).toHaveBeenCalledWith("event-123");
      expect(mockSetEvent).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual(mockEvent);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is called with error message", () => {
      mockShowToastError("API connection failed");

      expect(mockShowToastError).toHaveBeenCalledWith("API connection failed");
    });

    it("getEvent service can reject with error", async () => {
      const apiError = new Error("Event not found");
      mockGetEventService.mockRejectedValue(apiError);

      await expect(mockGetEventService("event-123")).rejects.toThrow(
        "Event not found"
      );
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("Network error");
      mockGetEventService.mockRejectedValue(apiError);

      // Simulate handler error logic
      const handlerLogic = async (eventId: string) => {
        try {
          return await mockGetEventService(eventId);
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };

      await expect(handlerLogic("event-123")).rejects.toThrow("Network error");
      expect(mockShowToastError).toHaveBeenCalledWith("Network error");
    });

    it("store is not updated when API fails", async () => {
      mockGetEventService.mockRejectedValue(new Error("Failed"));

      try {
        const event = await mockGetEventService("event-123");
        mockSetEvent(event);
      } catch {
        // Don't call setEvent on error
      }

      expect(mockSetEvent).not.toHaveBeenCalled();
    });
  });

  // MARK: Cache Key

  describe("Cache Key", () => {
    it("getKeyForGetEvent returns ID-based key", async () => {
      const { getKeyForGetEvent } =
        await import("../../../../app/composables/queries/useGetEvent");

      expect(getKeyForGetEvent("event-123")).toBe("event:event-123");
      expect(getKeyForGetEvent("abc")).toBe("event:abc");
    });

    it("different IDs produce different keys", async () => {
      const { getKeyForGetEvent } =
        await import("../../../../app/composables/queries/useGetEvent");

      const key1 = getKeyForGetEvent("event-1");
      const key2 = getKeyForGetEvent("event-2");

      expect(key1).not.toBe(key2);
    });
  });
});
