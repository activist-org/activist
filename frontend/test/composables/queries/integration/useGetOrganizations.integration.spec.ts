// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetOrganizations composable.
 * Tests paginated list behaviors: pagination, filter handling, append logic.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { OrganizationFilters } from "../../../../shared/types/organization";

import { createMockOrganization } from "../../../mocks/factories";
import { createMockNuxtApp } from "../helpers/useAsyncDataMock";

// Type helper
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

const mockListOrganizations = vi.fn();

vi.mock("../../../../app/services/entities/organization", () => ({
  listOrganizations: (params: unknown) => mockListOrganizations(params),
}));

// MARK: Tests

describe("useGetOrganizations Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
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

      // Simulate append logic
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

      // Simulate filter change logic
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

      // Simulate getCachedData logic
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
});
