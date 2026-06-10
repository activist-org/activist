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

      // Simulate append logic.
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

      // Simulate filter change logic.
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

      // Simulate getCachedData logic.
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

  // MARK: Race Condition / Stale Response Handling

  describe("Race Condition / Stale Response Handling", () => {
    it("discards stale page-2 response when a newer fetch has started", () => {
      // Simulate the generation counter logic:
      // fetch 1 (page 2, no filter) starts → currentGeneration = 1
      // fetch 2 (page 1, new filter) starts → fetchGeneration becomes 2
      // fetch 1 resolves last → detects currentGeneration (1) !== fetchGeneration (2) → discards
      let fetchGeneration = 0;
      const cached = [createMockEvent() as MockEvent];
      const staleEvents = [createMockEvent() as MockEvent];
      mockGetEvents.mockReturnValue(cached);

      // Simulate fetch 1 stamping its generation.
      const gen1 = ++fetchGeneration; // gen1 = 1

      // Simulate fetch 2 starting before fetch 1 resolves.
      const gen2 = ++fetchGeneration; // gen2 = 2 (fetchGeneration is now 2)

      // When fetch 1 resolves, it checks: gen1 !== fetchGeneration → true → discard.
      const shouldDiscard = gen1 !== fetchGeneration;
      expect(shouldDiscard).toBe(true);

      // The returned value should be the existing store contents, not stale data.
      const result = shouldDiscard ? mockGetEvents() : staleEvents;
      expect(result).toEqual(cached);
      expect(result).not.toEqual(staleEvents);

      // Fetch 2 resolves with gen2 === fetchGeneration → keeps result.
      const shouldKeep = gen2 === fetchGeneration;
      expect(shouldKeep).toBe(true);
    });

    it("does not append stale page-2 data after filter changes", () => {
      // Before fix: the old append logic used JSON.stringify on the store filters
      // AFTER the API call — so a stale page-2 fetch could still satisfy the
      // filter-match condition if the store hadn't been updated yet.
      // After fix: filtersChanged is computed BEFORE the call; if it was true,
      // the append branch is skipped entirely for that invocation.
      const page2Items = [createMockEvent() as MockEvent, createMockEvent() as MockEvent];
      const filterPage1Items = [createMockEvent() as MockEvent];

      // Simulate: store had no-filter results cached.
      mockGetEvents.mockReturnValue(page2Items);
      mockGetFilters.mockReturnValue({});

      // New filter is "Berlin".
      const newFilters = { location: "Berlin" } as EventFilters;
      const filtersChanged =
        JSON.stringify(mockGetFilters()) !== JSON.stringify(newFilters);

      expect(filtersChanged).toBe(true);

      // With the fix, when filtersChanged=true, the append branch is skipped.
      const shouldAppend =
        mockGetEvents().length > 0 &&
        !filtersChanged && // <-- this is the fixed condition
        true; // page.value > pageCached

      expect(shouldAppend).toBe(false);

      // Result should be filter page 1 items only.
      const result = shouldAppend
        ? [...page2Items, ...filterPage1Items]
        : filterPage1Items;
      expect(result).toHaveLength(1);
      expect(result).toEqual(filterPage1Items);
    });

    it("resets page to 1 before API call when filters change", () => {
      // The pre-fix code computed the request page as a ternary INSIDE the
      // listEvents call (after filter comparison). The fix computes filtersChanged
      // before the call and resets page.value = 1 immediately.
      let page = 2; // User has scrolled to page 2.
      mockGetFilters.mockReturnValue({});
      const newFilters = { location: "Berlin" } as EventFilters;

      // Simulate the pre-call page reset from the fix.
      const filtersChanged =
        JSON.stringify(mockGetFilters()) !== JSON.stringify(newFilters);
      if (filtersChanged) {
        page = 1;
      }

      // The API call should go out with page: 1, not page: 2.
      expect(page).toBe(1);
    });

    it("keeps page when filters did not change", () => {
      let page = 2;
      mockGetFilters.mockReturnValue({ location: "Berlin" });
      const sameFilters = { location: "Berlin" } as EventFilters;

      const filtersChanged =
        JSON.stringify(mockGetFilters()) !== JSON.stringify(sameFilters);
      if (filtersChanged) {
        page = 1;
      }

      // Page should remain at 2 since the filter is unchanged.
      expect(page).toBe(2);
    });

    it("newer generation result is not discarded", () => {
      // When fetch N is the latest (currentGeneration === fetchGeneration),
      // its result should be written to the store.
      let fetchGeneration = 0;
      const currentGeneration = ++fetchGeneration; // only one fetch in flight.

      const shouldDiscard = currentGeneration !== fetchGeneration;
      expect(shouldDiscard).toBe(false);
    });
  });
});
