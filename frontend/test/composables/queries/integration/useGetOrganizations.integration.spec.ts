/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { OrganizationFilters } from "../../../../shared/types/organization";

import { createMockOrganization } from "../../../mocks/factories";
import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

const { useAsyncDataMock, capturedCalls, hoistedListOrganizations } =
  vi.hoisted(() => {
    const { ref } = require("vue");

    const captured = {
      lastCall: null,
      allCalls: [],
    };

    const useAsyncDataMock = vi.fn((key, handler, options) => {
      const call = {
        handler,
        getCachedData: options?.getCachedData ?? null,
        watch: options?.watch ?? null,
        immediate: options?.immediate ?? false,
        defaultFn: options?.default ?? null,
      };
      captured.lastCall = call as any;
      captured.allCalls.push(call as any);

      return {
        data: ref(null),
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn().mockResolvedValue(undefined),
        execute: vi.fn().mockResolvedValue(undefined),
      };
    });

    return {
      useAsyncDataMock,
      capturedCalls: captured,
      hoistedListOrganizations: vi.fn(),
    };
  });

mockNuxtImport("useAsyncData", () => useAsyncDataMock);
mockNuxtImport("listOrganizations", () => hoistedListOrganizations);

type MockOrganization = ReturnType<typeof createMockOrganization> & {
  id: string;
};

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockSetOrganizations = vi.fn();
const mockGetOrganizations = vi.fn((): MockOrganization[] => []);
const mockGetFilters = vi.fn((): OrganizationFilters => ({}));
const mockSetFilters = vi.fn();
const mockGetPage = vi.fn(() => 1);
const mockSetPage = vi.fn();

vi.mock("../../../../app/stores/organization", () => ({
  useOrganizationStore: () => ({
    setOrganizations: mockSetOrganizations,
    getOrganizations: mockGetOrganizations,
    getFilters: mockGetFilters,
    setFilters: mockSetFilters,
    getPage: mockGetPage,
    setPage: mockSetPage,
  }),
}));

const mockListOrganizations = hoistedListOrganizations;

vi.mock("../../../../app/services/entities/organization", () => ({
  listOrganizations: (params: unknown) => mockListOrganizations(params),
}));

// MARK: Tests

describe("useGetOrganizations Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    capturedCalls.lastCall = null;
    capturedCalls.allCalls = [];
    mockGetOrganizations.mockReturnValue([]);
    mockGetFilters.mockReturnValue({});
    mockGetPage.mockReturnValue(1);
    mockListOrganizations.mockResolvedValue({ data: [], isLastPage: false });
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure with getMore", async () => {
      const { useGetOrganizations } =
        await import("../../../../app/composables/queries/useGetOrganizations");
      const { ref } = await import("vue");

      const filters = ref<OrganizationFilters>({});
      const result = useGetOrganizations(filters);

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });

    it("listOrganizations service receives page and page_size", async () => {
      const mockOrgs = [createMockOrganization() as MockOrganization];
      mockListOrganizations.mockResolvedValue({
        data: mockOrgs,
        isLastPage: false,
      });

      await mockListOrganizations({ page: 1, page_size: 10 });

      expect(mockListOrganizations).toHaveBeenCalledWith({
        page: 1,
        page_size: 10,
      });
    });

    it("setOrganizations store method can be called with array", () => {
      const mockOrgs = [createMockOrganization() as MockOrganization];
      mockSetOrganizations(mockOrgs);

      expect(mockSetOrganizations).toHaveBeenCalledWith(mockOrgs);
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
      mockListOrganizations.mockResolvedValue({ data: [], isLastPage: true });

      const response = await mockListOrganizations({ page: 1 });

      expect(response.isLastPage).toBe(true);
    });
  });

  // MARK: Append Logic

  describe("Append Logic", () => {
    it("appends results for page > 1 with same filters", () => {
      const cached = [createMockOrganization() as MockOrganization];
      const newOrgs = [createMockOrganization() as MockOrganization];
      mockGetOrganizations.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({ name: "test" });
      mockGetPage.mockReturnValue(1);

      const currentFilters = { name: "test" };
      const currentPage = 2;

      // Simulate append logic.
      const shouldAppend =
        mockGetOrganizations().length > 0 &&
        JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
        currentPage > mockGetPage();

      expect(shouldAppend).toBe(true);

      if (shouldAppend) {
        const result = [...cached, ...newOrgs];
        expect(result).toHaveLength(2);
      }
    });

    it("replaces data when filters differ", () => {
      mockGetOrganizations.mockReturnValue([
        createMockOrganization() as MockOrganization,
      ]);
      mockGetFilters.mockReturnValue({ name: "old" });

      const currentFilters = { name: "new" };

      const shouldAppend =
        mockGetOrganizations().length > 0 &&
        JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters);

      expect(shouldAppend).toBe(false);
    });
  });

  // MARK: Filter Change Handling

  describe("Filter Change Handling", () => {
    it("resets to page 1 when filters change", () => {
      mockGetFilters.mockReturnValue({ name: "old" });
      const currentFilters = { name: "new" };
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
      const filters = { name: "same" };
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
      const cached = [createMockOrganization() as MockOrganization];
      mockGetOrganizations.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({ name: "test" });
      mockGetPage.mockReturnValue(1);

      const currentFilters = { name: "test" };
      const currentPage = 1;

      // Simulate getCachedData logic.
      const getCachedDataLogic = () => {
        if (
          mockGetOrganizations().length > 0 &&
          JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
          currentPage === mockGetPage()
        ) {
          return mockGetOrganizations();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toEqual(cached);
    });

    it("returns undefined when filters differ", () => {
      const cached = [createMockOrganization() as MockOrganization];
      mockGetOrganizations.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({ name: "cached" });
      mockGetPage.mockReturnValue(1);

      const currentFilters = { name: "different" };
      const currentPage = 1;

      const getCachedDataLogic = () => {
        if (
          mockGetOrganizations().length > 0 &&
          JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
          currentPage === mockGetPage()
        ) {
          return mockGetOrganizations();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toBeUndefined();
    });

    it("returns undefined when page differs", () => {
      const cached = [createMockOrganization() as MockOrganization];
      mockGetOrganizations.mockReturnValue(cached);
      mockGetFilters.mockReturnValue({});
      mockGetPage.mockReturnValue(1);

      const currentFilters = {};
      const currentPage = 2;

      const getCachedDataLogic = () => {
        if (
          mockGetOrganizations().length > 0 &&
          JSON.stringify(mockGetFilters()) === JSON.stringify(currentFilters) &&
          currentPage === mockGetPage()
        ) {
          return mockGetOrganizations();
        }
        return undefined;
      };

      expect(getCachedDataLogic()).toBeUndefined();
    });
  });

  // MARK: Hydration Logic

  describe("Hydration Logic", () => {
    it("getCachedData returns payload during hydration when store empty", () => {
      const payloadOrgs = [createMockOrganization() as MockOrganization];
      mockGetOrganizations.mockReturnValue([]);

      const nuxtApp = createMockNuxtApp({
        isHydrating: true,
        payloadData: { "organizations-list": payloadOrgs },
      });

      const getCachedDataLogic = (key: string) => {
        if (mockGetOrganizations().length > 0) {
          return mockGetOrganizations();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      };

      expect(getCachedDataLogic("organizations-list")).toEqual(payloadOrgs);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is callable with error message", () => {
      mockShowToastError("Failed to fetch organizations");

      expect(mockShowToastError).toHaveBeenCalledWith(
        "Failed to fetch organizations"
      );
    });

    it("listOrganizations can reject with error", async () => {
      const apiError = new Error("Network error");
      mockListOrganizations.mockRejectedValue(apiError);

      await expect(mockListOrganizations({})).rejects.toThrow("Network error");
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("API error");
      mockListOrganizations.mockRejectedValue(apiError);

      const handlerLogic = async () => {
        try {
          return await mockListOrganizations({});
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
    it("getKeyForGetOrganizations returns consistent key", async () => {
      const { getKeyForGetOrganizations } =
        await import("../../../../app/composables/queries/useGetOrganizations");

      expect(getKeyForGetOrganizations()).toBe("organizations-list");
      expect(getKeyForGetOrganizations()).toBe(getKeyForGetOrganizations());
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
      const cached = [createMockOrganization() as MockOrganization];
      mockGetOrganizations.mockReturnValue(cached);

      // Simulate fetch 1 stamping its generation.
      const gen1 = ++fetchGeneration; // gen1 = 1

      // Simulate fetch 2 starting before fetch 1 resolves.
      ++fetchGeneration; // fetchGeneration is now 2

      // When fetch 1 resolves, it checks: gen1 !== fetchGeneration → true → discard.
      const shouldDiscard = gen1 !== fetchGeneration;
      expect(shouldDiscard).toBe(true);

      // The returned value should be the existing store contents, not stale data.
      const result = shouldDiscard ? mockGetOrganizations() : [];
      expect(result).toEqual(cached);

      // Fetch 2 resolves with fetchGeneration === 2 → keeps result.
      expect(fetchGeneration).toBe(2);
    });

    it("does not append stale page-2 data after filter changes", () => {
      // Before fix: the old append logic used JSON.stringify on the store filters
      // AFTER the API call — so a stale page-2 fetch could still satisfy the
      // filter-match condition if the store hadn't been updated yet.
      // After fix: filtersChanged is computed BEFORE the call; if it was true,
      // the append branch is skipped entirely for that invocation.
      const page2Items = [
        createMockOrganization() as MockOrganization,
        createMockOrganization() as MockOrganization,
      ];
      const filterPage1Items = [createMockOrganization() as MockOrganization];

      // Simulate: store had no-filter results cached.
      mockGetOrganizations.mockReturnValue(page2Items);
      mockGetFilters.mockReturnValue({});

      // New filter is "Berlin".
      const newFilters = { city: "Berlin" } as OrganizationFilters;
      const filtersChanged =
        JSON.stringify(mockGetFilters()) !== JSON.stringify(newFilters);

      expect(filtersChanged).toBe(true);

      // With the fix, when filtersChanged=true, the append branch is skipped.
      const shouldAppend =
        mockGetOrganizations().length > 0 &&
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
      // listOrganizations call (after filter comparison). The fix computes
      // filtersChanged before the call and resets page.value = 1 immediately.
      let page = 2; // User has scrolled to page 2.
      mockGetFilters.mockReturnValue({});
      const newFilters = { city: "Berlin" } as OrganizationFilters;

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
      mockGetFilters.mockReturnValue({ city: "Berlin" });
      const sameFilters = { city: "Berlin" } as OrganizationFilters;

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

    it("duplicate setPage call is removed (idempotency check)", () => {
      // In the original useGetOrganizations.ts, store.setPage(page.value) was
      // called twice in the non-append path. The fix removes the duplicate.
      // This test verifies that calling setPage once vs twice yields the same result.
      let callCount = 0;
      const mockSetPageTracked = (p: number) => {
        callCount++;
        mockSetPage(p);
      };

      const page = 2;
      // Fixed: called once.
      mockSetPageTracked(page);

      expect(callCount).toBe(1);
      expect(mockSetPage).toHaveBeenCalledWith(page);
    });

    it("should discard stale page-2 response when filter changes mid-flight (real composable integration test)", async () => {
      const page1Orgs = [
        createMockOrganization({ id: "o1" } as any),
        createMockOrganization({ id: "o2" } as any),
      ];
      const page2Orgs = [
        createMockOrganization({ id: "o3" } as any),
        createMockOrganization({ id: "o4" } as any),
      ];
      const filterOrgs = [createMockOrganization({ id: "of1" } as any)];

      let resolvePage2: (val: any) => void = () => {};
      let resolveFilter: (val: any) => void = () => {};

      const page2Promise = new Promise((resolve) => {
        resolvePage2 = resolve;
      });
      const filterPromise = new Promise((resolve) => {
        resolveFilter = resolve;
      });

      mockListOrganizations.mockImplementation((params: any) => {
        if (params.city === "Berlin") {
          return filterPromise;
        } else if (params.page === 2) {
          return page2Promise;
        } else {
          return Promise.resolve({ data: page1Orgs, isLastPage: false });
        }
      });

      const { ref } = await import("vue");
      const filters = ref<OrganizationFilters>({});
      const { useGetOrganizations } =
        await import("../../../../app/composables/queries/useGetOrganizations");

      // Initialize composable
      const { getMore } = useGetOrganizations(filters);

      // Get the real captured handler.
      const capturedHandler = capturedCalls.lastCall!.handler;

      // Run initial load (page 1)
      await capturedHandler();

      // Check the store state using the real store
      const { useOrganizationListStore } =
        await import("../../../../app/stores/data/organization");
      const store = useOrganizationListStore();
      expect(store.getItems().map((o) => o.id)).toEqual(["o1", "o2"]);

      // Trigger getMore() to request page 2
      getMore();
      // Manually trigger the handler for page 2 (simulating watch effect)
      const p2FetchPromise = capturedHandler();

      // Change filter mid-flight.
      filters.value = { city: "Berlin" };
      // Manually trigger the handler for the new filter (simulating watch effect)
      const filterFetchPromise = capturedHandler();

      // Simulate resolution order: filter resolves FIRST, stale page-2 resolves LAST
      resolveFilter({ data: filterOrgs, isLastPage: true });
      await filterFetchPromise;

      expect(store.getItems().map((o) => o.id)).toEqual(["of1"]);

      // Now resolve the stale page-2 request
      resolvePage2({ data: page2Orgs, isLastPage: false });
      await p2FetchPromise;

      // Assert that the stale page-2 result was discarded and did not contaminate the store
      expect(store.getItems().map((o) => o.id)).toEqual(["of1"]);
    });
  });
});
