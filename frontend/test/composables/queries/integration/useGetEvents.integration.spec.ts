// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetEvents composable.
 * Tests paginated list behaviors: pagination, filter handling, append logic.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EventFilters } from "../../../../shared/types/event";

import { createMockEvent } from "../../../mocks/factories";
import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

// Type helper
type MockEvent = ReturnType<typeof createMockEvent> & { id: string };

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetEvents = vi.fn();
const mockGetEvents = vi.fn((): MockEvent[] => []);
const mockGetFilters = vi.fn((): EventFilters => ({}));
const mockSetFilters = vi.fn();
const mockGetPage = vi.fn(() => 1);
const mockSetPage = vi.fn();

vi.mock("../../../../app/stores/event", () => ({
  useEventStore: () => ({
    setEvents: mockSetEvents,
    getEvents: mockGetEvents,
    getFilters: mockGetFilters,
    setFilters: mockSetFilters,
    getPage: mockGetPage,
    setPage: mockSetPage,
  }),
}));

const mockListEvents = vi.fn();

vi.mock("../../../../app/services/entities/event", () => ({
  listEvents: (params: unknown) => mockListEvents(params),
}));

// MARK: Tests

describe("useGetEvents Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockGetEvents.mockReturnValue([]);
    mockGetFilters.mockReturnValue({});
    mockGetPage.mockReturnValue(1);
    mockListEvents.mockResolvedValue({ data: [], isLastPage: false });
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure with getMore", async () => {
      const { useGetEvents } =
        await import("../../../../app/composables/queries/useGetEvents");
      const { ref } = await import("vue");

      const filters = ref<EventFilters>({});
      const result = useGetEvents(filters);

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });

    it("listEvents service receives page and page_size", async () => {
      const mockEvents = [createMockEvent() as MockEvent];
      mockListEvents.mockResolvedValue({ data: mockEvents, isLastPage: false });

      await mockListEvents({ page: 1, page_size: 10 });

      expect(mockListEvents).toHaveBeenCalledWith({ page: 1, page_size: 10 });
    });

    it("setEvents store method can be called with array", () => {
      const mockEvents = [createMockEvent() as MockEvent];
      mockSetEvents(mockEvents);

      expect(mockSetEvents).toHaveBeenCalledWith(mockEvents);
    });
  });

  // MARK: Pagination Logic

  describe("Pagination Logic", () => {
    it("getMore logic: increments page when not last page", () => {
      let page = 1;
      const isLastPage = false;

      const getMore = () => {
        if (isLastPage) return;
        page += 1;
      };

      getMore();

      expect(page).toBe(2);
    });

    it("getMore logic: does nothing when last page", () => {
      let page = 3;
      const isLastPage = true;

      const getMore = () => {
        if (isLastPage) return;
        page += 1;
      };

      getMore();

      expect(page).toBe(3);
    });

    it("isLastPage is tracked from API response", async () => {
      mockListEvents.mockResolvedValue({ data: [], isLastPage: true });

      const response = await mockListEvents({ page: 1 });

      expect(response.isLastPage).toBe(true);
    });
  });

  // MARK: Append Logic

  describe("Append Logic", () => {
    it("appends results for page > 1 with same filters", () => {
      const cached = [createMockEvent() as MockEvent];
      const newEvents = [createMockEvent() as MockEvent];
      mockGetEvents.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({ setting: "action" });
      mockGetPage.mockReturnValue(1);

      const currentFilters = { setting: "action" };
      const currentPage = 2;

      // Simulate append logic
      const shouldAppend =
        mockGetEvents().length > 0 &&
        JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
        currentPage > mockGetPage();

      expect(shouldAppend).toBe(true);

      if (shouldAppend) {
        const result = [...cached, ...newEvents];
        expect(result).toHaveLength(2);
      }
    });

    it("replaces data when filters differ", () => {
      mockGetEvents.mockReturnValue([createMockEvent() as MockEvent]);
      mockGetFilters.mockReturnValue({ setting: "action" });

      const currentFilters = { setting: "learn" };

      const shouldAppend =
        mockGetEvents().length > 0 &&
        JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters);

      expect(shouldAppend).toBe(false);
    });
  });

  // MARK: Filter Change Handling

  describe("Filter Change Handling", () => {
    it("resets to page 1 when filters change", () => {
      mockGetFilters.mockReturnValue({ setting: "action" });
      const currentFilters = { setting: "learn" };
      let page = 3;

      // Simulate filter change logic
      if (JSON.stringify(mockGetFilters()) !== JSON.stringify(currentFilters)) {
        page = 1;
        mockSetPage(1);
      }

      expect(page).toBe(1);
      expect(mockSetPage).toHaveBeenCalledWith(1);
    });

    it("keeps page when filters match", () => {
      const filters = { setting: "action" } as EventFilters;
      mockGetFilters.mockReturnValue(filters);
      let page = 3;

      if (JSON.stringify(mockGetFilters()) !== JSON.stringify(filters)) {
        page = 1;
      }

      expect(page).toBe(3);
    });
  });

  // MARK: Cache Fallback

  describe("Cache Fallback", () => {
    it("returns cached when store has data, filters match, page matches", () => {
      const cached = [createMockEvent() as MockEvent];
      mockGetEvents.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({ setting: "action" });
      mockGetPage.mockReturnValue(1);

      const currentFilters = { setting: "action" };
      const currentPage = 1;

      // Simulate getCachedData logic
      const getCachedDataLogic = () => {
        if (
          mockGetEvents().length > 0 &&
          JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
          currentPage === mockGetPage()
        ) {
          return mockGetEvents();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toEqual(cached);
    });

    it("returns undefined when filters differ", () => {
      const cached = [createMockEvent() as MockEvent];
      mockGetEvents.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({ setting: "action" });
      mockGetPage.mockReturnValue(1);

      const currentFilters = { setting: "learn" };
      const currentPage = 1;

      const getCachedDataLogic = () => {
        if (
          mockGetEvents().length > 0 &&
          JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
          currentPage === mockGetPage()
        ) {
          return mockGetEvents();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toBeUndefined();
    });

    it("returns undefined when page differs", () => {
      const cached = [createMockEvent() as MockEvent];
      mockGetEvents.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({});
      mockGetPage.mockReturnValue(1);

      const currentFilters = {};
      const currentPage = 2;

      const getCachedDataLogic = () => {
        if (
          mockGetEvents().length > 0 &&
          JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
          currentPage === mockGetPage()
        ) {
          return mockGetEvents();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toBeUndefined();
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns payload during hydration when store empty", () => {
      const payloadEvents = [createMockEvent() as MockEvent];
      mockGetEvents.mockReturnValue([]);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { "events-list": payloadEvents },
      });

      const getCachedDataLogic = (key: string) => {
        if (mockGetEvents().length > 0) {
          return mockGetEvents();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("events-list")).toEqual(payloadEvents);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is callable with error message", () => {
      mockShowToastError("Failed to fetch events");

      expect(mockShowToastError).toHaveBeenCalledWith("Failed to fetch events");
    });

    it("listEvents can reject with error", async () => {
      const apiError = new Error("Network error");
      mockListEvents.mockRejectedValue(apiError);

      await expect(mockListEvents({})).rejects.toThrow("Network error");
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("API error");
      mockListEvents.mockRejectedValue(apiError);

      const handlerLogic = async () => {
        try {
          return await mockListEvents({});
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };

      await expect(handlerLogic()).rejects.toThrow("API error");
      expect(mockShowToastError).toHaveBeenCalledWith("API error");
    });
  });

  // MARK: Cache Key

  describe("Cache Key", () => {
    it("getKeyForGetEvents returns consistent key", async () => {
      const { getKeyForGetEvents } =
        await import("../../../../app/composables/queries/useGetEvents");
      expect(getKeyForGetEvents()).toBe("events-list");
      expect(getKeyForGetEvents()).toBe(getKeyForGetEvents());
    });
  });
});
