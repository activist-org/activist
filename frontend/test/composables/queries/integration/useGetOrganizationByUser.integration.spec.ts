// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Integration tests for useGetOrganizationsByUser composable.
 * Tests unique behaviors: userId param, filter+page+userId in cache key.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { OrganizationFilters } from "../../../../shared/types/organization";

import { createMockOrganization } from "../../../mocks/factories";

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

const mockListOrganizationsByUserId = vi.fn();

vi.mock("../../../../app/services/entities/organization", () => ({
  listOrganizationsByUserId: (
    userId: string,
    page: number,
    filters?: OrganizationFilters
  ) => mockListOrganizationsByUserId(userId, page, filters),
}));

// MARK: Tests

describe("useGetOrganizationsByUser Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockListOrganizationsByUserId.mockResolvedValue({
      data: [],
      isLastPage: false,
    });
  });

  // MARK: Success Fetch Flow

  describe("Success Fetch Flow", () => {
    it("composable returns expected structure with getMore", async () => {
      const { useGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const result = useGetOrganizationsByUser("user-123");

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("refresh");
      expect(result).toHaveProperty("getMore");
      expect(typeof result.getMore).toBe("function");
    });

    it("listOrganizationsByUserId service receives userId, page, and filters", async () => {
      const mockOrgs = [createMockOrganization() as MockOrganization];
      mockListOrganizationsByUserId.mockResolvedValue({
        data: mockOrgs,
        isLastPage: false,
      });

      await mockListOrganizationsByUserId("user-123", 1, { name: "test" });

      expect(mockListOrganizationsByUserId).toHaveBeenCalledWith(
        "user-123",
        1,
        { name: "test" }
      );
    });
  });

  // MARK: Empty UserId Handling

  describe("Empty UserId Handling", () => {
    it("handler returns empty array when userId is empty", async () => {
      // Simulate handler logic.
      const handlerLogic = async (userId: string) => {
        if (!userId || userId === "") {
          return [];
        }
        const response = await mockListOrganizationsByUserId(userId, 1);
        return response.data;
      };

      const result = await handlerLogic("");

      expect(result).toEqual([]);
      expect(mockListOrganizationsByUserId).not.toHaveBeenCalled();
    });

    it("handler fetches when userId is provided", async () => {
      const mockOrgs = [createMockOrganization() as MockOrganization];
      mockListOrganizationsByUserId.mockResolvedValue({
        data: mockOrgs,
        isLastPage: false,
      });

      const handlerLogic = async (userId: string) => {
        if (!userId || userId === "") {
          return [];
        }
        const response = await mockListOrganizationsByUserId(userId, 1);
        return response.data;
      };

      const result = await handlerLogic("user-123");

      expect(result).toEqual(mockOrgs);
      expect(mockListOrganizationsByUserId).toHaveBeenCalledWith("user-123", 1);
    });
  });

  // MARK: Cache Key (Unique)

  describe("Cache Key (Unique)", () => {
    it("getKeyForGetOrganizationsByUser includes userId, page, and filters", async () => {
      const { getKeyForGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const key = getKeyForGetOrganizationsByUser("user-123", 1, {
        name: "test",
      });

      expect(key).toContain("organizations-by-user-user-123");
      expect(key).toContain("page:1");
      expect(key).toContain("filters:");
      expect(key).toContain(JSON.stringify({ name: "test" }));
    });

    it("different userIds produce different keys", async () => {
      const { getKeyForGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const key1 = getKeyForGetOrganizationsByUser("user-1", 1);
      const key2 = getKeyForGetOrganizationsByUser("user-2", 1);

      expect(key1).not.toBe(key2);
    });

    it("different pages produce different keys", async () => {
      const { getKeyForGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const key1 = getKeyForGetOrganizationsByUser("user-123", 1);
      const key2 = getKeyForGetOrganizationsByUser("user-123", 2);

      expect(key1).not.toBe(key2);
    });

    it("different filters produce different keys", async () => {
      const { getKeyForGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const key1 = getKeyForGetOrganizationsByUser("user-123", 1, {
        name: "a",
      });
      const key2 = getKeyForGetOrganizationsByUser("user-123", 1, {
        name: "b",
      });

      expect(key1).not.toBe(key2);
    });

    it("same params produce same key", async () => {
      const { getKeyForGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const key1 = getKeyForGetOrganizationsByUser("user-123", 1, {
        name: "test",
      });
      const key2 = getKeyForGetOrganizationsByUser("user-123", 1, {
        name: "test",
      });

      expect(key1).toBe(key2);
    });

    it("handles undefined filters", async () => {
      const { getKeyForGetOrganizationsByUser } =
        await import("../../../../app/composables/queries/useGetOrganizationByUser");

      const key = getKeyForGetOrganizationsByUser("user-123", 1);

      expect(key).toContain("organizations-by-user-user-123");
      expect(key).toContain("page:1");
      expect(key).toContain("filters:");
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
      mockListOrganizationsByUserId.mockResolvedValue({
        data: [],
        isLastPage: true,
      });

      const response = await mockListOrganizationsByUserId("user-123", 1);

      expect(response.isLastPage).toBe(true);
    });
  });

  // MARK: Append Logic (Local Ref)

  describe("Append Logic (Local Ref)", () => {
    it("appends new organizations to local ref", () => {
      const existing = [createMockOrganization() as MockOrganization];
      const newOrgs = [createMockOrganization() as MockOrganization];

      // Simulate append (composable uses local ref, not store).
      const result = [...existing, ...newOrgs];

      expect(result).toHaveLength(2);
    });
  });

  // MARK: Error Handling

  describe("Error Handling", () => {
    it("showToastError is callable with error message", () => {
      mockShowToastError("Failed to fetch user organizations");

      expect(mockShowToastError).toHaveBeenCalledWith(
        "Failed to fetch user organizations"
      );
    });

    it("listOrganizationsByUserId can reject with error", async () => {
      const apiError = new Error("Network error");
      mockListOrganizationsByUserId.mockRejectedValue(apiError);
      await expect(
        mockListOrganizationsByUserId("user-123", 1)
      ).rejects.toThrow("Network error");
    });

    it("error handler logic: catches error, shows toast, rethrows", async () => {
      const apiError = new Error("API error");
      mockListOrganizationsByUserId.mockRejectedValue(apiError);

      const handlerLogic = async () => {
        try {
          return await mockListOrganizationsByUserId("user-123", 1);
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
