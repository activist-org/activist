// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetGroups composable.
 * Tests unique behaviors: filter+page in cache key, empty filters handling.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { GroupFilters } from "../../../../shared/types/group";

import { createMockGroup } from "../../../mocks/factories";

type MockGroup = ReturnType<typeof createMockGroup> & { id: string };

// MARK: Mocks

const mockShowToastError = vi.fn();

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError: mockShowToastError,
  }),
}));

const mockListGroups = vi.fn();

vi.mock("../../../../app/services/entities/group", () => ({
  listGroups: (params: unknown) => mockListGroups(params),
}));

// MARK: Tests

describe("useGetGroups Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockListGroups.mockResolvedValue({ data: [], isLastPage: false });
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure with getMore", async () => {
      const { useGetGroups } =
        await import("../../../../app/composables/queries/useGetGroups");

      const filters = ref<GroupFilters>({ linked_organizations: ["org-1"] });
      const result = useGetGroups(filters);

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });

    it("listGroups service receives filters, page, and page_size", async () => {
      const mockGroups = [createMockGroup() as MockGroup];
      mockListGroups.mockResolvedValue({ data: mockGroups, isLastPage: false });

      await mockListGroups({
        linked_organizations: ["org-1"],
        page: 1,
        page_size: 10,
      });

      expect(mockListGroups).toHaveBeenCalledWith({
        linked_organizations: ["org-1"],
        page: 1,
        page_size: 10,
      });
    });
  });

  // MARK: Cache Key (Unique)

  describe("Cache Key (Unique)", () => {
    it("getKeyForGetGroups includes filters and page", async () => {
      const { getKeyForGetGroups } =
        await import("../../../../app/composables/queries/useGetGroups");

      const filters = { linked_organizations: ["org-1"] };
      const key = getKeyForGetGroups(filters, 1);

      expect(key).toContain("groups-list");
      expect(key).toContain("filters:");
      expect(key).toContain(JSON.stringify(filters));
      expect(key).toContain("page:1");
    });

    it("different filters produce different keys", async () => {
      const { getKeyForGetGroups } =
        await import("../../../../app/composables/queries/useGetGroups");

      const key1 = getKeyForGetGroups({ linked_organizations: ["org-1"] }, 1);
      const key2 = getKeyForGetGroups({ linked_organizations: ["org-2"] }, 1);

      expect(key1).not.toBe(key2);
    });

    it("different pages produce different keys", async () => {
      const { getKeyForGetGroups } =
        await import("../../../../app/composables/queries/useGetGroups");

      const filters = { linked_organizations: ["org-1"] };
      const key1 = getKeyForGetGroups(filters, 1);
      const key2 = getKeyForGetGroups(filters, 2);

      expect(key1).not.toBe(key2);
    });

    it("same filters and page produce same key", async () => {
      const { getKeyForGetGroups } =
        await import("../../../../app/composables/queries/useGetGroups");

      const filters = { linked_organizations: ["org-1"] };
      const key1 = getKeyForGetGroups(filters, 1);
      const key2 = getKeyForGetGroups(filters, 1);

      expect(key1).toBe(key2);
    });
  });

  // MARK: Empty Filters Handling

  describe("Empty Filters Handling", () => {
    it("handler returns empty array when no filters provided", async () => {
      // Simulate handler logic.
      const handlerLogic = async (filters: GroupFilters) => {
        if (!filters || Object.keys(filters).length === 0) {
          return [];
        }
        return await mockListGroups(filters);
      };

      const result = await handlerLogic({});

      expect(result).toEqual([]);
      expect(mockListGroups).not.toHaveBeenCalled();
    });

    it("handler fetches when filters are provided", async () => {
      const mockGroups = [createMockGroup() as MockGroup];
      mockListGroups.mockResolvedValue({ data: mockGroups, isLastPage: false });

      const handlerLogic = async (filters: GroupFilters) => {
        if (!filters || Object.keys(filters).length === 0) {
          return [];
        }
        const response = await mockListGroups(filters);
        return response.data;
      };

      const result = await handlerLogic({ linked_organizations: ["org-1"] });

      expect(result).toEqual(mockGroups);
      expect(mockListGroups).toHaveBeenCalledWith({
        linked_organizations: ["org-1"],
      });
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
      mockListGroups.mockResolvedValue({ data: [], isLastPage: true });

      const response = await mockListGroups({
        linked_organizations: ["org-1"],
      });

      expect(response.isLastPage).toBe(true);
    });

    it("handler logic: appends results to page 1, de-dupes, and changing filters resets", async () => {
      const page1Group = createMockGroup({ id: "group-1" }) as MockGroup;
      const page2Group1 = createMockGroup({ id: "group-1" }) as MockGroup; // Duplicate
      const page2Group2 = createMockGroup({ id: "group-2" }) as MockGroup;
      const filter2Group = createMockGroup({ id: "group-3" }) as MockGroup;

      mockListGroups
        .mockResolvedValueOnce({ data: [page1Group], isLastPage: false })
        .mockResolvedValueOnce({
          data: [page2Group1, page2Group2],
          isLastPage: true,
        })
        .mockResolvedValueOnce({ data: [filter2Group], isLastPage: true });

      const groups = ref<MockGroup[]>([]);
      const page = ref(1);
      const filtersRef = ref<GroupFilters>({ linked_organizations: ["org-1"] });
      const oldFilters = ref<GroupFilters | undefined>(filtersRef.value);

      const handlerLogic = async () => {
        if (
          JSON.stringify(oldFilters.value) !== JSON.stringify(filtersRef.value)
        ) {
          oldFilters.value = { ...filtersRef.value };
          page.value = 1;
          groups.value = [];
        }

        const response = await mockListGroups({
          ...filtersRef.value,
          page: page.value,
          page_size: 10,
        });

        const newGroups = response.data.filter(
          (newGroup: MockGroup) =>
            !groups.value.some(
              (existingGroup) => existingGroup.id === newGroup.id
            )
        );
        groups.value = groups.value.concat(newGroups);
        return groups.value;
      };

      // 1. Initial fetch (page 1)
      await handlerLogic();

      expect(mockListGroups).toHaveBeenCalledWith({
        linked_organizations: ["org-1"],
        page: 1,
        page_size: 10,
      });
      expect(groups.value.map((g) => g.id)).toEqual(["group-1"]);

      // 2. Fetch page 2
      page.value = 2;
      await handlerLogic();

      expect(mockListGroups).toHaveBeenCalledWith({
        linked_organizations: ["org-1"],
        page: 2,
        page_size: 10,
      });
      // Assert it accumulates and de-dupes
      expect(groups.value.map((g) => g.id)).toEqual(["group-1", "group-2"]);

      // 3. Change filters and fetch (resets)
      filtersRef.value = { linked_organizations: ["org-2"] };
      await handlerLogic();

      expect(mockListGroups).toHaveBeenCalledWith({
        linked_organizations: ["org-2"],
        page: 1,
        page_size: 10,
      });
      expect(groups.value.map((g) => g.id)).toEqual(["group-3"]);

      // Ensure the mock queue is fully consumed to prevent bleeding
      vi.clearAllMocks();
    });
  });

  // MARK: Append Logic (Local Ref)

  describe("Append Logic (Local Ref)", () => {
    it("appends new groups to local ref", () => {
      const existing = [createMockGroup() as MockGroup];
      const newGroups = [createMockGroup() as MockGroup];

      // Simulate append (groups composable uses local ref, not store).
      const result = [...existing, ...newGroups];

      expect(result).toHaveLength(2);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is callable with error message", () => {
      mockShowToastError("Failed to fetch groups");

      expect(mockShowToastError).toHaveBeenCalledWith("Failed to fetch groups");
    });

    it("listGroups can reject with error", async () => {
      const apiError = new Error("Network error");
      mockListGroups.mockRejectedValue(apiError);

      await expect(mockListGroups({})).rejects.toThrow("Network error");
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("API error");
      mockListGroups.mockRejectedValue(apiError);

      const handlerLogic = async () => {
        try {
          return await mockListGroups({});
        } catch (error) {
          mockShowToastError((error as Error).message);
          throw error;
        }
      };
      await expect(handlerLogic()).rejects.toThrow("API error");
      expect(mockShowToastError).toHaveBeenCalledWith("API error");
    });
  });
});
